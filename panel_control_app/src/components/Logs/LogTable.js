// LogTable.js
import React, { useState } from 'react';
import './LogsPage.css';

const LogTable = ({ logs, parseLogEntry, selectedOption, formatDate }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'descending' });

  const sortedLogs = React.useMemo(() => {
    let sortableLogs = [...logs];
    if (sortConfig !== null) {
      sortableLogs.sort((a, b) => {
        const aParsed = parseLogEntry(a);
        const bParsed = parseLogEntry(b);
        if (aParsed[sortConfig.key] < bParsed[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aParsed[sortConfig.key] > bParsed[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableLogs;
  }, [logs, sortConfig, parseLogEntry]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' 🔼' : ' 🔽';
    }
    return '';
  };

  return (
      <div className="log-table-container">
        <table className="log-table">
          <thead>
          <tr>
            <th onClick={() => requestSort('timestamp')}>
              Date {getSortIndicator('timestamp')}
            </th>
            <th onClick={() => requestSort('eventType')}>
              Événement {getSortIndicator('eventType')}
            </th>
            <th onClick={() => requestSort('panelName')}>
              Agent {getSortIndicator('panelName')}
            </th>
            <th>Détails</th>
          </tr>
            </thead>
          <tbody>
          {(!sortedLogs || sortedLogs.length === 0) ? (
              <tr>
                <td colSpan="4">Aucun journal trouvé</td>
              </tr>
          ) : (
              sortedLogs.map((log, index) => {
                const {timestamp, panelName, eventType, details} = parseLogEntry(log);

                // Define row class based on certain conditions
                let rowClass = '';
                const instruction = details.instruction;
                const panelStatus = details.panelStatus || {};

                if (panelStatus.sectorStatus === false) {
                  rowClass = 'log-red';
                } else if (panelStatus.maintenanceMode === true) {
                  rowClass = 'log-orange';
                } else if (instruction === 'off') {
                  rowClass = 'log-light-red';
                } else if (instruction === 'refresh') {
                  rowClass = 'log-blue';
                } else if (instruction === 'reboot') {
                  rowClass = 'log-orange';
                } else if (instruction === 'on') {
                  rowClass = 'log-green';
                } else if (panelStatus.isDoorOpen === true) {
                  rowClass = 'log-grey';
                }

                return (
                    <tr key={index} className={rowClass}>
                      <td>{formatDate(timestamp)}</td>
                      <td>{eventType}</td>

                      <td>{panelName}</td>
                      <td>
                        {details ? (
                            <pre>{JSON.stringify(details, null, 2)}</pre>
                        ) : (
                            'N/A'
                        )}
                      </td>
                    </tr>
                );
              })
          )}
          </tbody>
        </table>
      </div>
);
};

export default LogTable;
