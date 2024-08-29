import React, { useState, useEffect, useCallback } from 'react';
import './css/SystemSettings.css';
import axios from 'axios';
import SuccessPopup from './SuccessPopup';

function SystemSettingsPopup({ closePopup }) {
    const [cronTime, setCronTime] = useState('');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    useEffect(() => {
        const fetchCronTime = async () => {
            try {
                const response = await axios.get('/api/settings');
                setCronTime(response.data.cron_time);
            } catch (error) {
                console.error('Erro ao carregar cron time:', error);
            }
        };

        fetchCronTime();

        const popupOverlay = document.querySelector('.system-popup-overlay');
        popupOverlay.classList.add('active');

        return () => {
            popupOverlay.classList.remove('active');
        };
    }, []);

    const handleSave = async () => {
        try {
            await axios.post('/api/settings', { cron_time: cronTime });
            setShowSuccessPopup(true); // Exibe o popup de sucesso
            setTimeout(() => setShowSuccessPopup(false), 3000); // Esconde o popup após 3 segundos
        } catch (error) {
            console.error('Erro ao salvar cron time:', error);
        }
    };

    const handleClose = useCallback(() => {
        const popupOverlay = document.querySelector('.system-popup-overlay');
        popupOverlay.classList.add('closing');

        setTimeout(() => {
            closePopup();
            popupOverlay.classList.remove('closing');
        }, 400);
    }, [closePopup]);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (event.target.classList.contains('system-popup-overlay')) {
                handleClose();
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [handleClose]);

    return (
        <>
            <div className="system-popup-overlay">
                <div className="system-popup-content">
                    <button className="system-close-btn" onClick={handleClose}>×</button>
                    <h2>Configurações do Sistema</h2>
                    <div className="system-settings-field">
                        <p>Timing para reconsultar IPs:</p>
                        <input
                            className="system-set-timer"
                            type="number"
                            value={cronTime}
                            onChange={(e) => setCronTime(e.target.value)}
                        /><a> Segundos</a>
                    </div>
                    <button onClick={handleSave}>Salvar</button>
                </div>
            </div>
            {showSuccessPopup && <SuccessPopup message="Salvo com sucesso!" onClose={() => setShowSuccessPopup(false)} />}
        </>
    );
}

export default SystemSettingsPopup;
