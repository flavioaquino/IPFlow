import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [ips, setIps] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/ips')
            .then(response => setIps(response.data))
            .catch(error => console.log(error));
    }, []);

    return (
        <div>
            <h1>IP Control Dashboard</h1>
            <ul>
                {ips.map(ip => (
                    <li key={ip.id}>{ip.address}</li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard;
