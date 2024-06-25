const WebSocket = require('ws');
const ClientManager = require('./clientManager');
const Logger = require('./logger');
const HealthChecker = require('./healthChecker');
const moment = require('moment');

const HEARTBEAT_INTERVAL = 30000;  // 30 seconds
const STATUS_UPDATE_INTERVAL = 1000; // 1 second for status updates

class WebSocketServer {
  constructor() {
    this.expectedPanels = ['indret', 'aval', 'amont'];
    this.wss = new WebSocket.Server({ port: 8080 });
    this.clientManager = new ClientManager(WebSocket);
    this.setupServer();
  }

  setupServer() {
    this.wss.on('listening', () => {
      console.log('Server is running on port 8080');
      setInterval(() => this.checkProblems(), HEARTBEAT_INTERVAL);
      setInterval(() => this.sendStatusUpdates(), STATUS_UPDATE_INTERVAL);
    });

    this.wss.on('connection', ws => this.handleConnection(ws));
  }

  handleConnection(ws) {
    console.log('New client connected');
    Logger.appendLog('New client connected');

    ws.on('message', message => this.handleMessage(ws, message));
    ws.on('close', () => this.handleClose(ws));

    const clientAddressMessage = JSON.stringify({ message: 'Client IP address: ' + ws._socket.remoteAddress });
    ws.send(clientAddressMessage);
    Logger.appendLog(`Sent IP address to client: ${clientAddressMessage}`);
  }

  handleMessage(ws, message) {
    console.log('Received from client: %s', message);
    try {
      message = JSON.parse(message);
    } catch (e) {
      console.log('Invalid JSON');
      ws.send(JSON.stringify({ error: 'Invalid JSON' }));
      Logger.appendLog('Invalid JSON received');
      return;
    }

    if (message.type === 'register' || message.type === 'instruction' || message.type === 'maintenanceMode') {
      Logger.appendLog(`${JSON.stringify(message)}`);
    }

    switch (message.type) {
      case 'register':
        this.clientManager.addClient(ws, {
          clientType: message.clientType,
          name: message.name,
          lastHeartbeat: Date.now()
        });
        ws.send(JSON.stringify({ message: 'Registration successful' }));
        break;
      case 'heartbeat':
        this.clientManager.updateClient(ws, {
          lastHeartbeat: Date.now(),
          state: message.state,
          cpuTemp: message.cpuTemp,
          isDoorOpen: message.isDoorOpen,
          sectorStatus: message.sectorStatus,
          maintenanceMode: message.maintenanceMode
        });
        break;
      case 'maintenanceMode':
        this.clientManager.updateClient(ws, { maintenanceMode: message.state });
        break;
      case 'instruction':
        if (message.to === 'panel' && (message.instruction === 'on' || message.instruction === 'off')) {
          this.clientManager.broadcastToAppropriateClients(JSON.stringify({
            type: 'instruction',
            to: 'panel',
            instruction: message.instruction
          }), 'panel', message.name);
        } else {
          console.log('Invalid instruction');
        }
        break;
      default:
        console.log('Unknown message type');
    }
  }

  handleClose(ws) {
    this.clientManager.removeClient(ws);
    console.log('Client disconnected');
    Logger.appendLog('Client disconnected');
  }

  async checkProblems() {
    const allOk = await HealthChecker.checkProblems(this.clientManager.getClients(), this.clientManager.broadcastToAppropriateClients.bind(this.clientManager), this.expectedPanels);
    if (!allOk) {
      this.clientManager.broadcastToAppropriateClients(JSON.stringify({ type: 'instruction', to: 'panel', instruction: 'off' }), 'panel');
    }
  }

  sendStatusUpdates() {
    const panelStatus = {};

    // Utilisez les dernières données des clients stockées dans ClientManager
    this.clientManager.getLastClientData().forEach(clientInfo => {
      const isConnected = Date.now() - clientInfo.lastHeartbeat <= HEARTBEAT_INTERVAL * 2;
      const lastHeartbeatTime = moment(clientInfo.lastHeartbeat);
      panelStatus[clientInfo.name] = {
        connected: isConnected,
        state: clientInfo.state,
        cpuTemp: clientInfo.cpuTemp,
        isDoorOpen: clientInfo.isDoorOpen,
        sectorStatus: clientInfo.sectorStatus,
        maintenanceMode: clientInfo.maintenanceMode,
        lastHeartbeat:Math.floor((Date.now() - lastHeartbeatTime) / 1000), // Relative time
        lastHeartbeatTimestamp: lastHeartbeatTime.format('YYYY-MM-DD HH:mm:ss') // Full timestamp
      };
    });

    // Initialisez les panneaux attendus avec les dernières données connues ou avec des valeurs par défaut uniquement s'ils ne sont pas déjà définis
    this.expectedPanels.forEach(panel => {
      if (!panelStatus[panel]) {
        const lastClientInfo = this.clientManager.getLastClientData().find(info => info.name === panel);
        if (lastClientInfo) {
          const lastHeartbeatTime = moment(lastClientInfo.lastHeartbeat);
          panelStatus[panel] = {
            connected: false,
            state: lastClientInfo.state,
            cpuTemp: lastClientInfo.cpuTemp,
            isDoorOpen: lastClientInfo.isDoorOpen,
            sectorStatus: lastClientInfo.sectorStatus,
            maintenanceMode: lastClientInfo.maintenanceMode,
            lastHeartbeat: Math.floor((Date.now() - lastHeartbeatTime) / 1000), // Relative time
            lastHeartbeatTimestamp: lastHeartbeatTime.format('YYYY-MM-DD HH:mm:ss') // Full timestamp
          };
        } else {
          panelStatus[panel] = {
            connected: false,
            state: null,
            cpuTemp: null,
            isDoorOpen: null,
            sectorStatus: null,
            maintenanceMode: null,
            lastHeartbeat: null,
            lastHeartbeatTimestamp: null
          };
        }
      }
    });

    const statusMessage = JSON.stringify({ type: 'status', panelStatus });
    this.clientManager.broadcast(statusMessage);
  }
}

new WebSocketServer();
