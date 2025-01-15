// healthChecker.js
const http = require('http');
const Logger = require('../utils/logger');
const ping = require('ping');

// Example config constants; you can put them in .env
const FRONTEND_PORT = 3000;
const DATABASE_PORT = 27017;
const HEARTBEAT_INTERVAL = 5000;         // e.g. 5 seconds
const HEARTBEAT_THRESHOLD = HEARTBEAT_INTERVAL * 5; // e.g. 25 seconds
const PING_TIMEOUT = 5;    // 5 seconds
const MAX_ATTEMPTS = 7;    // Try 3 consecutive pings

class HealthChecker {
  static HEARTBEAT_THRESHOLD = HEARTBEAT_THRESHOLD;

  /**
   * Check if a local service (like frontend or DB) is up by HTTP request
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

  // Simple checks (customize as needed)
  static checkFrontend() {
    return this.checkService(FRONTEND_PORT);
  }

  static checkDatabase() {
    // If you want a real DB check, implement it here
    return true;
  }

  /**
   * Ping a panel up to 3 times (ICMP).
   * Returns true if reachable on any attempt, false otherwise.
   */
  static async pingPanel(panel) {
    const { name, ip } = panel;

    // If we previously flagged this panel as in permanent failure, we might skip repeated logs
    const permanentFailAlreadySet = panel.hasPermanentPingFailure === true;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      console.log(`[pingPanel] Attempt ${attempt} to ping panel "${name}" at IP ${ip}...`);

      try {
        const response = await ping.promise.probe(ip, {
          timeout: PING_TIMEOUT,
        });

        if (response.alive) {
          // If it was flagged as failure, log a "recovery"
          if (panel.hasPermanentPingFailure) {
            Logger.appendLog(name, 'Ping Recovery', {
              attempts: attempt,
              ip,
              message: `Panel "${name}" is reachable again after being in permanent failure.`,
            });
            panel.hasPermanentPingFailure = false;
          } else if (attempt > 1) {
            // If it was unreachable in attempt #1, but success in #2 or #3
            Logger.appendLog(name, 'Ping Success', {
              attempts: attempt,
              ip,
              message: `Panel "${name}" is reachable again after ${attempt - 1} failed attempt(s).`,
            });
          }

          console.log(`[pingPanel] Panel "${name}" at IP ${ip} is reachable on attempt ${attempt}.`);
          return true;
        } else {
          console.log(`[pingPanel] Panel "${name}" did not respond on attempt ${attempt}.`);
          if (!permanentFailAlreadySet) {
            Logger.appendLog(name, 'Ping No Response', {
              attempt,
              ip,
              message: `No response from panel "${name}" on attempt ${attempt}.`,
            });
          }
        }
      } catch (error) {
        console.error(`[pingPanel] Error on attempt ${attempt} while pinging panel "${name}":`, error);
        if (!permanentFailAlreadySet) {
          Logger.appendLog(name, 'Ping Error', {
            attempt,
            ip,
            error: error.message || error,
            message: `Error on attempt ${attempt} while pinging "${name}".`,
          });
        }
      }
    }

