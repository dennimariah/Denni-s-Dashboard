// ------------------------------------------------------------------
// Seed data + helpers. Exposed on window so other Babel scripts see it.
// ------------------------------------------------------------------

const SEED_TASKS = [
  { id: "t1", text: "Send Q3 wrap to the team", done: true,  day: "Mon" },
  { id: "t2", text: "Schedule dentist appointment",        done: true,  day: "Mon" },
  { id: "t3", text: "Reply to landlord email",              done: false, day: "Tue" },
  { id: "t4", text: "Pick up dry cleaning",                 done: false, day: "Tue" },
  { id: "t5", text: "Coffee with Maya 11am",                done: true,  day: "Wed" },
  { id: "t6", text: "Edit newsletter draft",                done: false, day: "Wed" },
  { id: "t7", text: "Grocery run for the week",             done: false, day: "Thu" },
  { id: "t8", text: "Call mom",                             done: false, day: "Thu" },
  { id: "t9", text: "Pilates 9am",                          done: false, day: "Fri" },
  { id: "t10", text: "Finish bookshelf reorg",              done: false, day: "Sat" },
  { id: "t11", text: "Plan Sunday brunch menu",             done: false, day: "Sun" },
];

const SEED_HABITS = [
  { id: "h1", label: "Move my body",   icon: "🌸", color: "#e8527a", bg: "#fbd7e1", goal: 5, section: "daily" },
  { id: "h2", label: "Water (8 glasses)", icon: "💧", color: "#7aaee5", bg: "#dceaf7", goal: 7, section: "daily" },
  { id: "h3", label: "Read 20 min",    icon: "📖", color: "#b39bd8", bg: "#ebe1f5", goal: 6, section: "daily" },
  { id: "h4", label: "Skincare routine", icon: "✨", color: "#f4a261", bg: "#fde3cf", goal: 7, section: "daily" },
  { id: "h5", label: "No phone in bed", icon: "🌙", color: "#88b896", bg: "#d8ecdc", goal: 5, section: "daily" },
  { id: "h6", label: "Morning pages",  icon: "🪷", color: "#d68d84", bg: "#f8dad5", goal: 4, section: "devotional" },
  { id: "h7", label: "Gratitude list", icon: "🍓", color: "#e8527a", bg: "#fbd7e1", goal: 5, section: "devotional" },
];

// Compact bitmap of 7 days. true = done.
function makeHabitLog(pattern) {
  // pattern: array of 0/1 of length 7
  return pattern.map(Boolean);
}

const SEED_HABIT_LOGS = {
  h1: makeHabitLog([1,1,0,1,1,0,0]),
  h2: makeHabitLog([1,1,1,1,1,1,0]),
  h3: makeHabitLog([1,0,1,1,1,0,0]),
  h4: makeHabitLog([1,1,1,1,1,0,0]),
  h5: makeHabitLog([1,1,0,1,0,0,0]),
  h6: makeHabitLog([1,0,1,1,0,0,0]),
  h7: makeHabitLog([1,1,1,0,1,0,0]),
};

const SEED_AGENDA = [
  { id: "a1", time: "8:30",  title: "Morning pages",    meta: "Solo time", color: "var(--accent-3)" },
  { id: "a2", time: "9:00",  title: "Team standup",     meta: "Google Meet", color: "var(--primary)" },
  { id: "a3", time: "11:30", title: "Coffee w/ Maya",   meta: "Cafe Sol",  color: "var(--accent-1)" },
  { id: "a4", time: "2:00",  title: "Design review",    meta: "Q3 dashboard", color: "var(--accent-2)" },
  { id: "a5", time: "6:30",  title: "Pilates",          meta: "Form Studio", color: "var(--primary)" },
];

const SEED_GYM_WEEK = [
  { day: "Mon", type: "Pilates",   done: true },
  { day: "Tue", type: "Run 5k",    done: true },
  { day: "Wed", type: "Rest",      done: false, rest: true },
  { day: "Thu", type: "Strength",  done: true },
  { day: "Fri", type: "Pilates",   done: false },
  { day: "Sat", type: "Hike",      done: false },
  { day: "Sun", type: "Rest",      done: false, rest: true },
];

