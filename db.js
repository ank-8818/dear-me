import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync(process.env.DATABASE_PATH || "dear-me.db");
db.exec("PRAGMA foreign_keys = ON");


db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pseudonym TEXT NOT NULL UNIQUE COLLATE NOCASE,
        avatar_slug TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        recovery_hash TEXT NOT NULL,
        status TEXT CHECK (status IS NULL OR length(status) <= 100),
        created_at TEXT NOT NULL
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS posts(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        mood_slug TEXT,
        time_tag TEXT,
        content_warning TEXT,
        author_id INTEGER NOT NULL REFERENCES users(id),
        is_private INTEGER NOT NULL DEFAULT 1 CHECK (is_private IN (0,1)),
        created_at TEXT NOT NULL
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS post_tags (
        post_id INTEGER NOT NULL,
        tag_slug TEXT NOT NULL,
        PRIMARY KEY (post_id, tag_slug),
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    )
`);




export default db;