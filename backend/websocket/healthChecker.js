// healthChecker.js
const http = require('http');
const Logger = require('../utils/logger');
const ping = require('ping'); // Ensure you've installed this package using `npm install ping`)

//TODO: Update the following constants with the appropriate values and put them in a .env file
const FRONTEND_PORT = 3000;
const DATABASE_PORT = 27017;
const HEARTBEAT_INTERVAL = 5000; // 5 seconds
const HEARTBEAT_THRESHOLD = HEARTBEAT_INTERVAL * 12; // 60 seconds
const PING_TIMEOUT = 5; // 5 seconds

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
        timeout: PING_TIMEOUT, // Timeout in seconds
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

      // Determine current status based on the three checks
      let currentStatus = 'offline';
      if (isWebSocketConnected && isHeartbeatValid && isPingable) {
        currentStatus = 'online';
      } else if (!isWebSocketConnected && isPingable && isHeartbeatValid) {
        currentStatus = 'pingable'; // Possible app crash
      } else {
        currentStatus = 'offline';
      }

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
              message: 'Panel is not reachable by ping bu still connected to websocket. Possible that ICMP protocol is blocked but not the 8080 port.'
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
        // Logger.appendLog(clientInfo.name, 'Ping Failure', {
        //   message: 'Unable to ping the panel.'
        // });
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

    return { allPanelsOk, problems };
  }

  /**
   * Checks all problems and enqueues instructions if necessary.
   * @param {Array} clients - Array of client information objects.
   * @param {Array} expectedPanels - Array of expected panel names.
   * @param {Function} enqueueInstruction - Function to enqueue instructions.
   * @param {Function} getQueue - Function to get the instruction queue for a panel.
   * @param {Function} getSentInstructions - Function to get sent instructions for a panel.
   * @returns {Promise<boolean>} - Resolves to true if all systems are OK, false otherwise.
   */
  static currentFailures = new Set(); // Garde en mémoire les panneaux en panne
  static offSentToAllPanels = false; // Indique si l'instruction "off" a été envoyée aux panneaux fonctionnels pour l'événement de panne actuel

  // healthChecker.js
  static async checkProblems(clients, expectedPanels, queueManager) {
    const [frontendOk, databaseOk] = await Promise.all([
      this.checkFrontend(),
      this.checkDatabase()
    ]);

    const { allPanelsOk, problems } = await this.checkPanels(clients, expectedPanels);

    const failingPanels = expectedPanels.filter(panelName => problems[panelName] === false);

    if (failingPanels.length > 0 || !frontendOk || !databaseOk) {
      this.currentFailures = new Set(failingPanels);

      if (!this.offSentToAllPanels) {
        for (const panelName of expectedPanels) {
          // Correct call to queueManager.getLastQueuedInstructions
          console.log(`[HealthChecker] Checking for existing auto-off instruction in queue for ${panelName}`);
          const hasOffInstruction = await queueManager.getLastQueuedInstructions(panelName, 1, 'auto-off-queue');
          console.log(`[HealthChecker] Last queued instructions for ${panelName}:`, hasOffInstruction);



          if (hasOffInstruction.length === 0) {
            try {
              console.log(`[HealthChecker] Attempting to enqueue auto-off instruction for ${panelName}`);
              const instructionItem = await queueManager.enqueueAutoOffInstruction(panelName);

              if (instructionItem) {
                console.log(`[HealthChecker] Successfully enqueued auto-off instruction for ${panelName}`);
              } else {
                console.log(`[HealthChecker] Skipped duplicate auto-off instruction for ${panelName}`);
              }
            } catch (error) {
              console.error(`Error enqueuing auto-off instruction for ${panelName}:`, error);
            }
          } else {
            console.log(`[HealthChecker] Auto-off instruction already enqueued for ${panelName}. Skipping.`);
          }
        }

        this.offSentToAllPanels = true;
      }
    }
    if (allPanelsOk && frontendOk && databaseOk) {
      this.currentFailures.clear();
      this.offSentToAllPanels = false; // Reset the flag here
    }


    return frontendOk && databaseOk && allPanelsOk;
  }



}

module.exports = HealthChecker;
