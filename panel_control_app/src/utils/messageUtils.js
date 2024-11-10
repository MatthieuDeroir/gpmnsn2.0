// src/utils/messageUtils.js

import { store } from '../stores/store';

export const sendInstructionMessage = ({ instruction, role, name = "all", heartbeatTimer }) => {
  const { websocket } = store.getState();
  const { socket } = websocket;
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(
        JSON.stringify({
          type: 'instruction',
          to: 'panel',
          role,
          name,
          instruction,
          heartbeatTimer,
        })
    );
  }
};

// Add other message utilities as needed
