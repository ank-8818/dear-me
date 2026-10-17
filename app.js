// Deployed on Railway
import express from "express";
import bcrypt from "bcrypt";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { SqliteStore } from "./sessionStore.js";

import { moods, getMoodBySlug } from "./moods.js";
import { avatars, getAvatarBySlug } from "./avatars.js";
import { getPostById, getPosts, addPost, updatePost, deletePost } from "./data.js";
import { getBodyError, getEmptyTitleError, getExcessTitleError, getLongCWError, getTooManyTagsError, getHomePageQuote, getBadPseudonymError,
    getTakenPseudonymError, getMismatchPasswordError, getShortPasswordError, getLongPasswordError,
    getNoAvatarError, placeholderText, getLongBodyError, getRecoveryError,
    getLoginError, getWelcomeName, getTooManyAttemptsError} from "./prompts.js";
import { timeSlots, getTimeTagBySlug } from "./timeTags.js";
import { tagCategories, getTagBySlug } from "./tags.js";
import { getUserById, getUserByPseudonym, createUser, setCredentials, setStatus } from "./users.js";
import "./db.js";
import session from "express-session";
import { makeRecoveryCode, hashCode, checkCode } from "./recovery.js";

const DUMMY_HASH = await bcrypt.hash("not-a-real-password", 10);
const app = express();
app.set("trust proxy", 1);
app.get("/healthz", (req, res) => res.type("text").send("ok"));
const isProd = process.env.NODE_ENV === "production";
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");

const cspDirectives = {
    "style-src": ["'self'", "https://fonts.googleapis.com"],
    "font-src": ["'self'", "https://fonts.gstatic.com"],
    "img-src": ["'self'", "data:"]
};
if (!isProd) cspDirectives["upgrade-insecure-requests"] = null;

app.use(helmet({
    referrerPolicy: {policy: "same-origin"},
    contentSecurityPolicy: { userDefaults: true, directives: cspDirectives }
}));

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use((req, res, next) => {
    if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") {
        return next();
    }

    const fetchSite = req.get("Sec-Fetch-Site");
    if (fetchSite) {
        if (fetchSite === "same-origin" || fetchSite === "none") return next();
        return renderError(res, 403, "Request blocked", "That request didn't come from this site, so it wasn't sent. Please go back and try again.");
    }

    const origin = req.get("Origin");
    if (origin) {
        let sameHost = false;
        try {
            sameHost = new URL(origin).host === req.get("Host");
        } catch {
            sameHost = false;
        }
        if (!sameHost) return renderError(res, 403, "Request blocked", "That request didn't come from this site, so it wasn't sent. Please go back and try again.");
    }

    next();
});
app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    next();
});
app.use(session({
    store: new SqliteStore(),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: isProd, sameSite: "lax", maxAge: 1000 * 60 * 60 * 24 * 7}
}));
app.use((req, res, next) => {
    const user = req.session.userId ? getUserById(req.session.userId) : null;
    res.locals.currentUser = user
        ? { id: user.id, pseudonym: user.pseudonym, status: user.status, avatar: getAvatarBySlug(user.avatarSlug) }
        : null;
    next();
});




// Helper function
function withDetails(post) {
    return {
        ...post,
        mood: getMoodBySlug(post.moodSlug),
        timeTag: getTimeTagBySlug(post.timeTagSlug),
        author: {
            pseudonym: post.authorPseudonym,
            avatar: getAvatarBySlug(post.authorAvatarSlug)
        },
        tags: post.tagSlugs.map(getTagBySlug).filter(Boolean)
    };
}

function renderRegister(res, status, values = {}) {
    res.status(status).render("register", {
        avatars,
        pseudonym: "",
        avatarSlug: "",
        error: null,
        ...values
    });
}

function startSession(req, userId) {
    return new Promise((resolve, reject) => {
        req.session.regenerate(err => {
            if (err) return reject(err);
            req.session.userId = userId;
            req.session.save(err2 => (err2 ? reject(err2) : resolve()))
        });
    });
}

function requireLogin(req, res, next) {
    if (!res.locals.currentUser) {
        return res.redirect("/login");
    }
    next();
}

