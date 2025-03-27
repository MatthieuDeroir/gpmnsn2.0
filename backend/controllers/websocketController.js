// webSocketServer.js

const WebSocket = require('ws');
const redis = require('redis');
const moment = require('moment');
const ClientManager = require('../websocket/clientManager');
const Logger = require('../utils/logger');
const HealthChecker = require('../websocket/healthChecker');
const QueueManager = require('../websocket/queueManager'); // Import QueueManager

// Intervalles paramétrables
const HEARTBEAT_INTERVAL = 1000;     // 1 seconde pour le health check
const STATUS_UPDATE_INTERVAL = 1000; // 1 seconde pour sendStatusUpdates

// Variable pour stocker l'instance unique
let globalWSS = null;

class WebSocketServer {
  constructor() {
    // Panels attendus
    this.expectedPanels = ['indret', 'aval', 'amont'];

    // Création du WebSocket server
    this.wss = new WebSocket.Server({ port: 8080 });

    // Instancier le client manager
    this.clientManager = new ClientManager(WebSocket);

    // Création du client Redis (v4+)
    this.redisClient = redis.createClient();

    // QueueManager (gestion des instructions en Redis)
    this.queueManager = new QueueManager(this.redisClient, this.expectedPanels);

    // Instructions envoyées en attente d'ack
    this.sentInstructions = {};

    // Gérer les erreurs Redis
    this.redisClient.on('error', (err) => console.error('Redis Client Error', err));

    // Initialiser le serveur (async)
    this.init();
  }

  async init() {
    try {
      this.setupServer();

      // Connexion à Redis
      await this.redisClient.connect();
      console.log('Redis client connected');

      Logger.appendLog('backend', 'WebSocket Server Started', {
        message: 'WebSocket server started and Redis client connected',
      });

      // Vider les queues Redis
      await this.queueManager.clearAllQueues();

      // Commencer à traiter les queues
      this.processQueues();

      // Nettoyage périodique (instructions sans ack)
      this.startCleanupInterval();

    } catch (err) {
      console.error('Failed to connect to Redis:', err);

      Logger.appendLog('Backend', 'WebSocket Server Start Failed', {
        error: err.message,
      });
    }
  }

  setupServer() {
    console.log('WebSocket server is running on port 8080');
    console.log('Starting health check interval...');

    // Health checks (heartbeat/ping)
    this.healthCheckIntervalId = setInterval(() => this.checkProblems(), HEARTBEAT_INTERVAL);

    // Statut panels vers "frontend"
    this.statusUpdateIntervalId = setInterval(() => this.sendStatusUpdates(), STATUS_UPDATE_INTERVAL);

    // Gestion des connexions
    this.wss.on('connection', (ws) => this.handleConnection(ws));

    // Erreurs server-level
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

    // Instructions initiales éventuelles
    this.sendInitialInstructions(ws);
  }

  async handleMessage(ws, rawMessage) {
    let message;
    try {
      message = JSON.parse(rawMessage);
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
        console.log(message);
        console.log(`Unknown message type: ${message.type}`);
        Logger.appendLog(
            message.name || 'Unknown Client',
            `Unknown Event: ${message.type}`,
            message
        );
    }
  }

  async handleInstruction(message) {
    if (message.to !== 'panel') {
      console.log('Invalid instruction target:', message.to);
      return;
    }

    // Sur un panel précis ou sur tous
    const targetPanels = (message.name === 'all')
        ? this.expectedPanels
        : [message.name];

    for (const panelName of targetPanels) {
      const instructionItem = await this.queueManager.enqueueInstruction(
          panelName,
          message.instruction,
          message.role
      );

      // Maj queue vers frontends
      this.clientManager.sendToFrontend(JSON.stringify({
        type: 'queue_update',
        panelName: panelName,
        queue: await this.queueManager.getQueue(panelName),
      }));

      // Log
      const role = message.role || message.from || 'unknown';
      Logger.appendLog(panelName, `User ${role} enqueued instruction (${message.instruction})`, {
        instruction: message.instruction,
        instructionId: instructionItem.id,
        role: role,
      });

      console.log(`[WebSocketServer] Instruction enqueued for ${panelName}: ${message.instruction} with id ${instructionItem.id}`);
    }
  }

  handleRegister(ws, message) {
    const { clientType, name } = message;

    // Un seul user possible ?
    //if (clientType === 'user') {
    //  this.clientManager.removeClientsByType('user', ws);
    //}

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

    // Notifier frontends
    this.clientManager.sendToFrontend(JSON.stringify({
      type: 'panel_registered',
      name: name,
    }));

    const role = message.from || 'unknown';
    Logger.appendLog(name, 'Panel connection', { panelName: name, role: role });
    console.log(`[WebSocketServer] Panel registered: ${name}`);
  }

  handleClose(ws) {
    const clientInfo = this.clientManager.getClientInfo(ws);
    if (!clientInfo || !clientInfo.name) {
      console.log('Disconnected client without registration.');
      Logger.appendLog('Unknown Client', 'Disconnected client without registration.');
      return;
    }

    const panelName = clientInfo.name;
    this.clientManager.removeClient(ws);

    console.log(`[WebSocketServer] Panel disconnected: ${panelName}`);
    Logger.appendLog(panelName, 'Disconnected', {
      message: 'WebSocket connection closed.'
    });
  }

