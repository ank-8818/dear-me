import express from "express";
import { moods, getMoodBySlug } from "./moods.js";
import { getPostById, getPosts, addPost } from "./data.js";
import { getBodyError, getEmptyTitleError, getExcessTitleError, placeholderText } from "./prompts.js";
import "./db.js";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));


// Helper function
function withMood(post) {
    return {
        ...post,
        mood: getMoodBySlug(post.moodSlug)
    };
}


// Gets home page
app.get("/", (req, res) => {
    const posts = getPosts();
    const sorted = [...posts.map(withMood)].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.render("home", { posts: sorted });
    
});


// Shows individual posts
app.get("/posts/:id", (req, res) => {
    const post = getPostById(req.params.id);
    if (!post){
        return res.status(404).send("Post not found")
    }
    res.render("post", { post: withMood(post) });   
});


// Compose page
app.get("/compose", (req, res) => {
    const placeholders = placeholderText();
    res.render("compose", {
        moods,
        placeholders,
        title: "",
        body: "",
        moodSlug:"",
        error: null
    });
});

app.post("/compose", (req, res) => {
    const { title, body, moodSlug } = req.body;
    const cleanTitle = title.trim();
    const cleanBody = body.trim();
    const placeholders = placeholderText();

    if (!cleanTitle) {
        return res.status(400).render("compose", {
            moods, placeholders,
            error: getEmptyTitleError(),
            title, body, moodSlug
        });
    }

    if (cleanTitle.length > 80) {
        return res.status(400).render("compose", {
            moods, placeholders,
            error: getExcessTitleError(),
            title, body, moodSlug
        });
    }

    if (!cleanBody) {
        return res.status(400).render("compose", {
            moods, placeholders,
            error: getBodyError(),
            title, body, moodSlug
        });
    }

    const validSlug = moodSlug && getMoodBySlug(moodSlug) ? moodSlug : null;
    addPost( {title: cleanTitle, body: cleanBody, moodSlug: validSlug});
    res.redirect("/");
});



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})