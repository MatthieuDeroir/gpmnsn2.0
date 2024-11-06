// src/components/Logs/LogPage.js

import React, { useState, useEffect } from 'react';
import { addDays } from 'date-fns';
import './LogsPage.css';
import SearchBar from './SearchBar';
import DatePickerComponent from './DatePickerComponent';
import LogTable from './LogTable';
import PaginationComponent from './PaginationComponent';
import { saveAs } from 'file-saver';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  fetchLogs as fetchLogsService,
  searchLogs as searchLogsService,
} from '../../services/logService';

const LogPage = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedOption, setSelectedOption] = useState('alllogs');
  const [dateRange, setDateRange] = useState([
    {
      startDate: addDays(new Date(), -7),
      endDate: new Date(),
      key: 'selection',
    },
  ]);
  const [page, setPage] = useState(1);
  const [limit] = useState(100); // Fetch 100 logs per request
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const options = [
    { label: 'Tous les Journaux', value: 'alllogs' },
    { label: 'Journaux des Panneaux', value: 'panels' },
    { label: 'Journaux des Utilisateurs', value: 'users' },
  ];

  const panels = ['Aval', 'Amont', 'Indret'];
  const users = ['Maintenance', 'Operateur', 'Visualisation'];

  const toggleDatePicker = () => setShowDatePicker(!showDatePicker);

  const fetchLogs = async () => {
    setLoading(true);

    const startDate = dateRange[0].startDate.toISOString();
    const endDate = dateRange[0].endDate.toISOString();
    const searchQuery = search.trim().toLowerCase();

    let type = 'all';
    let value = 'all';

    if (selectedOption === 'alllogs') {
      type = 'all';
    } else if (selectedOption === 'panels') {
      type = 'panels';
    } else if (selectedOption === 'users') {
      type = 'users';
    } else if (selectedOption.startsWith('panel-')) {
      type = 'panel';
      value = selectedOption.replace('panel-', '');
    } else if (selectedOption.startsWith('user-')) {
      type = 'user';
      value = selectedOption.replace('user-', '');
    }

    try {
      const data = await fetchLogsService(
          type,
          value,
          page,
          limit,
          startDate,
          endDate,
          searchQuery
      );

      if (data && Array.isArray(data.logs)) {
        setLogs(data.logs);
        setTotalPages(data.totalPages || 0);
      } else {
        console.warn('Invalid log data received:', data);
        setLogs([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des journaux:', error);
      if (error.response && error.response.status === 401) {
        console.error('Utilisateur non authentifié');
        // Handle unauthenticated user case
      }
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption, page, dateRange]);

  const parseLogEntry = (log) => {
    if (!log || typeof log !== 'object') {
      return {
        timestamp: 'Invalid',
        identifier: 'Unknown',
        event: 'Unknown',
        details: {},
      };
    }

    return {
      timestamp: log.timestamp,
      identifier: log.panelName || 'N/A',
      event: log.eventType,
      details: log.details || {},
    };
  };

  const exportToCSV = () => {
    if (!logs || logs.length === 0) {
      alert('Aucun journal à exporter.');
      return;
    }

    const headers = [
      'Date',
      'Panneau',
      'Événement',
      'Connectivité',
      'État',
      'Température CPU',
      'État du Secteur',
      'Porte ouverte',
      'Maintenance',
    ];
    const rows = logs.map((log) => {
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
        details.maintenanceMode || 'Unknown',
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'logs.csv');
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await searchLogsService(search);

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
    setSearch('');
    setPage(1);
    fetchLogs();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      console.warn('Date invalide reçue:', dateString);
      return 'Date invalide';
    }

    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    return new Intl.DateTimeFormat('fr-FR', options).format(date);
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
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
            ))}

            <optgroup label="Panneaux">
              {panels.map((panel) => (
                  <option key={panel} value={`panel-${panel.toLowerCase()}`}>
                    {panel}
                  </option>
              ))}
            </optgroup>

            <optgroup label="Utilisateurs">
              {users.map((user) => (
                  <option key={user} value={`user-${user.toLowerCase()}`}>
                    {user}
                  </option>
              ))}
            </optgroup>
          </select>
          <button onClick={exportToCSV} className="export-button">
            Exporter CSV
          </button>
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
