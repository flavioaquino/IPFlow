import React, { useState } from 'react';
import './Reports.css';
import logo from '../assets/logo.png';
import Sidebar from '../components/Sidebar';
import SettingsPopup from '../components/SettingsPopup.js';
import AvailabilityHistoryReport from '../components/AvailabilityHistoryReport.js';
import OnlinePercentage from '../components/OnlinePercentage';

const Reports = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isSettingsOpen, setSettingsOpen] = useState(false);

    const toggleSidebar = () => {
        if (isSidebarOpen) {
            setIsClosing(true);
            setTimeout(() => {
                setSidebarOpen(false);
                setIsClosing(false);
            }, 300);
        } else {
            setSidebarOpen(true);
        }
    };

    const showSettings = () => {
        setSettingsOpen(true);
    };

    const closeSettings = () => {
        setSettingsOpen(false);
    };

    return (
        <div className="dashboard-reports">
            <div className="toolbar">
                <button onClick={toggleSidebar} className="menu-button">☰</button>
                <img src={logo} onClick={() => { window.location.href = '/' }} alt="Logo" />
                <div className="spacer"></div> 
            </div>
            <div className='history-report'>
                <AvailabilityHistoryReport />
            </div>
            <div className='basic-reports'>
                <div className='online-report'>
                    <OnlinePercentage />
                </div>
            </div>
            {isSidebarOpen && <Sidebar closeSidebar={toggleSidebar} showSettings={showSettings} isClosing={isClosing} />}
            {isSettingsOpen && <SettingsPopup closePopup={closeSettings} />}
        </div>
    );
};

export default Reports;
