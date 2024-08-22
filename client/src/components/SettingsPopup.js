import React, { useEffect, useState, useCallback } from 'react';
import './css/Settings.css'; // Supondo que o arquivo CSS seja diferente
import axios from 'axios';

function SettingsPopup({ closePopup }) {  // Ajuste o nome da prop para closePopup
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [telegramNumber, setTelegramNumber] = useState('');

    useEffect(() => {
        const popupOverlay = document.querySelector('.popup-overlay');
        popupOverlay.classList.add('active');

        return () => {
            popupOverlay.classList.remove('active');
        };
    }, []);

    const handleClose = useCallback(() => {
        const popupOverlay = document.querySelector('.popup-overlay');
        popupOverlay.classList.add('closing');

        setTimeout(() => {
            closePopup();  // Use closePopup em vez de closeSettings
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
                <button className="close-btn" onClick={handleClose}>×</button>
                <h2>Configurações de Alertas</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        id="whatsapp"
                        placeholder='Número do WhatsApp'
                        name="whatsapp"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                    />
                    <input
                        type="text"
                        id="telegram"
                        placeholder='Número do Telegram'
                        name="telegram"
                        value={telegramNumber}
                        onChange={(e) => setTelegramNumber(e.target.value)}
                    />
                    <button type="submit">Salvar</button>
                </form>
            </div>
        </div>
    );
}

export default SettingsPopup;
