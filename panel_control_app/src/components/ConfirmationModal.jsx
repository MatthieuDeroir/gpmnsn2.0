import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ show, onConfirm, onCancel, message }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 style={{color: 'black'}}>Confirmation</h2>
        <p style={{color: 'black'}}>{message}</p>
        <div className="modal-buttons">
          <button className="btn-modal btn-confirm" onClick={onConfirm}>Confirm</button>
          <button className="btn-modal btn-cancel" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