function readPostForm(reqBody) {
    const title = text(reqBody.title);
    const body = text(reqBody.body);
    const moodSlug = text(reqBody.moodSlug);
    const timeTagSlug = text(reqBody.timeTagSlug);
    const contentWarning = text(reqBody.contentWarning);
    const isPrivate = text(reqBody.visibility) === "public" ? 0 : 1;

    const entered = { title, body, moodSlug, timeTagSlug, contentWarning, visibility: isPrivate ? "private" : "public" };
    const rawTags = Array.isArray(reqBody.tagSlugs) ? reqBody.tagSlugs
    : reqBody.tagSlugs ? [reqBody.tagSlugs] : [];
    
    const tagSlugs = [...new Set(
        rawTags.filter(slug => typeof slug === "string")
    )].filter(slug => getTagBySlug(slug));

    const cleanTitle = title.trim();
    const cleanBody = body.trim();
    const cleanWarning = contentWarning.trim();

    let error = null;
    if (tagSlugs.length > 3) error = getTooManyTagsError();
    else if (!cleanTitle) error = getEmptyTitleError();
    else if (cleanTitle.length > 80) error = getExcessTitleError();
    else if (!cleanBody) error = getBodyError();
    else if (cleanBody.length > 10000) error = getLongBodyError();
    else if (cleanWarning.length > 60) error = getLongCWError();

    const post = {
        title: cleanTitle,
        body: cleanBody,
        moodSlug: moodSlug && getMoodBySlug(moodSlug) ? moodSlug : null,
        timeTagSlug: timeTagSlug && getTimeTagBySlug(timeTagSlug) ? timeTagSlug : null,
        contentWarning: cleanWarning || null,
        isPrivate,
        tagSlugs
    };

    return { error, entered, tagSlugs, post };
}

function findOwnPost(req, res) {
    const post = getPostById(req.params.id);
    if (!post || !canView(post, res.locals.currentUser)) {
        postNotFound(res);
        return null;
    }

    if (post.authorId !== res.locals.currentUser.id) {
        renderError(res, 403, "That one isn't yours", "Only the person who wrote a post can change it.");
        return null;
    }

    return post;
}

function checkNewPassword(password, confirmPassword) {
    if (password.length < 8) return getShortPasswordError();
    if (Buffer.byteLength(password, "utf-8") > 72) return getLongPasswordError();
    if (password !== confirmPassword) return getMismatchPasswordError();
    return null;
}

const ERROR_IMAGES = {
    404: "/images/assets/error-404.png",
    403: "/images/assets/error-403.png",
    500: "/images/assets/error-500.png"
}

function renderError(res, status, heading, message) {
    res.locals.currentUser ??= null;
    res.locals.currentPath ??= "";

    res.status(status).render("error", {
        heading, message,
        image: ERROR_IMAGES[status] || ERROR_IMAGES[500]
    }, (err, html) => {
        if (err) {
            console.error("RENDER ERROR:", err.message);
            return res.type("text").send(`${heading}. ${message}`);
        }
        res.send(html);
    });
}   

function canView(post, user) {
    return !post.isPrivate || (user && user.id === post.authorId);
}


const text = value =>(typeof value === "string" ? value : "");
const cleanPseudonym = value => value.trim().replace(/\s+/g, " ");
const postNotFound = res =>
    renderError(res, 404, "Post not found", "It may have been deleted, or it was never here.");

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    handler: (req, res) => renderLogin(res, 429, { error: getTooManyAttemptsError(), pseudonym: "" })
});

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    skipFailedRequests: true,
    legacyHeaders: false,
    handler: (req, res) => renderRegister(res, 429, { error: getTooManyAttemptsError() })
});

const postLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        const form = readPostForm(req.body);
        renderCompose(res, 429, { error: getTooManyAttemptsError(), ...form.entered, tagSlugs: form.tagSlugs });
    }
});

const forgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    handler: (req, res) => renderForgotPassword(res, 429, { error: getTooManyAttemptsError(), pseudonym: "" })

});

// Gets home page
app.get("/", (req, res) => {

    const activeMood = getMoodBySlug(req.query.mood) || null;
    const activeTag = getTagBySlug(req.query.tag) || null;
    
    let q = null;
    if (typeof req.query.q === "string") {
        q = req.query.q.trim().slice(0, 100);
        if (!q) q = null;
    }

    const page = Math.min(1000, Math.max(1, parseInt(req.query.page, 10) || 1));
    const perPage = 2;

    const results = getPosts({
        moodSlug: activeMood?.slug,
        tagSlug: activeTag?.slug,
        q, page, perPage,
        fetchExtra: true
    });

    const hasMore = results.length > perPage;
    const posts = results.slice(0, perPage);

    const nextParams = new URLSearchParams();
    if (activeMood) nextParams.set("mood", activeMood.slug);
    if (activeTag) nextParams.set("tag", activeTag.slug);
    if (q) nextParams.set("q", q);
    nextParams.set("page", page + 1);
    const nextPageUrl = hasMore ? `/?${nextParams}` : null;

    res.render("home", {
        posts: posts.map(withDetails),
        moods, activeMood, activeTag,
        q: q || "",
        quote: getHomePageQuote(),
        page,
        hasMore,
        nextPageUrl
    });
});


