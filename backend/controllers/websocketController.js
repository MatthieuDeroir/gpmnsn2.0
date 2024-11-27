// webSocketServer.js
const WebSocket = require('ws');
const redis = require('redis');
const moment = require('moment');
const ClientManager = require('../websocket/clientManager');
const Logger = require('../utils/logger');
const HealthChecker = require('../websocket/healthChecker');
const QueueManager = require('../websocket/queueManager'); // Import QueueManager

const HEARTBEAT_INTERVAL = 1000; // 1 second
const STATUS_UPDATE_INTERVAL = 1000; // 1 second for status updates

class WebSocketServer {
  constructor() {
    this.expectedPanels = ['indret', 'aval', 'amont'];
    this.wss = new WebSocket.Server({ port: 8080 });
    this.clientManager = new ClientManager(WebSocket);
    this.redisClient = redis.createClient();

    // Initialize QueueManager
    this.queueManager = new QueueManager(this.redisClient, this.expectedPanels);

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

      Logger.appendLog(
          'backend',
          'WebSocket Server Started',
          {
            message: 'WebSocket server started and Redis client connected',
          }
      );

      // Clear Redis queues before starting the server
      await this.queueManager.clearAllQueues();

      this.processQueues();

      // Start the cleanup interval to check for unacknowledged instructions
      this.startCleanupInterval();

    } catch (err) {
      console.error('Failed to connect to Redis:', err);

      Logger.appendLog(
          'Backend',
          'WebSocket Server Start Failed',
          {
            error: err.message,
          }
      );
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
        console.log('[WebSocketServer] Instruction received:', message);
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
        console.log(message)
        console.log(`Unknown message type: ${message.type}`);
        Logger.appendLog(message.name || 'Unknown Client', `Unknown Event: ${message.type}`, message);
    }
  }

  async handleInstruction(message) {
    console.log('[WebSocketServer] Instruction received:', message);
    if (message.to === 'panel') {
      const targetPanels = message.name === 'all' ? this.expectedPanels : [message.name];

      console.log(`[WebSocketServer] Instruction received for ${targetPanels}: ${message.instruction}`);

      for (const panelName of targetPanels) {
        // Enqueue the instruction for each panel and get the instruction item
        const instructionItem = await this.queueManager.enqueueInstruction(panelName, message.instruction, message.role);

        // Notify the frontend about the queued instruction
        this.clientManager.sendToFrontend(JSON.stringify({
          type: 'queue_update',
          panelName: panelName,
          queue: await this.queueManager.getQueue(panelName),
        }));

        // Log the instruction, including the instruction ID
        const role = message.role || message.from || 'unknown';
        Logger.appendLog(panelName, `User ${role} enqueued instruction (${message.instruction})`, {
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
    Logger.appendLog(name, 'Panel connection', { panelName: name, role: role });
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

  sendInitialInstructions(ws) {
    // Implement if necessary
  }

  async checkProblems() {
    const clients = this.clientManager.getClients();
    const problem = await HealthChecker.checkProblems(clients, this.expectedPanels, this.queueManager);

    if (!problem) {
      for (const client of clients) {
        console.log(`[HealthChecker] Checking client ${client.name} with state: ${client.connected}`);
        if (client.state === 'on' ) {
          const panelName = client.name;
          const instruction = 'off';
          const instructionItem = await this.queueManager.enqueueInstruction(panelName, instruction, 'auto');
          console.log(`[HealthChecker] Enqueued auto-off instruction for ${panelName}: ${instruction} with id ${instructionItem.id}`);

          // Log the auto-off instruction
          Logger.appendLog(panelName, 'Auto-Off Instruction Enqueued', {
            instruction: instruction,
            instructionId: instructionItem.id,
            role: 'auto',
          });
        }


      }
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

  // Instruction Queue Management with QueueManager

  async processQueues() {
    setInterval(async () => {
      for (const panelName of this.expectedPanels) {
        const queue = await this.queueManager.getQueue(panelName);
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
            await this.queueManager.removeInstruction(panelName, nextInstruction.id);

            // Store the sent instruction for tracking
            this.storeSentInstruction(panelName, nextInstruction);

            // **Log the instruction along with panel status**
            const panelClientInfo = this.clientManager.getClientInfoByName(panelName);
            const panelStatus = panelClientInfo
                ? {
                  status: panelClientInfo.currentStatus || 'unknown',
                  state: panelClientInfo.state || 'unknown',
                  cpuTemp: panelClientInfo.cpuTemp || null,
                  isDoorOpen: panelClientInfo.isDoorOpen || false,
                  sectorStatus: panelClientInfo.sectorStatus || null,
                  maintenanceMode: panelClientInfo.maintenanceMode || false,
                }
                : { status: 'unknown' };

            Logger.appendLog(
                panelName,
                `Serveur transmitted instruction (${nextInstruction.instruction}) to ${panelName}`,
                {
                  instruction: nextInstruction.instruction,
                  instructionId: nextInstruction.id,
                  panelStatus: panelStatus,
                }
            );

            console.log(
                `[WebSocketServer] Sent instruction ${nextInstruction.id} (${nextInstruction.instruction}) to ${panelName}, panel status:`,
                panelStatus
            );
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

  getSentInstructions(panelName) {
    return this.sentInstructions[panelName] || [];
  }

  async handleAcknowledgement(message) {
    const { panelName, instructionId, status } = message;

    let acknowledgedInstruction = null;

    // Remove the instruction from sentInstructions and retrieve it
    if (this.sentInstructions[panelName]) {
      const instructionIndex = this.sentInstructions[panelName].findIndex(
          (instr) => instr.id === instructionId
      );
      if (instructionIndex !== -1) {
        acknowledgedInstruction = this.sentInstructions[panelName][instructionIndex];
        this.sentInstructions[panelName].splice(instructionIndex, 1);
      }
    }

    // Notify frontend about updated queue
    const updatedQueue = await this.queueManager.getQueue(panelName);
    this.clientManager.sendToFrontend(
        JSON.stringify({
          type: 'queue_update',
          panelName: panelName,
          queue: updatedQueue,
        })
    );

    // **Log the acknowledgement along with panel status**
    const instruction = acknowledgedInstruction ? acknowledgedInstruction.instruction : 'unknown';
    const panelClientInfo = this.clientManager.getClientInfoByName(panelName);
    const panelStatus = panelClientInfo
        ? {
          status: panelClientInfo.currentStatus || 'unknown',
          state: panelClientInfo.state || 'unknown',
          cpuTemp: panelClientInfo.cpuTemp || null,
          isDoorOpen: panelClientInfo.isDoorOpen || false,
          sectorStatus: panelClientInfo.sectorStatus || null,
          maintenanceMode: panelClientInfo.maintenanceMode || false,
        }
        : { status: 'unknown' };

    Logger.appendLog(
        panelName,
        `Instruction  (${instruction}) acknowledged by ${panelName}`,
        {
          instruction: instruction,
          instructionId: instructionId,
          status: status,
          panelStatus: panelStatus,
        }
    );

    console.log(
        `[WebSocketServer] Instruction ${instructionId} (${instruction}) acknowledged by ${panelName} with status: ${status}, panel status:`,
        panelStatus
    );
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
      await this.queueManager.removeInstruction(panelName, instructionId);
      // Notify frontend about updated queue
      const updatedQueue = await this.queueManager.getQueue(panelName);
      this.clientManager.sendToFrontend(JSON.stringify({
        type: 'queue_update',
        panelName: panelName,
        queue: updatedQueue,
      }));
      console.log(`[WebSocketServer] Instruction ${instructionId} removed from queue for ${panelName}`);
    }
  }
}

new WebSocketServer();
