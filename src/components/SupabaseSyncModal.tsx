import React, { useState } from 'react';
import {
  Database,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  UploadCloud,
  DownloadCloud,
  X,
  Sparkles,
  KeyRound,
  Server,
} from 'lucide-react';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../lib/supabase';
import { Task, DailyStreak } from '../types';

interface SupabaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncStatus: 'synced' | 'syncing' | 'error' | 'offline';
  syncMessage: string;
  onManualSync: () => Promise<void>;
  onPushLocalToCloud: () => Promise<void>;
  onPullCloudToLocal: () => Promise<void>;
  tasksCount: number;
}

export const SupabaseSyncModal: React.FC<SupabaseSyncModalProps> = ({
  isOpen,
  onClose,
  syncStatus,
  syncMessage,
  onManualSync,
  onPushLocalToCloud,
  onPullCloudToLocal,
  tasksCount,
}) => {
  const [copied, setCopied] = useState(false);
  const [isOperating, setIsOperating] = useState(false);
  const [opMessage, setOpMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const sqlSchema = `-- SQL Schema សម្រាប់ Supabase Database របស់អ្នក
-- ចូលទៅកាន់ Supabase Dashboard -> SQL Editor រួច Paste កូដខាងក្រោមនេះដើម្បីបង្កើត Tables:

create table if not exists public.tasks (
  id text primary key,
  title text not null,
  description text,
  category text not null,
  priority text not null,
  due_date text not null,
  due_time text,
  reminder_timing text default 'none',
  reminder_triggered boolean default false,
  reminder_snoozed_until text,
  completed boolean default false,
  completed_at text,
  created_at text not null,
  subtasks jsonb default '[]'::jsonb,
  estimated_minutes integer default 25,
  spent_minutes integer default 0,
  recurring text default 'none',
  tags jsonb default '[]'::jsonb
);

create table if not exists public.user_streak (
  id text primary key default 'main',
  current_streak integer default 0,
  longest_streak integer default 0,
  last_active_date text,
  total_completed_all_time integer default 0,
  total_focus_minutes_all_time integer default 0
);

-- បើកសិទ្ធិ Row Level Security (RLS) អនុញ្ញាតឱ្យសរសេរ និងអានទិន្នន័យ
alter table public.tasks enable row level security;
drop policy if exists "Public tasks access" on public.tasks;
create policy "Public tasks access" on public.tasks for all using (true) with check (true);

alter table public.user_streak enable row level security;
drop policy if exists "Public streak access" on public.user_streak;
create policy "Public streak access" on public.user_streak for all using (true) with check (true);
`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePush = async () => {
    setIsOperating(true);
    setOpMessage('កំពុងបញ្ជូនទិន្នន័យទៅ Cloud Database...');
    try {
      await onPushLocalToCloud();
      setOpMessage('បានបញ្ជូនទិន្នន័យទៅ Supabase ជោគជ័យ! ✅');
    } catch (err: any) {
      setOpMessage(`មានបញ្ហា៖ ${err.message || 'មិនអាចបញ្ជូនបាន'}`);
    } finally {
      setIsOperating(false);
      setTimeout(() => setOpMessage(null), 4000);
    }
  };

  const handlePull = async () => {
    setIsOperating(true);
    setOpMessage('កំពុងទាញទិន្នន័យពី Cloud Database...');
    try {
      await onPullCloudToLocal();
      setOpMessage('បានទាញទិន្នន័យពី Supabase ជោគជ័យ! ✅');
    } catch (err: any) {
      setOpMessage(`មានបញ្ហា៖ ${err.message || 'មិនអាចទាញបាន'}`);
    } finally {
      setIsOperating(false);
      setTimeout(() => setOpMessage(null), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold leading-tight">
                ការភ្ជាប់ Supabase Database
              </h2>
              <p className="text-xs text-emerald-100 mt-0.5">
                Cloud Sync & Real-time Database
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Status Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">ស្ថានភាពភ្ជាប់បច្ចុប្បន្ន</span>
              <div className="flex items-center gap-1.5">
                {syncStatus === 'synced' && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> ភ្ជាប់ជោគជ័យ (Cloud Synced)
                  </span>
                )}
                {syncStatus === 'syncing' && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-full">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> កំពុង Sync...
                  </span>
                )}
                {syncStatus === 'error' && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full">
                    <AlertCircle className="w-3.5 h-3.5" /> មិនទាន់មាន Table
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-600">{syncMessage}</p>

            {opMessage && (
              <div className="mt-2 text-xs font-semibold p-2.5 bg-indigo-50 text-indigo-800 rounded-lg border border-indigo-100">
                {opMessage}
              </div>
            )}
          </div>

          {/* Credentials Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-indigo-600" /> ព័ត៌មាន Database API
            </h3>
            <div className="bg-slate-900 rounded-xl p-3 text-slate-200 text-xs font-mono space-y-1.5 border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">SUPABASE_URL:</span>
                <span className="text-emerald-400">{SUPABASE_URL}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400">PUBLISHABLE_KEY:</span>
                <span className="text-indigo-300 truncate max-w-[240px]">{SUPABASE_ANON_KEY}</span>
              </div>
            </div>
          </div>

          {/* Quick Sync Actions */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={handlePush}
              disabled={isOperating}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <UploadCloud className="w-4 h-4" />
              បញ្ជូនកិច្ចការ ({tasksCount}) ទៅ Cloud
            </button>
            <button
              onClick={handlePull}
              disabled={isOperating}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <DownloadCloud className="w-4 h-4" />
              ទាញយកពី Cloud មកវិញ
            </button>
          </div>

          {/* SQL Setup Helper */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  SQL Script បង្កើត Table (សម្រាប់ Supabase SQL Editor)
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  បើក Supabase Dashboard រួច Copy & Run កូដនេះប្រសិនបើមិនទាន់បង្កើត Table
                </p>
              </div>
              <button
                onClick={handleCopySql}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> បាន Copy
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" /> Copy SQL
                  </>
                )}
              </button>
            </div>

            <pre className="bg-slate-900 text-emerald-400 p-3 rounded-lg text-[10px] font-mono overflow-x-auto max-h-36 border border-slate-800 leading-relaxed">
              {sqlSchema}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onManualSync}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> ពិនិត្យការតភ្ជាប់ឡើងវិញ
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            បិទផ្ទាំង
          </button>
        </div>
      </div>
    </div>
  );
};
