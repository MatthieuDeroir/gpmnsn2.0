const http = require('http');

const FRONTEND_PORT = 3000;
const DATABASE_PORT = 27017;
const HEARTBEAT_INTERVAL = 5000;  // 5 seconds

class HealthChecker {
  static async checkFrontend() {
    return new Promise((resolve, reject) => {
      const req = http.get(`http://localhost:${FRONTEND_PORT}`, res => {
        res.statusCode === 200 ? resolve(true) : resolve(false);
      });
      req.on('error', () => resolve(false));
      req.end();
    });
  }

  static async checkDatabase() {
    return new Promise((resolve, reject) => {
      const req = http.get(`http://localhost:${DATABASE_PORT}`, res => {
        res.statusCode === 200 ? resolve(true) : resolve(false);
      });
      req.on('error', () => resolve(false));
      req.end();
    });
  }

  static checkPanels(clients, expectedPanels) {
    const now = Date.now();
    let allPanelsOk = true;
    let problems = {};

    const connectedPanels = new Set();

    clients.forEach(clientInfo => {
      if (clientInfo.clientType === 'panel') {
        connectedPanels.add(clientInfo.name);
        if (now - clientInfo.lastHeartbeat > HEARTBEAT_INTERVAL * 2 || !clientInfo.sectorStatus || !clientInfo.state) {
          problems[clientInfo.name] = false;
          allPanelsOk = false;
        } else {
          problems[clientInfo.name] = true;
        }
      }
    });

    expectedPanels.forEach(panel => {
      if (!connectedPanels.has(panel)) {
        problems[panel] = true;
        allPanelsOk = false;
      }
    });

    return { allPanelsOk, problems };
  }

  static async checkProblems(clients, broadcastToAppropriateClients, expectedPanels) {
    const frontendOk = await this.checkFrontend();
    const databaseOk = await this.checkDatabase();
    const { allPanelsOk, problems } = this.checkPanels(clients, expectedPanels);

    if (!frontendOk || !databaseOk) {
      broadcastToAppropriateClients(JSON.stringify({ type: 'instruction', to: 'panel', instruction: 'off' }), 'panel');
    }

    console.log(`Check result - Frontend: ${frontendOk}, Database: ${databaseOk}, Panel Problems: ${JSON.stringify(problems)}`);
    return frontendOk && databaseOk && allPanelsOk;
  }
}

module.exports = HealthChecker;
