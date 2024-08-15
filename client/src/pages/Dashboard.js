import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import logo from '../assets/logo.png';

const Dashboard = () => {
    const [ips, setIps] = useState([]);

    useEffect(() => {
        fetch('/api/ips')
            .then(response => response.json())
            .then(data => setIps(data))
            .catch(error => console.error('Erro ao buscar IPs:', error));
    }, []);

    return (
        <div className="dashboard">
            <div className="toolbar">
                <button>Inserir IP</button>
                <img src={logo} style={{ width: '60px' }} alt="Logo" />
                <button>Realizar Teste</button>
            </div>
            <div className="ip-container">
                <div className="ip-grid">
                    {ips.map(ip => (
                        <div key={ip.id} className={`ip-card ${ip.online ? 'online' : 'offline'}`}>
                            <p><strong>Nome:</strong> {ip.name}</p>
                            <p><strong>IP:</strong> {ip.address}</p>
                            <p>{ip.online ? 'Online' : `Offline, visto por último: ${ip.last_seen}`}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;