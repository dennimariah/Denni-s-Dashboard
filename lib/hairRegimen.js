const REGIMEN_START = new Date('2026-05-14T00:00:00');

export function getRegimenWeek() {
  const now = new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00');
  return Math.max(1, Math.min(8, Math.floor((now - REGIMEN_START) / (7 * 86400000)) + 1));
}
