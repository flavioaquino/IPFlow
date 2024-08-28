import React, { useEffect, useState, useCallback } from 'react';
import './css/Settings.css';
import axios from 'axios';
import TelegramSettingsPopup from './TelegramSettingsPopup';

function SettingsPopup({ closePopup }) {
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [telegramNumber, setTelegramNumber] = useState('');
    const [showTelegramSettings, setShowTelegramSettings] = useState(false);

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
        }, 400); // 400ms para sincronizar com a animação de fechamento
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/settings', {
                whatsappNumber,
                telegramNumber
            });
            handleClose();
        } catch (error) {
            console.error('Erro ao salvar as configurações:', error);
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                {showTelegramSettings ? (
                    <TelegramSettingsPopup closePopup={() => setShowTelegramSettings(false)} />
                ) : (
                    <>
                        <button className="close-btn" onClick={handleClose}>×</button>
                        <h2>Configurações de Alertas</h2>
                        <button className="settings-btn" onClick={handleOpenTelegramSettings}>Configurações do Telegram</button><br></br>
                        <button className="settings-btn">Configurações do WhatsApp</button>
                    </>
                )}
            </div>
        </div>
    );
}

export default SettingsPopup;
