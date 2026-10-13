export const tagCategories = [
    {
        name: "Feelings & moods",
        colorClass: "cat-feelings",
        slug: "feelings",
        description: "For when a writer wants to express how something feels",
        tags: [
            { slug: "soft-and-sappy", label: "#SoftAndSappy" },
            { slug: "feeling-everything", label: "#FeelingEverything" },
            { slug: "a-little-lost", label: "#ALittleLost" },
            { slug: "bittersweet-things", label: "#BittersweetThings" },
            { slug: "need-a-reset", label: "#NeedAReset" },
            { slug: "heart-full-head-empty", label: "#HeartFullHeadEmpty" },
            { slug: "gentle-days", label: "#GentleDays" },
            { slug: "at-peace-for-once", label: "#AtPeaceForOnce" },
            { slug: "mixed-bag-of-feelings", label: "#MixedBagOfFeelings" },
            { slug: "missing-something", label: "#MissingSomething"}
        ]
    },

    {
        name: "Thoughts, rants & randomness",
        colorClass: "cat-thoughts",
        slug: "thoughts",
        description: "The home of brain dumps, shower thoughts, overthinking, confessions, and nonsense",
        tags: [
            { slug: "brain-dump", label: "#BrainDump" },
            { slug: "mini-rant", label: "#MiniRant" },
            { slug: "note-to-self", label: "#NoteToSelf" },
            { slug: "confession-booth", label: "#ConfessionBooth" },
            { slug: "what-if", label: "#WhatIf" },
            { slug: "brain-on-a-detour", label: "#BrainOnADetour" },
            { slug: "a-question-for-the-void", label: "#AQuestionForTheVoid" },
            { slug: "just-because", label: "#JustBecause" },
            { slug: "rabbit-hole-alert", label: "#RabbitHoleAlert" },
            { slug: "why-am-i-like-this", label: "#WhyAmILikeThis" },
            { slug: "overthinking-olympics", label: "#OverthinkingOlympics" }
        ]
    },

    {
        name: "Life, people & little stories",
        colorClass: "cat-life",
        slug: "life",
        description: "For daily happenings, memories, relationships, observations, and all the little things that make up a life",
        tags: [
            { slug: "daily-nonsense", label: "#DailyNonsense" },
            { slug: "tiny-pleasures", label: "#TinyPleasures" },
            { slug: "little-victory", label: "#LittleVictory" },
            { slug: "daily-lore", label: "#DailyLore" },
            { slug: "one-of-those-days", label: "#OneOfThoseDays" },
            { slug: "life-lately", label: "#LifeLately" },
            { slug: "main-character-moment", label: "#MainCharacterMoment" },
            { slug: "friendship-things", label: "#FriendshipThings" },
            { slug: "almost-said-it", label: "#AlmostSaidIt" },
            { slug: "memory-lane", label: "#MemoryLane" },
            { slug: "things-people-do", label: "#ThingsPeopleDo" },
            { slug: "today-i-learned", label: "#TodayILearned" },
            { slug: "things-i-love", label: "#ThingsILove" },
            { slug: "unexpected-plot-twist", label: "#UnexpectedPlotTwist" }
        ]
    },

    {
        name: "Creativity, interests & imagination",
        colorClass: "cat-creativity",
        slug: "creativity",
        description: "For ideas, hobbies, dreams, stories, and creative tangents",
        tags: [
            { slug: "creative-ramblings", label: "#CreativeRamblings" },
            { slug: "dreamscape", label: "#Dreamscape" },
            { slug: "story-seeds", label: "#StorySeeds" },
            { slug: "aesthetic-thoughts", label: "#AestheticThoughts" },
            { slug: "sudden-inspiration", label: "#SuddenInspiration" },
            { slug: "words-and-wonder", label: "#WordsAndWonder" },
            { slug: "currently-obsessed", label: "#CurrentlyObsessed" },
            { slug: "ideas-for-later", label: "#IdeasForLater" },
            { slug: "things-i-want-to-make", label: "#ThingsIWantToMake" },
            { slug: "character-brainrot", label: "#CharacterBrainrot" }
        ]
    },

    {
        name: "Growth, comfort & little victories",
        colorClass: "cat-growth",
        slug: "growth",
        description: "For self-reflection, lessons learned, reassurance, and slowly figuring things out",
        tags: [
            { slug: "learning-as-i-go", label: "#LearningAsIGo" },
            { slug: "work-in-progress", label: "#WorkInProgress" },
            { slug: "unlearning-things", label: "#UnlearningThings" },
            { slug: "lesson-in-hindsight", label: "#LessonInHindsight" },
            { slug: "future-me-notes", label: "#FutureMeNotes" },
            { slug: "growing-pains", label: "#GrowingPains" },
            { slug: "proud-of-myself", label: "#ProudOfMyself" },
            { slug: "permission-to-pause", label: "#PermissionToPause" },
            { slug: "survived-the-day", label: "#SurvivedTheDay" },
            { slug: "small-steps-count", label: "#SmallStepsCount" },
            { slug: "starting-again", label: "#StartingAgain" },
            { slug: "getting-to-know-me", label: "#GettingToKnowMe" },
            { slug: "making-peace-with-it", label: "#MakingPeaceWithIt" }
        ]
    }
];


const allCatTags = tagCategories.flatMap(cat =>
    cat.tags.map(tag => ({...tag, colorClass: cat.colorClass, categoryName: cat.name, categorySlug: cat.slug}))
);

export function getTagBySlug(slug) {
    return allCatTags.find(tag => tag.slug === slug);
}