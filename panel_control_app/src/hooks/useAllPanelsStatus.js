// src/hooks/useAllPanelsStatus.js
import { useState, useEffect } from 'react';
import websocketClient from '../utils/websocketClient';

const useAllPanelsStatus = () => {
  const [panelStatus, setPanelStatus] = useState({});
  const [isAnyPanelInDysfunction, setIsAnyPanelInDysfunction] = useState(false);

  useEffect(() => {
    const handleStatusUpdate = (updatedPanelStatus, dysfunctionStatus) => {
      console.log('--- handleStatusUpdate ---');
      console.log('updatedPanelStatus:', updatedPanelStatus);
      console.log('dysfunctionStatus:', dysfunctionStatus);

      // Extraire uniquement les panneaux 'aval', 'amont', 'indret'
      const relevantPanels = ['aval', 'amont', 'indret'];
      const filteredPanelStatus = {};

      relevantPanels.forEach(panelName => {
        if (updatedPanelStatus && updatedPanelStatus[panelName]) {
          filteredPanelStatus[panelName] = updatedPanelStatus[panelName];
        } else {
          console.warn(`Panel info for ${panelName} not found in updatedPanelStatus.`);
          filteredPanelStatus[panelName] = {}; // Ou une valeur par défaut
        }
      });

      setPanelStatus(filteredPanelStatus);
      setIsAnyPanelInDysfunction(dysfunctionStatus || false);
    };

    websocketClient.addStatusListener(handleStatusUpdate);

    return () => {
      websocketClient.removeStatusListener(handleStatusUpdate);
    };
  }, []);

  return { panelStatus, isAnyPanelInDysfunction };
};

export default useAllPanelsStatus;
