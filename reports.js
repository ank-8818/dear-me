import db from "./db.js";

export function addReport({ postId, reporterId, reason, note }) {
    db.prepare(`INSERT INTO reports (post_id, reporter_id, reason, note, created_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(post_id, reporter_id) DO NOTHING`
    ).run(postId, reporterId, reason, note, new Date().toISOString());
}

export function getOpenReports() {
    return db.prepare(`
        SELECT reports.id, reports.reason, reports.note, reports.created_at,
               posts.id AS post_id, posts.title, posts.body, posts.content_warning,
               author.pseudonym AS author_pseudonym,
               reporter.pseudonym AS reporter_pseudonym
        FROM reports
        JOIN posts ON posts.id = reports.post_id
        JOIN users AS author ON author.id = posts.author_id
        LEFT JOIN users AS reporter ON reporter.id = reports.reporter_id
        WHERE reports.status = 'open'
        ORDER BY reports.created_at DESC
    `).all();
}

export function dismissReport(id) {
    db.prepare("UPDATE reports SET status = 'dismissed' WHERE id = ?").run(id);
}