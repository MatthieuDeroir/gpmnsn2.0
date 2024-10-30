// webSocketServer.js
const WebSocket = require('ws');
const ClientManager = require('./clientManager');
const Logger = require('./logger');
const HealthChecker = require('./healthChecker');
const moment = require('moment');

const HEARTBEAT_INTERVAL = 1000; // 1 secondes
const STATUS_UPDATE_INTERVAL = 1000; // 1 seconde pour les mises à jour de statut

class WebSocketServer {
  constructor() {
    this.expectedPanels = ['indret', 'aval', 'amont'];
    this.wss = new WebSocket.Server({ port: 8080 });
    this.clientManager = new ClientManager(WebSocket);
    this.setupServer();
  }

  /**
   * Configure les écouteurs d'événements pour le serveur WebSocket.
   */
  setupServer() {
    this.wss.on('listening', () => {
      console.log('Le serveur WebSocket fonctionne sur le port 8080');
      this.healthCheckIntervalId = setInterval(() => this.checkProblems(), HEARTBEAT_INTERVAL);
      this.statusUpdateIntervalId = setInterval(() => this.sendStatusUpdates(), STATUS_UPDATE_INTERVAL);
    });

    this.wss.on('connection', ws => this.handleConnection(ws));

    this.wss.on('error', (error) => {
      console.error('Erreur du serveur WebSocket:', error);
    });
  }

  /**
   * Gère une nouvelle connexion WebSocket.
   * @param {WebSocket} ws - La connexion WebSocket.
   */
  handleConnection(ws) {
    console.log('[WebSocketServer] Nouvelle connexion établie.');
    
    ws.on('message', (message) => {
      console.log(`[WebSocketServer] Message reçu: ${message}`);
      this.handleMessage(ws, message);
    });

    ws.on('close', () => {
      console.log('[WebSocketServer] Connexion fermée.');
      this.handleClose(ws);
    });

    ws.on('error', (error) => {
      console.error(`[WebSocketServer] Erreur de connexion: ${error}`);
      this.handleClose(ws);
    });

    const clientAddress = ws._socket.remoteAddress.startsWith('::ffff:')
      ? ws._socket.remoteAddress.split(':').pop()
      : ws._socket.remoteAddress;
    const clientAddressMessage = JSON.stringify({ message: `Adresse IP du client : ${clientAddress}` });
    ws.send(clientAddressMessage);
    console.log(`[WebSocketServer] Adresse IP envoyée au client : ${clientAddress}`);

    // Envoyer les instructions initiales discrètement
    this.sendInitialInstructions(ws);
  }

  /**
   * Gère les messages entrants des clients.
   * @param {WebSocket} ws - La connexion WebSocket.
   * @param {string} message - Le message reçu.
   */
  handleMessage(ws, message) {
    try {
      message = JSON.parse(message);
    } catch (e) {
      console.log('JSON invalide reçu.');
      ws.send(JSON.stringify({ error: 'JSON invalide' }));
      Logger.appendLog('Unknown Panel', 'Error', { error: 'JSON invalide' });
      return;
    }

    switch (message.type) {
      case 'reboot':
      case 'refresh':
      case 'instruction':
        this.handleInstruction(message);
        break;

      case 'register':
        this.handleRegister(ws, message);
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
        // Assuming Logger.getLogs() exists and returns logs
        // You might need to implement this method to support fetching logs
        const logs = Logger.getLogs();
        ws.send(JSON.stringify({ type: 'logs', logs }));
        break;

      case 'ping':
        ws.send(JSON.stringify({ type: 'pong' }));
        break;

      default:
        console.log(`Type de message inconnu : ${message.type}`);
        Logger.appendLog(message.name || 'Unknown Panel', `Unknown Event: ${message.type}`, message);
    }
  }

  /**
   * Gère les messages de type instruction.
   * @param {object} message - Le message d'instruction.
   */
  handleInstruction(message) {
    if (message.to === 'panel') {
      this.clientManager.broadcastToAppropriateClients(JSON.stringify({
        type: 'instruction',
        to: 'panel',
        instruction: message.instruction,
        heartbeatTimer: message.heartbeatTimer,
      }), 'panel', message.name);

      // Logger l'instruction avec les informations de rôle et de panneau
      const role = message.role || message.from || 'unknown';
      Logger.appendLog(message.name, `${role} a envoyé l'instruction ${message.instruction}`, {
        instruction: message.instruction,
        role: role,
        heartbeatTimer: message.heartbeatTimer,
      });

      console.log(`[WebSocketServer] Instruction envoyée à ${message.name}: ${message.instruction}`);
    } else {
      console.log('Cible d\'instruction invalide :', message.to);
    }
  }

