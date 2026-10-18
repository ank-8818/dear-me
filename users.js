import db from "./db.js";
// db.exec("DELETE FROM users");
function rowToUser(row) {
    return {
        id: row.id,
        pseudonym: row.pseudonym,
        avatarSlug: row.avatar_slug,
        passwordHash: row.password_hash,
        recoveryHash: row.recovery_hash,
        status: row.status,
        createdAt: new Date(row.created_at)
    }
}


export function getUserByPseudonym(pseudonym) {
    const row = db.prepare("SELECT * FROM users WHERE pseudonym = ?").get(pseudonym);
    return row ? rowToUser(row) : undefined;
}

export function getUserById(id) {
    const row = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
    return row ? rowToUser(row) : undefined;
} 

export function createUser({ pseudonym, avatarSlug, passwordHash, recoveryHash }) {
    
    const statement = db.prepare("INSERT INTO users (pseudonym, avatar_slug, password_hash, recovery_hash, created_at) VALUES (?, ?, ?, ?, ?)");
    const result = statement.run(pseudonym, avatarSlug, passwordHash, recoveryHash, new Date().toISOString());

    return Number(result.lastInsertRowid);
}

export function setCredentials(id, { passwordHash, recoveryHash }) {
    const statement = db.prepare("UPDATE users SET password_hash = ?, recovery_hash = ? WHERE id = ?");

    statement.run(passwordHash, recoveryHash, id);
}

export function setStatus(id, status) {
    db.prepare("UPDATE users SET status = ? WHERE id = ?").run(status, id);
}

export function deleteAccount(userId) {
    db.exec("BEGIN");
    try {
        db.prepare("DELETE FROM post_tags WHERE post_id IN (SELECT id FROM posts WHERE author_id = ?)").run(userId);
        db.prepare("DELETE FROM posts WHERE author_id = ?").run(userId);
        db.prepare("DELETE FROM sessions WHERE json_extract(data, '$.userId') = ?").run(userId);
        db.prepare("DELETE FROM users WHERE id = ?").run(userId);
        db.exec("COMMIT");
    } catch (error) {
        db.exec("ROLLBACK");
        throw error;
    }
}