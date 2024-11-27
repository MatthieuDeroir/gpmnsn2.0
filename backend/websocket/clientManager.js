// clientManager.js
const WebSocket = require('ws');
const Logger = require('../utils/logger');

class ClientManager {
  constructor(WebSocket) {
    this.WebSocket = WebSocket;
    this.clients = new Map(); // Map of ws => clientInfo
    this.lastClientData = new Map(); // Map of clientName => clientInfo
    this.clientWsMap = new Map(); // Map of clientName => { ws, clientInfo }
  }

  /**
   * Adds or updates a client in the manager.
   * @param {WebSocket} ws - The WebSocket connection.
   * @param {object} clientInfo - Information about the client.
   */
  addClient(ws, clientInfo) {
    let ipAddress = ws._socket.remoteAddress;
    clientInfo.ip = ipAddress.startsWith('::ffff:') ? ipAddress.split(':').pop() : ipAddress;
    clientInfo.connected = true;

    // Check if the client is already connected via another ws
    if (this.clientWsMap.has(clientInfo.name)) {
      const existingWs = this.clientWsMap.get(clientInfo.name).ws;
      if (existingWs !== ws && existingWs.readyState === this.WebSocket.OPEN) {
        console.log(`Disconnecting old client ${clientInfo.name} to establish a new connection.`);
        existingWs.close(); // Close the old connection
      } else {
        console.log(`Existing client ${clientInfo.name} is the same as the current connection. Not disconnecting.`);
      }
    }

    // Update the maps with the new connection
    this.clients.set(ws, clientInfo);
    this.lastClientData.set(clientInfo.name, clientInfo);
    this.clientWsMap.set(clientInfo.name, { ws, clientInfo });

    console.log(`Client registered/updated: ${clientInfo.name}, Connected: ${clientInfo.connected}, IP: ${clientInfo.ip}`);
  }

  /**
   * Marks a client as disconnected without removing it from the manager.
   * @param {WebSocket} ws - The WebSocket connection.
   */
  removeClient(ws) {
    const clientInfo = this.clients.get(ws);
    if (clientInfo) {
      clientInfo.connected = false;
      this.clients.delete(ws);
      this.lastClientData.set(clientInfo.name, clientInfo);

      // Remove from clientWsMap if this ws was the current one
      const currentClient = this.clientWsMap.get(clientInfo.name);
      if (currentClient && currentClient.ws === ws) {
        this.clientWsMap.delete(clientInfo.name);
      }

      console.log(`Client disconnected: ${clientInfo.name}, Connected: ${clientInfo.connected}, IP: ${clientInfo.ip}`);
    }
  }

  /**
   * Removes all clients of a specific type except for an excluded WebSocket.
   * @param {string} clientType - The type of clients to remove.
   * @param {WebSocket} excludeWs - The WebSocket connection to exclude.
   */
  removeClientsByType(clientType, excludeWs = null) {
    for (const [ws, clientInfo] of this.clients.entries()) {
      if (clientInfo.clientType === clientType && ws !== excludeWs) {
        console.log(`Marquage du client de type ${clientType} comme déconnecté : ${clientInfo.name}`);
        clientInfo.connected = false; // Mark as disconnected
        this.clients.delete(ws);
        this.lastClientData.set(clientInfo.name, clientInfo);

        // Remove from clientWsMap if necessary
        const currentClient = this.clientWsMap.get(clientInfo.name);
        if (currentClient && currentClient.ws === ws) {
          this.clientWsMap.delete(clientInfo.name);
        }
      }
    }
  }

  /**
   * Updates client information with new data.
   * @param {WebSocket} ws - The WebSocket connection.
   * @param {object} updates - The data to update.
   */
  updateClient(ws, updates) {
    const clientInfo = this.clients.get(ws);
    if (clientInfo) {
      Object.assign(clientInfo, updates);
      this.clients.set(ws, clientInfo);
      this.lastClientData.set(clientInfo.name, clientInfo);
      console.log(`Client mis à jour : ${clientInfo.name}, Updates: ${JSON.stringify(updates)}`);
    }
  }

  /**
   * Updates the heartbeat information for a client.
   * @param {WebSocket} ws - The WebSocket connection.
   * @param {object} heartbeatData - The heartbeat data sent by the client.
   */

// clientManager.js

