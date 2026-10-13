import db from "./db.js";

const POST_SELECT = `
    SELECT posts.*, GROUP_CONCAT(post_tags.tag_slug) AS tag_slugs
    FROM posts
    LEFT JOIN post_tags ON post_tags.post_id = posts.id
`;

function rowToPost(row) {
    return {
        id: row.id,
        title: row.title,
        body: row.body,
        moodSlug: row.mood_slug,
        timeTagSlug: row.time_tag,
        tagSlugs: row.tag_slugs ? row.tag_slugs.split(",") : [],
        contentWarning: row.content_warning,
        createdAt: new Date(row.created_at)
    }
}


export function getPosts() {

    const rows = db.prepare(`${POST_SELECT} GROUP BY posts.id ORDER BY posts.created_at DESC, posts.id DESC`).all();
    return rows.map(rowToPost);
}

export function getPostsByMood(slug) {
    const statement = db.prepare(
        `${POST_SELECT} WHERE posts.mood_slug = ?  GROUP BY posts.id ORDER BY posts.created_at DESC, posts.id DESC`
    );
    return statement.all(slug).map(rowToPost);
}

export function addPost({title, body, moodSlug, timeTagSlug = null, contentWarning = null, tagSlugs = []}) {
   
    db.exec("BEGIN");
    try{
        const statement = db.prepare("INSERT INTO posts (title, body, mood_slug, time_tag, content_warning, created_at) VALUES (?, ?, ?, ?, ?, ?)");
        const result = statement.run(title, body, moodSlug, timeTagSlug, contentWarning, new Date().toISOString());

        const postId = result.lastInsertRowid;

        const insertTag = db.prepare("INSERT INTO post_tags (post_id, tag_slug) VALUES (?, ?)");
        tagSlugs.forEach(slug => insertTag.run(postId, slug));



        db.exec("COMMIT");
    } catch(error) {
        db.exec("ROLLBACK");
        throw error;
    } 
    
}

export function getPostById(id) {
    const row = db.prepare(`${POST_SELECT} WHERE posts.id = ? GROUP BY posts.id`).get(id);
    return row ? rowToPost(row) : undefined;
}