const WebSocket = require('ws');
const ClientManager = require('./clientManager');
const Logger = require('./logger');
const HealthChecker = require('./healthChecker');
const moment = require('moment');

const HEARTBEAT_INTERVAL = 5000;
const STATUS_UPDATE_INTERVAL = 1000; // 1 second for status updates

class WebSocketServer {
  constructor() {
    this.expectedPanels = ['indret', 'aval', 'amont'];
    this.wss = new WebSocket.Server({ port: 8080 });
    this.clientManager = new ClientManager(WebSocket);
    this.heartbeatInterval = HEARTBEAT_INTERVAL;
    this.panelPreviousStatus = {}; // Initialize previous status tracking
    this.expectedPanels.forEach(panel => {
      this.panelPreviousStatus[panel] = 'offline';
    });
    this.setupServer();
  }

  setupServer() {
    this.wss.on('listening', () => {
      console.log('Server is running on port 8080');
      this.healthCheckIntervalId = setInterval(() => this.checkProblems(), this.heartbeatInterval);
      setInterval(() => this.sendStatusUpdates(), STATUS_UPDATE_INTERVAL);
    });

    this.wss.on('connection', ws => this.handleConnection(ws));
  }

  handleConnection(ws) {
    ws.on('message', (message) => {
      this.handleMessage(ws, message);
    });

    ws.on('close', () => this.handleClose(ws));

    const clientAddressMessage = JSON.stringify({ message: 'Client IP address: ' + ws._socket.remoteAddress });
    ws.send(clientAddressMessage);

    // Send initial instructions immediately after the connection is established
    this.sendInitialInstructions(ws);
  }

  handleMessage(ws, message) {
    try {
      message = JSON.parse(message);
    } catch (e) {
      console.log('Invalid JSON');
      ws.send(JSON.stringify({ error: 'Invalid JSON' }));
      Logger.appendLog('Unknown Panel', 'Error', { error: 'Invalid JSON' });
      return;
    }

    // Process the message types
    if (message.type != 'heartbeat') {
      console.log('Received message:', message);
    }

    switch (message.type) {
      case 'reboot':
        // ... existing code ...
        break;
      case 'refresh':
        // ... existing code ...
        break;
      case 'instruction':
        // ... existing code ...
        break;
      case 'register':
        console.log('Received registration:', message);

        // Check if the clientType is "user"
        if (message.clientType === 'user') {
          console.log('Removing all other user clients before registering the new user');
          this.clientManager.removeClientsByType('user', ws);
        }

        // Register the new client
        this.clientManager.addClient(ws, {
          clientType: message.clientType,
          name: message.name,
          lastHeartbeat: Date.now()
        });

        // Set initial status to 'online' and log the status change
        const previousStatus = this.panelPreviousStatus[message.name];
        if (previousStatus !== 'online') {
          Logger.appendLog(message.name, 'Status Change', { status: 'online' });
          this.panelPreviousStatus[message.name] = 'online';
        }

        this.clientManager.broadcastToAppropriateClients(JSON.stringify({
          type: 'panel_registered',
          name: message.name
        }), 'user', "frontend");

        // Log registration event
        Logger.appendLog(message.name, 'Register', { panelName: message.name, role: message.from });
        break;

      case 'heartbeat':
        this.clientManager.updateHeartbeat(ws, message);
        Logger.appendLog(message.name, 'Heartbeat', message);
        break;
      case 'maintenanceMode':
        this.clientManager.updateClient(ws, { maintenanceMode: message.state });
        Logger.appendLog(message.name, 'Maintenance Mode', { state: message.state, role: message.from });
        break;
      case 'logs':
        const logs = Logger.getLogs();
        ws.send(JSON.stringify({ type: 'logs', logs }));
        break;
      case 'ping':
        ws.send(JSON.stringify({ type: 'pong' }));
        break;
      default:
        console.log('Unknown message type: ', message.type);
        Logger.appendLog(message.name || 'Unknown Panel', `Unknown Event: ${message.type}`, message);
    }
  }

  handleClose(ws) {
    const clientInfo = this.clientManager.getClientInfo(ws);
    if (clientInfo && clientInfo.name) {
      const panelName = clientInfo.name;

      // Update status to 'offline' and log the status change
      const previousStatus = this.panelPreviousStatus[panelName];
      if (previousStatus !== 'offline') {
        Logger.appendLog(panelName, 'Status Change', { status: 'offline' });
        this.panelPreviousStatus[panelName] = 'offline';
      }
    }

    this.clientManager.removeClient(ws);
    console.log('Client disconnected');
    Logger.appendLog('Unknown Panel', 'Client disconnected');
  }

