import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import logo from '../assets/logo.png';
import IPAdd from '../components/IPAdd';
import IPDetails from '../components/IPDetails';
import Sidebar from '../components/Sidebar';
import SettingsPopup from '../components/SettingsPopup.js';

const Dashboard = () => {
    const [ips, setIps] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedIpId, setSelectedIpId] = useState(null);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isSettingsOpen, setSettingsOpen] = useState(false);
    
    const toggleSidebar = () => {
        if (isSidebarOpen) {
            setIsClosing(true);
            setTimeout(() => {
                setSidebarOpen(false);
                setIsClosing(false);
            }, 300); // Tempo de animação de saída
        } else {
            setSidebarOpen(true);
        }
    };

    const showSettings = () => {
        setSettingsOpen(true);
        //toggleSidebar(); // Fecha a sidebar ao abrir o popup de configurações
    };

    const closeSettings = () => {
        setSettingsOpen(false);
    };

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
        
        // Configura a atualização automática a cada 10 segundos (ajuste conforme necessário)
        const interval = setInterval(fetchIps, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleIpAdd = () => {
        fetchIps();
    };
    
    return (
        <div className="dashboard">
            <div className="toolbar">
                <button onClick={toggleSidebar} className="menu-button">☰</button>
                <img src={logo} onClick={fetchIps} alt="Logo" />
                <div className="toolbar-buttons">
                    <button onClick={togglePopup} className='toolbar-button'>Inserir IP</button>
                </div>
            </div>
            {isSidebarOpen && <Sidebar closeSidebar={toggleSidebar} showSettings={showSettings} isClosing={isClosing} />}
            <div className="ip-container">
                <div className="ip-grid">
                    {ips.map(ip => (
                        <div
                            key={ip.id}
                            className={`ip-card ${ip.status === 'online' ? 'online' : 'offline'}`}
                            onClick={() => toggleDetails(ip.id)}
                        >
                            <p><strong>{ip.name}</strong></p>
                            <p><strong>IP:</strong> {ip.address}</p>
                            {ip.status === 'online' ? (
                                <p>Online</p>
                            ) : (
                                <p>Offline, visto por último: {ip.last_seen ? ip.last_seen : 'Nunca'}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            {showPopup && <IPAdd closePopup={() => setShowPopup(false)} onIpAdded={handleIpAdd} />}
            {showDetails && <IPDetails closePopup={() => setShowDetails(false)} ipId={selectedIpId} onIpChanged={handleIpAdd} />}
            {isSettingsOpen && <SettingsPopup closePopup={closeSettings} />}
        </div>
    );
};

export default Dashboard;
