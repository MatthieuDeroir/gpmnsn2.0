// webSocketServer.js
const WebSocket = require('ws');
const redis = require('redis');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const ClientManager = require('../websocket/clientManager');
const Logger = require('../utils/logger');
const HealthChecker = require('../websocket/healthChecker');

const HEARTBEAT_INTERVAL = 1000; // 1 second
const STATUS_UPDATE_INTERVAL = 1000; // 1 second for status updates

class WebSocketServer {
  constructor() {
    this.expectedPanels = ['indret', 'aval', 'amont'];
    this.wss = new WebSocket.Server({ port: 8080 });
    this.clientManager = new ClientManager(WebSocket);
    this.redisClient = redis.createClient();

    this.sentInstructions = {}; // Object to store sent instructions per panel

    this.redisClient.on('error', (err) => console.error('Redis Client Error', err));

    // Initialize the server after connecting to Redis
    this.init();
  }

  async init() {
    try {
      this.setupServer();
      await this.redisClient.connect();
      console.log('Redis client connected');

      // Clear Redis queues before starting the server
      await this.clearRedisQueues();

      this.processQueues();

      // Start the cleanup interval to check for unacknowledged instructions
      this.startCleanupInterval();

    } catch (err) {
      console.error('Failed to connect to Redis:', err);
    }
  }

  setupServer() {

    console.log('WebSocket server is running on port 8080');
    console.log('Starting health check interval...');
    this.healthCheckIntervalId = setInterval(() => this.checkProblems(), HEARTBEAT_INTERVAL);
    this.statusUpdateIntervalId = setInterval(() => this.sendStatusUpdates(), STATUS_UPDATE_INTERVAL);

    this.wss.on('connection', (ws) => this.handleConnection(ws));

    this.wss.on('error', (error) => {
      console.error('WebSocket server error:', error);
    });
  }

  handleConnection(ws) {
    console.log('[WebSocketServer] New connection established.');

    ws.on('message', (message) => {
      this.handleMessage(ws, message);
    });

    ws.on('close', () => {
      console.log('[WebSocketServer] Connection closed.');
      this.handleClose(ws);
    });

    ws.on('error', (error) => {
      console.error(`[WebSocketServer] Connection error: ${error}`);
      this.handleClose(ws);
    });

    // Send initial instructions (if any)
    this.sendInitialInstructions(ws);
  }

  async handleMessage(ws, message) {
    try {
      message = JSON.parse(message);
    } catch (e) {
      console.log('Invalid JSON received.');
      ws.send(JSON.stringify({ error: 'Invalid JSON' }));
      Logger.appendLog('Unknown Client', 'Error', { error: 'Invalid JSON' });
      return;
    }

    switch (message.type) {
      case 'instruction':
        await this.handleInstruction(message);
        break;

      case 'register':
        this.handleRegister(ws, message);
        break;

      case 'heartbeat':
        this.clientManager.updateHeartbeat(ws, message);
        break;

      case 'acknowledgement':
        await this.handleAcknowledgement(message);
        break;

      case 'modify_queue':
        await this.handleModifyQueue(message);
        break;

      case 'ping':
        ws.send(JSON.stringify({ type: 'pong' }));
        break;

      default:
        console.log(`Unknown message type: ${message.type}`);
        Logger.appendLog(message.name || 'Unknown Client', `Unknown Event: ${message.type}`, message);
    }
  }

  async handleInstruction(message) {
    if (message.to === 'panel') {
      const targetPanels = message.name === 'all' ? this.expectedPanels : [message.name];

      for (const panelName of targetPanels) {
        // Enqueue the instruction for each panel and get the instruction item
        const instructionItem = await this.enqueueInstruction(panelName, message.instruction, message.role);

        // Notify the frontend about the queued instruction
        this.clientManager.sendToFrontend(JSON.stringify({
          type: 'queue_update',
          panelName: panelName,
          queue: await this.getQueue(panelName),
        }));

        // Log the instruction, including the instruction ID
        const role = message.role || message.from || 'unknown';
        Logger.appendLog(panelName, `${role} enqueued instruction ${message.instruction} with id ${instructionItem.id}`, {
          instruction: message.instruction,
          instructionId: instructionItem.id,
          role: role,
        });

        console.log(`[WebSocketServer] Instruction enqueued for ${panelName}: ${message.instruction} with id ${instructionItem.id}`);
      }
    } else {
      console.log('Invalid instruction target:', message.to);
    }
  }

  handleRegister(ws, message) {
    const { clientType, name } = message;

    if (clientType === 'user') {
      // Remove all other clients of type 'user' except the current one
      this.clientManager.removeClientsByType('user', ws);
    }

    // Register or update the client
    this.clientManager.addClient(ws, {
      clientType: clientType,
      name: name,
      lastHeartbeat: Date.now(),
      sectorStatus: message.sectorStatus !== undefined ? message.sectorStatus : true,
      state: message.state || 'off',
      cpuTemp: message.cpuTemp || null,
      isDoorOpen: message.isDoorOpen || false,
      maintenanceMode: message.maintenanceMode || false,
    });

    this.clientManager.sendToFrontend(JSON.stringify({
      type: 'panel_registered',
      name: name,
    }));

    // Log the registration event
    const role = message.from || 'unknown';
    Logger.appendLog(name, 'Register', { panelName: name, role: role });
    console.log(`[WebSocketServer] Panel registered: ${name}`);
  }

