import React, { useEffect, useState, useCallback } from 'react';
import './css/TelegramSettings.css';
import axios from 'axios';

function TelegramSettingsPopup({ closePopup }) {
    const [people, setPeople] = useState([]);
    const [name, setName] = useState('');
    const [chatID, setChatID] = useState('');

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
            closePopup();
            popupOverlay.classList.remove('closing');
        }, 400);
    }, [closePopup]);

    useEffect(() => {
        const fetchPeople = async () => {
            try {
                const response = await axios.get('/api/telegram-people');
                setPeople(response.data);
            } catch (error) {
                console.error('Erro ao carregar pessoas:', error);
            }
        };

        fetchPeople();

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

    const handleAddPerson = async () => {
        try {
            const newPerson = { name, chatID };
            const response = await axios.post('/api/telegram-people', newPerson);
            setPeople([...people, response.data]);
            setName('');
            setChatID('');
        } catch (error) {
            console.error('Erro ao adicionar pessoa:', error);
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <button className="close-btn" onClick={handleClose}>×</button>
                <h2>Configurações do Telegram</h2>

                <div className="people-list">
                    {people.map(person => (
                        <div key={person.id} className="person-item">
                            <p>{person.name} - {person.chatID}</p>
                        </div>
                    ))}
                </div>

                <div className="add-person">
                    <input
                        type="text"
                        placeholder="Nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Chat ID"
                        value={chatID}
                        onChange={(e) => setChatID(e.target.value)}
                    />
                    <button onClick={handleAddPerson}>Adicionar</button>
                </div>
            </div>
        </div>
    );
}

export default TelegramSettingsPopup;
