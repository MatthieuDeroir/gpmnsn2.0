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
  
    broadcast(message) {
      this.clients.forEach((clientInfo, client) => {
        if (client.readyState === this.WebSocket.OPEN) {
          client.send(message);
        }
      });
    }
  
    broadcastToAppropriateClients(message, type, name) {
      this.clients.forEach((clientInfo, client) => {
        if (client.readyState === this.WebSocket.OPEN) {
          if (clientInfo.clientType === 'all' || clientInfo.clientType === type) {
            if (!name || clientInfo.name === name || name === 'all') {
              client.send(message);
            }
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
  }
  
  module.exports = ClientManager;
  