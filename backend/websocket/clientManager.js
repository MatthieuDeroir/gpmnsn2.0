const WebSocket = require('ws');
const Logger = require('../utils/logger');

/**
 * Manages active clients (both panels and user/frontends).
 */
class ClientManager {
  constructor(WebSocket) {
    this.WebSocket = WebSocket;
    this.clients = new Map();        // Map<WebSocket, clientInfo>
    this.lastClientData = new Map(); // Map<clientName, clientInfo>
    this.clientWsMap = new Map();    // Map<clientName, Array<{ ws, clientInfo }>>
  }

  /**
   * Add or update a client in the manager.
   */
  addClient(ws, clientInfo) {
    let ipAddress = ws._socket.remoteAddress;
    if (ipAddress.startsWith('::ffff:')) {
      ipAddress = ipAddress.split(':').pop();
    }
    clientInfo.ip = ipAddress;
    clientInfo.connected = true;

    // Handle frontend/user clients with multiple connections
    if (clientInfo.clientType === 'frontend' || clientInfo.clientType === 'user') {
      if (!this.clientWsMap.has(clientInfo.name)) {
        this.clientWsMap.set(clientInfo.name, []);
      }
      const existingClients = this.clientWsMap.get(clientInfo.name);
      if (!existingClients.some(client => client.ws === ws)) {
        existingClients.push({ ws, clientInfo });
      }
    }
    // Panels remain unique (only one connection per panel)
    else {
      if (this.clientWsMap.has(clientInfo.name)) {
        const existingWs = this.clientWsMap.get(clientInfo.name)[0].ws;
        if (existingWs !== ws && existingWs.readyState === this.WebSocket.OPEN) {
          console.log(`Disconnecting old panel client ${clientInfo.name} to establish a new connection.`);
          existingWs.close();
        }
      }
      this.clientWsMap.set(clientInfo.name, [{ ws, clientInfo }]);
    }

    this.clients.set(ws, clientInfo);
    this.lastClientData.set(clientInfo.name, clientInfo);

    console.log(`Client registered/updated: ${clientInfo.name}, Connected: ${clientInfo.connected}, IP: ${clientInfo.ip}`);
  }

  /**
   * Mark a client as disconnected and remove from manager.
   */
  removeClient(ws) {
    const clientInfo = this.clients.get(ws);
    if (!clientInfo) return;

    clientInfo.connected = false;
    this.clients.delete(ws);
    this.lastClientData.set(clientInfo.name, clientInfo);

    if (this.clientWsMap.has(clientInfo.name)) {
      let updatedClients = this.clientWsMap.get(clientInfo.name).filter(client => client.ws !== ws);
      if (updatedClients.length > 0) {
        this.clientWsMap.set(clientInfo.name, updatedClients);
      } else {
        this.clientWsMap.delete(clientInfo.name);
      }
    }

    console.log(`Client disconnected: ${clientInfo.name}, Connected: ${clientInfo.connected}, IP: ${clientInfo.ip}`);
  }

  /**
   * Update heartbeat info and log changes in specific fields.
   */
  updateHeartbeat(ws, heartbeatData) {
    const clientInfo = this.clients.get(ws);
    if (!clientInfo) {
      console.warn(`Heartbeat received for an unregistered client: ${heartbeatData.name}`);
      return;
    }

    clientInfo.lastHeartbeat = Date.now();

    const fieldsToMonitor = ['isDoorOpen', 'sectorStatus', 'maintenanceMode', 'state'];

    fieldsToMonitor.forEach((field) => {
      if (heartbeatData.hasOwnProperty(field)) {
        const oldValue = clientInfo[field];
        const newValue = heartbeatData[field];

        if (oldValue !== newValue) {
          let message = '';
          let eventType = '';

          switch (field) {
            case 'maintenanceMode':
              message = newValue ? 'Maintenance Mode activated' : 'Maintenance Mode deactivated';
              eventType = newValue ? 'Maintenance On' : 'Maintenance Off';
              break;

            case 'isDoorOpen':
              message = newValue ? 'The door has been opened' : 'The door has been closed';
              eventType = newValue ? 'Door Open' : 'Door Closed';
              break;

            case 'sectorStatus':
              message = newValue ? 'Main power restored' : 'Main power lost, battery backup activated';
              eventType = newValue ? 'Power Restored' : 'Power Lost';
              break;

            case 'state':
              message = `Panel screen state changed to '${newValue}'`;
              eventType = `Screen ${newValue}`;
              break;
          }

          Logger.appendLog(clientInfo.name, eventType, { field, oldValue, newValue, message });

          console.log(
              `Field '${field}' for panel '${clientInfo.name}' changed from '${oldValue}' to '${newValue}'`
          );
        }
      }
    });

    Object.assign(clientInfo, heartbeatData);
    this.clients.set(ws, clientInfo);
    this.lastClientData.set(clientInfo.name, clientInfo);
  }

  /**
   * Send a message to all "frontend" or "user" clients.
   */
  sendToFrontend(message) {
    this.clientWsMap.forEach((clients, name) => {
      clients.forEach(({ ws, clientInfo }) => {
        if ((clientInfo.clientType === 'user' || clientInfo.clientType === 'frontend') &&
            ws.readyState === this.WebSocket.OPEN) {
          ws.send(message);
        }
      });
    });
  }

  /**
   * Broadcast a message to all connected clients.
   */
  broadcastToAllClients(message) {
    this.clients.forEach((clientInfo, clientWs) => {
      if (clientWs.readyState === this.WebSocket.OPEN) {
        clientWs.send(message);
      }
    });
  }

  /**
   * Send a message to a specific panel by name.
   */
  sendToPanel(panelName, message) {
    const clientEntry = this.clientWsMap.get(panelName);
    if (clientEntry && clientEntry[0].ws.readyState === this.WebSocket.OPEN) {
      clientEntry[0].ws.send(JSON.stringify(message));
    } else {
      console.warn(`Panel ${panelName} is not connected.`);
    }
  }

  /**
   * Get an array of all clientInfo objects (last known data).
   */
  getClients() {
    return Array.from(this.lastClientData.values());
  }

  /**
   * Get last-known data for all clients.
   */
  getLastClientData() {
    return Array.from(this.lastClientData.values());
  }

  /**
   * Get the client info for a particular WebSocket.
   */
  getClientInfo(ws) {
    return this.clients.get(ws);
  }

  /**
   * Get client info for a specific client name.
   */
  getClientInfoByName(name) {
    return this.lastClientData.get(name) || null;
  }

  /**
   * Get all WebSocket connections for a client name.
   */
  getAllClientConnections(name) {
    return this.clientWsMap.get(name) || [];
  }
}

module.exports = ClientManager;
