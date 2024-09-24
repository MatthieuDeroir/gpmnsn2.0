import React, { useState, useEffect } from 'react';
import { DateRangePicker, createStaticRanges } from 'react-date-range';
import { addDays, subMonths, subYears, startOfYear, endOfYear, addHours } from 'date-fns';
import { fr } from 'date-fns/locale';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './LogsPage.css';

const LogPage = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedOption, setSelectedOption] = useState('allPanels');
  const [dateRange, setDateRange] = useState([
    {
      startDate: addDays(new Date(), -7),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const [page, setPage] = useState(1);
  const [limit] = useState(100); // Fetch 100 logs per request
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false); // New state for toggling the date picker

  const panels = ['allpanels', 'Aval', 'Amont', 'Indret'];
  const users = ['Maintenance', 'Operateur', 'Visualisation'];

  const toggleDatePicker = () => setShowDatePicker(!showDatePicker);

  const fetchLogs = async () => {
    setLoading(true);

    const startDate = dateRange[0].startDate.toISOString();
    const endDate = dateRange[0].endDate.toISOString();
    const isUserRole = selectedOption.includes('users');
    const panelOrRole = isUserRole ? 'role' : 'panel';
    const selectedType = selectedOption === 'allpanels' || selectedOption === 'allusers' ? 'all' : selectedOption.toLowerCase();

    try {
      const response = await fetch(
        `http://localhost:4000/logs/${panelOrRole}/${selectedType}?page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`
      );
      const data = await response.json();

      if (data && Array.isArray(data.logs)) {
        setLogs(data.logs);
      } else {
        console.warn('Invalid log data received:', data);
        setLogs([]);
      }

      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error('Erreur lors du chargement des journaux:', error);
      setLogs([]); // Fallback to empty logs if there is an error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [selectedOption, page, dateRange]);

  const parseLogEntry = (log) => {
    if (!log || typeof log !== 'string') {
      return {
        timestamp: 'Invalid',
        identifier: 'Unknown',
        event: 'Unknown',
        details: {}
      };
    }

    const [timestamp, identifier, event, ...rest] = log.split(',');

    const details = rest.join(',').split(',').reduce((acc, keyValuePair) => {
      const [key, value] = keyValuePair.split('=');
      acc[key.trim()] = value ? value.trim() : 'Unknown';
      return acc;
    }, {});

    return {
      timestamp,
      identifier,
      event,
      details
    };
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    return new Intl.DateTimeFormat('fr-FR', options).format(new Date(dateString));
  };

  const customStaticRanges = createStaticRanges([
    { label: 'Aujourd\'hui', range: () => ({ startDate: new Date(), endDate: new Date() }) },
    { label: 'Depuis 6 heures', range: () => ({ startDate: addHours(new Date(), -6), endDate: new Date() }) },
    { label: 'Depuis 12 heures', range: () => ({ startDate: addHours(new Date(), -12), endDate: new Date() }) },
    { label: 'Hier', range: () => ({ startDate: addDays(new Date(), -1), endDate: addDays(new Date(), -1) }) },
    { label: 'Cette semaine', range: () => ({ startDate: addDays(new Date(), -new Date().getDay()), endDate: new Date() }) },
    { label: 'Semaine dernière', range: () => ({ startDate: addDays(new Date(), -7 - new Date().getDay()), endDate: addDays(new Date(), -new Date().getDay() - 1) }) },
    { label: 'Ce mois', range: () => ({ startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1), endDate: new Date() }) },
    { label: 'Le mois dernier', range: () => ({ startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1), endDate: new Date() }) },
    { label: 'Les 6 derniers mois', range: () => ({ startDate: subMonths(new Date(), 6), endDate: new Date() }) },
    { label: 'Depuis le début de l\'année', range: () => ({ startDate: startOfYear(new Date()), endDate: new Date() }) },
    { label: 'Depuis un an', range: () => ({ startDate: subYears(new Date(), 1), endDate: new Date() }) },
    { label: 'L\'année dernière', range: () => ({ startDate: startOfYear(subYears(new Date(), 1)), endDate: endOfYear(subYears(new Date(), 1)) }) }
  ]);

  return (
    <div className="log-page">
      <h2 className="log-title">Journaux Système</h2>

      <div className="control-container">
        <input
          className="search-input"
          type="text"
          placeholder="Rechercher dans les journaux..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select 
          className="selector" 
          value={selectedOption} 
          onChange={(e) => {
            setSelectedOption(e.target.value);
            setPage(1);
          }}
        >
          <optgroup label="Panneaux">
            {panels.map((panel) => (
              <option key={panel} value={panel.toLowerCase()}>
                {panel === 'allpanels' ? 'Tous les Panneaux' : panel}
              </option>
            ))}
          </optgroup>

          <optgroup label="Utilisateurs">
            {users.map((user) => (
              <option key={user} value={user.toLowerCase()}>
                {user === 'allusers' ? 'Tous les Utilisateurs' : user}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      <div className="date-toggle-container">
        <div className="date-toggle-header" onClick={toggleDatePicker}>
          <span>Tri par date</span>
          <span className={showDatePicker ? 'arrow-up' : 'arrow-down'}>▼</span>
        </div>
        {showDatePicker && (
          <div className="date-picker-container">
            <DateRangePicker
              onChange={item => setDateRange([item.selection])}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              months={2}
              ranges={dateRange}
              direction="horizontal"
              locale={fr}
              staticRanges={customStaticRanges}
              inputRanges={[]}
            />
          </div>
        )}
      </div>

      <div className="table-container">
        {loading ? (
          <p>Chargement des journaux...</p>
        ) : (
          <table className="log-table">
            <thead>
              {['visualisation', 'operateur', 'maintenance'].includes(selectedOption.toLowerCase()) ? (
                <tr>
                  <th>Date</th>
                  <th>Utilisateur</th>
                  <th>Instruction</th>
                  <th>Panneau</th>
                  <th>Détails</th>
                </tr>
              ) : (
                <tr>
                  <th>Date</th>
                  <th>Panneau</th>
                  <th>Événement</th>
                  <th>État</th>
                  <th>Température CPU</th>
                  <th>État du Secteur</th>
                  <th>Porte ouverte</th>
                  <th>Mode Maintenance</th>
                </tr>
              )}
            </thead>
            <tbody>
              {(!logs || logs.length === 0) ? (
                <tr>
                  <td colSpan="8">Aucun journal trouvé</td>
                </tr>
              ) : (
                logs.map((log, index) => {
                  const { timestamp, identifier, event, details } = parseLogEntry(log);
                
                  // Define the class based on conditions
                  let rowClass = '';
                  if (details.sectorStatus === 'false') {
                    rowClass = 'log-red'; // Red for sector false
                  } else if (details.maintenanceMode === 'true') {
                    rowClass = 'log-orange'; // Orange for maintenance mode on
                  } else if (details.instruction === 'off') {
                    rowClass = 'log-light-red'; // Grey for off
                  } else if (details.instruction === 'refresh') {
                    rowClass = 'log-blue'; // Blue for refresh
                  } else if (details.instruction === 'reboot') {
                    rowClass = 'log-orange'; // Orange for reboot
                  } else if (details.instruction === 'on') {
                    rowClass = 'log-green'; // Green for on
                  } else if (details.isDoorOpen === 'true') {
                    rowClass = 'log-grey'; // Grey for off
                  }
                
                  if (['visualisation', 'operateur', 'maintenance'].includes(selectedOption.toLowerCase())) {
                    // User logs display
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
                    // Panel logs display
                    return (
                      <tr key={index} className={rowClass}>
                        <td>{formatDate(timestamp)}</td>
                        <td>{identifier}</td>
                        <td>{event}</td>
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
        )}
      </div>

      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Précédent
        </button>
        <span> Page {page} sur {totalPages} </span>
        <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>
          Suivant
        </button>
      </div>
    </div>
  );
};

export default LogPage;
