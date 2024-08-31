import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/AvailabilityHistoryReport.css';

const AvailabilityHistoryReport = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('api/report/availability-history')
            .then(response => setData(response.data))
            .catch(error => console.error('Erro ao buscar dados:', error));
    }, []);

    return (
        <div className="history">
            <h2>Histórico de Disponibilidade de IPs</h2>
            <table>
                <thead>
                    <tr>
                        <th>IP</th>
                        <th>Nome</th>
                        <th>Status</th>
                        <th>Última Vez Visto</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            <td>{row.address}</td>
                            <td>{row.name}</td>
                            <td style={{ textTransform: 'capitalize' }}>{row.status}</td>
                            <td>{row.last_seen ? row.last_seen : "Nunca ficou online."}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AvailabilityHistoryReport;