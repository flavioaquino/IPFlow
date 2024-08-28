const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const fs = require('fs');
const ping = require('ping');
const sendTelegramMessage = require('./telegramNotifier');

const app = express();
const port = process.env.PORT || 5000;

let cronTime = '*/1 * * * *'; // Valor padrão

if (!fs.existsSync("./database.db")) {
    console.log('Banco de dados não encontrado. Inicializando...');
    require('./startBD/initDatabase');
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

db.get('SELECT cron_time FROM settings ORDER BY id DESC LIMIT 1', [], (err, row) => {
    if (row && row.cron_time) {
        cronTime = row.cron_time;
    }
    scheduleCronJob(cronTime);
});

const formatDateWithTimezone = (dateString) => {
    const date = new Date(dateString);
    const adjustedDate = new Date(date.getTime() - (3 * 60 * 60 * 1000));
    return adjustedDate.toISOString().replace('T', ' ').substring(0, 19);
};

function scheduleCronJob(cronTime) {
    const cron = require('node-cron');

    cron.schedule(cronTime, () => {
        db.all('SELECT * FROM ips', [], (err, rows) => {
            if (err) {
                console.error('Erro ao buscar IPs:', err.message);
                return;
            }
            rows.forEach(row => {
                monitorIP(row.address, (status, isAlive) => {
                    const sql = `UPDATE ips SET status = ?, ${isAlive ? 'last_seen = ?' : 'last_seen = last_seen'} WHERE id = ?`;
                    var now = new Date().toLocaleString();
                    db.run(sql, [status, ...(isAlive ? [now] : []), row.id], function(err) {
                        if (err) {
                            console.error(`Erro ao atualizar status do IP ${row.address}:`, err.message);
                        } else {
                            console.log(`IP ${row.address} está ${status}`);
                        }
                    });
                });
            });
        });
    });
}

function monitorIP(address, callback) {
    db.get('SELECT status, name FROM ips WHERE address = ?', [address], (err, row) => {
        if (err) {
            console.error('Erro ao buscar status do IP:', err.message);
            return;
        }

        ping.sys.probe(address, function(isAlive) {
            const status = isAlive ? 'online' : 'offline';

            if (row && row.status === 'online' && status === 'offline') {
                db.all('SELECT user_key FROM alert_settings WHERE type = 1', [], (err, rows) => {
                    if (err) {
                        console.error('Erro ao buscar configurações de alerta:', err.message);
                        return;
                    }
                    rows.forEach(alertRow => {
                        sendTelegramMessage(alertRow.user_key, `A câmera ${row.name} (IP ${address}) ficou offline.`);
                    });
                });
            }

            callback(status, isAlive);
        });
    });
}

function checkIP(id, address) {
    monitorIP(address, (status, isAlive) => {
        const sql = `UPDATE ips SET status = ?, ${isAlive ? 'last_seen = ?' : 'last_seen = last_seen'} WHERE id = ?`;
        var now = new Date().toLocaleString();
        db.run(sql, [status, ...(isAlive ? [now] : []), id], function(err) {
            if (err) {
                console.error(`Erro ao atualizar status do IP ${address}:`, err.message);
            } else {
                console.log(`IP ${address} está ${status}`);
            }
        });
    });
}

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
        const updatedRows = rows.map(row => {
            return {
                ...row,
                created_at: formatDateWithTimezone(row.created_at),
                last_seen: row.status === 'online' ? null : row.last_seen
            };
        });
        res.json(updatedRows);
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
        const updatedRow = {
            ...row,
            created_at: formatDateWithTimezone(row.created_at)
        };
        res.json(updatedRow);
    });
});

app.post('/ips', (req, res) => {
    const { address, name, description } = req.body;

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
        const newIPId = this.lastID;
        res.status(201).json({ id: newIPId, address });

        // Verifique o IP imediatamente após a inserção
        checkIP(newIPId, address);
    });
});

app.put('/ips/:id', (req, res) => {
    const { id } = req.params;
    const { name, address, description } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'ID do IP é obrigatório' });
    }

    if (!name || !address) {
        return res.status(400).json({ error: 'Nome e endereço IP são obrigatórios' });
    }

    const sql = `UPDATE ips 
                 SET name = ?, address = ?, description = ?
                 WHERE id = ?`;

    const params = [name, address, description, id];

    db.run(sql, params, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        if (this.changes === 0) {
            res.status(404).json({ error: 'IP não encontrado' });
            return;
        }

        res.json({ message: 'IP atualizado com sucesso' });
    });
});

app.delete('/ips/:id', (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'ID do IP é obrigatório' });
    }

    const sql = 'DELETE FROM ips WHERE id = ?';

    db.run(sql, id, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        if (this.changes === 0) {
            res.status(404).json({ error: 'IP não encontrado' });
            return;
        }

        res.json({ message: 'IP excluído com sucesso' });
    });
});

app.post('/monitor', (req, res) => {
    db.all('SELECT * FROM ips', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        rows.forEach(row => {
            monitorIP(row.address, (status, isAlive) => {
                const sql = `UPDATE ips SET status = ? WHERE id = ?`;
                db.run(sql, [status, row.id], function(err) {
                    if (err) {
                        console.error(`Erro ao atualizar status do IP ${row.address}:`, err.message);
                    } else {
                        console.log(`IP ${row.address} está ${status}`);
                    }
                });
            });
        });

        res.json({ message: 'Monitoramento iniciado' });
    });
});

app.post('/settings', (req, res) => {
    const { cron_time } = req.body;

    if (!cron_time) {
        return res.status(400).json({ error: 'O tempo do cron é obrigatório' });
    }

    const sql = `INSERT INTO settings (cron_time) VALUES (?)`;
    db.run(sql, [cron_time], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, cron_time });
    });
});

app.get('/settings', (req, res) => {
    db.get('SELECT cron_time FROM settings ORDER BY id DESC LIMIT 1', [], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(row);
    });
});

// Rota para listar todas as pessoas
app.get('/telegram-people', (req, res) => {
    db.all('SELECT * FROM alert_settings', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Rota para adicionar uma nova pessoa
app.post('/telegram-people', (req, res) => {
    const { name, chatID } = req.body;

    if (!name || !chatID) {
        return res.status(400).json({ error: 'Nome e Chat ID são obrigatórios' });
    }

    const sql = 'INSERT INTO alert_settings (name, type, user_key) VALUES (?, ?, ?)';
    const params = [name, 1, chatID];

    db.run(sql, params, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, name, chatID });
    });
});

// Rota para excluir uma pessoa
app.delete('/telegram-people/:id', (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'ID é obrigatório' });
    }

    const sql = 'DELETE FROM alert_settings WHERE id = ?';

    db.run(sql, id, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Pessoa não encontrada' });
        }

        res.json({ message: 'Pessoa excluída com sucesso' });
    });
});