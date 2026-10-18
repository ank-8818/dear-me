const homePageQuotes = [
  "The path ahead might be harder than it seems. But it is yours.",
  "You don't have to stay on a path just because you've already started walking it. You're allowed to change direction.",
  "It's okay to be scared. You don't have to figure everything out today.",
  "You've made it through difficult things before. Give yourself a little credit for that.",
  "You don't have to be fearless to try. And when it all gets a little too much, you can put your thoughts down here.",
  "Not every thought needs a conclusion. Some just need somewhere to go.",
  "You're allowed to have a day that doesn't turn into a lesson.",
  "It's okay if all you did today was get through today.",
  "You don't have to make sense of everything before you write it down."
];

const welcomeNames = [
  "Dreamer",
  "Stargazer",
  "Wonder-Seeker",
  "Storyteller",
  "Brave Soul",
  "Little Fighter",
  "Steady Heart",
  "Quiet Courage",
  "Work in Progress",
  "Little Seedling",
  "Hopeful Heart",
  "Phoenix",
  "Wanderer",
  "Kind Soul",
  "Little Light",
  "Wayfinder",
  "Resilient One",
  "Gentle Rebel",
  "Unfinished Masterpiece",
  "One Step at a Time"
];

const titles = [
  "dear me, today i was feeling...",
  "so, what's the story?",
  "name this little moment",
  "the headline of your chaos",
  "today's one-liner",
  "what's the vibe? (be honest)",
  "a title, if you're feeling fancy",
  "summarize your entire existence in 80 chars",
  "the subject line of your soul",
  "what would you whisper if no one was listening?"
];

const bodies = [
  "just... talk to yourself. it's okay.",
  "spill it. ramble. no filter.",
  "brain to page. that's the whole rule.",
  "the good, the bad, the 2am thoughts",
  "no one's grading this. go.",
  "write like you're texting your best friend at 1am",
  "this is your therapy. the couch is free.",
  "ramble responsibly (or don't)",
  "future you will thank present you for this",
  "no structure. no rules. just vibes."
];

const excessTitleErrors = [
  "that title's got ambition. 80 chars max, sorry.",
  "shorter! your future self won't read 80+ chars.",
  "the title box is small. it's a feature, not a bug."
];

const emptyTitleErrors = [
  "give me at least one real character.",
  "spaces aren't a thought, dear.",
  "the title is empty. ironically."
];

const bodyErrors = [
  "you said you'd dump it... dump it.",
  "at least give me one sentence to work with.",
  "a post with no body is just a title wearing a trench coat."
];

const longBodyErrors = [
  "10,000 characters max. that's roughly 1,800 words — a whole short story. if it's longer, maybe split it into two thoughts?",
  "the box holds 10,000 characters. that's a lot of brain. if you need more, it's probably two thoughts wearing a trench coat.",
  "10,000 chars is the limit. you've hit the wall of 'one post can hold this much.' consider giving the rest its own card.",
  "that's 10,000 characters of you. impressive. but the box tops out there — maybe the overflow deserves its own post?",
  "10,000 characters. that's a novella's worth of feeling. if there's more, it's not lost — it's just waiting for the next one."
]

const longCWErrors = [
  "60 chars max. it's a warning, not a therapy session.",
  "the CW box is tiny. be brief, be kind.",
  "shorten the warning. the post can do the long part."
];

const tooManyTagsErrors = [
  "three tags max. pick your favorites.",
  "the tag box is a trio, not a playlist.",
  "three is the magic number here. choose wisely."
];

const badPseudonymErrors = [
  "names need 3 to 20 characters: letters, numbers, spaces, hyphens or underscores. no emoji, sorry.",
  "that name doesn't fit yet. keep it to 3–20 characters, using letters, numbers, spaces, - or _.",
  "almost! pseudonyms are 3–20 characters, and only letters, numbers, spaces, - and _ are allowed.",
  "try a simpler one: 3–20 characters, using letters, numbers, spaces, - or _."
];

