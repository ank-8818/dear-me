export const moods = [
    {
        slug: "angry",
        label: "Angry",
        image: "/images/stickers/angry.png",
        colorClass: "mood-warm"
    },

    {
        slug: "anxious",
        label: "Anxious",
        image: "/images/stickers/anxious.png",
        colorClass: "mood-blue"
    },

    {
        slug: "confident",
        label: "Confident",
        image: "/images/stickers/confident.png",
        colorClass: "mood-coral"
    },

    {
        slug: "curious",
        label: "Curious",
        image: "/images/stickers/curious.png",
        colorClass: "mood-lilac"
    },

    {
        slug: "drifting-attention",
        label: "Drifting attention",
        image: "/images/stickers/drifting-attention.png",
        colorClass: "mood-blue"
    },

    {
        slug: "exhausted",
        label: "Exhausted",
        image: "/images/stickers/exhausted.png",
        colorClass: "mood-brown"
    },

    {
        slug: "good-drink",
        label: "Good drink",
        image: "/images/stickers/good-drink.png",
        colorClass: "mood-teal"
    },

    {
        slug: "good-food",
        label: "Good food",
        image: "/images/stickers/good-food.png",
        colorClass: "mood-coral"
    },

    {
        slug: "happy",
        label: "Happy",
        image: "/images/stickers/happy.png",
        colorClass: "mood-yellow"
    },

    {
        slug: "hilarious",
        label: "Hilarious",
        image: "/images/stickers/hilarious.png",
        colorClass: "mood-yellow"
    },

    {
        slug: "hopeful",
        label: "Hopeful",
        image: "/images/stickers/hopeful.png",
        colorClass: "mood-teal"
    },

    {
        slug: "in-the-soft-era",
        label: "In my soft era",
        image: "/images/stickers/in-the-soft-era.png",
        colorClass: "mood-pink"
    },

    {
        slug: "lonely",
        label: "Lonely",
        image: "/images/stickers/lonely.png",
        colorClass: "mood-pink"
    },

    {
        slug: "overwhelmed",
        label: "Overwhelmed",
        image: "/images/stickers/overwhelmed.png",
        colorClass: "mood-warm"
    },

    {
        slug: "peaceful",
        label: "Peaceful",
        image: "/images/stickers/peaceful.png",
        colorClass: "mood-teal"
    },

    {
        slug: "sad",
        label: "Sad",
        image: "/images/stickers/sad.png",
        colorClass: "mood-blue"
    },

    {
        slug: "things-going-smoothly",
        label: "Things going smoothly",
        image: "/images/stickers/things-going-smoothly.png",
        colorClass: "mood-coral"
    },

    {
        slug: "tired-but-pushing",
        label: "Tired but pushing",
        image: "/images/stickers/tired-but-pushing.png",
        colorClass: "mood-brown"
    },

    {
        slug: "tired",
        label: "Tired",
        image: "/images/stickers/tired.png",
        colorClass: "mood-brown"
    },

    {
        slug: "winning-award",
        label: "Winning an award",
        image: "/images/stickers/winning-award.png",
        colorClass: "mood-yellow"
    }
];


export function getMoodBySlug(slug) {
    return moods.find(m => m.slug === slug);
}