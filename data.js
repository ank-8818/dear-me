import db from "./db.js";

const POST_SELECT = `
    SELECT posts.*,
        users.pseudonym AS author_pseudonym,
        users.avatar_slug AS author_avatar_slug,
        GROUP_CONCAT(post_tags.tag_slug) AS tag_slugs
    FROM posts
    JOIN users ON users.id = posts.author_id
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
        authorId: row.author_id,
        authorPseudonym: row.author_pseudonym,
        authorAvatarSlug: row.author_avatar_slug,
        isPrivate: row.is_private === 1,
        createdAt: new Date(row.created_at)
    }
}

function escapeLike(text) {
    return text.replace(/[\\%_]/g, "\\$&");
}


export function getPosts({ moodSlug = null, tagSlug = null, q = null, authorId, includePrivate = false, page = 1, perPage = null, fetchExtra = false } = {}) {
    const conditions = [];
    const params = [];

    if (moodSlug) {
        conditions.push("posts.mood_slug = ?");
        params.push(moodSlug);
    }

    if (tagSlug) {
        conditions.push("posts.id IN (SELECT post_id FROM post_tags WHERE tag_slug =?)");
        conditions.push("posts.content_warning IS NULL");
        params.push(tagSlug);
    }

    if (q) {
        const pattern = `%${escapeLike(q)}%`;
        conditions.push(
            "(posts.title LIKE ? ESCAPE '\\' OR (posts.content_warning IS NULL AND posts.body LIKE ? ESCAPE '\\'))"
        );
        params.push(pattern, pattern);
    }

    if (!(includePrivate && authorId)) conditions.push("posts.is_private = 0");
    if (authorId) {
        conditions.push("posts.author_id = ?");
        params.push(authorId);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    let limitSql = "";
    if (perPage) {
        limitSql = " LIMIT ? OFFSET ?";
        params.push(perPage + (fetchExtra ? 1 : 0), (page - 1) * perPage);
    } 

    const rows = db.prepare(
        `${POST_SELECT} ${where} GROUP BY posts.id ORDER BY posts.created_at DESC, posts.id DESC${limitSql}`
    ).all(...params);

    return rows.map(rowToPost);
}

export function addPost({title, body, moodSlug, timeTagSlug = null, contentWarning = null, tagSlugs = [], isPrivate = 1, authorId}) {
   
    db.exec("BEGIN");
    try{
        const statement = db.prepare("INSERT INTO posts (title, body, mood_slug, time_tag, content_warning, author_id, is_private, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        const result = statement.run(title, body, moodSlug, timeTagSlug, contentWarning, authorId, isPrivate, new Date().toISOString());

        const postId = result.lastInsertRowid;

        const insertTag = db.prepare("INSERT INTO post_tags (post_id, tag_slug) VALUES (?, ?)");
        tagSlugs.forEach(slug => insertTag.run(postId, slug));



        db.exec("COMMIT");
    } catch(error) {
        db.exec("ROLLBACK");
        throw error;
    } 
    
}

export function updatePost({ id, title, body, moodSlug, timeTagSlug, contentWarning, isPrivate = 1, tagSlugs }) {
    db.exec("BEGIN");
    try {
        db.prepare(
            "UPDATE posts SET title = ?, body = ?, mood_slug = ?, time_tag = ?, content_warning = ?, is_private = ? WHERE id = ?"
        ).run(title, body, moodSlug, timeTagSlug, contentWarning, isPrivate, id);
        db.prepare("DELETE FROM post_tags WHERE post_id = ?").run(id);

        const insertTag = db.prepare("INSERT INTO post_tags (post_id, tag_slug) VALUES (?, ?)");
        tagSlugs.forEach(slug => insertTag.run(id, slug));

        db.exec("COMMIT");
    } catch (error) {
        db.exec("ROLLBACK");
        throw error;
    }
}

export function deletePost(id) {
    db.exec("BEGIN");
    try {
        db.prepare("DELETE FROM post_tags WHERE post_id = ?").run(id);
        db.prepare("DELETE from posts WHERE id = ?").run(id);

        db.exec("COMMIT");
    } catch (error) {
        db.exec("ROLLBACK");
        throw error;
    }
}

export function getPostById(id) {
    const row = db.prepare(`${POST_SELECT} WHERE posts.id = ? GROUP BY posts.id`).get(id);
    return row ? rowToPost(row) : undefined;
}