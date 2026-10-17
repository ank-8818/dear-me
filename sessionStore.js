import session from "express-session";
import db from "./db.js";

db.exec(`CREATE TABLE IF NOT EXISTS sessions (
    sid TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    expires INTEGER NOT NULL
)`);

const getRow = db.prepare("SELECT data FROM sessions WHERE sid = ? AND expires > ?");
const setRow = db.prepare(`INSERT INTO sessions (sid, data, expires) VALUES (?, ?, ?)
    ON CONFLICT(sid) DO UPDATE SET data = excluded.data, expires = excluded.expires`);
const deleteRow = db.prepare("DELETE FROM sessions WHERE sid = ?");
const deleteOld = db.prepare("DELETE FROM sessions WHERE expires <= ?");

export class SqliteStore extends session.Store {
    constructor() {
        super();
        setInterval(() => deleteOld.run(Date.now()), 60 * 60 * 1000).unref();
    }

    get(sid, callback) {
        try {
            const row = getRow.get(sid, Date.now());
            callback(null, row ? JSON.parse(row.data) : null);
        } catch (err) {
            callback(err);
        }
    }

    set(sid, sess, callback) {
        try {
            const expires = sess.cookie?.expires
                ? new Date(sess.cookie.expires).getTime()
                : Date.now() + 1000 * 60 * 60 * 24 * 7;
            setRow.run(sid, JSON.stringify(sess), expires);
            callback?.(null);
        } catch (err) {
            callback?.(err);
        }
    }

    destroy(sid, callback) {
        try {
            deleteRow.run(sid);
            callback?.(null);
        } catch (err) {
            callback?.(err);
        }
    }
}