  updateHeartbeat(ws, heartbeatData) {
    const clientInfo = this.clients.get(ws);
    if (clientInfo) {
      clientInfo.lastHeartbeat = Date.now();

      // Champs à surveiller
      const fieldsToMonitor = ['isDoorOpen', 'sectorStatus', 'maintenanceMode', 'state'];

      // Parcourir les champs à surveiller et détecter les changements
      fieldsToMonitor.forEach((field) => {
        if (heartbeatData.hasOwnProperty(field)) {
          const oldValue = clientInfo[field];
          const newValue = heartbeatData[field];

          if (oldValue !== newValue) {
            // Générer un message personnalisé et un eventType court basé sur le champ et la nouvelle valeur
            let message = '';
            let eventType = '';

            switch (field) {
              case 'maintenanceMode':
                if (newValue) {
                  message = 'Maintenance Mode has been activated';
                  eventType = 'Maintenance On';
                } else {
                  message = 'Maintenance Mode has been deactivated';
                  eventType = 'Maintenance Off';
                }
                break;

              case 'isDoorOpen':
                if (newValue) {
                  message = 'The door has been opened';
                  eventType = 'Door Open';
                } else {
                  message = 'The door has been closed';
                  eventType = 'Door Closed';
                }
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

            // Enregistrer le changement
            Logger.appendLog(
                clientInfo.name, // Nom du panneau
                eventType,       // Type d'événement (court et spécifique)
                {
                  field: field,
                  oldValue: oldValue,
                  newValue: newValue,
                  message: message,
                }
            );

            console.log(
                `Field '${field}' for panel '${clientInfo.name}' changed from '${oldValue}' to '${newValue}'`
            );
          }
        }
      });

      // Mettre à jour les valeurs dans clientInfo
      clientInfo.cpuTemp = heartbeatData.cpuTemp;
      clientInfo.isDoorOpen = heartbeatData.isDoorOpen;
      clientInfo.sectorStatus = heartbeatData.sectorStatus;
      clientInfo.maintenanceMode = heartbeatData.maintenanceMode;
      clientInfo.state = heartbeatData.state;

      this.clients.set(ws, clientInfo);
      this.lastClientData.set(clientInfo.name, clientInfo);
      // console.log(`Heartbeat reçu pour ${clientInfo.name}: ${JSON.stringify(heartbeatData)}, Connected: ${clientInfo.connected}`);
    } else {
      console.warn(`Heartbeat reçu pour un client non enregistré : ${heartbeatData.name}`);
    }
  }


  /**
   * Broadcasts a message to all connected clients.
   * @param {string} message - The message to broadcast.
   */
  broadcast(message) {
    this.clients.forEach((clientInfo, client) => {
      if (client.readyState === this.WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  /**
   * Broadcasts a message to clients of a specific type and name.
   * @param {string} message - The message to broadcast.
   * @param {string} type - The type of clients to broadcast to (e.g., 'panel', 'user').
   * @param {string} name - The specific name of the client to broadcast to.
   */
  broadcastToAppropriateClients(message, type, name) {
    this.clients.forEach((clientInfo, client) => {
      if (client.readyState === this.WebSocket.OPEN) {
        const typeMatches = clientInfo.clientType === type || type === 'all';
        const nameMatches = !name || clientInfo.name === name || name === 'all';

        if (typeMatches && nameMatches) {
          client.send(message);
        }
      }
    });
  }

  sendToPanel(panelName, message) {
    const clientEntry = this.clientWsMap.get(panelName);
    if (clientEntry && clientEntry.ws.readyState === this.WebSocket.OPEN) {
      clientEntry.ws.send(JSON.stringify(message));
    } else {
      console.warn(`Panel ${panelName} is not connected.`);
    }
  }

  sendToFrontend(message) {
    this.clients.forEach((clientInfo, client) => {
      if (
          (clientInfo.clientType === 'user' || clientInfo.clientType === 'frontend') &&
          client.readyState === this.WebSocket.OPEN
      ) {
        client.send(message);
      }
    });
  }

  /**
   * Broadcasts a message to all clients.
   * @param {string} message - The message to broadcast.
   */
  broadcastToAllClients(message) {
    for (const [clientWs, clientInfo] of this.clients.entries()) {
      if (clientWs.readyState === this.WebSocket.OPEN) {
        clientWs.send(message); // Send the message to each open client
      }
    }
  }

  /**
   * Retrieves an array of all client information objects.
   * @returns {Array}
   */
  getClients() {
    return Array.from(this.lastClientData.values()); // Return all clients
  }

  getClientByName(name) {
    const clientEntry = this.clientWsMap.get(name);
    return clientEntry ? clientEntry : null;
  }

  /**
   * Retrieves an array of all last client data.
   * @returns {Array}
   */
  getLastClientData() {
    return Array.from(this.lastClientData.values());
  }

  /**
   * Retrieves client information based on the WebSocket connection.
   * @param {WebSocket} ws - The WebSocket connection.
   * @returns {object|null}
   */
  getClientInfo(ws) {
    return this.clients.get(ws);
  }

  /**
   * Retrieves client information based on the client name.
   * @param {string} name - The name of the client.
   * @returns {object|null}
   */
  getClientInfoByName(name) {
    return this.lastClientData.get(name) || null;
  }

  /**
   * Retrieves the settings of all panels.
   * @returns {object}
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
