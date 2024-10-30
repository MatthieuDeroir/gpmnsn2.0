// src/utils/logUtils.js
export const parseLogEntry = (log) => {
    if (!log || typeof log !== 'string') {
      return {
        timestamp: 'Invalid',
        identifier: 'Unknown',
        event: 'Unknown',
        details: {},
      };
    }
  
    const [timestamp, identifier, event, ...rest] = log.split(',');
  
    const details = rest
      .join(',')
      .split(',')
      .reduce((acc, keyValuePair) => {
        const [key, value] = keyValuePair.split('=');
        acc[key.trim()] = value ? value.trim() : 'Unknown';
        return acc;
      }, {});
  
    return {
      timestamp,
      event,
      details,
    };
  };
  
  export const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    return new Intl.DateTimeFormat('fr-FR', options).format(new Date(dateString));
  };
  