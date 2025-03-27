// src/components/ConfirmationModal.jsx
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './ConfirmationModal.css';

const ConfirmationModal = ({ show, onConfirm, onCancel, message }) => {
  useEffect(() => {
    if (show) {
      // Gérer le focus pour l'accessibilité
      const handleEsc = (event) => {
        if (event.key === 'Escape') {
          onCancel();
        }
      };
      document.addEventListener('keydown', handleEsc);
      return () => {
        document.removeEventListener('keydown', handleEsc);
      };
    }
  }, [show, onCancel]);

  if (!show) return null;

  return ReactDOM.createPortal(
    <div 
      className="confirmation-modal-overlay" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="modal-title"
      onClick={onCancel} // Fermer le modal en cliquant en dehors
    >
      <div 
        className="confirmation-modal-content" 
        onClick={(e) => e.stopPropagation()} // Empêcher la propagation du clic
      >
        <h2 id="modal-title">Confirmation</h2>
        <p>{message}</p>
        <div className="confirmation-modal-buttons">
          <button onClick={onConfirm} className="confirm-button">Confirmer</button>
          <button onClick={onCancel} className="cancel-button">Annuler</button>
        </div>
      </div>
    </div>,
    document.body
  );
};

ConfirmationModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};

export default React.memo(ConfirmationModal);
