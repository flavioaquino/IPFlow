import React, { useEffect, useState, useCallback } from 'react';
import './css/Settings.css';
import TelegramSettingsPopup from './TelegramSettingsPopup';
import SystemSettingsPopup from './SystemSettingsPopup';

function SettingsPopup({ closePopup }) {
    const [showTelegramSettings, setShowTelegramSettings] = useState(false);
    const [showSystemSettings, setShowSystemSettings] = useState(false);

    useEffect(() => {
        const popupOverlay = document.querySelector('.popup-overlay');
        popupOverlay.classList.add('active');

        return () => {
            popupOverlay.classList.remove('active');
        };
    }, []);

    const handleOpenTelegramSettings = () => {
        const popupOverlay = document.querySelector('.popup-overlay');
        popupOverlay.classList.add('closing');
        
        setTimeout(() => {
            setShowTelegramSettings(true);
            popupOverlay.classList.remove('closing');
        }, 400);
    };

    const handleOpenSystemSettings = () => {
        const popupOverlay = document.querySelector('.popup-overlay');
        popupOverlay.classList.add('closing');
        
        setTimeout(() => {
            setShowSystemSettings(true);
            popupOverlay.classList.remove('closing');
        }, 400);
    };

    const handleClose = useCallback(() => {
        const popupOverlay = document.querySelector('.popup-overlay');
        popupOverlay.classList.add('closing');

        setTimeout(() => {
            closePopup();
            popupOverlay.classList.remove('closing');
        }, 400);
    }, [closePopup]);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (event.target.classList.contains('popup-overlay')) {
                handleClose();
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [handleClose]);

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                {showTelegramSettings ? (
                    <TelegramSettingsPopup closePopup={() => setShowTelegramSettings(false)} />
                ) : showSystemSettings ? (
                    <SystemSettingsPopup closePopup={() => setShowSystemSettings(false)} />
                ) : (
                    <>
                        <button className="close-btn" onClick={handleClose}>×</button>
                        <h2>Configurações</h2>
                        <button className="settings-btn" onClick={handleOpenSystemSettings}>Configurações do Sistema</button>
                        <button className="settings-btn" onClick={handleOpenTelegramSettings}>Configurações do Telegram</button>
                        <button className="settings-btn">Configurações do WhatsApp</button>
                    </>
                )}
            </div>
        </div>
    );
}

export default SettingsPopup;
