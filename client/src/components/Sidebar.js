import React, { useEffect } from 'react';
import './css/Sidebar.css';

function Sidebar({ closeSidebar, showSettings, isClosing }) {
    useEffect(() => {
        const sidebarOverlay = document.querySelector('.sidebar-overlay');
        sidebarOverlay.classList.add('active');

        return () => {
            sidebarOverlay.classList.remove('active');
        };
    }, []);

    const handleClose = () => {
        closeSidebar();
    };

    const handleOutsideClick = (event) => {
        if (event.target.classList.contains('sidebar-overlay')) {
            handleClose();
        }
    };

    return (
        <div className={`sidebar-overlay ${isClosing ? 'closing' : ''}`} onClick={handleOutsideClick}>
            <div className={`sidebar ${isClosing ? 'closing' : ''}`}>
                <button onClick={handleClose} className="close-sidebar">X</button>
                <button onClick={() => window.location.href = '/reports'}>Relatórios</button>
                <button onClick={showSettings}>Configurações</button>
            </div>
        </div>
    );
}

export default Sidebar;
