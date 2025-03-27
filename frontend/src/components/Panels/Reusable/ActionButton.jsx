// src/components/ActionButton.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './ActionButton.css'; // Créez ce fichier pour les styles spécifiques

const ActionButton = React.memo(({ 
  onClick, 
  label, 
  icon, 
  colorClass, 
  isBlinking 
}) => (
  <button 
    className={`action-btn ${colorClass} ${isBlinking ? 'blinking' : ''}`}
    onClick={onClick}
    aria-label={label}
  >
    <span className="material-icons">{icon}</span>
    {label}
  </button>
));

ActionButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  colorClass: PropTypes.string.isRequired,
  isBlinking: PropTypes.bool,
};

ActionButton.defaultProps = {
  isBlinking: false,
};

export default ActionButton;
