const fs = require('fs');
const path = require('path');

class Logger {
  static appendLog(panel, eventType, details = null) {
    const timestamp = new Date().toISOString();
    const panelName = panel || 'Unknown Panel';
    let role = 'unknown'; // Default value
    if (details && details.role) {
      role = details.role; // Use the role from details
    }

    let logMessage = `${timestamp},${panelName},${eventType}`;
    if (details && typeof details === 'object') {
      const detailEntries = Object.entries(details)
        .map(([key, value]) => `${key}=${value !== null && value !== undefined ? value : 'Unknown'}`)
        .join(',');
      logMessage += `,${detailEntries}`;
    }

    logMessage += '\n';

    // Log to the general log file (all.txt)
    fs.appendFile('logs/all.txt', logMessage, (err) => {
      if (err) {
        console.error('Failed to append to all.txt:', err);
      }
    });

    // Log to the specific panel's log file
    if (panelName !== 'Unknown Panel') {
      const panelLogPath = path.join('logs', `${panelName.toLowerCase()}.txt`);
      fs.appendFile(panelLogPath, logMessage, (err) => {
        if (err) {
          console.error(`Failed to append to ${panelName}.txt:`, err);
        }
      });
    }

    // Log to the specific role's log file
    if (role !== 'unknown') {
      const roleLogPath = path.join('logs', `${role.toLowerCase()}.txt`);
      fs.appendFile(roleLogPath, logMessage, (err) => {
        if (err) {
          console.error(`Failed to append to ${role}.txt:`, err);
        }
      });
    }
  }

  // Get logs based on the panel or handle "allpanels"
  static getPanelLogs(panel = 'all', page = 1, limit = 100, startDate = null, endDate = null) {
    let fileName = 'all.txt';

    // If specific panels are requested, filter them
    if (panel !== 'allpanels') {
      fileName = `${panel.toLowerCase()}.txt`;
    }

    return Logger._getLogsFromFile(fileName, page, limit, startDate, endDate, panel);
  }

  // Get logs based on the role or handle "allusers"
   // Get logs based on the role or handle "allusers"
   static getRoleLogs(role = 'allusers', page = 1, limit = 100, startDate = null, endDate = null) {
    const fileName = 'all.txt'; // Use the general "all" log file

    // If a specific role is requested, we will filter the "all.txt" file to only show that role
    if (role !== 'allusers') {
      return Logger._getLogsFromFile(fileName, page, limit, startDate, endDate, null, role);
    }

    // For "allusers", filter the "all.txt" file to return logs containing a "role=" entry
    return Logger._getLogsFromFile(fileName, page, limit, startDate, endDate, null, 'all');
  }

  // Internal helper method to read and filter logs from a file
  static _getLogsFromFile(fileName, page, limit, startDate, endDate, panelFilter = null, roleFilter = null) {
    const filePath = path.join('logs', fileName);

    try {
      const data = fs.readFileSync(filePath, 'utf8');
      const lines = data.trim().split('\n');

      // Filter by panel or role
      const filteredLines = lines.filter(log => {
        const logDate = new Date(log.split(',')[0]);
        const logPanel = log.split(',')[1];
        const hasRole = log.includes('role=');

        // Match panel or all panels
        const panelMatch = panelFilter
          ? ['aval', 'amont', 'indret', 'all'].includes(logPanel) // Include logs where panel is "all"
          : true;

        // Filter by role if roleFilter is specified
        const roleMatch = roleFilter
          ? roleFilter === 'role='
            ? hasRole // For "allusers", check if any role exists in the log
            : log.includes(`role=${roleFilter}`) // For specific roles
          : true;

        return (!startDate || logDate >= startDate) && (!endDate || logDate <= endDate) && (panelFilter ? panelMatch : roleMatch);
      });

      const reversedLogs = filteredLines.reverse();
      const startIndex = (page - 1) * limit;
      const paginatedLogs = reversedLogs.slice(startIndex, startIndex + limit);

      return {
        logs: paginatedLogs,
        page,
        limit,
        totalLogs: filteredLines.length,
        totalPages: Math.ceil(filteredLines.length / limit),
      };
    } catch (error) {
      console.error(`Error reading logs from ${fileName}:`, error);
      return { logs: [], page, limit, totalLogs: 0, totalPages: 0, error: error.message };
    }
  }
}

module.exports = Logger;
