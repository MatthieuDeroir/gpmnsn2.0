class ClientManager {
  constructor(WebSocket) {
    this.WebSocket = WebSocket;
    this.clients = new Map();
    this.lastClientData = new Map();
  }

  addClient(ws, clientInfo) {
    this.clients.set(ws, clientInfo);
    this.lastClientData.set(clientInfo.name, clientInfo);
  }

  removeClient(ws) {
    const clientInfo = this.clients.get(ws);
    if (clientInfo) {
      this.clients.delete(ws);
      this.lastClientData.delete(clientInfo.name);
    }
  }

  updateClient(ws, updates) {
    const clientInfo = this.clients.get(ws);
    if (clientInfo) {
      Object.assign(clientInfo, updates);
      this.clients.set(ws, clientInfo);
      this.lastClientData.set(clientInfo.name, clientInfo);
    }
  }

  updateHeartbeat(ws, heartbeatData) {
    const clientInfo = this.clients.get(ws);
    if (clientInfo) {
      // Update the lastHeartbeat timestamp and other heartbeat-specific data
      clientInfo.lastHeartbeat = Date.now();
      clientInfo.cpuTemp = heartbeatData.cpuTemp;
      clientInfo.isDoorOpen = heartbeatData.isDoorOpen;
      clientInfo.sectorStatus = heartbeatData.sectorStatus;
      clientInfo.maintenanceMode = heartbeatData.maintenanceMode;

      // Store updated information
      this.clients.set(ws, clientInfo);
      this.lastClientData.set(clientInfo.name, clientInfo);
    }
  }

  broadcast(message) {
    this.clients.forEach((clientInfo, client) => {
      if (client.readyState === this.WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  broadcastToAppropriateClients(message, type, name) {
    this.clients.forEach((clientInfo, client) => {
      if (client.readyState === this.WebSocket.OPEN && (clientInfo.clientType === type || clientInfo.clientType === 'all')) {
        if (!name || clientInfo.name === name || name === 'all') {
          client.send(message);
        }
      }
    });
  }

  getClients() {
    return Array.from(this.clients.values());
  }

  getLastClientData() {
    return Array.from(this.lastClientData.values());
  }

  getPanelSettings() {
    const panelSettings = {};
    this.lastClientData.forEach((data, name) => {
      panelSettings[name] = {
        state: data.state,
        cpuTemp: data.cpuTemp,
        isDoorOpen: data.isDoorOpen,
        sectorStatus: data.sectorStatus,
        maintenanceMode: data.maintenanceMode
      };
    });
    return panelSettings;
  }
}

module.exports = ClientManager;
