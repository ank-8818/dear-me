import { exec } from "node:child_process";
import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("dear-me.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS posts(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    mood_slug TEXT,
    created_at TEXT NOT NULL)
`);

export default db;