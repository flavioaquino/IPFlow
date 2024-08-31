import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import './css/OnlinePercentage.css';

Chart.register(ArcElement, Tooltip, Legend);

const OnlinePercentage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/reports/online-percentage')
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Erro ao carregar dados de porcentagem de IPs online/offline', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (!data) {
        return <div>Não foi possível carregar os dados</div>;
    }

    const chartData = {
        labels: ['Online', 'Offline'],
        datasets: [
            {
                data: [data.online, data.offline],
                backgroundColor: ['#00BF63', '#FF3131'],
                hoverBackgroundColor: ['#00BF63', '#FF3131'],
            },
        ],
    };

    return (
        <div className='percentage'>
            <h2>Porcentagem de IPs Online/Offline</h2>
            <Pie data={chartData} />
        </div>
    );
};

export default OnlinePercentage;
