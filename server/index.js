const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Conectando ao banco de dados SQLite
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados SQLite3:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite3');
    }
});

app.get('/', (req, res) => {
    res.send('API is running');
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

app.get('/api/ips', (req, res) => {
    // Buscando os IPs armazenados no SQLite3
    db.all('SELECT * FROM ips', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/ips', (req, res) => {
    const { address } = req.body;
    if (!address) {
        return res.status(400).json({ error: 'Endereço IP é obrigatório' });
    }

    const sql = 'INSERT INTO ips (address) VALUES (?)';
    const params = [address];

    db.run(sql, params, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID, address });
    });
});
