const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS ips (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            address TEXT NOT NULL,
            last_seen datetime,
            description TEXT,
            status TEXT NOT NULL DEFAULT 'offline',
            created_at date NOT NULL DEFAULT (datetime('now'))
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cron_time TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS alert_settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            type integer,
            userID varchar(255)
        );
    `);

    console.log('Banco de dados SQLite inicializado com sucesso!');
});

db.close();