  sendInitialInstructions(ws) {
    // e.g. ws.send(JSON.stringify({ type: 'welcome' }));
  }

  async checkProblems() {
    const clients = this.clientManager.getClients();
    const allOk = await HealthChecker.checkProblems(
        clients,
        this.expectedPanels,
        this.queueManager
    );

    console.log(`[HealthChecker] All systems OK: ${allOk}`);
    if (!allOk) {
      for (const client of clients) {
        console.log(`[HealthChecker] Checking client ${client.name} with state: ${client.connected}`);
        if (client.state === 'on') {
          const panelName = client.name;
          const instruction = 'off';
          const instructionItem = await this.queueManager.enqueueInstruction(panelName, instruction, 'auto');

          console.log(`[HealthChecker] Enqueued auto-off instruction for ${panelName}: ${instruction} with id ${instructionItem.id}`);
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

    // Panels attendus non connectés
    this.expectedPanels.forEach((panel) => {
      if (!panelStatus[panel]) {
        panelStatus[panel] = {
          status: 'offline',
          connected: false,
          state: null,
          cpuTemp: null,
          isDoorOpen: null,
          sectorStatus: null,
          maintenanceMode: null,
          lastHeartbeat: null,
          lastHeartbeatTimestamp: null,
        };
      }
    });

    const statusMessage = JSON.stringify({ type: 'status', panelStatus });
    this.clientManager.sendToFrontend(statusMessage);
  }

  async processQueues() {
    setInterval(async () => {
      for (const panelName of this.expectedPanels) {
        const queue = await this.queueManager.getQueue(panelName);
        if (queue.length === 0) continue;

        const nextInstruction = queue[0];
        console.log(`[ProcessQueues] Next instruction for ${panelName}:`, nextInstruction);

        if (nextInstruction.status === 'pending') {
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
            nextInstruction.status = 'sent';

            await this.queueManager.removeInstruction(panelName, nextInstruction.id);
            this.storeSentInstruction(panelName, nextInstruction);

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
    if (this.sentInstructions[panelName]) {
      const idx = this.sentInstructions[panelName].findIndex(
          (instr) => instr.id === instructionId
      );
      if (idx !== -1) {
        acknowledgedInstruction = this.sentInstructions[panelName][idx];
        this.sentInstructions[panelName].splice(idx, 1);
      }
    }

    const updatedQueue = await this.queueManager.getQueue(panelName);
    this.clientManager.sendToFrontend(
        JSON.stringify({
          type: 'queue_update',
          panelName: panelName,
          queue: updatedQueue,
        })
    );

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

  async handleModifyQueue(message) {
    const { action, panelName, instructionId } = message;
    if (action === 'delete') {
      await this.queueManager.removeInstruction(panelName, instructionId);

      const updatedQueue = await this.queueManager.getQueue(panelName);
      this.clientManager.sendToFrontend(
          JSON.stringify({
            type: 'queue_update',
            panelName: panelName,
            queue: updatedQueue,
          })
      );

      console.log(`[WebSocketServer] Instruction ${instructionId} removed from queue for ${panelName}`);
    }
  }

  startCleanupInterval() {
    const MAX_WAIT_TIME = 60000;   // 60s
    const CLEANUP_INTERVAL = 10000; // 10s

    setInterval(() => {
      const now = Date.now();
      for (const panelName in this.sentInstructions) {
        this.sentInstructions[panelName] = this.sentInstructions[panelName].filter((instruction) => {
          if (now - instruction.timestamp > MAX_WAIT_TIME) {
            console.warn(`Instruction ${instruction.id} to ${panelName} has not been acknowledged after ${MAX_WAIT_TIME} ms.`);
            this.resendInstruction(panelName, instruction);
            return false;
          }
          return true;
        });
      }
    }, CLEANUP_INTERVAL);
  }

  resendInstruction(panelName, instruction) {
    const panelClient = this.clientManager.getClientByName(panelName);
    if (!panelClient) {
      console.warn(`Cannot resend instruction to ${panelName} as it is not connected.`);
      return;
    }

    const instructionMessage = {
      type: 'instruction',
      instruction: instruction.instruction,
      instructionId: instruction.id,
      to: 'panel',
      panelName: panelName,
    };
    panelClient.ws.send(JSON.stringify(instructionMessage));

    console.log(`[WebSocketServer] Resent instruction ${instruction.id} to ${panelName}`);
    instruction.timestamp = Date.now();
    this.storeSentInstruction(panelName, instruction);
  }
}

/**
 * Crée une instance unique du WebSocketServer.
 */
function createWebSocketServer() {
  if (!globalWSS) {
    globalWSS = new WebSocketServer();
  }
  return globalWSS;
}

/**
 * Récupère le clientManager de l'unique instance WebSocketServer (ou null si pas encore créé).
 */
function getClientManager() {
  return globalWSS ? globalWSS.clientManager : null;
}

module.exports = {
  WebSocketServer,
  createWebSocketServer,
  getClientManager
};
