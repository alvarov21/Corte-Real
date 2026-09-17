import Database from 'better-sqlite3';
import path from 'path';

// En desarrollo usamos una base de datos local en el proyecto
const dbPath = path.join(process.cwd(), 'reservas.db');
const db = new Database(dbPath);

// Crear la tabla si no existe
db.exec(`
  CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    service TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;