const SEED_CARDS = [
  { id: "c1", name: "Cherry Visa",   last4: "4421", balance: 1240, limit: 6000, color: "var(--primary)" },
  { id: "c2", name: "Sapphire",      last4: "8810", balance: 320,  limit: 4500, color: "var(--accent-3)" },
  { id: "c3", name: "Amex Pink",     last4: "0044", balance: 580,  limit: 8000, color: "var(--accent-1)" },
];

const SEED_BUDGET = [
  { id: "b1", category: "Groceries",      spent: 380, budget: 500,  color: "var(--accent-2)" },
  { id: "b2", category: "Dining out",     spent: 215, budget: 250,  color: "var(--primary)" },
  { id: "b3", category: "Beauty + Self-care", spent: 140, budget: 200, color: "var(--accent-3)" },
  { id: "b4", category: "Fitness",        spent:  95, budget: 150,  color: "var(--accent-1)" },
  { id: "b5", category: "Books + Hobbies",spent:  62, budget: 100,  color: "var(--accent-4)" },
  { id: "b6", category: "Subscriptions",  spent:  84, budget:  90,  color: "var(--accent-3)" },
];

const SEED_SAVINGS = [
  { id: "s1", name: "Italy trip ✈️",  saved: 2150, goal: 4000,  color: "var(--primary)" },
  { id: "s2", name: "Emergency fund", saved: 6800, goal: 10000, color: "var(--accent-2)" },
  { id: "s3", name: "New camera",      saved: 480,  goal: 1200,  color: "var(--accent-3)" },
];

const SEED_QUARTER_GOALS = [
  { id: "g1", category: "Health",   text: "Pilates 4x/week consistently",        done: true },
  { id: "g2", category: "Health",   text: "Run a 10k by end of quarter",         done: false },
  { id: "g3", category: "Finance",  text: "Pay down Cherry Visa under $1k",      done: false },
  { id: "g4", category: "Finance",  text: "Hit $7k in emergency fund",           done: true },
  { id: "g5", category: "Personal", text: "Read 6 books (currently 4)",          done: false },
  { id: "g6", category: "Personal", text: "Weekend trip to Sonoma",              done: true },
  { id: "g7", category: "Business", text: "Launch the newsletter",               done: false },
  { id: "g8", category: "Business", text: "10 paid subscribers",                 done: false },
];

const SEED_PARKING_LOT = [
  "Try cold plunge once a week",
  "Repaint the kitchen — terracotta?",
  "Newsletter format: weekly Friday letter",
  "Photography class — Sundays in October",
  "Build a little garden balcony",
  "Stop buying iced coffees for 2 weeks",
  "Plan Maya's 30th surprise dinner",
];

const SEED_JOURNAL = [
  {
    id: "j1",
    date: "May 21, 2026",
    title: "Quiet Thursday",
    mood: "🌷",
    body: "Got up early before the apartment woke up. Made the matcha properly today — whisked it until frothy. Felt like I had a second life by 8 AM.\n\nThe design review went better than I expected. I've been worried about pushing back on the Q3 direction but the team actually agreed. Lesson: I underestimate how much people want a clear point of view.",
  },
  {
    id: "j2",
    date: "May 19, 2026",
    title: "Tired but soft",
    mood: "🌿",
    body: "Long day. Two back-to-back meetings, a billing call that took forty minutes for no reason. Did pilates anyway. Glad I went — felt the difference immediately.\n\nReading the new Ocean Vuong tonight. It's slow but the sentences keep stopping me in place.",
  },
  {
    id: "j3",
    date: "May 17, 2026",
    title: "Sunday reset",
    mood: "✨",
    body: "Cleaned, did laundry, made the kale salad I keep meaning to make. Realized I'd been wearing the same three outfits for two weeks straight. Pulled out the spring stuff finally.",
  },
];

