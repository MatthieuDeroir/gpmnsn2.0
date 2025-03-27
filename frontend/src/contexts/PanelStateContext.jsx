import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWebSocket } from './WebSocketContext';

const PanelStateContext = createContext(null);

export const PanelStateProvider = ({ children }) => {
  const { socket, panelStatus } = useWebSocket();
  const [panels, setPanels] = useState({});

  useEffect(() => {
    if (socket) {
      socket.onmessage = (message) => {
        const data = JSON.parse(message.data);
        console.log(data)
        if (data.type === "panel_update") {
          setPanels(prevPanels => ({
            ...prevPanels,
            [data.name]: {
              ...prevPanels[data.name],
              ...data.details
            }
          }));
        }
      };
    }
  }, [socket]);

  return (
    <PanelStateContext.Provider value={{ panels, setPanels }}>
      {children}
    </PanelStateContext.Provider>
  );
};

export const usePanelState = () => useContext(PanelStateContext);