  /**
   * Gère les messages de registre des clients.
   * @param {WebSocket} ws - La connexion WebSocket.
   * @param {object} message - Le message de registre.
   */
  handleRegister(ws, message) {
    const { clientType, name } = message;

    if (clientType === 'user') {
      // Supprimer tous les autres clients de type 'user' sauf le courant
      this.clientManager.removeClientsByType('user', ws);
    }

    // Enregistrer ou mettre à jour le client
    this.clientManager.addClient(ws, {
      clientType: clientType,
      name: name,
      lastHeartbeat: Date.now(),
      sectorStatus: message.sectorStatus !== undefined ? message.sectorStatus : true, // Default to true if not provided
      state: message.state || 'off', // Default to 'off' if not provided
      cpuTemp: message.cpuTemp || null,
      isDoorOpen: message.isDoorOpen || false,
      maintenanceMode: message.maintenanceMode || false,
    });

    this.clientManager.broadcastToAppropriateClients(JSON.stringify({
      type: 'panel_registered',
      name: name
    }), 'user', "frontend");

    // Logger l'événement d'enregistrement
    const role = message.from || 'unknown';
    Logger.appendLog(name, 'Register', { panelName: name, role: role });
    console.log(`[WebSocketServer] Panel registered: ${name}`);
  }

  /**
   * Gère la fermeture d'une connexion WebSocket.
   * @param {WebSocket} ws - La connexion WebSocket.
   */
  handleClose(ws) {
    const clientInfo = this.clientManager.getClientInfo(ws);
    if (clientInfo && clientInfo.name) {
      const panelName = clientInfo.name;

      // Marquer le client comme déconnecté dans ClientManager
      this.clientManager.removeClient(ws);

      console.log(`[WebSocketServer] Panel disconnected: ${panelName}`);
      Logger.appendLog(panelName, 'Disconnected', { message: 'WebSocket connection closed.' });
    } else {
      console.log('Client déconnecté sans enregistrement.');
      Logger.appendLog('Unknown Panel', 'Client déconnecté sans enregistrement.');
    }
  }

  /**
   * Envoie les instructions initiales à un panneau nouvellement connecté.
   * @param {WebSocket} ws - La connexion WebSocket.
   */
  sendInitialInstructions(ws) {
    const panelSettings = this.clientManager.getPanelSettings();
    const instructions = {
      type: 'instruction',
      panels: panelSettings
    };
    ws.send(JSON.stringify(instructions));
    console.log('[WebSocketServer] Instructions initiales envoyées.');
  }

  /**
   * Effectue des vérifications de santé périodiques et diffuse des instructions si nécessaire.
   */
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
      console.log('[WebSocketServer] Instructions "off" envoyées aux panneaux.');
    }
  }

  /**
   * Envoie des mises à jour de statut aux clients utilisateur.
   * Cette méthode est découplée des messages des panneaux et repose uniquement sur les données de HealthChecker.
   */
  async sendStatusUpdates() {
    const panelStatus = {};

    this.clientManager.getLastClientData().forEach(clientInfo => {
      const panelName = clientInfo.name;
      const currentStatus = clientInfo.currentStatus || 'offline'; // HealthChecker définit cela
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
        lastHeartbeatTimestamp: lastHeartbeatTime.format('YYYY-MM-DD HH:mm:ss')
      };
    });

    // Gérer les panneaux attendus qui pourraient ne pas être dans le clientManager
    this.expectedPanels.forEach(panel => {
      if (!panelStatus[panel]) {
        const lastClientInfo = this.clientManager.getLastClientData().find(info => info.name === panel);
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
          lastHeartbeatTimestamp: lastHeartbeatTime ? lastHeartbeatTime.format('YYYY-MM-DD HH:mm:ss') : null
        };
      }
    });

    const statusMessage = JSON.stringify({ type: 'status', panelStatus });
    this.clientManager.broadcastToAppropriateClients(statusMessage, 'user');
    console.log('[WebSocketServer] Mises à jour de statut envoyées aux utilisateurs.');
  }
}

new WebSocketServer();
