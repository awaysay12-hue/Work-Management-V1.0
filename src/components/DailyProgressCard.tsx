import React, { useMemo } from 'react';
import { Task, DailyStreak } from '../types';
import { getTodayDateString } from '../utils/khmerDates';
import { toKhmerNumber } from '../utils/translations';

interface DailyProgressCardProps {
  tasks: Task[];
  streak: DailyStreak;
  onViewAnalytics?: () => void;
}

export const DailyProgressCard: React.FC<DailyProgressCardProps> = ({
  tasks,
  streak,
  onViewAnalytics,
}) => {
  const todayStr = getTodayDateString();

  const { totalCount, pendingCount, completedCount, overdueCount } = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const overdue = tasks.filter((t) => !t.completed && t.dueDate < todayStr).length;

    return {
      totalCount: total,
      pendingCount: pending,
      completedCount: completed,
      overdueCount: overdue,
    };
  }, [tasks, todayStr]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Total Tasks */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
        <p className="text-xs font-bold text-slate-500 mb-1">ភារកិច្ចសរុប</p>
        <div className="flex items-end justify-between">
          <h3 className="text-2xl font-black text-slate-800">
            {toKhmerNumber(String(totalCount).padStart(2, '0'))}
          </h3>
          <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded font-bold">
            +១២% ខែនេះ
          </span>
        </div>
      </div>

      {/* 2. In Progress */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-200 transition-colors">
        <p className="text-xs font-bold text-slate-500 mb-1">កំពុងដំណើរការ</p>
        <div className="flex items-end justify-between">
          <h3 className="text-2xl font-black text-indigo-600">
            {toKhmerNumber(String(pendingCount).padStart(2, '0'))}
          </h3>
          <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-bold">
            ទៀងទាត់
          </span>
        </div>
      </div>

      {/* 3. Completed */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-200 transition-colors">
        <p className="text-xs font-bold text-slate-500 mb-1">បានបញ្ចប់</p>
        <div className="flex items-end justify-between">
          <h3 className="text-2xl font-black text-emerald-500">
            {toKhmerNumber(String(completedCount).padStart(2, '0'))}
          </h3>
          <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded font-bold">
            ជោគជ័យ
          </span>
        </div>
      </div>

      {/* 4. Overdue / Urgent */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-rose-200 transition-colors">
        <p className="text-xs font-bold text-slate-500 mb-1">យឺតយ៉ាវ / ហួសកំណត់</p>
        <div className="flex items-end justify-between">
          <h3 className="text-2xl font-black text-rose-500">
            {toKhmerNumber(String(overdueCount).padStart(2, '0'))}
          </h3>
          <span className="text-[10px] text-rose-600 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded font-bold">
            {overdueCount > 0 ? 'បន្ទាន់' : 'គ្មាន'}
          </span>
        </div>
      </div>
    </div>
  );
};
