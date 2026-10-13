import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("dear-me.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS posts(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        mood_slug TEXT,
        time_tag TEXT,
        content_warning TEXT,
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