// Shows individual posts
app.get("/posts/:id", (req, res) => {
    const post = getPostById(req.params.id);
    if (!post || !canView(post, res.locals.currentUser)){
        return postNotFound(res);
    }

    if (post.isPrivate) res.set("Cache-Control", "no-store");
    res.render("post", { post: withDetails(post) });   
});


// Compose page

function renderCompose(res, status, values) {
    res.status(status).render("compose", {
        moods, timeSlots, tagCategories,
        placeholders: placeholderText(),
        title: "",
        body:"",
        moodSlug: "",
        timeTagSlug: "",
        tagSlugs: [],
        contentWarning: "",
        error: null,
        formAction: "/compose",
        submitLabel: "Publish",
        visibility: "private",
        ...values
    })
}

app.get("/compose", requireLogin, (req, res) => {
    renderCompose(res, 200);
});

app.post("/compose",requireLogin, postLimiter, (req, res) => {
    const form = readPostForm(req.body);

    if (form.error) {
        return renderCompose(res, 400, {
            error: form.error,
            ...form.entered,
            tagSlugs: form.tagSlugs
        });
    }

    addPost({ ...form.post, authorId: res.locals.currentUser.id });
    res.redirect(form.post.isPrivate ? "/me" : "/");
});


//Register page
app.get("/register", (req, res) => {
    if (res.locals.currentUser) return res.redirect("/");

    renderRegister(res, 200);
});

