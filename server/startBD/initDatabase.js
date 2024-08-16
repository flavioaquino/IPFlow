const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS ips (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            address TEXT NOT NULL,
            last_seen date,
            description TEXT,
            created_at date NOT NULL DEFAULT (date('now'))
        )
    `);

    console.log('Banco de dados SQLite inicializado com sucesso!');
});

db.close();