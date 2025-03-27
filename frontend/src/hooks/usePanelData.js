// src/hooks/usePanelData.js
import { useState, useEffect } from 'react';
import websocketClient from '../utils/websocketClient';

const usePanelData = (name) => {
  const [panelInfo, setPanelInfo] = useState({});
  const [logs, setLogs] = useState([]);
  const [isAnyPanelInDysfunction, setIsAnyPanelInDysfunction] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleStatusUpdate = (panelStatus) => {
      if (panelStatus && panelStatus[name]) {
        setPanelInfo({ ...panelStatus[name] });
      } else {
        console.warn(`Panel info for ${name} not found in panelStatus.`);
      }

      // Define the panel names to check for dysfunction
      const panelNames = ['aval', 'amont', 'indret'];

      // Determine if any of the specified panels are in dysfunction
      const anyPanelInDysfunction = panelNames.some((panelName) => {
        const panel = panelStatus[panelName];
        // console.log(panel)

        return !panel || !panel.connected || !panel.sectorStatus;
      });

      setIsAnyPanelInDysfunction(anyPanelInDysfunction);
      setIsLoading(false);
    };

    const handleLogsUpdate = (updatedLogs) => {
      setLogs(updatedLogs[name] || []);
    };

    websocketClient.addStatusListener(handleStatusUpdate);
    websocketClient.addLogsListener(handleLogsUpdate);
    websocketClient.fetchLogsForPanel(name);

    return () => {
      websocketClient.removeStatusListener(handleStatusUpdate);
      websocketClient.removeLogsListener(handleLogsUpdate);
    };
  }, [name]);

  return { panelInfo, logs, isAnyPanelInDysfunction, isLoading };
};

export default usePanelData;