  handleClose(ws) {
    const clientInfo = this.clientManager.getClientInfo(ws);
    if (clientInfo && clientInfo.name) {
      const panelName = clientInfo.name;

      // Mark the client as disconnected in ClientManager
      this.clientManager.removeClient(ws);

      console.log(`[WebSocketServer] Panel disconnected: ${panelName}`);
      Logger.appendLog(panelName, 'Disconnected', { message: 'WebSocket connection closed.' });
    } else {
      console.log('Disconnected client without registration.');
      Logger.appendLog('Unknown Client', 'Disconnected client without registration.');
    }
  }

  startCleanupInterval() {
    const MAX_WAIT_TIME = 60000; // Maximum wait time in milliseconds (e.g., 60 seconds)
    const CLEANUP_INTERVAL = 10000; // Interval at which to check (e.g., every 10 seconds)

    setInterval(() => {
      const now = Date.now();
      for (const panelName in this.sentInstructions) {
        this.sentInstructions[panelName] = this.sentInstructions[panelName].filter((instruction) => {
          if (now - instruction.timestamp > MAX_WAIT_TIME) {
            console.warn(`Instruction ${instruction.id} to ${panelName} has not been acknowledged after ${MAX_WAIT_TIME}ms`);
            // Optionally, re-send the instruction
            this.resendInstruction(panelName, instruction);
            return false; // Remove instruction from tracking
          }
          return true; // Keep instruction in tracking
        });
      }
    }, CLEANUP_INTERVAL);
  }

  async clearRedisQueues() {
    for (const panelName of this.expectedPanels) {
      await this.redisClient.del(`queue:${panelName}`);
      console.log(`[Redis] Cleared queue for panel: ${panelName}`);
    }
  }


  sendInitialInstructions(ws) {
    // Implement if necessary
  }

  async checkProblems() {
    const clients = this.clientManager.getClients();
    const allOk = await HealthChecker.checkProblems(
        clients,
        this.clientManager.broadcastToAppropriateClients.bind(this.clientManager),
        this.expectedPanels
    );

    if (!allOk) {
      this.clientManager.broadcastToAppropriateClients(
          JSON.stringify({ type: 'instruction', to: 'panel', instruction: 'off' }),
          'panel'
      );
      console.log('[WebSocketServer] "Off" instructions sent to panels due to detected problems.');
    }
  }

  async sendStatusUpdates() {
    const panelStatus = {};

    this.clientManager.getLastClientData().forEach((clientInfo) => {
      const panelName = clientInfo.name;
      const currentStatus = clientInfo.currentStatus || 'offline';
      const lastHeartbeatTime = moment(clientInfo.lastHeartbeat);

      panelStatus[panelName] = {
        status: currentStatus,
        connected: clientInfo.connected,
        state: clientInfo.state,
        cpuTemp: clientInfo.cpuTemp,
        isDoorOpen: clientInfo.isDoorOpen,
        sectorStatus: clientInfo.sectorStatus,
        maintenanceMode: clientInfo.maintenanceMode,
        lastHeartbeat: Math.floor((Date.now() - lastHeartbeatTime) / 1000),
        lastHeartbeatTimestamp: lastHeartbeatTime.format('YYYY-MM-DD HH:mm:ss'),
      };
    });

    // Handle expected panels not in clientManager
    this.expectedPanels.forEach((panel) => {
      if (!panelStatus[panel]) {
        const lastClientInfo = this.clientManager.getLastClientData().find((info) => info.name === panel);
        const lastHeartbeatTime = lastClientInfo ? moment(lastClientInfo.lastHeartbeat) : null;

        panelStatus[panel] = {
          status: 'offline',
          connected: false,
          state: lastClientInfo ? lastClientInfo.state : null,
          cpuTemp: lastClientInfo ? lastClientInfo.cpuTemp : null,
          isDoorOpen: lastClientInfo ? lastClientInfo.isDoorOpen : null,
          sectorStatus: lastClientInfo ? lastClientInfo.sectorStatus : null,
          maintenanceMode: lastClientInfo ? lastClientInfo.maintenanceMode : null,
          lastHeartbeat: lastHeartbeatTime ? Math.floor((Date.now() - lastHeartbeatTime) / 1000) : null,
          lastHeartbeatTimestamp: lastHeartbeatTime ? lastHeartbeatTime.format('YYYY-MM-DD HH:mm:ss') : null,
        };
      }
    });

    const statusMessage = JSON.stringify({ type: 'status', panelStatus });
    this.clientManager.sendToFrontend(statusMessage);
  }

  // Instruction Queue Management with Redis

