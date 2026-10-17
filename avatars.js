export const avatars = [
    {
        slug: "beach",
        label: "Beach",
        image: "/images/avatars/beach.png"
    },

    {
        slug: "birds-in-sky",
        label: "Birds in sky",
        image: "/images/avatars/birds-in-sky.png"
    },

    {
        slug: "black-cat",
        label: "Black cat",
        image: "/images/avatars/black-cat.png"
    },

    {
        slug: "books",
        label: "Books",
        image: "/images/avatars/books.png"
    },

    {
        slug: "bouquet",
        label: "Bouquet",
        image: "/images/avatars/bouquet.png"
    },

    {
        slug: "brown-cat",
        label: "Brown cat",
        image: "/images/avatars/brown-cat.png"
    },

    {
        slug: "changing-clouds",
        label: "Changing clouds",
        image: "/images/avatars/changing-clouds.png"
    },

    {
        slug: "coffee",
        label: "Coffee",
        image: "/images/avatars/coffee.png"
    },

    {
        slug: "daisy",
        label: "Daisy",
        image: "/images/avatars/daisy.png"
    },

    {
        slug: "dusk",
        label: "Dusk",
        image: "/images/avatars/dusk.png"
    },

    {
        slug: "flowers-in-vase",
        label: "Flowers in vase",
        image: "/images/avatars/flowers-in-vase.png"
    },

    {
        slug: "golden-sky",
        label: "Golden sky",
        image: "/images/avatars/golden-sky.png"
    },

    {
        slug: "lavender",
        label: "Lavender",
        image: "/images/avatars/lavender.png"
    },

    {
        slug: "lily-of-valley",
        label: "Lily of valley",
        image: "/images/avatars/lily-of-valley.png"
    },

    {
        slug: "moon-in-sea",
        label: "Moon in sea",
        image: "/images/avatars/moon-in-sea.png"
    },

    {
        slug: "night-sky",
        label: "Night sky",
        image: "/images/avatars/night-sky.png"
    },

    {
        slug: "snoozing-cat",
        label: "Snoozing cat",
        image: "/images/avatars/snoozing-cat.png"
    },

    {
        slug: "sunflower",
        label: "Sunflower",
        image: "/images/avatars/sunflower.png"
    },

    {
        slug: "sunset",
        label: "Sunset",
        image: "/images/avatars/sunset.png"
    },

    {
        slug: "tabby",
        label: "Tabby",
        image: "/images/avatars/tabby.png"
    },

    {
        slug: "tulips",
        label: "Tulips",
        image: "/images/avatars/tulips.png"
    },

    {
        slug: "white-cat",
        label: "White cat",
        image: "/images/avatars/white-cat.png"
    },

    {
        slug: "yellow-florals",
        label: "Yellow florals",
        image: "/images/avatars/yellow-florals.png"
    }
];

export function getAvatarBySlug(slug) {
    return avatars.find(a => a.slug === slug);
}