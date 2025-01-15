// src/components/Button.jsx

import React, { useState, useEffect } from 'react';
import './Button.css'; // Importation du CSS spécifique au bouton

const Button = ({ children, className, onClick, disabled }) => {
  const [ripple, setRipple] = useState(null);

  const handleClick = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();

    // Calculer la taille et la position de la goutte d'eau
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = {
      x,
      y,
      size,
    };

    setRipple(newRipple);

    if (onClick) {
      onClick(e);
    }
  };

  useEffect(() => {
    if (ripple) {
      // Supprimer la goutte d'eau après l'animation
      const timeout = setTimeout(() => {
        setRipple(null);
      }, 600); // Durée de l'animation
      return () => clearTimeout(timeout);
    }
  }, [ripple]);

  return (
    <button
      className={`all-panel-btn ${className}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
      {ripple && (
        <span
          className="ripple"
          style={{
            top: ripple.y,
            left: ripple.x,
            width: ripple.size,
            height: ripple.size,
          }}
        ></span>
      )}
    </button>
  );
};

export default Button;