  async enqueueInstruction(panelName, instruction, role) {
    const instructionItem = {
      id: this.generateUniqueId(),
      instruction,
      timestamp: Date.now(),
      status: 'pending',
      role,
    };

    await this.redisClient.lPush(`queue:${panelName}`, JSON.stringify(instructionItem));
    console.log(`[Redis] Enqueued instruction for ${panelName}:`, instructionItem);

    return instructionItem; // Return the instruction item to get the ID
  }

  async getQueue(panelName) {
    const queueItems = await this.redisClient.lRange(`queue:${panelName}`, 0, -1);
    return queueItems.map((item) => JSON.parse(item)).reverse(); // Reverse to maintain FIFO order
  }

  async removeInstruction(panelName, instructionId) {
    const queueItems = await this.redisClient.lRange(`queue:${panelName}`, 0, -1);
    for (const item of queueItems) {
      const instruction = JSON.parse(item);
      if (instruction.id === instructionId) {
        await this.redisClient.lRem(`queue:${panelName}`, 0, item);
        break;
      }
    }
  }

  async processQueues() {
    setInterval(async () => {
      for (const panelName of this.expectedPanels) {
        const queue = await this.getQueue(panelName);
        if (queue.length === 0) continue;

        const nextInstruction = queue[0]; // Get the next instruction (FIFO)
        console.log(`[ProcessQueues] Next instruction for ${panelName}:`, nextInstruction);

        if (nextInstruction.status === 'pending') {
          // Send instruction to panel
          const panelClient = this.clientManager.getClientByName(panelName);
          if (panelClient) {
            const instructionMessage = {
              type: 'instruction',
              instruction: nextInstruction.instruction,
              instructionId: nextInstruction.id,
              to: 'panel',
              panelName: panelName,
            };
            panelClient.ws.send(JSON.stringify(instructionMessage));

            // Update instruction status to 'sent'
            nextInstruction.status = 'sent';

            // Remove the instruction from the queue
            await this.removeInstruction(panelName, nextInstruction.id);

            // Store the sent instruction for tracking
            this.storeSentInstruction(panelName, nextInstruction);
          } else {
            console.warn(`Panel ${panelName} is not connected. Cannot send instruction.`);
          }
        }
      }
    }, 1000);
  }

  storeSentInstruction(panelName, instruction) {
    if (!this.sentInstructions[panelName]) {
      this.sentInstructions[panelName] = [];
    }
    this.sentInstructions[panelName].push(instruction);
  }

  async handleAcknowledgement(message) {
    const { panelName, instructionId, status } = message;

    let acknowledgedInstruction = null;

    // Remove the instruction from sentInstructions and retrieve it
    if (this.sentInstructions[panelName]) {
      const instructionIndex = this.sentInstructions[panelName].findIndex(instr => instr.id === instructionId);
      if (instructionIndex !== -1) {
        acknowledgedInstruction = this.sentInstructions[panelName][instructionIndex];
        this.sentInstructions[panelName].splice(instructionIndex, 1);
      }
    }

    // Notify frontend about updated queue
    const updatedQueue = await this.getQueue(panelName);
    this.clientManager.sendToFrontend(JSON.stringify({
      type: 'queue_update',
      panelName: panelName,
      queue: updatedQueue,
    }));

    // Log the acknowledgement, including the instruction
    const instruction = acknowledgedInstruction ? acknowledgedInstruction.instruction : 'unknown';
    Logger.appendLog(panelName, `Instruction (${instruction}) ${instructionId}  acknowledged with status: ${status}`);
    console.log(`[WebSocketServer] Instruction (${instruction})  ${instructionId} acknowledged by ${panelName} with status: ${status}`);
  }

  resendInstruction(panelName, instruction) {
    const panelClient = this.clientManager.getClientByName(panelName);
    if (panelClient) {
      const instructionMessage = {
        type: 'instruction',
        instruction: instruction.instruction,
        instructionId: instruction.id,
        to: 'panel',
        panelName: panelName,
      };
      panelClient.ws.send(JSON.stringify(instructionMessage));
      console.log(`[WebSocketServer] Resent instruction ${instruction.id} to ${panelName}`);
      // Update timestamp
      instruction.timestamp = Date.now();
      // Re-store the instruction for tracking
      this.storeSentInstruction(panelName, instruction);
    } else {
      console.warn(`Cannot resend instruction to ${panelName} as it is not connected.`);
    }
  }

  async handleModifyQueue(message) {
    const { action, panelName, instructionId } = message;
    if (action === 'delete') {
      await this.removeInstruction(panelName, instructionId);
      // Notify frontend about updated queue
      const updatedQueue = await this.getQueue(panelName);
      this.clientManager.sendToFrontend(JSON.stringify({
        type: 'queue_update',
        panelName: panelName,
        queue: updatedQueue,
      }));
      console.log(`[WebSocketServer] Instruction ${instructionId} removed from queue for ${panelName}`);
    }
  }

  generateUniqueId() {
    return uuidv4();
  }
}

new WebSocketServer();
