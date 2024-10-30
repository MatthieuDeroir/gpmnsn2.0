// LogPage.js
import React, { useState, useEffect } from 'react';
import { addDays, subMonths, subYears, startOfYear, endOfYear, addHours } from 'date-fns';
import { fr } from 'date-fns/locale';
import './LogsPage.css';
import SearchBar from './SearchBar';
import DatePickerComponent from './DatePickerComponent';
import LogTable from './LogTable';
import PaginationComponent from './PaginationComponent';
import { saveAs } from 'file-saver'; // Installez avec `npm install file-saver`
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LogPage = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedOption, setSelectedOption] = useState('allpanels');
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
  const users = ['allusers', 'Maintenance', 'Operateur', 'Visualisation'];

  const toggleDatePicker = () => setShowDatePicker(!showDatePicker);

  const fetchLogs = async () => {
    setLoading(true);
  
    const startDate = dateRange[0].startDate.toISOString();
    const endDate = dateRange[0].endDate.toISOString();
    const isUserRole = selectedOption.includes('users');
    const panelOrRole = isUserRole ? 'role' : 'panel';
    const selectedType = selectedOption === 'allpanels' || selectedOption === 'allusers' ? 'all' : selectedOption.toLowerCase();
    const searchQuery = search.trim().toLowerCase(); // Normalize search to lowercase and trim any spaces
  
    try {
      // Modify the request to include the search query as a parameter
      const response = await fetch(
        `http://localhost:4000/logs/${panelOrRole}/${selectedType}?page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}&search=${searchQuery}`
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

  const exportToCSV = () => {
    if (!logs || logs.length === 0) {
      alert('Aucun journal à exporter.');
      return;
    }
  
    const headers = ['Date', 'Panneau', 'Événement', 'Connectivité', 'État', 'Température CPU', 'État du Secteur', 'Porte ouverte', 'Mode Maintenance'];
    const rows = logs.map(log => {
      const { timestamp, identifier, event, details } = parseLogEntry(log);
      return [
        formatDate(timestamp),
        identifier,
        event,
        details.status || 'Unknown',
        details.state || 'Unknown',
        details.cpuTemp || 'Unknown',
        details.sectorStatus || 'Unknown',
        details.isDoorOpen || 'Unknown',
        details.maintenanceMode || 'Unknown'
      ].join(',');
    });
  
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'logs.csv');
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/logs/search?query=${search}`);
      const data = await response.json();

      if (data && Array.isArray(data.logs)) {
        setLogs(data.logs);
        toast.success('Recherche réussie!');
      } else {
        console.warn('Données de journal invalides reçues:', data);
        setLogs([]);
        toast.warn('Aucun journal trouvé.');
      }

      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error('Erreur lors du chargement des journaux:', error);
      setLogs([]);
      toast.error('Erreur lors du chargement des journaux.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearch(''); // Clear the search input
    setPage(1);    // Reset to the first page
    fetchLogs();   // Re-fetch logs based on original filters
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

  return (
    <div className="log-page">
      <h2 className="log-title">Journaux Système</h2>

      <SearchBar 
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
        handleReset={handleReset}
      />

      <div className="control-container">
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
        <button onClick={exportToCSV} className="export-button">Exporter CSV</button>
      </div>

      <DatePickerComponent
        dateRange={dateRange}
        setDateRange={setDateRange}
        showDatePicker={showDatePicker}
        toggleDatePicker={toggleDatePicker}
      />

      <div className="table-container">
        {loading ? (
          <p>Chargement des journaux...</p>
        ) : (
          <LogTable 
            logs={logs} 
            parseLogEntry={parseLogEntry} 
            selectedOption={selectedOption} 
            formatDate={formatDate} 
          />
        )}
      </div>

      <PaginationComponent 
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        fetchLogs={fetchLogs}
      />
      <ToastContainer />
    </div>
  );
};

export default LogPage;
