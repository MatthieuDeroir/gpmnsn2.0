// src/components/Logs/LogsPage.js

import React, { useState, useEffect } from 'react';
import { addDays } from 'date-fns';
import './LogsPage.css';
import SearchBar from './SearchBar';
import DatePickerComponent from './DatePickerComponent';
import LogTable from './LogTable';
import PaginationComponent from './PaginationComponent';
import { saveAs } from 'file-saver';
import axios from 'axios'; // Assurez-vous que axios est installé et importé
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  fetchLogs as fetchLogsService,
  searchLogs as searchLogsService,
} from '../../services/logService';

const LogsPage = () => {
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
  const [limit] = useState(100); // Nombre de logs par page
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const options = [
    { label: 'Tous les Journaux', value: 'alllogs' },
  ];

  const panels = ['Aval', 'Amont', 'Indret'];

  const toggleDatePicker = () => setShowDatePicker(!showDatePicker);

  const fetchLogs = async () => {
    setLoading(true);

    const startDate = dateRange[0].startDate.toISOString();
    const endDate = dateRange[0].endDate.toISOString();

    let searchQuery = search.trim().toLowerCase();

    // Si un utilisateur spécifique est sélectionné, définir la requête de recherche sur son nom de rôle
    if (selectedOption.startsWith('user-')) {
      const roleName = selectedOption.replace('user-', ''); // ex : 'maintenance', 'operateur'
      searchQuery = roleName;
    }

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
        console.warn('Données de journal invalides reçues:', data);
        setLogs([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des journaux:', error);
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
        panelName: 'Unknown',
        eventType: 'Unknown',
        details: {},
      };
    }

    // Extraction des champs de base
    const { timestamp, panelName, eventType, details } = log;

    // Initialisation d'un objet pour contenir les détails analysés
    const parsedDetails = {};

    // En fonction du type d'événement, extraire les détails pertinents
    if (eventType.includes('Instruction') && details) {
      parsedDetails.instruction = details.instruction || 'Unknown';
      parsedDetails.instructionId = details.instructionId || 'Unknown';
      parsedDetails.status = details.status || 'Unknown';

      // Si panelStatus est disponible, extraire ses champs
      if (details.panelStatus) {
        parsedDetails.panelStatus = details.panelStatus;
      }
    } else if (eventType === 'Status Change' && details) {
      parsedDetails.status = details.status || 'Unknown';
      parsedDetails.message = details.message || 'Unknown';
    } else if (eventType === 'Register' && details) {
      parsedDetails.panelName = details.panelName || 'Unknown';
      parsedDetails.role = details.role || 'Unknown';
    } else if (eventType === 'Disconnected' && details) {
      parsedDetails.message = details.message || 'Unknown';
    } else if (eventType === 'Auto-Off Instruction Enqueued' && details) {
      parsedDetails.instruction = details.instruction || 'Unknown';
      parsedDetails.instructionId = details.instructionId || 'Unknown';
      parsedDetails.role = details.role || 'Unknown';
    } else {
      // Pour les autres types d'événements, inclure les détails tels quels
      parsedDetails.details = details || {};
    }

    return {
      timestamp,
      panelName: panelName || 'Unknown',
      eventType,
      details: parsedDetails,
    };
  };

  const exportToCSV = async () => {
    try {
      console.log('Exporting logs...');
      const response = await axios.get('https://panneauxloire.nantes.port.fr/api/logs/export', {
        responseType: 'blob', // Important pour gérer les données binaires
      });

      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'logs.csv');
    } catch (error) {
      console.error('Erreur lors de l\'exportation des journaux:', error);
      toast.error('Erreur lors de l\'exportation des journaux.');
    }
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

  const handleExportAndDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir exporter et supprimer tous les journaux ? Cette action est irréversible.')) {
      return;
    }

    setLoading(true);

    try {
      console.log('Exporting and deleting logs...');
      const response = await axios.get('https://panneauxloire.nantes.port.fr/api/logs/export-and-delete', {
        responseType: 'blob', // Important pour gérer les données binaires
        withCredentials: true, // Inclure les cookies
      });

      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'logs.csv');

      toast.success('Les journaux ont été exportés et supprimés avec succès.');

      // Rafraîchir les logs
      setPage(1);
      fetchLogs();
    } catch (error) {
      console.error('Erreur lors de l\'exportation et de la suppression des journaux:', error);
      toast.error('Erreur lors de l\'exportation et de la suppression des journaux.');
    } finally {
      setLoading(false);
    }
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

          </select>
          <button onClick={exportToCSV} className="export-button">
            Exporter CSV
          </button>
          <button onClick={handleExportAndDelete} className="export-delete-button">
            Exporter & Supprimer les Journaux
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

export default LogsPage;
