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
      this.handleMessage(ws, message); // Use handleMessage to process the message
    
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
          if (message.to === 'panel') {
            this.clientManager.broadcastToAppropriateClients(JSON.stringify({
                type: 'instruction',
                to: 'panel',
                instruction: message.instruction,
                heartbeatTimer: message.heartbeatTimer,
            }), 'panel', message.name);

            // Log the instruction with role and panel information
            Logger.appendLog(message.name, 'Instruction Sent', {
                instruction: "reboot",
                role: message.from,  // Include user role
                heartbeatTimer: message.heartbeatTimer,
            });
            } else {
                console.log('Invalid instruction');
            }
            break;
        case 'refresh':
          if (message.to === 'panel') {
            this.clientManager.broadcastToAppropriateClients(JSON.stringify({
                type: 'instruction',
                to: 'panel',
                instruction: message.instruction,
                heartbeatTimer: message.heartbeatTimer,
            }), 'panel', message.name);

            // Log the instruction with role and panel information
            Logger.appendLog(message.name, 'Instruction Sent', {
                instruction: "refresh",
                role: message.from,  // Include user role
                heartbeatTimer: message.heartbeatTimer,
            });
            } else {
                console.log('Invalid instruction');
            }
            break;
        case 'instruction':
            if (message.to === 'panel') {
                this.clientManager.broadcastToAppropriateClients(JSON.stringify({
                    type: 'instruction',
                    to: 'panel',
                    instruction: message.instruction,
                    heartbeatTimer: message.heartbeatTimer,
                }), 'panel', message.name);

                // Log the instruction with role and panel information
                Logger.appendLog(message.name, 'Instruction Sent', {
                    instruction: message.instruction,
                    role: message.from,  // Include user role
                    heartbeatTimer: message.heartbeatTimer,
                });
            } else {
                console.log('Invalid instruction');
            }
            break;
        case 'register':
            console.log('Received registration:', message);
            this.clientManager.addClient(ws, {
                clientType: message.clientType,
                name: message.name,
                lastHeartbeat: Date.now()
            });
            this.clientManager.broadcastToAppropriateClients(JSON.stringify({
                type: 'panel_registered',
                name: message.name
            }), 'user', "frontend");

            // Log registration event
            Logger.appendLog(message.name, 'Register', { panelName: message.name, role: message.from });
            break;
        case 'heartbeat':
            this.clientManager.updateHeartbeat(ws, message);
            // console.log(this.clientManager.getClients())

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
        default:
            console.log('Unknown message type: ', message.type);
            Logger.appendLog(message.name || 'Unknown Panel', `Unknown Event: ${message.type}`, message);
    }


}


  handleClose(ws) {
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
      const isConnected = Date.now() - clientInfo.lastHeartbeat <= this.heartbeatInterval * 6;
      const lastHeartbeatTime = moment(clientInfo.lastHeartbeat);
      panelStatus[clientInfo.name] = {
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
            lastHeartbeat: Math.floor((Date.now() - lastHeartbeatTime) / 1000),
            lastHeartbeatTimestamp: lastHeartbeatTime.format('YYYY-MM-DD HH:mm:ss')
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
