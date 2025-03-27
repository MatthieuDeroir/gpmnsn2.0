// In PanelControl.js or a separate file
const stateClassMap = {
    rebooting: 'rebooting',
    maintenance: 'maintenance',
    dysfunction: 'dysfunction',
    'door-open': 'door-open',
    off: 'dark',
    on: 'bright',
    default: 'not-connected',
  };
  
  const getClassByState = (panelInfo, isRebooting) => {
    if (isRebooting) return stateClassMap.rebooting;
    if (panelInfo.maintenanceMode) return stateClassMap.maintenance;
    if (!panelInfo.connected || !panelInfo.sectorStatus) return stateClassMap.dysfunction;
    if (panelInfo.isDoorOpen) return stateClassMap['door-open'];
    if (panelInfo.state === 'off') return stateClassMap.off;
    if (panelInfo.state === 'on') return stateClassMap.on;
    return stateClassMap.default;
  };
  