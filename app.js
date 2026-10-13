import express from "express";
import { moods, getMoodBySlug } from "./moods.js";
import { getPostById, getPostsByMood, getPosts, addPost } from "./data.js";
import { getBodyError, getEmptyTitleError, getExcessTitleError, getLongCWError, getTooManyTagsError, getHomePageQuote, placeholderText } from "./prompts.js";
import { timeSlots, getTimeTagBySlug } from "./timeTags.js";
import { tagCategories, getTagBySlug } from "./tags.js";
import "./db.js";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));


// Helper function
function withDetails(post) {
    return {
        ...post,
        mood: getMoodBySlug(post.moodSlug),
        timeTag: getTimeTagBySlug(post.timeTagSlug),
        tags: post.tagSlugs.map(getTagBySlug).filter(Boolean)
    };
}


// Gets home page
app.get("/", (req, res) => {
    const activeMood = getMoodBySlug(req.query.mood) || null;

    const posts = activeMood ? getPostsByMood(activeMood.slug) : getPosts();
    res.render("home", { posts: posts.map(withDetails), moods, activeMood, quote: getHomePageQuote()});
    
});


// Shows individual posts
app.get("/posts/:id", (req, res) => {
    const post = getPostById(req.params.id);
    if (!post){
        return res.status(404).send("Post not found")
    }
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
        ...values
    })
}

app.get("/compose", (req, res) => {
    renderCompose(res, 200);
});

app.post("/compose", (req, res) => {
    const { title = "", body = "", moodSlug, timeTagSlug = "", contentWarning = ""} = req.body;
    const entered = { title, body, moodSlug, timeTagSlug, contentWarning };
    const cleanTitle = title.trim();
    const cleanBody = body.trim();
    const cleanWarning = contentWarning.trim();
    
    const rawTags = (Array.isArray(req.body.tagSlugs) ? req.body.tagSlugs : req.body.tagSlugs ? [req.body.tagSlugs] : []);

    const validTags = [...new Set(
        rawTags.filter (slug => typeof slug === "string")
    )].filter(slug => getTagBySlug(slug));

    if (validTags.length > 3) {
        return renderCompose(res, 400, {
            error:getTooManyTagsError(),
            title, body, moodSlug, timeTagSlug, contentWarning,
            tagSlugs: validTags
        });
    }
    
    //  Errors for the compose form
    if (!cleanTitle) {
        return renderCompose(res, 400, {error: getEmptyTitleError(), 
            tagSlugs: validTags,
            ...entered  
        });
    }

    if (cleanTitle.length > 80) {
        return renderCompose(res, 400, {error: getExcessTitleError(),
            tagSlugs: validTags,
            ...entered
        });
    }

    if (!cleanBody) {
        return renderCompose(res, 400, {error: getBodyError(),
            tagSlugs: validTags,
            ...entered
        });
    }

    if (cleanWarning.length > 60) {
    return renderCompose(res, 400, {error: getLongCWError(),
            tagSlugs: validTags,
            ...entered
        });
    }

    //  Validation
    const validMood = moodSlug && getMoodBySlug(moodSlug) ? moodSlug : null;
    const validTime = timeTagSlug && getTimeTagBySlug(timeTagSlug) ? timeTagSlug : null;

    
    
    addPost( {title: cleanTitle, body: cleanBody, moodSlug: validMood, timeTagSlug: validTime, tagSlugs: validTags, contentWarning: cleanWarning || null});
    res.redirect("/");
});



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})