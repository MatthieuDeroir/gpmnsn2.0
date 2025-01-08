// clientManager.js
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
    this.clientWsMap = new Map();    // Map<clientName, { ws, clientInfo }>
  }

  /**
   * Add or update a client in the manager.
   */
  addClient(ws, clientInfo) {
    // Determine the IP from the socket
    let ipAddress = ws._socket.remoteAddress;
    if (ipAddress.startsWith('::ffff:')) {
      ipAddress = ipAddress.split(':').pop();
    }
    clientInfo.ip = ipAddress;
    clientInfo.connected = true; // On registration, we consider them "connected"

    // If there's already a client of the same name, close the old connection
    if (this.clientWsMap.has(clientInfo.name)) {
      const existingWs = this.clientWsMap.get(clientInfo.name).ws;
      if (existingWs !== ws && existingWs.readyState === this.WebSocket.OPEN) {
        console.log(`Disconnecting old client ${clientInfo.name} to establish a new connection.`);
        existingWs.close();
      } else {
        console.log(`Existing client ${clientInfo.name} is the same as the current connection. Not disconnecting.`);
      }
    }

    // Update the Maps
    this.clients.set(ws, clientInfo);
    this.lastClientData.set(clientInfo.name, clientInfo);
    this.clientWsMap.set(clientInfo.name, { ws, clientInfo });

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

    // If this ws was the "current" one, remove it from clientWsMap
    const currentClient = this.clientWsMap.get(clientInfo.name);
    if (currentClient && currentClient.ws === ws) {
      this.clientWsMap.delete(clientInfo.name);
    }

    console.log(`Client disconnected: ${clientInfo.name}, Connected: ${clientInfo.connected}, IP: ${clientInfo.ip}`);
  }

  /**
   * Remove all clients of a certain type (except one).
   */
  removeClientsByType(clientType, excludeWs = null) {
    for (const [ws, clientInfo] of this.clients.entries()) {
      if (clientInfo.clientType === clientType && ws !== excludeWs) {
        console.log(`Marquage du client de type ${clientType} comme déconnecté : ${clientInfo.name}`);
        clientInfo.connected = false;
        this.clients.delete(ws);
        this.lastClientData.set(clientInfo.name, clientInfo);

        const currentClient = this.clientWsMap.get(clientInfo.name);
        if (currentClient && currentClient.ws === ws) {
          this.clientWsMap.delete(clientInfo.name);
        }
      }
    }
  }

  /**
   * Update client fields in place.
   */
  updateClient(ws, updates) {
    const clientInfo = this.clients.get(ws);
    if (!clientInfo) return;

    Object.assign(clientInfo, updates);
    this.clients.set(ws, clientInfo);
    this.lastClientData.set(clientInfo.name, clientInfo);

    console.log(`Client mis à jour : ${clientInfo.name}, Updates: ${JSON.stringify(updates)}`);
  }

  /**
   * Update heartbeat info. Logs changes in certain fields.
   */
  updateHeartbeat(ws, heartbeatData) {
    const clientInfo = this.clients.get(ws);
    if (!clientInfo) {
      console.warn(`Heartbeat reçu pour un client non enregistré : ${heartbeatData.name}`);
      return;
    }

    // Update last heartbeat timestamp
    clientInfo.lastHeartbeat = Date.now();

    // Fields we want to monitor for changes (and log)
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
              message = newValue
                  ? 'Maintenance Mode has been activated'
                  : 'Maintenance Mode has been deactivated';
              eventType = newValue ? 'Maintenance On' : 'Maintenance Off';
              break;

            case 'isDoorOpen':
              message = newValue ? 'The door has been opened' : 'The door has been closed';
              eventType = newValue ? 'Door Open' : 'Door Closed';
              break;

            case 'sectorStatus':
              if (!newValue) {
                message = 'Main power supply lost, battery backup activated';
                eventType = 'Power Lost';
              } else {
                message = 'Main power supply restored';
                eventType = 'Power Restored';
              }
              break;

            case 'state':
              if (newValue === 'on') {
                message = 'Panel screen is On';
                eventType = 'Screen On';
              } else if (newValue === 'off') {
                message = 'Panel screen is Off';
                eventType = 'Screen Off';
              } else {
                message = `Panel screen state changed to '${newValue}'`;
                eventType = `Screen ${newValue}`;
              }
              break;

            default:
              message = `Field '${field}' changed from '${oldValue}' to '${newValue}'`;
              eventType = `Change in ${field}`;
              break;
          }

          // Log the change
          Logger.appendLog(clientInfo.name, eventType, {
            field,
            oldValue,
            newValue,
            message,
          });

          console.log(
              `Field '${field}' for panel '${clientInfo.name}' changed from '${oldValue}' to '${newValue}'`
          );
        }
      }
    });

    // Update the fields in clientInfo
    clientInfo.cpuTemp = heartbeatData.cpuTemp;
    clientInfo.isDoorOpen = heartbeatData.isDoorOpen;
    clientInfo.sectorStatus = heartbeatData.sectorStatus;
    clientInfo.maintenanceMode = heartbeatData.maintenanceMode;
    clientInfo.state = heartbeatData.state;

    // Re-store
    this.clients.set(ws, clientInfo);
    this.lastClientData.set(clientInfo.name, clientInfo);
  }

  /**
   * Broadcast a message to all connected clients (any type).
   */
  broadcast(message) {
    this.clients.forEach((clientInfo, client) => {
      if (client.readyState === this.WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  /**
   * Broadcast a message to clients matching the specified type and name (or 'all').
   */
  broadcastToAppropriateClients(message, type, name) {
    this.clients.forEach((clientInfo, client) => {
      if (client.readyState === this.WebSocket.OPEN) {
        const typeMatches = (clientInfo.clientType === type || type === 'all');
        const nameMatches = (!name || clientInfo.name === name || name === 'all');

        if (typeMatches && nameMatches) {
          client.send(message);
        }
      }
    });
  }

  /**
   * Send a message to a specific panel by name.
   */
  sendToPanel(panelName, message) {
    const clientEntry = this.clientWsMap.get(panelName);
    if (clientEntry && clientEntry.ws.readyState === this.WebSocket.OPEN) {
      clientEntry.ws.send(JSON.stringify(message));
    } else {
      console.warn(`Panel ${panelName} is not connected.`);
    }
  }

  /**
   * Send a message to all "frontend" or "user" clients.
   */
  sendToFrontend(message) {
    this.clients.forEach((clientInfo, client) => {
      if ((clientInfo.clientType === 'user' || clientInfo.clientType === 'frontend') &&
          client.readyState === this.WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  /**
   * Broadcast to all active WebSocket clients, regardless of type.
   */
  broadcastToAllClients(message) {
    for (const [clientWs, clientInfo] of this.clients.entries()) {
      if (clientWs.readyState === this.WebSocket.OPEN) {
        clientWs.send(message);
      }
    }
  }

  /**
   * Get an array of all clientInfo objects (the last known data).
   */
  getClients() {
    return Array.from(this.lastClientData.values());
  }

  /**
   * Get a client (ws + info) by panel name.
   */
  getClientByName(name) {
    const clientEntry = this.clientWsMap.get(name);
    return clientEntry ? clientEntry : null;
  }

  /**
   * Get the last-known data for all clients.
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
   * Get the client info for a particular client name (panel name).
   */
  getClientInfoByName(name) {
    return this.lastClientData.get(name) || null;
  }

  /**
   * Example function to gather certain panel settings
   */
  getPanelSettings() {
    const panelSettings = {};
    this.lastClientData.forEach((data, name) => {
      panelSettings[name] = {
        state: data.state,
        cpuTemp: data.cpuTemp,
        isDoorOpen: data.isDoorOpen,
        sectorStatus: data.sectorStatus,
        maintenanceMode: data.maintenanceMode,
      };
    });
    return panelSettings;
  }
}

module.exports = ClientManager;
