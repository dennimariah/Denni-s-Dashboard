export const DEFAULT_HABITS = [
  { id: "h1", label: "Move my body", icon: "🌸", color: "#e8527a", bg: "#fbd7e1", goal: 5, section: "daily" },
  { id: "h2", label: "Water (8 glasses)", icon: "💧", color: "#7aaee5", bg: "#dceaf7", goal: 7, section: "daily" },
  { id: "h3", label: "Read 20 min", icon: "📖", color: "#b39bd8", bg: "#ebe1f5", goal: 6, section: "daily" },
  { id: "h4", label: "Skincare routine", icon: "✨", color: "#f4a261", bg: "#fde3cf", goal: 7, section: "daily" },
  { id: "h5", label: "No phone in bed", icon: "🌙", color: "#88b896", bg: "#d8ecdc", goal: 5, section: "daily" },
  { id: "h6", label: "Morning pages", icon: "🪷", color: "#d68d84", bg: "#f8dad5", goal: 4, section: "devotional" },
  { id: "h7", label: "Gratitude list", icon: "🍓", color: "#e8527a", bg: "#fbd7e1", goal: 5, section: "devotional" },
];

export const DEFAULT_BUDGET = [
  { id: "b1", category: "Groceries", spent: 0, budget: 500, color: "var(--accent-2)" },
  { id: "b2", category: "Dining out", spent: 0, budget: 250, color: "var(--primary)" },
  { id: "b3", category: "Beauty + Self-care", spent: 0, budget: 200, color: "var(--accent-3)" },
  { id: "b4", category: "Fitness", spent: 0, budget: 150, color: "var(--accent-1)" },
  { id: "b5", category: "Books + Hobbies", spent: 0, budget: 100, color: "var(--accent-4)" },
  { id: "b6", category: "Subscriptions", spent: 0, budget: 90, color: "var(--accent-3)" },
];

export const DEFAULT_GYM_WEEK = [
  { day: "Mon", type: "Workout", done: false },
  { day: "Tue", type: "Workout", done: false },
  { day: "Wed", type: "Rest", done: false, rest: true },
  { day: "Thu", type: "Workout", done: false },
  { day: "Fri", type: "Workout", done: false },
  { day: "Sat", type: "Workout", done: false },
  { day: "Sun", type: "Rest", done: false, rest: true },
];

export const DEFAULT_MOOD_WEEK = [
  { day: "Mon", mood: 0, emoji: null },
  { day: "Tue", mood: 0, emoji: null },
  { day: "Wed", mood: 0, emoji: null },
  { day: "Thu", mood: 0, emoji: null },
  { day: "Fri", mood: 0, emoji: null },
  { day: "Sat", mood: 0, emoji: null },
  { day: "Sun", mood: 0, emoji: null },
];

export function getDefaultState() {
  return {
    page: "today",
    tasks: [],
    habits: DEFAULT_HABITS,
    habitLogs: {
      h1: [false, false, false, false, false, false, false],
      h2: [false, false, false, false, false, false, false],
      h3: [false, false, false, false, false, false, false],
      h4: [false, false, false, false, false, false, false],
      h5: [false, false, false, false, false, false, false],
      h6: [false, false, false, false, false, false, false],
      h7: [false, false, false, false, false, false, false],
    },
    agenda: [],
    gymWeek: DEFAULT_GYM_WEEK,
    cards: [],
    budget: DEFAULT_BUDGET,
    savings: [],
    quarterGoals: [],
    parking: [],
    journal: [],
    recipes: [],
    content: [],
    transactions: [],
    moodWeek: DEFAULT_MOOD_WEEK,
    hair: { activeWeek: 1, nightlyDone: {}, scalpDays: {} },
    focus: "",
    reflections: { wins: "", push: "" },
    calendarUrls: [],
    show: {
      today: true,
      week: true,
      habits: true,
      quarter: true,
      finance: true,
      journal: true,
      recipes: true,
      content: true,
      hair: true,
      briefing: true,
    },
  };
}
