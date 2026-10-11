import db from "./db.js";

function rowToPost(row) {
    return {
        id: row.id,
        title: row.title,
        body: row.body,
        moodSlug: row.mood_slug,
        createdAt: new Date(row.created_at)
    }
}


export function getPosts() {

    const rows = db.prepare("SELECT * FROM posts ORDER BY created_at DESC, id DESC").all();
    return rows.map(rowToPost);
}

export function addPost({title, body, moodSlug}) {
   
    const statement = db.prepare("INSERT INTO posts (title, body, mood_slug, created_at) VALUES (?, ?, ?, ?)");
    statement.run(title, body, moodSlug, new Date().toISOString());
}

export function getPostById(id) {
    const row = db.prepare("SELECT * FROM posts WHERE id = ?").get(id);
    return row ? rowToPost(row) : undefined;
}