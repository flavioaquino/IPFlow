import React, { useEffect, useState } from 'react';
import './css/IPAdd.css';
import axios from 'axios';

function IPAdd({ closePopup, onIpAdded }) {
  const [name, setName] = useState('');
  const [ip, setIp] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const popupOverlay = document.querySelector('.popup-overlay');
    popupOverlay.classList.add('active');

    return () => {
      popupOverlay.classList.remove('active');
    };
  }, []);

  const handleClose = () => {
    const popupOverlay = document.querySelector('.popup-overlay');
    popupOverlay.classList.add('closing');
    
    setTimeout(() => {
      closePopup();
      popupOverlay.classList.remove('closing');
    }, 400);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/ips', {
        name,
        address: ip,
        description
      });
      onIpAdded();  // Atualiza a lista de IPs no componente pai
      handleClose(); // Fecha o popup
    } catch (error) {
      console.error('Erro ao adicionar IP:', error);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={handleClose}>×</button>
        <h2>Inserir IP</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="name"
            placeholder='Nome'
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            id="ip"
            placeholder='IP'
            name="ip"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
          />
          <input
            type="text"
            id="description"
            placeholder='Descrição (Opcional)'
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit">Adicionar</button>
        </form>
      </div>
    </div>
  );
}

export default IPAdd;
