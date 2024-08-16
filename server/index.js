const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5000;

const dbPath = './database.db';

if (!fs.existsSync(dbPath)) {
    console.log('Banco de dados não encontrado. Inicializando...');
    require('./initDatabase');
}

app.use(cors());
app.use(express.json());

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

app.get('/ips', (req, res) => {
    db.all('SELECT * FROM ips', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/ips/:id', (req, res) => {
    const { id } = req.params;

    db.get('SELECT * FROM ips WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'IP não encontrado' });
            return;
        }
        res.json(row);
    });
});

app.post('/ips', (req, res) => {
    const { address } = req.body;
    const { name } = req.body;
    const { description } = req.body;

    if (!address) {
        return res.status(400).json({ error: 'Endereço IP é obrigatório' });
    } else if (!name) {
        return res.status(400).json({ error: 'Nome é obrigatório' });
    }

    const sql = 'INSERT INTO ips (name, address, description) VALUES (?, ?, ?)';
    const params = [name, address, description];

    db.run(sql, params, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID, address });
    });
});