app.post("/register", registerLimiter, async(req, res) => {


    const {pseudonym = "", password = "", confirmPassword = "", avatarSlug = ""} = req.body;
    const entered = {pseudonym, avatarSlug};
    

    if (typeof pseudonym !== "string" || typeof password !== "string" || typeof confirmPassword !== "string" || typeof avatarSlug !== "string") {
        return renderRegister(res, 400, {
            error: "Something went wrong with your input. Please try again.",
            pseudonym: typeof pseudonym === "string" ? pseudonym : "",
            avatarSlug: typeof avatarSlug === "string" ? avatarSlug : ""
        })
    }

    const cleanName = cleanPseudonym(pseudonym);

    if (!/^[A-Za-z0-9 _-]{3,20}$/.test(cleanName)) {
        return renderRegister(res, 400, {
            error: getBadPseudonymError(),
            ...entered
        });
    }

    const passwordError = checkNewPassword(password, confirmPassword);
    if (passwordError) {
        return renderRegister(res, 400, { error: passwordError, ...entered });
    }

    const avatar = getAvatarBySlug(avatarSlug);
    if (!avatar) {
        return renderRegister(res, 400, {
            error: getNoAvatarError(),
            ...entered
        });
    }

    if (getUserByPseudonym(cleanName)) {
        return renderRegister(res, 400, {
            error: getTakenPseudonymError(),
            ...entered
        });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const code = makeRecoveryCode();
    const recoveryHash = await hashCode(code);

    let userId;
    try {
        userId = createUser({ pseudonym: cleanName, avatarSlug, passwordHash, recoveryHash });
    } catch (error) {
        if (error.message.includes("UNIQUE")) {
            return renderRegister(res, 400, {
                error: getTakenPseudonymError(),
                ...entered
            });
        }
        throw error;
    }  

    await startSession(req, userId);
    req.session.recoveryCode = code;
    res.redirect("/recovery-code");
});


//Login page
function renderLogin(res, status, values = {}) {
    res.status(status).render("login", {
        pseudonym: "",
        error: null,
        welcomeName: getWelcomeName(),
        ...values
    });
}

app.get("/login", (req, res) => {
    if (res.locals.currentUser) return res.redirect("/");

    return renderLogin(res, 200);
});

app.post("/login", loginLimiter, async(req, res) => {
    const pseudonym = typeof req.body.pseudonym === "string" ? req.body.pseudonym : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";

    if (!pseudonym || !password) {
        return renderLogin(res, 400, { error: getLoginError(), pseudonym });
    }

    const cleanName = cleanPseudonym(pseudonym);
    const user = getUserByPseudonym(cleanName);

    const hashToCheck = user ? user.passwordHash : DUMMY_HASH;
    const passwordOk = await bcrypt.compare(password, hashToCheck);

    if (!user || !passwordOk) {
        return renderLogin(res, 400, { error: getLoginError(), pseudonym });
    }

    await startSession(req, user.id);
    res.redirect("/");
});


//Logout
app.post("/logout", (req, res) => {
    req.session.destroy(err => {
        res.clearCookie("connect.sid");
        res.redirect("/");
    });
});


//Edit posts
app.get("/posts/:id/edit", requireLogin, (req, res) => {

    const post = findOwnPost(req, res);
    if (!post) return;

    res.set("Cache-Control", "no-store");

    renderCompose(res, 200, {
        title: post.title,
        body: post.body,
        moodSlug: post.moodSlug || "",
        timeTagSlug: post.timeTagSlug || "",
        contentWarning: post.contentWarning || "",
        tagSlugs: post.tagSlugs,
        formAction: `/posts/${post.id}/edit`,
        visibility: post.isPrivate ? "private" : "public",
        submitLabel: "Save changes"
    });
});


app.post("/posts/:id/edit", requireLogin, (req, res) => {
    const post = findOwnPost(req, res);
    if (!post) return;

    const form = readPostForm(req.body);
    if (form.error) {
        return renderCompose(res, 400, {
            error: form.error,
            ...form.entered,
            tagSlugs: form.tagSlugs,
            formAction: `/posts/${post.id}/edit`,
            submitLabel: "Save changes"
        });
    }

    updatePost({ id: post.id, ...form.post });
    res.redirect(`/posts/${post.id}`);
});

//Post delete
app.post("/posts/:id/delete", requireLogin, (req, res) => {
    const post = findOwnPost(req, res);
    if (!post) return;

    deletePost(post.id);
    res.redirect("/");
});


//Recovery
app.get("/recovery-code", requireLogin, (req, res) => {
    const code = req.session.recoveryCode;
    delete req.session.recoveryCode;
    if (!code) return res.redirect("/");

    res.set("Cache-Control", "no-store");
    res.render("recovery-code", { code });
});


//Forgot password
function renderForgotPassword(res, status, values = {}) {
    res.status(status).render("forgot-password", {
        pseudonym: "",
        error: null,
        ...values
    });
}

app.get("/forgot-password", (req, res) => {
    if (res.locals.currentUser) return res.redirect("/");
    renderForgotPassword(res, 200);
});

app.post("/forgot-password", forgotPasswordLimiter, async(req, res) => {
    const pseudonym = text(req.body.pseudonym);
    const recoveryCode = text(req.body.recoveryCode);
    const password = text(req.body.password);
    const confirmPassword = text(req.body.confirmPassword);

    if (!pseudonym || !recoveryCode || !password || !confirmPassword) {
        return renderForgotPassword(res, 400, { error: getRecoveryError(), pseudonym });
    }

    const cleanName = cleanPseudonym(pseudonym);
    const user = getUserByPseudonym(cleanName);


    const hashToCheck = user ? user.recoveryHash : DUMMY_HASH;
    const codeOk = await checkCode(recoveryCode, hashToCheck);

    if (!user || !codeOk) {
        return renderForgotPassword(res, 400, { error: getRecoveryError(), pseudonym });
    }

    const passwordError = checkNewPassword(password, confirmPassword);
    if (passwordError) {
        return renderForgotPassword(res, 400, { error: passwordError, pseudonym });
    }

    const newPasswordHash = await bcrypt.hash(password, 10);
    const newCode = makeRecoveryCode();
    const newRecoveryHash = await hashCode(newCode);

    setCredentials(user.id, { passwordHash: newPasswordHash, recoveryHash: newRecoveryHash });

    await startSession(req, user.id);
    req.session.recoveryCode = newCode;
    res.redirect("/recovery-code");
});

//About page
app.get("/about", (req, res) => {
    res.render("about");
});


//Journal page
app.get("/me", requireLogin, (req, res) => {
    const me = res.locals.currentUser;
    const posts = getPosts({ authorId: me.id, includePrivate: true });
    res.set("Cache-Control", "no-store");
    res.render("me", { posts: posts.map(withDetails) });
});

app.post("/me/status",requireLogin, (req, res) => {
    const status = text(req.body.status).trim().replace(/\s+/g, " ").slice(0, 100);
    setStatus(res.locals.currentUser.id, status || null);
    res.redirect("/me");
});


//Proper 404 and error pages
app.use((req, res) => {
    renderError(res, 404, "Page not found", "That address doesn't lead anywhere. Let's get you back home.");
});

app.use((err, req, res, next) => {
    console.error(err);
    if (res.headersSent) return next(err);
    const status = err.status >= 400 && err.status < 500 ? err.status : 500;
    renderError(res, status, "Something went wrong", status === 500
        ? "That wasn't you. Please try again in a little while."
        : "That request couldn't be understood. Please go back and try again.");
});


app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
});

process.on("SIGTERM", () => {
    server.close(() => process.exit(0));
});