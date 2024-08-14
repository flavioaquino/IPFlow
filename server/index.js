const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost/ipcontrol', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('API is running');
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

app.get('/api/ips', (req, res) => {
    // Simulação de dados; substitua pela busca no MongoDB.
    const ips = [
        { id: 1, address: '192.168.0.1' },
        { id: 2, address: '192.168.0.2' },
    ];
    res.json(ips);
});
