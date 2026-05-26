import { DAYS_OF_WEEK } from '@/lib/helpers';

function buildMessage(data) {
  const now = new Date();
  const etDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const dateStr = etDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const todayIdx = (etDate.getDay() + 6) % 7;
  const todayShort = DAYS_OF_WEEK[todayIdx];

  const allTodayTasks = (data.tasks || []).filter(t => t.day === todayShort);
  const doneTasks = allTodayTasks.filter(t => t.done).length;
  const pendingTasks = allTodayTasks.filter(t => !t.done);

  const agendaItems = (data.agenda || []).slice(0, 3);

  const dailyHabits = (data.habits || []).filter(h => h.section === 'daily').slice(0, 5);
  const habitsCompleted = dailyHabits.filter(h => (data.habitLogs?.[h.id] || [])[todayIdx]).length;

  const lines = [`Good morning Dennika ✦`, dateStr];

  if (agendaItems.length > 0) {
    lines.push('', '📅 Today:');
    agendaItems.forEach(a => lines.push(`• ${a.time} ${a.title}`));
  }

  lines.push('', `✅ Tasks (${doneTasks}/${allTodayTasks.length}):`);
  if (pendingTasks.length > 0) {
    pendingTasks.slice(0, 5).forEach((t, i) => lines.push(`${i + 1}. ${t.text}`));
  } else if (allTodayTasks.length > 0) {
    lines.push('All done! 🎉');
  } else {
    lines.push('Nothing scheduled');
  }

  if (data.focus) {
    lines.push('', `🎯 "${data.focus}"`);
  }

  if (dailyHabits.length > 0) {
    lines.push('', `💪 Habits: ${habitsCompleted}/${dailyHabits.length} done today`);
  }

  lines.push('', '✨ Have a beautiful day.');

  return lines.join('\n');
}

export async function sendMorningBriefing(data) {
  await fetch(`https://ntfy.sh/${process.env.NTFY_TOPIC}`, {
    method: 'POST',
    headers: {
      'Title': 'Good morning Dennika ✦',
      'Priority': 'default',
      'Content-Type': 'text/plain',
    },
    body: buildMessage(data),
  });
}
