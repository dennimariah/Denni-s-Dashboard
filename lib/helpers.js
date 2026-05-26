export function cls(...a) {
  return a.filter(Boolean).join(' ');
}

export function currency(n) {
  return '$' + n.toLocaleString();
}

export function pct(part, whole) {
  return whole ? Math.round((part / whole) * 100) : 0;
}

export const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const MOOD_OPTIONS = [
  { id: 'stormy', emoji: '🌧', label: 'Stormy' },
  { id: 'low', emoji: '🌫', label: 'Low' },
  { id: 'okay', emoji: '🌿', label: 'Okay' },
  { id: 'good', emoji: '🌷', label: 'Good' },
  { id: 'glow', emoji: '🌸', label: 'Glowing' },
  { id: 'magic', emoji: '✨', label: 'Magic' },
  { id: 'wild', emoji: '🔥', label: 'Wild' },
];

export const TRANSACTION_ICONS = [
  '🥬', '🛒', '🍽', '☕', '🧘🏻‍♀️', '💄', '🎧', '📚', '💸', '✨',
  '🍷', '🚖', '⛽', '🏥', '🎁', '💐', '🍰', '🍕', '🛍', '🏡',
];
