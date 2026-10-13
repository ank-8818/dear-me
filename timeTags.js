export const timeSlots = [
    {
        name: "Early morning",
        colorClass: "time-lilac",
        tags: [
            { slug: "before-the-birds", label: "#BeforeTheBirds" },
            { slug: "blanket-to-brain", label: "#BlanketToBrain" }
        ]
    },

    {
        name: "Morning",
        colorClass: "time-sage",
        tags: [
            { slug: "sunshine-and-static", label: "#SunshineAndStatic" },
            { slug: "brain-booting-up", label: "#BrainBootingUp" }
        ]
    },

    {
        name: "Noon",
        colorClass: "time-yellow",
        tags: [
            { slug: "midday-muddle", label: "#MiddayMuddle" },
            { slug: "lunch-break-lore", label: "#LunchBreakLore" }
        ]
    },

    {
        name: "Afternoon",
        colorClass: "time-yellow",
        tags: [
            { slug: "afternoon-brain-fog", label: "#AfternoonBrainFog" },
            { slug: "three-pm-soul", label: "#ThreePMSoul" }
        ]
    },

    {
        name: "Golden hour",
        colorClass: "time-coral",
        tags: [
            { slug: "nostalgia-o-clock", label: "#NostalgiaOClock" },
            { slug: "honey-light-thoughts", label: "#HoneyLightThoughts" }
        ]
    },

    {
        name: "Dusk and twilight",
        colorClass: "time-pink",
        tags: [
            { slug: "unfinished-feelings", label: "#UnfinishedFeelings" },
            { slug: "twilight-tangles", label: "#TwilightTangles" }
        ]
    },

    {
        name: "Evening",
        colorClass: "time-blue",
        tags: [
            { slug: "after-hours-of-existing", label: "#AfterHoursOfExisting" },
            { slug: "the-days-leftovers", label: "#TheDaysLeftovers" }
        ]
    },

    {
        name: "Night",
        colorClass: "time-blue",
        tags: [
            { slug: "night-owl-notes", label: "#NightOwlNotes" },
            { slug: "unsupervised-thoughts", label: "#UnsupervisedThoughts" }
        ]
    },

    {
        name: "Midnight",
        colorClass: "time-deep",
        tags: [
            { slug: "the-sleep-can-wait", label: "#TheSleepCanWait" },
            { slug: "unsent-at-midnight", label: "#UnsentAtMidnight" }
        ]
    },

    {
        name: "2 AM and beyond",
        colorClass: "time-deep",
        tags: [
            { slug: "my-brain-has-wi-fi", label: "#MyBrainHasWiFi" },
            { slug: "why-am-i-still-awake", label: "#WhyAmIStillAwake" }
        ]
    },

    {
        name: "Pre-dawn",
        colorClass: "time-lilac",
        tags: [
            { slug: "before-the-world-wakes", label: "#BeforeTheWorldWakes" },
            { slug: "sleepless-and-scribbling", label: "#SleeplessAndScribbling" }
        ]
    }
];


const allTimeTags = timeSlots.flatMap(slot =>
    slot.tags.map(tag => ({...tag, slotName: slot.name, colorClass: slot.colorClass}))
);

export function getTimeTagBySlug(slug) {
    return allTimeTags.find(tag => tag.slug === slug);
}