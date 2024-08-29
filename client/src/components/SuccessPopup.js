import React, { useEffect } from 'react';
import './css/SuccessPopup.css';

function SuccessPopup({ message, onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000); // Esconde o popup após 3 segundos

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="success-popup">
            <p>{message}</p>
        </div>
    );
}

export default SuccessPopup;
