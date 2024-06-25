const WebSocket = require('ws');
const http = require('http');
const fs = require('fs')

const wss = new WebSocket.Server({ port: 8080 });

const clients = new Map();
const panelClients = [];
const FRONTEND_PORT = 3000;
const DATABASE_PORT = 27017;
const HEARTBEAT_INTERVAL = 5000;  // 5 seconds
const STATUS_UPDATE_INTERVAL = 500; // 5 seconds for status updates


// Function to append log messages to log.txt
function appendLog(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${message}\n`;
  fs.appendFile('log.txt', logMessage, err => {
    if (err) {
      console.error('Failed to append to log:', err);
    }
  });
}

// Log a message when the server is ready
wss.on('listening', () => {
  console.log('Server is running on port 8080');
  setInterval(check_problems, HEARTBEAT_INTERVAL);
  setInterval(sendStatusUpdates, STATUS_UPDATE_INTERVAL);
});

wss.on('connection', ws => {
  console.log('New client connected');
  appendLog('New client connected');

  ws.on('message', message => {
    console.log('Received from client: %s', message);

    try {
      message = JSON.parse(message);
    } catch (e) {
      console.log('Invalid JSON');
      ws.send(JSON.stringify({ error: 'Invalid JSON' }));
      appendLog('Invalid JSON received');
      return;
    }

    // Append logs on specific events
    if (message.type === 'register' || message.type === 'instruction' || message.type === 'maintenanceMode') {
      appendLog(`${JSON.stringify(message)}`);
    }

    // Handle client registration
    if (message.type === 'register') {
      const { clientType, name } = message;
      clients.set(ws, { clientType, name, lastHeartbeat: Date.now() });
      if (clientType === 'panel') {
        panelClients.push(ws);
      }
      console.log(`Client registered: type=${clientType}, name=${name}`);
      ws.send(JSON.stringify({ message: 'Registration successful' }));
      return;
    }

    // Handle heartbeat
    if (message.type === 'heartbeat') {
      const clientInfo = clients.get(ws);
      if (clientInfo) {
        clientInfo.lastHeartbeat = Date.now();
        clientInfo.state = message.state;
        clientInfo.cpuTemp = message.cpuTemp;
        clientInfo.isDoorOpen = message.isDoorOpen;
        clientInfo.sectorStatus = message.sectorStatus;
        clientInfo.maintenanceMode = message.maintenanceMode;
        clients.set(ws, clientInfo);
      }
      return;
    }

    // Handle maintenance mode
    if (message.type === "maintenanceMode") {
      const clientInfo = clients.get(ws);
      if (clientInfo) {
        clientInfo.maintenanceMode = message.state;
        clients.set(ws, clientInfo);
      }
      return;
    }

    // Handle instruction messages
    if (message.type === "instruction" && message.to === "panel") {
      if (message.instruction === "on" || message.instruction === "off") {
        console.log(`Turning ${message.instruction} the LED`);
        const instructionMessage = JSON.stringify({ type: 'instruction', to: 'panel', instruction: message.instruction });
        console.log('Sending to appropriate clients:', instructionMessage);
        broadcastToAppropriateClients(instructionMessage, 'panel', message.name);
      } else {
        console.log('Invalid instruction');
      }
      return;
    }
  });


  ws.on('close', () => {
    clients.delete(ws);
    const index = panelClients.indexOf(ws);
    if (index > -1) {
      panelClients.splice(index, 1);
    }
    console.log('Client disconnected');
    appendLog('Client disconnected');
  });


  // Broadcast the identity of the client, its IP address
  const clientAddressMessage = JSON.stringify({ message: 'Client IP address: ' + ws._socket.remoteAddress });
  console.log('Sending to client:', clientAddressMessage);
  ws.send(clientAddressMessage);
  appendLog(`Sent IP address to client: ${clientAddressMessage}`);
});

// Function to broadcast a message to all connected clients
function broadcast(message) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Function to broadcast a message to appropriate clients
function broadcastToAppropriateClients(message, type, name) {
  clients.forEach((clientInfo, client) => {
    if (client.readyState === WebSocket.OPEN) {
      if (clientInfo.clientType === 'all' || clientInfo.clientType === type) {
        if (!name || clientInfo.name === name || name === 'all') {
          client.send(message);
        }
      }
    }
  });
}

// Function to check if frontend is available
function checkFrontend() {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://localhost:${FRONTEND_PORT}`, res => {
      res.statusCode === 200 ? resolve(true) : resolve(false);
    });
    req.on('error', () => resolve(false));
    req.end();
  });
}

