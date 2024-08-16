import React from 'react';
import './css/IPs.css'; // Usando o mesmo CSS de IPDetails

function ConfirmationPopup({ onConfirm, onCancel }) {
    return (
        <div className="confirmation-overlay active">
            <div className="confirmation-content">
                <p>Deseja mesmo sair?</p>
                <button onClick={onConfirm}>Sim</button>
                <button onClick={onCancel}>Cancelar</button>
            </div>
        </div>
    );
}

export default ConfirmationPopup;
