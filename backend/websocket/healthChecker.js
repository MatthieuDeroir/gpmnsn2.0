// healthChecker.js
const http = require('http');
const Logger = require('../utils/logger');
const ping = require('ping'); // Ensure you've installed this package using `npm install ping`

//TODO: Update the following constants with the appropriate values and put them in a .env file
const FRONTEND_PORT = 3000;
const DATABASE_PORT = 27017;
const HEARTBEAT_INTERVAL = 5000; // 5 seconds
const HEARTBEAT_THRESHOLD = HEARTBEAT_INTERVAL * 6; // 30 seconds

class HealthChecker {
  static HEARTBEAT_THRESHOLD = HEARTBEAT_THRESHOLD;

  /**
   * Checks if a local service (frontend or database) is up by sending an HTTP GET request.
   * @param {number} port - The port number of the service.
   * @returns {Promise<boolean>} - Resolves to true if the service is up, false otherwise.
   */
  static async checkService(port) {
    return new Promise((resolve) => {
      const req = http.get(`http://localhost:${port}`, (res) => {
        resolve(res.statusCode === 200);
      });
      req.on('error', () => resolve(false));
      req.end();
    });
  }

  /**
   * Checks if the frontend service is up.
   * @returns {Promise<boolean>}
   */
  static checkFrontend() {
    return this.checkService(FRONTEND_PORT);
  }

  /**
   * Checks if the database service is up.
   * @returns {Promise<boolean>}
   */
  static checkDatabase() {
    return this.checkService(DATABASE_PORT);
  }

  /**
   * Pings a panel using ICMP to check if it's reachable.
   * @param {string} ip - The IP address of the panel.
   * @returns {Promise<boolean>} - Resolves to true if the panel is reachable, false otherwise.
   */
  static async pingPanel(ip) {
    try {
      const response = await ping.promise.probe(ip, {
        timeout: 2, // Timeout in seconds
      });
      return response.alive; // Returns true if the ping was successful, false otherwise
    } catch (error) {
      console.error(`Error pinging ${ip}:`, error);
      return false;
    }
  }

  /**
   * Checks the status of all panels.
   * @param {Array} clients - Array of client information objects.
   * @param {Array} expectedPanels - Array of expected panel names.
   * @returns {Promise<{ allPanelsOk: boolean, problems: object }>}
   */
  static async checkPanels(clients, expectedPanels) {
    const now = Date.now();
    let allPanelsOk = true;
    const problems = {};
    const connectedPanels = new Set();

    for (const clientInfo of clients) {
      if (clientInfo.clientType !== 'panel') continue;

      connectedPanels.add(clientInfo.name);

      const isWebSocketConnected = clientInfo.connected;
      const isHeartbeatValid = now - clientInfo.lastHeartbeat <= HealthChecker.HEARTBEAT_THRESHOLD;
      const isPingable = await this.pingPanel(clientInfo.ip);

      // console.log(`[HealthChecker] Panel: ${clientInfo.name}`);
      // console.log(` - WebSocket Connected: ${isWebSocketConnected}`);
      // console.log(` - Heartbeat Valid: ${isHeartbeatValid}`);
      // console.log(` - Pingable: ${isPingable}`);

      // Determine current status based on the three checks
      let currentStatus = 'offline';
      if (isWebSocketConnected && isHeartbeatValid && isPingable) {
        currentStatus = 'online';
      } else if (!isWebSocketConnected && isPingable && isHeartbeatValid) {
        currentStatus = 'pingable'; // Possible app crash
      } else {
        currentStatus = 'offline';
      }

      // console.log(` - Current Status: ${currentStatus}`);
      // console.log(` - Previous Status: ${clientInfo.previousStatus || 'offline'}`);

      const previousStatus = clientInfo.previousStatus || 'offline';

      // Log status changes only if there's an actual change
      if (previousStatus !== currentStatus) {
        if (currentStatus === 'pingable') {
          Logger.appendLog(clientInfo.name, 'Status Change', { 
            status: currentStatus, 
            message: 'Panel is pingable but not connected via WebSocket. Possible app crash; manual reboot may be required.' 
          });
        } else if (currentStatus === 'offline') {
          if (!isPingable && !isWebSocketConnected) {
            Logger.appendLog(clientInfo.name, 'Status Change', { 
              status: currentStatus, 
              message: 'Panel is disconnected and not pingable. Possible network disconnection.' 
            });
          } else {
            Logger.appendLog(clientInfo.name, 'Status Change', { 
              status: currentStatus, 
              message: 'Panel is disconnected. Possible app crash.' 
            });
          }
        } else if (currentStatus === 'online') {
          Logger.appendLog(clientInfo.name, 'Status Change', { 
            status: currentStatus, 
            message: 'Panel is online and fully operational.' 
          });
        }
        clientInfo.previousStatus = currentStatus;
      }

      // Log heartbeat issues separately if applicable
      if (isWebSocketConnected && !isHeartbeatValid) {
        Logger.appendLog(clientInfo.name, 'Heartbeat Issue', { 
          message: 'Heartbeat not received within threshold.' 
        });
      }

      // Log ping failures
      if (!isPingable) {
        Logger.appendLog(clientInfo.name, 'Ping Failure', { 
          message: 'Unable to ping the panel.' 
        });
      }

      // Determine if there's a problem with the panel
      if (!isPingable || !isHeartbeatValid || !clientInfo.sectorStatus || !clientInfo.state) {
        problems[clientInfo.name] = false;
        allPanelsOk = false;
      } else {
        problems[clientInfo.name] = true;
      }
    }

    // Check for any expected panels not connected
    expectedPanels.forEach((panel) => {
      if (!connectedPanels.has(panel)) {
        problems[panel] = false;
        allPanelsOk = false;

        // Log disconnection if the panel was previously online
        const panelWasOnline = clients.some(client => client.name === panel && client.previousStatus === 'online');
        if (panelWasOnline) {
          Logger.appendLog(panel, 'Status Change', { 
            status: 'offline', 
            message: 'Panel is now offline.' 
          });
        }
      }
    });

    // console.log(`[HealthChecker] All Panels OK: ${allPanelsOk}`);

    return { allPanelsOk, problems };
  }

  /**
   * Checks all problems and broadcasts instructions if necessary.
   * @param {Array} clients - Array of client information objects.
   * @param {Function} broadcastToAppropriateClients - Function to broadcast messages to clients.
   * @param {Array} expectedPanels - Array of expected panel names.
   * @returns {Promise<boolean>} - Resolves to true if all systems are OK, false otherwise.
   */
  static async checkProblems(clients, broadcastToAppropriateClients, expectedPanels) {
    const [frontendOk, databaseOk] = await Promise.all([
      this.checkFrontend(),
      this.checkDatabase()
    ]);

    const { allPanelsOk, problems } = await this.checkPanels(clients, expectedPanels);

    if (!frontendOk || !databaseOk) {
      broadcastToAppropriateClients(
        JSON.stringify({ type: 'instruction', to: 'panel', instruction: 'off' }),
        'panel'
      );
      Logger.appendLog('System', 'Service Down', { 
        frontend: frontendOk, 
        database: databaseOk 
      });
    }

    return frontendOk && databaseOk && allPanelsOk;
  }
}

module.exports = HealthChecker;
