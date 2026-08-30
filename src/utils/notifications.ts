import { Task, ReminderTiming } from '../types';
import { soundFx } from './sound';
import { formatKhmerTime } from './khmerDates';

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch {
    return 'denied';
  }
}

export function sendBrowserNotification(title: string, body: string, icon?: string) {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: icon || '🔔',
      });
    } catch {
      // Ignore
    }
  }
}

// Calculate the reminder timestamp for a task in milliseconds
export function getReminderTargetTimestamp(task: Task): number | null {
  if (task.completed || task.reminderTiming === 'none') {
    return null;
  }

  // If snoozed, check snoozed time
  if (task.reminderSnoozedUntil) {
    return new Date(task.reminderSnoozedUntil).getTime();
  }

  if (!task.dueDate) return null;

  const [y, m, d] = task.dueDate.split('-').map(Number);
  const [hour, min] = (task.dueTime || '09:00').split(':').map(Number);

  const targetDate = new Date(y, m - 1, d, hour, min, 0, 0);
  const offsetMinutes = getTimingOffsetMinutes(task.reminderTiming);

  return targetDate.getTime() - offsetMinutes * 60 * 1000;
}

function getTimingOffsetMinutes(timing: ReminderTiming): number {
  switch (timing) {
    case '5m_before': return 5;
    case '15m_before': return 15;
    case '30m_before': return 30;
    case '1h_before': return 60;
    case '1d_before': return 24 * 60;
    case 'at_time':
    default: return 0;
  }
}

// Check which tasks need reminders right now
export function checkDueReminders(tasks: Task[]): Task[] {
  const now = Date.now();
  const triggered: Task[] = [];

  tasks.forEach((task) => {
    if (task.completed) return;
    if (task.reminderTriggered && !task.reminderSnoozedUntil) return;

    const targetTime = getReminderTargetTimestamp(task);
    if (targetTime && now >= targetTime && now - targetTime <= 1000 * 60 * 60 * 12) {
      // Triggered within reasonable window (last 12 hours)
      triggered.push(task);
    }
  });

  return triggered;
}

export function triggerTaskAlert(task: Task) {
  soundFx.playReminderChime();
  const timeInfo = task.dueTime ? ` ម៉ោង ${formatKhmerTime(task.dueTime)}` : '';
  sendBrowserNotification(
    `⏰ រំលឹកកិច្ចការ៖ ${task.title}`,
    `ដល់ពេលអនុវត្តកិច្ចការរបស់អ្នកហើយ!${timeInfo}`
  );
}