    // All attempts failed
    console.log(`[pingPanel] Panel "${name}" at IP ${ip} is unreachable after ${MAX_ATTEMPTS} attempts.`);
    if (!panel.hasPermanentPingFailure) {
      Logger.appendLog(name, 'Ping Failure', {
        attempts: MAX_ATTEMPTS,
        ip,
        message: `Panel "${name}" is unreachable after ${MAX_ATTEMPTS} attempts.`,
      });
      panel.hasPermanentPingFailure = true;
    }
    return false;
  }

  /**
   * Check the status of all panels (heartbeat, ping, etc.).
   * Return { allPanelsOk, problems } with each panel’s status.
   */
  static async checkPanels(clients, expectedPanels) {
    const now = Date.now();
    let allPanelsOk = true;
    const problems = {};
    const connectedPanels = new Set();

    for (const clientInfo of clients) {
      // Only handle panels
      if (clientInfo.clientType !== 'panel') continue;

      connectedPanels.add(clientInfo.name);

      // 1) Heartbeat check
      const isHeartbeatValid = (now - clientInfo.lastHeartbeat <= this.HEARTBEAT_THRESHOLD);

      // 2) WebSocket check (initially from clientInfo.connected)
      const isWebSocketConnected = !!clientInfo.connected;

      // 3) ICMP Ping check
      const isPingable = await this.pingPanel(clientInfo);

      // Decide overall current status
      let currentStatus = 'offline';

      if (isWebSocketConnected && isHeartbeatValid && isPingable) {
        currentStatus = 'online';
      } else if (!isWebSocketConnected && isHeartbeatValid && isPingable) {
        currentStatus = 'pingable';
      } else {
        currentStatus = 'offline';
      }

      // Update clientInfo.connected based on the computed status
      if (currentStatus === 'online' || currentStatus === 'pingable') {
        clientInfo.connected = true;
      } else {
        clientInfo.connected = false;
        clientInfo.state = 'off'; // If not connected, consider the panel off
      }

      // Optionally store the textual status
      clientInfo.currentStatus = currentStatus;

      // Compare with previous status
      const previousStatus = clientInfo.previousStatus || 'offline';
      if (previousStatus !== currentStatus) {
        if (currentStatus === 'pingable') {
          console.log(
              `[HealthChecker] Panel "${clientInfo.name}" is pingable but not connected via WebSocket. Possible app crash.`
          );
          Logger.appendLog(clientInfo.name, 'Panel App Crash', {
            status: currentStatus,
            message: 'Panel is pingable but not connected via WebSocket. Possible app crash.',
          });
        } else if (currentStatus === 'offline') {
          if (!isPingable) {
            console.log(
                `[HealthChecker] Panel "${clientInfo.name}" is offline and not pingable. Possible network disconnection.`
            );
            Logger.appendLog(clientInfo.name, 'Offline', {
              status: currentStatus,
              message: 'Panel is disconnected and not pingable. Possible network disconnection.',
            });
          }
        } else if (currentStatus === 'online') {
          console.log(
              `[HealthChecker] Panel "${clientInfo.name}" is online and fully operational.`
          );
          Logger.appendLog(clientInfo.name, 'Online', {
            status: currentStatus,
            message: 'Panel is online and fully operational.',
          });
        }

        clientInfo.previousStatus = currentStatus;
      }

      // If the socket is still open but heartbeat is invalid, log separately
      if (isWebSocketConnected && !isHeartbeatValid) {
        Logger.appendLog(clientInfo.name, 'Heartbeat Issue', {
          message: 'Heartbeat not received within threshold.',
        });
      }

      // If the panel is truly offline, consider it a problem
      if (!isPingable || !isHeartbeatValid || !clientInfo.sectorStatus || currentStatus !== 'online') {
        problems[clientInfo.name] = false;
        allPanelsOk = false;
      } else {
        problems[clientInfo.name] = true;
      }
    }

    // For panels not present in `clients`, mark them as problematic
    expectedPanels.forEach((panelName) => {
      if (!connectedPanels.has(panelName)) {
        problems[panelName] = false;
        allPanelsOk = false;
      }
    });

    return { allPanelsOk, problems };
  }

  /**
   * Aggregates checks:
   * - Frontend
   * - Database
   * - Panel checks
   * - Possibly enqueue "off" instructions if major failures
   */
  static currentFailures = new Set();
  static offSentToAllPanels = false;

  static async checkProblems(clients, expectedPanels, queueManager) {
    // Check if frontend & DB are up
    const [frontendOk, databaseOk] = await Promise.all([
      this.checkFrontend(),
      this.checkDatabase(),
    ]);

    if (!frontendOk) {
      console.log('[HealthChecker] Frontend service is down.');
      Logger.appendLog('Frontend', 'Offline', {
        message: 'Frontend service is down.',
      });
    }
    if (!databaseOk) {
      console.log('[HealthChecker] Database service is down.');
      Logger.appendLog('Database', 'Offline', {
        message: 'Database service is down.',
      });
    }

    // Check all panels
    const { allPanelsOk, problems } = await this.checkPanels(clients, expectedPanels);

    // Identify failing panels
    const failingPanels = expectedPanels.filter((panelName) => problems[panelName] === false);

    // If there's a failure or frontend/db is down, do something
    if (failingPanels.length > 0 || !frontendOk || !databaseOk) {
      this.currentFailures = new Set(failingPanels);

      // Example logic: Enqueue "off" instructions for all panels if we haven't done so yet
      if (!this.offSentToAllPanels) {
        for (const panelName of expectedPanels) {
          const hasOffInstruction = await queueManager.getLastQueuedInstructions(
              panelName,
              1,
              'auto-off-queue'
          );
          if (hasOffInstruction.length === 0) {
            try {
              console.log(`[HealthChecker] Attempting to enqueue auto-off instruction for "${panelName}"`);
              const instructionItem = await queueManager.enqueueAutoOffInstruction(panelName);
              if (instructionItem) {
                console.log(`[HealthChecker] Successfully enqueued auto-off instruction for "${panelName}"`);
              } else {
                console.log(`[HealthChecker] Skipped duplicate auto-off instruction for "${panelName}"`);
              }
            } catch (error) {
              console.error(`Error enqueuing auto-off instruction for ${panelName}:`, error);
            }
          } else {
            console.log(`[HealthChecker] Auto-off instruction already enqueued for "${panelName}". Skipping.`);
          }
        }
        this.offSentToAllPanels = true;
      }
    }

    // If all is well, reset the flags
    if (allPanelsOk && frontendOk && databaseOk) {
      this.currentFailures.clear();
      this.offSentToAllPanels = false;
    }

    // Return overall system health
    return frontendOk && databaseOk && allPanelsOk;
  }
}

module.exports = HealthChecker;
