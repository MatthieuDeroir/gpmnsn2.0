// src/utils/websocketClient.js

class WebSocketClient {
    constructor(url) {
      this.url = url;
      this.socket = null;
      this.isConnected = false;
      this.panelStatus = JSON.parse(localStorage.getItem('panelStatus')) || {}; // Load from localStorage
      this.logs = JSON.parse(localStorage.getItem('logs')) || {}; // Load logs from localStorage
      this.isAnyPanelInDysfunction = false;
      this.listeners = [];
      this.statusListeners = [];
      this.logsListeners = [];
      this.reconnectInterval = 2000;
    }
  
    connect() {
      this.socket = new WebSocket(this.url);
  
      this.socket.onopen = () => {
        this.isConnected = true;
        console.log('WebSocket connection established.');
        this.sendMessage({ type: 'register', clientType: 'user', name: 'frontend' });
        this.notifyStatusListeners();
      };
  
      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
  
          switch (data.type) {
            case 'status':
              // For each panel in data.panelStatus
              Object.keys(data.panelStatus).forEach((panelName) => {
                const newPanelData = data.panelStatus[panelName];
                const existingPanelData = this.panelStatus[panelName] || {};
  
                // Merge the newPanelData into existingPanelData, avoiding overwriting non-null values with null
                const mergedPanelData = { ...existingPanelData };
  
                Object.keys(newPanelData).forEach((key) => {
                  if (newPanelData[key] !== null && newPanelData[key] !== undefined) {
                    mergedPanelData[key] = newPanelData[key];
                  }
                  // If newPanelData[key] is null or undefined, do not overwrite
                });
  
                this.panelStatus[panelName] = mergedPanelData;
              });
  
              localStorage.setItem('panelStatus', JSON.stringify(this.panelStatus)); // Save to localStorage
              this.updateIsAnyPanelInDysfunction();
              this.notifyStatusListeners();
  
              // Handle logs if included
              if (data.logs) {
                this.processLogs(data.logs);
              }
              break;
  
            // Other cases...
  
            default:
              break;
          }
  
          this.listeners.forEach((callback) => callback(data));
        } catch (error) {
          console.error('Error parsing message data:', error);
        }
      };
  
      this.socket.onclose = () => {
        this.isConnected = false;
        console.log('WebSocket connection closed.');
        this.notifyStatusListeners();
        
        // Attempt to reconnect after a delay
        setTimeout(() => {
          console.log('Attempting to reconnect...');
          this.connect();
        }, this.reconnectInterval);
      };
  
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    }
  
    // Helper function to update the dysfunction status
    updateIsAnyPanelInDysfunction() {
      const panelsToCheck = ['aval', 'amont', 'indret']; // Only these panels will be checked for dysfunction
      this.isAnyPanelInDysfunction = Object.entries(this.panelStatus).some(
        ([name, panel]) =>
          panelsToCheck.includes(name) &&
          (panel.state !== 'rebooting' && (!panel.connected || !panel.sectorStatus))
      );
    }
  
    // Process logs received from the server
    processLogs(logsArray) {
      logsArray.forEach((logLine) => {
        // Assuming logLine is a string like "timestamp,panel,eventType,details"
        const logParts = logLine.split(',');
        const panelName = logParts[1];
        if (!this.logs[panelName]) {
          this.logs[panelName] = [];
        }
        this.logs[panelName].push(logLine);
      });
  
      localStorage.setItem('logs', JSON.stringify(this.logs)); // Save logs to localStorage
      this.notifyLogsListeners();
    }
  
    // Fetch logs for a specific panel
    async fetchLogsForPanel(panelName) {
      try {
        const response = await fetch(`http://panneauxloire.nantes.port.fr:4000/logs/panel/${panelName}?limit=10`);
        const data = await response.json();
        if (data && Array.isArray(data.logs)) {
          this.logs = {
            ...this.logs,
            [panelName]: data.logs,
          };
          localStorage.setItem('logs', JSON.stringify(this.logs)); // Save logs to localStorage
          this.notifyLogsListeners();
        } else {
          console.warn('Invalid log data received:', data);
          this.logs = {
            ...this.logs,
            [panelName]: [],
          };
          this.notifyLogsListeners();
        }
      } catch (error) {
        console.error('Error fetching logs:', error);
        this.logs = {
          ...this.logs,
          [panelName]: [],
        };
        this.notifyLogsListeners();
      }
    }
  
    // Methods for managing listeners
    addMessageListener(callback) {
      if (typeof callback === 'function') {
        this.listeners.push(callback);
      }
    }
  
    removeMessageListener(callback) {
      this.listeners = this.listeners.filter((listener) => listener !== callback);
    }
  
    addStatusListener(callback) {
      if (typeof callback === 'function') {
        this.statusListeners.push(callback);
      }
    }
  
    removeStatusListener(callback) {
      this.statusListeners = this.statusListeners.filter((listener) => listener !== callback);
    }
  
    addLogsListener(callback) {
      if (typeof callback === 'function') {
        this.logsListeners.push(callback);
      }
    }
  
    removeLogsListener(callback) {
      this.logsListeners = this.logsListeners.filter((listener) => listener !== callback);
    }
  
    // Notify listeners about status updates
    notifyStatusListeners() {
      this.statusListeners.forEach((callback) => callback(this.panelStatus, this.isAnyPanelInDysfunction));
    }
  
    // Notify listeners about logs updates
    notifyLogsListeners() {
      this.logsListeners.forEach((callback) => callback(this.logs));
    }
  
    // Method to send messages
    sendMessage(message) {
      if (this.isConnected && this.socket) {
        this.socket.send(JSON.stringify(message));
      } else {
        console.warn('WebSocket is not connected. Cannot send message.');
      }
    }
  }
  
  const websocketClient = new WebSocketClient('wss://panneauxloire.nantes.port.fr/ws/');
  //websocketClient.connect();
  
  export default websocketClient;
  
