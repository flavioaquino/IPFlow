import React, { useEffect, useState, useCallback } from 'react';
import './css/TelegramSettings.css';
import axios from 'axios';

function TelegramSettingsPopup({ closePopup }) {
    const [people, setPeople] = useState([]);
    const [name, setName] = useState('');
    const [chatID, setChatID] = useState('');

    useEffect(() => {
        const popupOverlay = document.querySelector('.telegram-popup-overlay');
        popupOverlay.classList.add('active');

        return () => {
            popupOverlay.classList.remove('active');
        };
    }, []);

    const handleClose = useCallback(() => {
        const popupOverlay = document.querySelector('.telegram-popup-overlay');
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
            if (event.target.classList.contains('telegram-popup-overlay')) {
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

    const handleDeletePerson = async (id) => {
        try {
            await axios.delete(`/api/telegram-people/${id}`);
            setPeople(people.filter(person => person.id !== id));
        } catch (error) {
            console.error('Erro ao excluir pessoa:', error);
        }
    };

    return (
        <div className="telegram-popup-overlay">
            <div className="telegram-popup-content">
                <button className="telegram-close-btn" onClick={handleClose}>×</button>
                <h2>Configurações do Telegram</h2>

                <div className="telegram-people-list">
                    {people.map(person => (
                        <div key={person.id} className="telegram-person-item">
                            <p>{person.name} - {person.user_key}</p>
                            <button onClick={() => handleDeletePerson(person.id)}>Excluir</button>
                        </div>
                    ))}
                </div>

                <div className="telegram-add-person">
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
