import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import logo from '../assets/logo.png';
import IPAdd from '../components/IPAdd';
import IPDetails from '../components/IPDetails';

const Dashboard = () => {
    const [ips, setIps] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedIpId, setSelectedIpId] = useState(null);

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const toggleDetails = (id) => {
        setSelectedIpId(id);
        setShowDetails(true); // Sempre abre o popup de detalhes
    };

    const fetchIps = () => {
        fetch('/api/ips')
            .then(response => response.json())
            .then(data => setIps(data))
            .catch(error => console.error('Erro ao buscar IPs:', error));
    };

    useEffect(() => {
        fetchIps();
    }, []);

    const handleIpAdd = () => {
        fetchIps();
    };

    return (
        <div className="dashboard">
            <div className="toolbar">
                <button onClick={togglePopup}>Inserir IP</button>
                <img src={logo} onClick={fetchIps} style={{ cursor: "pointer", width: '60px' }} alt="Logo" />
                <button>Realizar Teste</button>
            </div>
            <div className="ip-container">
                <div className="ip-grid">
                    {ips.map(ip => (
                        <div 
                            key={ip.id} 
                            className={`ip-card ${ip.online ? 'online' : 'offline'}`} 
                            onClick={() => toggleDetails(ip.id)}
                        >
                            <p><strong>Nome:</strong> {ip.name}</p>
                            <p><strong>IP:</strong> {ip.address}</p>
                            <p>{ip.online ? 'Online' : `Offline, visto por último: ${ip.last_seen}`}</p>
                        </div>
                    ))}
                </div>
            </div>
            {showPopup && <IPAdd closePopup={() => setShowPopup(false)} onIpAdded={handleIpAdd} />}
            {showDetails && <IPDetails closePopup={() => setShowDetails(false)} ipId={selectedIpId} />}
        </div>
    );
};

export default Dashboard;