// Function to check if database is available
function checkDatabase() {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://localhost:${DATABASE_PORT}`, res => {
      res.statusCode === 200 ? resolve(true) : resolve(false);
    });
    req.on('error', () => resolve(false));
    req.end();
  });
}

// Function to check if panels are sending heartbeats
function checkPanels() {
  const now = Date.now();
  let allPanelsOk = true;
  let problems = {};

  clients.forEach((clientInfo, client) => {
    if (clientInfo.clientType === 'panel') {
      if (now - clientInfo.lastHeartbeat > HEARTBEAT_INTERVAL * 2 || !clientInfo.sectorStatus) {
        problems[clientInfo.name] = true;
        allPanelsOk = false;
      } else {
        problems[clientInfo.name] = false;
      }
    }
  });

  if (!allPanelsOk) {
    // Shut down all panels with problems
    Object.keys(problems).forEach(panelName => {
      if (problems[panelName]) {
        broadcastToAppropriateClients(JSON.stringify({ type: 'instruction', to: 'panel', name: panelName, instruction: 'off' }), 'panel', panelName);
      }
    });
  }

  return problems;
}

// Function to check for problems
async function check_problems() {
  const frontendOk = await checkFrontend();
  const databaseOk = await checkDatabase();
  const panelProblems = checkPanels();

  if (!frontendOk || !databaseOk) {
    // If the frontend or database is down, shut down all panels
    broadcastToAppropriateClients(JSON.stringify({ type: 'instruction', to: 'panel', instruction: 'off' }), 'panel');
  }

  console.log(`Check result - Frontend: ${frontendOk}, Database: ${databaseOk}, Panel Problems: ${JSON.stringify(panelProblems)}`);
  sendPanelStatus(panelProblems);
  return frontendOk && databaseOk && !Object.values(panelProblems).includes(true);
}

// Function to send panel status updates to all clients
function sendStatusUpdates() {
  const panelStatus = {};
  clients.forEach((clientInfo, client) => {
    if (clientInfo.clientType === 'panel') {
      panelStatus[clientInfo.name] = {
        connected: Date.now() - clientInfo.lastHeartbeat <= HEARTBEAT_INTERVAL * 2,
        state: clientInfo.state,
        cpuTemp: clientInfo.cpuTemp,
        isDoorOpen: clientInfo.isDoorOpen,
        sectorStatus: clientInfo.sectorStatus,
        maintenanceMode: clientInfo.maintenanceMode
      };
    }
  });
  const statusMessage = JSON.stringify({ type: 'status', panelStatus });
  broadcast(statusMessage);
}

// Function to send panel status to all clients
function sendPanelStatus(panelProblems) {
  const panelStatus = {};
  clients.forEach((clientInfo, client) => {
    if (clientInfo.clientType === 'panel') {
      panelStatus[clientInfo.name] = {
        connected: Date.now() - clientInfo.lastHeartbeat <= HEARTBEAT_INTERVAL * 2,
        state: clientInfo.state,
        cpuTemp: clientInfo.cpuTemp,
        isDoorOpen: clientInfo.isDoorOpen,
        sectorStatus: clientInfo.sectorStatus,
        maintenanceMode: clientInfo.maintenanceMode,
        problem: panelProblems[clientInfo.name]
      };
    }
  });
  const statusMessage = JSON.stringify({ type: 'status', panelStatus });
  broadcast(statusMessage);
}
