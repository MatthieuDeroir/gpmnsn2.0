// src/utils/messageUtils.js
import websocketClient from './websocketClient';

export const sendInstructionMessage = ({
  instruction,
  to = 'panel',
  name = 'all',
  role,
  heartbeatTimer,
}) => {
  const message = {
    type: 'instruction',
    to,
    name,
    from: role,
    role: role,
    instruction,
    heartbeatTimer,
  };
  websocketClient.sendMessage(message);
};

export const sendRebootMessage = ({
  to = 'panel',
  name = 'all',
  role,
  heartbeatTimer,
}) => {
  const message = {
    type: 'reboot',
    to,
    name,
    from: role,
    heartbeatTimer,
  };
  websocketClient.sendMessage(message);
};

export const sendRefreshMessage = ({
  to = 'panel',
  name = 'all',
  role,
  heartbeatTimer,
}) => {
  const message = {
    type: 'refresh',
    to,
    name,
    from: role,
    heartbeatTimer,
  };
  websocketClient.sendMessage(message);
};
