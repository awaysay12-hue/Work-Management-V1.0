import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Task, DailyStreak } from '../types';

// Configuration for Supabase with the user's provided API key and project ref
const DEFAULT_PROJECT_REF = 'rjkxjgqmnvv30fl0o4';
const DEFAULT_SUPABASE_URL = `https://${DEFAULT_PROJECT_REF}.supabase.co`;
const DEFAULT_ANON_KEY = 'sb_publishable_rJKxJgQMNVV30FL0o4_S3w_hNdajzYw';

const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env || {} : {};

export const SUPABASE_URL = metaEnv.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
export const SUPABASE_ANON_KEY = metaEnv.VITE_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY;


export let supabase: SupabaseClient | null = null;

try {
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
} catch (err) {
  console.warn('Failed to initialize Supabase client:', err);
}

// Convert Frontend Task (camelCase) to DB Row (snake_case)
export function taskToDbRow(task: Task) {
  return {
    id: task.id,
    title: task.title,
    description: task.description || '',
    category: task.category,
    priority: task.priority,
    due_date: task.dueDate,
    due_time: task.dueTime || null,
    reminder_timing: task.reminderTiming || 'none',
    reminder_triggered: Boolean(task.reminderTriggered),
    reminder_snoozed_until: task.reminderSnoozedUntil || null,
    completed: Boolean(task.completed),
    completed_at: task.completedAt || null,
    created_at: task.createdAt,
    subtasks: task.subtasks || [],
    estimated_minutes: task.estimatedMinutes || 25,
    spent_minutes: task.spentMinutes || 0,
    recurring: task.recurring || 'none',
    tags: task.tags || [],
    assignee_id: task.assigneeId || null,
    assignee_name: task.assigneeName || null,
    creator_id: task.creatorId || null,
    creator_name: task.creatorName || null,
  };
}

// Convert DB Row (snake_case) to Frontend Task (camelCase)
export function dbRowToTask(row: any): Task {
  return {
    id: String(row.id),
    title: String(row.title || ''),
    description: row.description || undefined,
    category: row.category || 'other',
    priority: row.priority || 'medium',
    dueDate: row.due_date || new Date().toISOString().split('T')[0],
    dueTime: row.due_time || undefined,
    reminderTiming: row.reminder_timing || 'none',
    reminderTriggered: Boolean(row.reminder_triggered),
    reminderSnoozedUntil: row.reminder_snoozed_until || undefined,
    completed: Boolean(row.completed),
    completedAt: row.completed_at || undefined,
    createdAt: row.created_at || new Date().toISOString(),
    subtasks: Array.isArray(row.subtasks) ? row.subtasks : [],
    estimatedMinutes: Number(row.estimated_minutes) || 25,
    spentMinutes: Number(row.spent_minutes) || 0,
    recurring: row.recurring || 'none',
    tags: Array.isArray(row.tags) ? row.tags : [],
    assigneeId: row.assignee_id || undefined,
    assigneeName: row.assignee_name || undefined,
    creatorId: row.creator_id || undefined,
    creatorName: row.creator_name || undefined,
  };
}

// Convert Streak to DB Row
export function streakToDbRow(streak: DailyStreak) {
  return {
    id: 'main',
    current_streak: streak.currentStreak,
    longest_streak: streak.longestStreak,
    last_active_date: streak.lastActiveDate,
    total_completed_all_time: streak.totalCompletedAllTime,
    total_focus_minutes_all_time: streak.totalFocusMinutesAllTime,
  };
}

// Convert DB Row to Streak
export function dbRowToStreak(row: any): DailyStreak {
  return {
    currentStreak: Number(row.current_streak) || 0,
    longestStreak: Number(row.longest_streak) || 0,
    lastActiveDate: row.last_active_date || new Date().toISOString().split('T')[0],
    totalCompletedAllTime: Number(row.total_completed_all_time) || 0,
    totalFocusMinutesAllTime: Number(row.total_focus_minutes_all_time) || 0,
  };
}

/**
 * Fetch all tasks from Supabase
 */
export async function fetchTasksFromSupabase(): Promise<{ tasks: Task[] | null; error: Error | null }> {
  if (!supabase) {
    return { tasks: null, error: new Error('Supabase client not initialized') };
  }
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data) return { tasks: [], error: null };

    const tasks = data.map(dbRowToTask);
    return { tasks, error: null };
  } catch (err: any) {
    return { tasks: null, error: err };
  }
}

/**
 * Upsert a single task in Supabase
 */
export async function saveTaskToSupabase(task: Task): Promise<{ success: boolean; error: Error | null }> {
  if (!supabase) {
    return { success: false, error: new Error('Supabase client not initialized') };
  }
  try {
    const row = taskToDbRow(task);
    const { error } = await supabase.from('tasks').upsert(row);
    if (error) throw error;
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err };
  }
}

/**
 * Batch Upsert tasks in Supabase
 */
export async function syncAllTasksToSupabase(tasks: Task[]): Promise<{ success: boolean; error: Error | null }> {
  if (!supabase) {
    return { success: false, error: new Error('Supabase client not initialized') };
  }
  try {
    const rows = tasks.map(taskToDbRow);
    const { error } = await supabase.from('tasks').upsert(rows);
    if (error) throw error;
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err };
  }
}

/**
 * Delete a task from Supabase
 */
export async function deleteTaskFromSupabase(taskId: string): Promise<{ success: boolean; error: Error | null }> {
  if (!supabase) {
    return { success: false, error: new Error('Supabase client not initialized') };
  }
  try {
    const { error } = await supabase.from('tasks').delete().eq('id', taskId);
    if (error) throw error;
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err };
  }
}

/**
 * Fetch Streak from Supabase
 */
export async function fetchStreakFromSupabase(): Promise<{ streak: DailyStreak | null; error: Error | null }> {
  if (!supabase) {
    return { streak: null, error: new Error('Supabase client not initialized') };
  }
  try {
    const { data, error } = await supabase
      .from('user_streak')
      .select('*')
      .eq('id', 'main')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is not found, which is ok initially
      throw error;
    }
    if (!data) return { streak: null, error: null };
    return { streak: dbRowToStreak(data), error: null };
  } catch (err: any) {
    return { streak: null, error: err };
  }
}

/**
 * Save Streak to Supabase
 */
export async function saveStreakToSupabase(streak: DailyStreak): Promise<{ success: boolean; error: Error | null }> {
  if (!supabase) {
    return { success: false, error: new Error('Supabase client not initialized') };
  }
  try {
    const row = streakToDbRow(streak);
    const { error } = await supabase.from('user_streak').upsert(row);
    if (error) throw error;
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err };
  }
}
