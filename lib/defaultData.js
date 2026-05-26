export const DEFAULT_HABITS = [
  // Body
  { id: "hb1", label: "Protein goal hit",           icon: "🥩", color: "#e8527a", bg: "#fbd7e1", goal: 7, section: "body" },
  { id: "hb2", label: "Workout done",                icon: "💪", color: "#7aaee5", bg: "#dceaf7", goal: 5, section: "body" },
  { id: "hb3", label: "Hydrated",                    icon: "💧", color: "#b39bd8", bg: "#ebe1f5", goal: 7, section: "body" },
  { id: "hb4", label: "Anti-inflammatory meal",      icon: "🥗", color: "#88b896", bg: "#d8ecdc", goal: 7, section: "body" },
  // Hair
  { id: "hh1", label: "Nightly hair protection",     icon: "🎀", color: "#f4a261", bg: "#fde3cf", goal: 7, section: "hair" },
  { id: "hh2", label: "Scalp treatment applied",     icon: "🌱", color: "#6db88a", bg: "#c8e8d4", goal: 7, section: "hair" },
  // Business
  { id: "hbs1", label: "School hours logged",        icon: "📚", color: "#9b7cc8", bg: "#e0d4f5", goal: 5, section: "business" },
  { id: "hbs2", label: "Silk Collective task done",  icon: "👑", color: "#f7c548", bg: "#fef3cd", goal: 5, section: "business" },
  // Mind & Recovery
  { id: "hm1", label: "Morning devotion",            icon: "🕊️", color: "#d68d84", bg: "#f8dad5", goal: 7, section: "mind" },
  { id: "hm2", label: "Screen-free wind down",       icon: "🌙", color: "#88b896", bg: "#d8ecdc", goal: 7, section: "mind" },
  { id: "hm3", label: "In bed on time",              icon: "😴", color: "#7aaee5", bg: "#dceaf7", goal: 7, section: "mind" },
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
      hb1:  [false, false, false, false, false, false, false],
      hb2:  [false, false, false, false, false, false, false],
      hb3:  [false, false, false, false, false, false, false],
      hb4:  [false, false, false, false, false, false, false],
      hh1:  [false, false, false, false, false, false, false],
      hh2:  [false, false, false, false, false, false, false],
      hbs1: [false, false, false, false, false, false, false],
      hbs2: [false, false, false, false, false, false, false],
      hm1:  [false, false, false, false, false, false, false],
      hm2:  [false, false, false, false, false, false, false],
      hm3:  [false, false, false, false, false, false, false],
    },
    weeklyHabitLogs: {},
    churchLog: {},
    agenda: [],
    gymWeek: DEFAULT_GYM_WEEK,
    cards: [],
    budget: DEFAULT_BUDGET,
    savings: [],
    quarterGoals: [],
    parking: [],
    journal: [],
    brainDumps: [],
    moodLog: {},
    journalPin: null,
    recipes: [],
    content: [],
    transactions: [],
    moodWeek: DEFAULT_MOOD_WEEK,
    hair: {
      activeWeek: 5,
      currentStyle: 'natural',
      nightlyDone: {},
      nightlyDate: '',
      scalpDays: {},
      washDayLog: [],
      lengthLog: [{ date: new Date().toISOString().slice(0, 10), length: 15 }],
      templeNotes: '',
      progressPhotos: [],
    },
    fitness: {
      weightLog: [{ date: new Date().toISOString().slice(0, 10), weight: 160 }],
      measurements: { waist: 0, arms: 0, glutes: 0, hips: 0, date: '' },
      goals: { glutes: 30, arms: 20, core: 25, back: 20 },
      goalNotes: { glutes: '', arms: '', core: '', back: '' },
      targets: { calories: 1800, protein: 130, workoutsPerWeek: 3 },
      nutritionLog: [],
      workoutLog: [],
      watchWorkouts: [],
      sleepLog: [],
      progressPhotos: [],
    },
    focus: "",
    reflections: { wins: "", push: "" },
    groceryList: [],
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
      fitness: true,
    },
  };
}
