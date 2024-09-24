// const WebSocket = require('ws');
// const clientManager = require('./clientManager');
// const logger = require('./logger');

// const wss = new WebSocket.Server({ port: 8080 });

// wss.on('listening', () => {
//   console.log('Server is running on port 8080');
// });

// wss.on('connection', (ws) => {
//   console.log('New client connected', ws.);
//   logger.appendLog('New client connected');
//   clientManager.registerClient(ws);

//   ws.on('message', (message) => {
//     clientManager.handleMessage(ws, message);
//   });

//   ws.on('close', () => {
//     clientManager.unregisterClient(ws);
//     logger.appendLog('Client disconnected');
//   });
// });

// function broadcast(message) {
//   wss.clients.forEach(client => {
//       if (client.readyState === WebSocket.OPEN) {
//           client.send(message);
//       }
//   });
// }

// function broadcastToSpecificClients(message, type, name) {
//   wss.clients.forEach(client => {
//       const clientInfo = clientManager.getClient(client);
//       if (client.readyState === WebSocket.OPEN && (clientInfo.clientType === type || clientInfo.clientType === 'all')) {
//           if (!name || clientInfo.name === name || name === 'all') {
//               client.send(message);
//           }
//       }
//   });
// }

// exports.broadcast = broadcast;
// exports.broadcastToSpecificClients = broadcastToSpecificClients;