const SEED_RECIPES = [
  { id: "r1", name: "Strawberry tahini toast",     time: "5 min",  type: "Breakfast", icon: "🍓", bg: "var(--primary-soft)",  fav: true  },
  { id: "r2", name: "Kale + crispy chickpea bowl",  time: "25 min", type: "Lunch",     icon: "🥗", bg: "var(--accent-2-soft)", fav: false },
  { id: "r3", name: "Miso butter pasta",            time: "20 min", type: "Dinner",    icon: "🍝", bg: "var(--accent-1-soft)", fav: true  },
  { id: "r4", name: "Pink coconut rice pudding",     time: "30 min", type: "Dessert",   icon: "🍮", bg: "var(--primary-soft)",  fav: false },
  { id: "r5", name: "Cucumber + chili crisp salad",  time: "10 min", type: "Side",      icon: "🥒", bg: "var(--accent-2-soft)", fav: false },
  { id: "r6", name: "Cardamom oat cookies",          time: "35 min", type: "Dessert",   icon: "🍪", bg: "var(--accent-4-soft)", fav: true  },
  { id: "r7", name: "Beet hummus + sourdough",       time: "15 min", type: "Snack",     icon: "🧄", bg: "var(--accent-3-soft)", fav: false },
  { id: "r8", name: "Roast peach + burrata",         time: "12 min", type: "Side",      icon: "🍑", bg: "var(--accent-1-soft)", fav: true  },
];

const SEED_CONTENT = [
  { id: "c1", title: "How I built my dashboard with Claude",  format: "Newsletter", status: "Drafting",  notes: "Pull from journal entries — the workflow part is the heart of it.", tags: ["build","workflow"], starred: true },
  { id: "c2", title: "Pink productivity setup tour",         format: "TikTok",     status: "Idea",      notes: "60 seconds, voiceover, cute zoom-ins on widgets.",                 tags: ["setup","aesthetic"], starred: false },
  { id: "c3", title: "Sunday reset routine",                 format: "Instagram",  status: "Scheduled", notes: "Reel + carousel. Schedule for Sunday 6pm.",                        tags: ["reset","routine"], starred: false, publishedAt: "May 26" },
  { id: "c4", title: "Newsletter #14: On quiet ambition",    format: "Newsletter", status: "Published", notes: "Performed well — 24% open, 8% click.",                              tags: ["essay"], starred: true,  publishedAt: "May 17" },
  { id: "c5", title: "5 things in my bag right now",          format: "TikTok",     status: "Published", notes: "",                                                                  tags: ["lifestyle"], starred: false, publishedAt: "May 12" },
  { id: "c6", title: "The case for a paper habit tracker",    format: "Blog",       status: "Idea",      notes: "Counter-take to digital obsession. Use stationery photo.",          tags: ["hot-take"], starred: false },
  { id: "c7", title: "Money diary: May edition",              format: "Newsletter", status: "Drafting",  notes: "Be honest about the bad weeks too.",                                tags: ["finance","diary"], starred: false },
  { id: "c8", title: "Quick interview w/ Maya about her brand", format: "Podcast",  status: "Scheduled", notes: "Record Thursday 3pm. 30 min cut.",                                  tags: ["interview"], starred: true, publishedAt: "May 30" },
  { id: "c9", title: "Strawberry tahini toast recipe video",   format: "Video",      status: "Idea",      notes: "Slow-mo drizzle shot, very pink.",                                   tags: ["recipe"], starred: false },
  { id: "c10", title: "My Q2 review (publicly)",               format: "Newsletter", status: "Idea",      notes: "End of June. Photos from each month.",                              tags: ["reflection"], starred: false },
  { id: "c11", title: "Pilates studio review carousel",        format: "Instagram",  status: "Drafting",  notes: "",                                                                  tags: ["review"], starred: false },
  { id: "c12", title: "Morning routine voiceover",             format: "TikTok",     status: "Scheduled", notes: "Drop Tuesday morning.",                                              tags: ["routine"], starred: false, publishedAt: "May 28" },
];

