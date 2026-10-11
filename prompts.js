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

const buttons = [
  "send it",
  "dump it",
  "let it out",
  "press to release",
  "seal the thought",
  "ship it to future me",
  "drop the brain rot",
  "okay, i'm done"
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



function pick(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export function placeholderText() {
  return {
      title: pick(titles),
      body: pick(bodies),
      button: pick(buttons)
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