const takenPseudonymErrors = [
  "someone's already wearing that name. try another?",
  "that pseudonym's taken. the universe says: pick a different hat.",
  "already claimed. want to try another one?",
  "that name already has an owner. find one that's yours."
];

const shortPasswordErrors = [
  "8 characters minimum. a little longer, please.",
  "that password is a bit short. 8 or more keeps your account safer.",
  "make it 8 characters or more. a few random words strung together works well."
];

const longPasswordErrors = [
  "that one's too long. please keep it to 72 characters or fewer."
];

const mismatchPasswordErrors = [
  "those two don't match. try typing them again?",
  "password and confirm-password need to match exactly.",
  "one of them probably has a typo. retype both and we'll compare."
];

const noAvatarErrors = [
  "pick a picture to go with your name. any of them will do.",
  "you forgot your picture. choose one below.",
  "almost done, just choose a picture."
];

const loginErrors = [
  "close, but not quite. the name and password need to match what you signed up with.",
  "that pair doesn't open the door. give it another shot?",
  "we can't find that combination. no harm done, try once more.",
  "hmm, that combination doesn't match. double-check both?"
]

const tooManyAttemptsErrors = [
  "that's enough for now. sip some water, come back in a bit.",
  "whoa, easy. lock's a bit shy right now. come back in a minute?",
  "hey, slow down. take a breath and try again in a minute.",
  "you've knocked a few times. the door's not mad, just needs a sec. try again shortly."
]

const recoveryErrors = [
  "that combination doesn't match. check the name and the code one more time?",
  "hmm, the name and code don't line up. no rush, try again.",
  "that's not the pair we have on file. double-check both, no stress.",
  "close, but not quite. the name + code need to match what you saved.",
  "the door's not opening. give the name and code another look?"
];

const deleteAccountErrors = [
  "that password doesn't match, so nothing was deleted. you're still here. (for now? no, for a while.)",
  "wrong password, nothing happened. your posts are safe. your thoughts are safe. take a breath and try again.",
  "the password didn't match, so the door stayed shut. nothing was touched. try one more time?",
  "that's not the password, so nothing was deleted. your little corner is exactly as you left it.",
  "nope, that's not it. nothing was deleted, nothing was lost. your words are still waiting for you."
];

const reportReasonErrors = [
  "pick a reason, even a rough one. it helps us understand what went wrong.",
  "we need a little context to do anything with this. tap one of the options above?",
  "we can't file a report with a blank 'why.' pick the closest one, even if it's not perfect.",
  "one tap, that's all. which one fits? (there's no wrong answer here.)"
];




function pick(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export function placeholderText() {
  return {
      title: pick(titles),
      body: pick(bodies),
  }
}

export function getExcessTitleError() {
  return pick(excessTitleErrors);
}

export function getEmptyTitleError() {
  return pick(emptyTitleErrors);
}

export function getBodyError() {
  return pick(bodyErrors);
}

export function getLongBodyError() {
  return pick(longBodyErrors);
}

export function getLongCWError() {
  return pick(longCWErrors);
}

export function getHomePageQuote() {
  return pick(homePageQuotes);
}

export function getTooManyTagsError() {
  return pick(tooManyTagsErrors);
}

export function getBadPseudonymError() {
  return pick(badPseudonymErrors);
}

export function getTakenPseudonymError() {
  return pick(takenPseudonymErrors);
}

export function getShortPasswordError() {
  return pick(shortPasswordErrors);
}

export function getLongPasswordError() {
  return pick(longPasswordErrors);
}

export function getMismatchPasswordError() {
  return pick(mismatchPasswordErrors);
}

export function getNoAvatarError() {
  return pick(noAvatarErrors);
}

export function getLoginError() {
  return pick(loginErrors);
}

export function getWelcomeName() {
  return pick(welcomeNames);
}

export function getTooManyAttemptsError() {
  return pick(tooManyAttemptsErrors);
}

export function getRecoveryError() {
  return pick(recoveryErrors);
}

export function getDeleteAccountError() {
  return pick(deleteAccountErrors);
}

export function getReportReasonError() {
  return pick(reportReasonErrors);
}