const SEED_TRANSACTIONS = [
  { id: "tx1", date: "May 24", vendor: "Whole Foods",   amount: -82.14, category: "Groceries",            icon: "🥬" },
  { id: "tx2", date: "May 23", vendor: "Glossier",       amount: -48.00, category: "Beauty + Self-care",   icon: "💄" },
  { id: "tx3", date: "May 22", vendor: "Salary",          amount:  4280,  category: "Income",               icon: "✨" },
  { id: "tx4", date: "May 22", vendor: "Cafe Sol",        amount: -7.50,  category: "Dining out",           icon: "☕" },
  { id: "tx5", date: "May 21", vendor: "Pilates Form",    amount: -32.00, category: "Fitness",              icon: "🧘🏻‍♀️" },
  { id: "tx6", date: "May 20", vendor: "Spotify",         amount: -10.99, category: "Subscriptions",        icon: "🎧" },
  { id: "tx7", date: "May 19", vendor: "Trader Joe's",     amount: -41.20, category: "Groceries",            icon: "🛒" },
];

const TRANSACTION_ICONS = [
  "🥬", "🛒", "🍽", "☕", "🧘🏻‍♀️", "💄", "🎧", "📚", "💸", "✨",
  "🍷", "🚖", "⛽", "🏥", "🎁", "💐", "🍰", "🍕", "🛍", "🏡",
];

const SEED_MOOD_WEEK = [
  { day: "Mon", mood: 4, emoji: "🌸" },
  { day: "Tue", mood: 3, emoji: "🌿" },
  { day: "Wed", mood: 5, emoji: "✨" },
  { day: "Thu", mood: 4, emoji: "🌷" },
  { day: "Fri", mood: 0, emoji: null },
  { day: "Sat", mood: 0, emoji: null },
  { day: "Sun", mood: 0, emoji: null },
];

