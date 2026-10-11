let nextId = 4;

const posts = [
    {
        id: "1",
        title: "Hey, so i finally got that award today! All those hardwork finally paid off!",
        body: "So. I finally worked that problem for my reaserch out! All those sleepless night shifts, running on coffee (which is not healthy, but i digress)- i finally got the calculations right, and presented my findings- and judges were so impressed, i won!",
        createdAt: new Date("2026-10-09"),
        moodSlug: "winning-award"
    },

    {
        id: "2",
        title: "Got coffee spilled on my computer",
        body: "i have been working on a file, and then, some intern spilled coffee all over my computer. well. it is the comapny's computer, their loss, so i guess, i do not have to pay out of my pockets. though. my files might have to be recovered. and i do not have to work- it has been a very very long week, an di can finally take the chance of the botched computer to go to sleep tonight on my own bed instead of sleeping in the office rest area. yay, i guess?",
        createdAt: new Date("2026-10-10"),
        moodSlug: "tired-but-pushing"
    },

    {
        id: "3",
        title: "The ice cream dilemma",
        body: "No thoughts, just thinking- how do i decide which flavor of ice cream i should buy when you have a fixed budget?",
        createdAt: new Date("2026-10-10"),
        moodSlug: null
    }
];

export function getPosts() {
    return posts;
}

export function addPost({title, body, moodSlug}) {
    const newPost = {
        id: String(nextId++),
        title: title,
        body: body,
        moodSlug: moodSlug,
        createdAt: new Date()
    }

    posts.push(newPost);
    return newPost;
}


export function getPostById(id) {
    return posts.find(p => p.id === id);
}