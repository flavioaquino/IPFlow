const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
    // Criando a tabela 'ips' se não existir
    db.run(`
        CREATE TABLE IF NOT EXISTS ips (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            created_at date NOT NULL,
            last_seen date NOT NULL,
            address TEXT NOT NULL
        )
    `);

    // Inserindo dados iniciais
    const stmt = db.prepare("INSERT INTO ips (address) VALUES (?)");
    stmt.run('192.168.0.1');
    stmt.run('192.168.0.2');
    stmt.finalize();

    console.log('Banco de dados SQLite inicializado com sucesso!');
});

db.close();