const MOOD_OPTIONS = [
  { id: "stormy",  emoji: "🌧",  label: "Stormy" },
  { id: "low",     emoji: "🌫",  label: "Low" },
  { id: "okay",    emoji: "🌿",  label: "Okay" },
  { id: "good",    emoji: "🌷",  label: "Good" },
  { id: "glow",    emoji: "🌸",  label: "Glowing" },
  { id: "magic",   emoji: "✨",  label: "Magic" },
  { id: "wild",    emoji: "🔥",  label: "Wild" },
];

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ----- Themes -----
const THEMES = {
  strawberry: {
    label: "Strawberry Cream",
    swatches: ["#fdf3ef", "#e8527a", "#f4a261", "#88b896", "#b39bd8"],
    vars: {
      "--bg": "#fdf3ef",
      "--bg-soft": "#fbe7e0",
      "--card": "#ffffff",
      "--card-2": "#fff7f3",
      "--ink": "#3a1d28",
      "--ink-soft": "#6b4250",
      "--muted": "#a98591",
      "--line": "#f3d9d9",
      "--line-soft": "#f7e7e7",
      "--primary": "#e8527a",
      "--primary-soft": "#fbd7e1",
      "--primary-deep": "#b1325c",
      "--accent-1": "#f4a261",
      "--accent-1-soft": "#fde3cf",
      "--accent-2": "#88b896",
      "--accent-2-soft": "#d8ecdc",
      "--accent-3": "#b39bd8",
      "--accent-3-soft": "#ebe1f5",
      "--accent-4": "#f7c548",
      "--accent-4-soft": "#fdecbc",
    },
  },
  cottoncandy: {
    label: "Cotton Candy",
    swatches: ["#fbf2f7", "#f48fb1", "#a8d8f0", "#c7b8ea", "#fbd9c5"],
    vars: {
      "--bg": "#fbf2f7",
      "--bg-soft": "#f6e1ee",
      "--card": "#ffffff",
      "--card-2": "#fdf4f9",
      "--ink": "#3d1e35",
      "--ink-soft": "#6b3f5e",
      "--muted": "#b39ab0",
      "--line": "#f1d8e5",
      "--line-soft": "#f7e7ef",
      "--primary": "#f48fb1",
      "--primary-soft": "#fbe0eb",
      "--primary-deep": "#c4658a",
      "--accent-1": "#fbb286",
      "--accent-1-soft": "#fde3cf",
      "--accent-2": "#a8d8f0",
      "--accent-2-soft": "#daedf8",
      "--accent-3": "#c7b8ea",
      "--accent-3-soft": "#ece5f7",
      "--accent-4": "#fcdd8c",
      "--accent-4-soft": "#fdf1cd",
    },
  },
  hibiscus: {
    label: "Hibiscus",
    swatches: ["#fff5f7", "#d6336c", "#ff8c69", "#f4a261", "#b08bd1"],
    vars: {
      "--bg": "#fff5f7",
      "--bg-soft": "#ffe0e8",
      "--card": "#ffffff",
      "--card-2": "#fff0f4",
      "--ink": "#2d0a1a",
      "--ink-soft": "#5e2238",
      "--muted": "#a8758a",
      "--line": "#f4d0dc",
      "--line-soft": "#fae0e8",
      "--primary": "#d6336c",
      "--primary-soft": "#fbcfdd",
      "--primary-deep": "#931f49",
      "--accent-1": "#ff8c69",
      "--accent-1-soft": "#ffd9c9",
      "--accent-2": "#8eb89a",
      "--accent-2-soft": "#d6ecdc",
      "--accent-3": "#b08bd1",
      "--accent-3-soft": "#e6d9f0",
      "--accent-4": "#f5b942",
      "--accent-4-soft": "#fce4ba",
    },
  },
  peony: {
    label: "Peony Garden",
    swatches: ["#f5f0ed", "#c4658a", "#7d9b6f", "#cda678", "#a8c9b3"],
    vars: {
      "--bg": "#f5f0ed",
      "--bg-soft": "#ede0d8",
      "--card": "#ffffff",
      "--card-2": "#faf5f2",
      "--ink": "#2d2422",
      "--ink-soft": "#5c4944",
      "--muted": "#a89c95",
      "--line": "#e6d8d0",
      "--line-soft": "#ede2db",
      "--primary": "#c4658a",
      "--primary-soft": "#f1d4df",
      "--primary-deep": "#8a4063",
      "--accent-1": "#cda678",
      "--accent-1-soft": "#ecd9bd",
      "--accent-2": "#7d9b6f",
      "--accent-2-soft": "#d3dfcb",
      "--accent-3": "#a8c9b3",
      "--accent-3-soft": "#d9e8de",
      "--accent-4": "#e0b95d",
      "--accent-4-soft": "#f4e0a3",
    },
  },
  lavender: {
    label: "Lavender Plum",
    swatches: ["#f6f3fa", "#9b6dc9", "#e87aa6", "#b09bd6", "#f2c08c"],
    vars: {
      "--bg": "#f6f3fa",
      "--bg-soft": "#ebe2f0",
      "--card": "#ffffff",
      "--card-2": "#f8f4fb",
      "--ink": "#2a1a3a",
      "--ink-soft": "#553f72",
      "--muted": "#9c87b3",
      "--line": "#e4d8ed",
      "--line-soft": "#eee5f3",
      "--primary": "#9b6dc9",
      "--primary-soft": "#e2d2f0",
      "--primary-deep": "#6a4093",
      "--accent-1": "#e87aa6",
      "--accent-1-soft": "#fbd8e4",
      "--accent-2": "#8eb89a",
      "--accent-2-soft": "#d8ecdc",
      "--accent-3": "#b09bd6",
      "--accent-3-soft": "#e2d8f0",
      "--accent-4": "#f2c08c",
      "--accent-4-soft": "#fbe2c8",
    },
  },
};

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------
function cls(...a) { return a.filter(Boolean).join(" "); }
function currency(n) { return "$" + n.toLocaleString(); }
function pct(part, whole) { return whole ? Math.round((part / whole) * 100) : 0; }

function applyTheme(themeKey) {
  const theme = THEMES[themeKey] || THEMES.strawberry;
  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));
}

Object.assign(window, {
  SEED_TASKS, SEED_HABITS, SEED_HABIT_LOGS, SEED_AGENDA, SEED_GYM_WEEK,
  SEED_CARDS, SEED_BUDGET, SEED_SAVINGS, SEED_QUARTER_GOALS, SEED_PARKING_LOT,
  SEED_JOURNAL, SEED_RECIPES, SEED_MOOD_WEEK, SEED_CONTENT, SEED_TRANSACTIONS, TRANSACTION_ICONS,
  MOOD_OPTIONS, DAYS_OF_WEEK, THEMES,
  cls, currency, pct, applyTheme,
});