  sendInitialInstructions(ws) {
    const panelSettings = this.clientManager.getPanelSettings();
    const instructions = {
      type: 'instruction',
      panels: panelSettings
    };
    ws.send(JSON.stringify(instructions));
  }

  updateHeartbeatInterval(newInterval) {
    clearInterval(this.healthCheckIntervalId); // Stop the old interval
    this.heartbeatInterval = newInterval;
    this.healthCheckIntervalId = setInterval(() => this.checkProblems(), this.heartbeatInterval); // Start a new interval
    console.log(`Heartbeat interval updated to ${this.heartbeatInterval}ms`);
  }

  async checkProblems() {
    const allOk = await HealthChecker.checkProblems(this.clientManager.getClients(), this.clientManager.broadcastToAppropriateClients.bind(this.clientManager), this.expectedPanels);
    if (!allOk) {
      this.clientManager.broadcastToAppropriateClients(JSON.stringify({ type: 'instruction', to: 'panel', instruction: 'off' }), 'panel');
    }
  }

  sendStatusUpdates() {
    const panelStatus = {};

    this.clientManager.getLastClientData().forEach(clientInfo => {
      const panelName = clientInfo.name;
      const isConnected = Date.now() - clientInfo.lastHeartbeat <= this.heartbeatInterval * 6;
      const lastHeartbeatTime = moment(clientInfo.lastHeartbeat);

      // Determine the current status
      const currentStatus = isConnected ? 'online' : 'offline';

      // Check if the status has changed
      const previousStatus = this.panelPreviousStatus[panelName];
      if (previousStatus !== currentStatus) {
        // Status has changed, log it
        Logger.appendLog(panelName, 'Status Change', { status: currentStatus });
        // Update the previous status
        this.panelPreviousStatus[panelName] = currentStatus;
      }

      panelStatus[panelName] = {
        status: currentStatus, // Include the status field
        connected: isConnected,
        state: clientInfo.state,
        cpuTemp: clientInfo.cpuTemp,
        isDoorOpen: clientInfo.isDoorOpen,
        sectorStatus: clientInfo.sectorStatus,
        maintenanceMode: clientInfo.maintenanceMode,
        lastHeartbeat: Math.floor((Date.now() - lastHeartbeatTime) / 1000),
        lastHeartbeatTimestamp: lastHeartbeatTime.format('YYYY-MM-DD HH:mm:ss')
      };
    });

    // Handle expected panels that might not be in the clientManager
    this.expectedPanels.forEach(panel => {
      if (!panelStatus[panel]) {
        const lastClientInfo = this.clientManager.getLastClientData().find(info => info.name === panel);
        const lastHeartbeatTime = lastClientInfo ? moment(lastClientInfo.lastHeartbeat) : null;

        // Determine the current status
        const currentStatus = 'offline';

        // Check if the status has changed
        const previousStatus = this.panelPreviousStatus[panel];
        if (previousStatus !== currentStatus) {
          // Status has changed, log it
          Logger.appendLog(panel, 'Status Change', { status: currentStatus });
          // Update the previous status
          this.panelPreviousStatus[panel] = currentStatus;
        }

        panelStatus[panel] = {
          status: currentStatus, // Include the status field
          connected: false,
          state: lastClientInfo ? lastClientInfo.state : null,
          cpuTemp: lastClientInfo ? lastClientInfo.cpuTemp : null,
          isDoorOpen: lastClientInfo ? lastClientInfo.isDoorOpen : null,
          sectorStatus: lastClientInfo ? lastClientInfo.sectorStatus : null,
          maintenanceMode: lastClientInfo ? lastClientInfo.maintenanceMode : null,
          lastHeartbeat: lastHeartbeatTime ? Math.floor((Date.now() - lastHeartbeatTime) / 1000) : null,
          lastHeartbeatTimestamp: lastHeartbeatTime ? lastHeartbeatTime.format('YYYY-MM-DD HH:mm:ss') : null
        };
      }
    });

    const statusMessage = JSON.stringify({ type: 'status', panelStatus });
    this.clientManager.broadcast(statusMessage);
  }
}

new WebSocketServer();
