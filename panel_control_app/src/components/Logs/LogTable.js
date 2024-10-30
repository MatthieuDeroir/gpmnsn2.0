// LogTable.js
import React, { useState } from 'react';
import './LogsPage.css'; // Assurez-vous que les styles sont importés

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
          {['visualisation', 'operateur', 'maintenance'].includes(selectedOption.toLowerCase()) ? (
            <tr>
              <th onClick={() => requestSort('timestamp')}>Date{getSortIndicator('timestamp')}</th>
              <th onClick={() => requestSort('role')}>Utilisateur{getSortIndicator('role')}</th>
              <th onClick={() => requestSort('instruction')}>Instruction{getSortIndicator('instruction')}</th>
              <th onClick={() => requestSort('identifier')}>Panneau{getSortIndicator('identifier')}</th>
              <th>Détails</th>
            </tr>
          ) : (
            <tr>
              <th onClick={() => requestSort('timestamp')}>Date{getSortIndicator('timestamp')}</th>
              <th onClick={() => requestSort('identifier')}>Panneau{getSortIndicator('identifier')}</th>
              <th onClick={() => requestSort('event')}>Événement{getSortIndicator('event')}</th>
              <th onClick={() => requestSort('status')}>Connectivité{getSortIndicator('status')}</th>
              <th onClick={() => requestSort('state')}>État{getSortIndicator('state')}</th>
              <th onClick={() => requestSort('cpuTemp')}>Température CPU{getSortIndicator('cpuTemp')}</th>
              <th onClick={() => requestSort('sectorStatus')}>État du Secteur{getSortIndicator('sectorStatus')}</th>
              <th onClick={() => requestSort('isDoorOpen')}>Porte ouverte{getSortIndicator('isDoorOpen')}</th>
              <th onClick={() => requestSort('maintenanceMode')}>Mode Maintenance{getSortIndicator('maintenanceMode')}</th>
            </tr>
          )}
        </thead>
        <tbody>
          {(!sortedLogs || sortedLogs.length === 0) ? (
            <tr>
              <td colSpan={selectedOption.toLowerCase().includes('user') ? "5" : "9"}>Aucun journal trouvé</td>
            </tr>
          ) : (
            sortedLogs.map((log, index) => {
              const { timestamp, identifier, event, details } = parseLogEntry(log);
            
              // Définir la classe basée sur les conditions
              let rowClass = '';
              if (details.sectorStatus === 'false') {
                rowClass = 'log-red'; // Rouge pour secteur false
              } else if (details.maintenanceMode === 'true') {
                rowClass = 'log-orange'; // Orange pour mode maintenance activé
              } else if (details.instruction === 'off') {
                rowClass = 'log-light-red'; // Rouge clair pour off
              } else if (details.instruction === 'refresh') {
                rowClass = 'log-blue'; // Bleu pour refresh
              } else if (details.instruction === 'reboot') {
                rowClass = 'log-orange'; // Orange pour reboot
              } else if (details.instruction === 'on') {
                rowClass = 'log-green'; // Vert pour on
              } else if (details.isDoorOpen === 'true') {
                rowClass = 'log-grey'; // Gris pour porte ouverte
              }
            
              if (['visualisation', 'operateur', 'maintenance'].includes(selectedOption.toLowerCase())) {
                // Affichage des logs utilisateurs
                return (
                  <tr key={index} className={rowClass}>
                    <td>{formatDate(timestamp)}</td>
                    <td>{details.role || 'Unknown'}</td>
                    <td>{details.instruction || 'Unknown'}</td>
                    <td>{identifier}</td>
                    <td>{JSON.stringify(details)}</td>
                  </tr>
                );
              } else {
                // Affichage des logs panneaux
                return (
                  <tr key={index} className={rowClass}>
                    <td>{formatDate(timestamp)}</td>
                    <td>{identifier}</td>
                    <td>{event}</td>
                    <td>{details.status}</td>
                    <td>{details.state}</td>
                    <td>{details.cpuTemp}</td>
                    <td>{details.sectorStatus}</td>
                    <td>{details.isDoorOpen}</td>
                    <td>{details.maintenanceMode}</td>
                  </tr>
                );
              }
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LogTable;
