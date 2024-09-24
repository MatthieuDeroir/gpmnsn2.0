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
        // Update all relevant data, including the 'state'
        clientInfo.lastHeartbeat = Date.now();
        clientInfo.cpuTemp = heartbeatData.cpuTemp;
        clientInfo.isDoorOpen = heartbeatData.isDoorOpen;
        clientInfo.sectorStatus = heartbeatData.sectorStatus;
        clientInfo.maintenanceMode = heartbeatData.maintenanceMode;
        clientInfo.state = heartbeatData.state;  // Assuming 'state' is provided in the heartbeatData

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

  // broadcastToAppropriateClients(message, type, name) {
  //   this.clients.forEach((clientInfo, client) => {
  //     if (client.readyState === this.WebSocket.OPEN && (clientInfo.clientType === type || clientInfo.clientType === 'all')) {
  //       if (!name || clientInfo.name === name || name === 'all') {
  //         client.send(message);
  //       }
  //     }
  //   });
  // }

  broadcastToAppropriateClients(message, type, name) {
    this.clients.forEach((clientInfo, client) => {
        if (client.readyState === this.WebSocket.OPEN) {
            // Check if the client matches the type, or if we're broadcasting to all types
            const typeMatches = clientInfo.clientType === type || type === 'all';
            
            // Check if the name matches, or if we're broadcasting to all names
            const nameMatches = !name || clientInfo.name === name || name === 'all';
            
            // If both type and name match, send the message
            if (typeMatches && nameMatches) {
                client.send(message);
            }
        }
    });
}

  broadcastToAllClients(message) {
    for (const [clientWs, clientInfo] of this.clients.entries()) {
        if (clientWs.readyState === this.WebSocket.OPEN) {
            clientWs.send(message); // Send the message to each open client
        }
    }
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
