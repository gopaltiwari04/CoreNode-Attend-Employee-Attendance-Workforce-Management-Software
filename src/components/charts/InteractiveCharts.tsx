import React, { useState } from 'react';

// Color palette matching the brand design system
const COLORS = {
  present: '#10b981', // green-500
  late: '#f59e0b',    // amber-500
  absent: '#ef4444',  // red-500
  halfDay: '#06b6d4', // cyan-500
  onLeave: '#8b5cf6', // purple-500
  notCheckedIn: '#94a3b8', // slate-400
};

interface DonutSegment {
  label: string;
  count: number;
  color: string;
}

export const AttendanceBreakdownDonut: React.FC<{
  present: number;
  late: number;
  absent: number;
  halfDay: number;
  onLeave: number;
  notCheckedIn: number;
}> = ({ present, late, absent, halfDay, onLeave, notCheckedIn }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const data: DonutSegment[] = [
    { label: 'Present (On-Time)', count: present, color: COLORS.present },
    { label: 'Late Arrival', count: late, color: COLORS.late },
    { label: 'Absent', count: absent, color: COLORS.absent },
    { label: 'Half Day', count: halfDay, color: COLORS.halfDay },
    { label: 'On Leave', count: onLeave, color: COLORS.onLeave },
    { label: 'Not Checked In', count: notCheckedIn, color: COLORS.notCheckedIn },
  ].filter(d => d.count > 0);

  const total = data.reduce((acc, curr) => acc + curr.count, 0);

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-slate-400 text-sm">
        No attendance records for selected filter.
      </div>
    );
  }

  // Calculate SVG donut stroke arcs
  const radius = 64;
  const strokeWidth = 22;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative flex items-center justify-center w-44 h-44 shrink-0">
        <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90 transform">
          {data.map((seg, idx) => {
            const percent = seg.count / total;
            const strokeDasharray = `${percent * circumference} ${circumference}`;
            const strokeDashoffset = -(accumulatedPercent * circumference);
            accumulatedPercent += percent;

            const isHovered = hoveredIndex === idx;

            return (
              <circle
                key={seg.label}
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke={seg.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          {hoveredIndex !== null ? (
            <>
              <span className="text-xl font-bold text-slate-800">
                {data[hoveredIndex].count}
              </span>
              <span className="text-[11px] font-medium text-slate-500 max-w-[80px] leading-tight truncate">
                {data[hoveredIndex].label}
              </span>
              <span className="text-[10px] text-slate-400">
                {Math.round((data[hoveredIndex].count / total) * 100)}%
              </span>
            </>
          ) : (
            <>
              <span className="text-2xl font-bold text-slate-800">{total}</span>
              <span className="text-[11px] font-medium text-slate-500">Scheduled</span>
            </>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-2 text-xs w-full">
        {data.map((item, idx) => {
          const isHovered = hoveredIndex === idx;
          const pct = Math.round((item.count / total) * 100);
          return (
            <div
              key={item.label}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`flex items-center justify-between p-1.5 rounded transition-colors cursor-pointer ${
                isHovered ? 'bg-slate-100 font-semibold' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-700 truncate">{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 text-slate-500">
                <span className="font-semibold text-slate-800">{item.count}</span>
                <span className="text-[10px]">({pct}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const WeeklyAttendanceChart: React.FC<{
  days: {
    dayLabel: string;
    date: string;
    present: number;
    late: number;
    absent: number;
    leave: number;
  }[];
}> = ({ days }) => {
  const [activeDayIdx, setActiveDayIdx] = useState<number | null>(null);

  const maxVal = Math.max(...days.map(d => d.present + d.late + d.absent + d.leave), 15);

  return (
    <div className="w-full">
      <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 px-1 border-b border-slate-100">
        {days.map((item, idx) => {
          const totalDay = item.present + item.late + item.absent + item.leave;
          const isHovered = activeDayIdx === idx;

          const pHeight = (item.present / maxVal) * 100;
          const lHeight = (item.late / maxVal) * 100;
          const aHeight = (item.absent / maxVal) * 100;
          const lvHeight = (item.leave / maxVal) * 100;

          return (
            <div
              key={item.date}
              className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
              onMouseEnter={() => setActiveDayIdx(idx)}
              onMouseLeave={() => setActiveDayIdx(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-14 z-20 bg-slate-900 text-white text-[11px] py-1.5 px-2.5 rounded-md shadow-lg pointer-events-none whitespace-nowrap">
                  <div className="font-semibold mb-0.5">{item.date}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">Present: {item.present}</span>
                    <span className="text-amber-400">Late: {item.late}</span>
                    <span className="text-red-400">Absent: {item.absent}</span>
                  </div>
                </div>
              )}

              {/* Stacked bar */}
              <div
                className={`w-full max-w-[28px] rounded-t flex flex-col-reverse overflow-hidden transition-all duration-200 ${
                  isHovered ? 'ring-2 ring-indigo-500 ring-offset-1 scale-105' : 'opacity-90'
                }`}
                style={{ height: `${Math.max(12, (totalDay / maxVal) * 100)}%` }}
              >
                <div style={{ height: `${pHeight}%` }} className="bg-emerald-500 w-full" />
                <div style={{ height: `${lHeight}%` }} className="bg-amber-500 w-full" />
                <div style={{ height: `${aHeight}%` }} className="bg-rose-500 w-full" />
                <div style={{ height: `${lvHeight}%` }} className="bg-purple-500 w-full" />
              </div>
            </div>
          );
        })}
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between gap-2 sm:gap-4 mt-2 text-[11px] text-slate-500 font-medium px-1">
        {days.map((item, idx) => (
          <div
            key={item.date}
            className={`flex-1 text-center truncate ${
              activeDayIdx === idx ? 'text-indigo-600 font-bold' : ''
            }`}
          >
            {item.dayLabel}
          </div>
        ))}
      </div>

      {/* Mini Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 text-[11px] text-slate-600">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm"></span> Present
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-amber-500 rounded-sm"></span> Late
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-rose-500 rounded-sm"></span> Absent
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-purple-500 rounded-sm"></span> Leave
        </span>
      </div>
    </div>
  );
};

export const DepartmentAttendanceBars: React.FC<{
  departments: { name: string; rate: number; count: number }[];
}> = ({ departments }) => {
  return (
    <div className="space-y-3.5">
      {departments.map(dept => {
        const isHealthy = dept.rate >= 90;
        const isMedium = dept.rate >= 80 && dept.rate < 90;

        return (
          <div key={dept.name} className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-700 truncate max-w-[140px] sm:max-w-none">
                {dept.name}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-[11px]">{dept.count} Staff</span>
                <span
                  className={`font-semibold ${
                    isHealthy
                      ? 'text-emerald-700'
                      : isMedium
                      ? 'text-amber-700'
                      : 'text-rose-700'
                  }`}
                >
                  {dept.rate}%
                </span>
              </div>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isHealthy
                    ? 'bg-emerald-500'
                    : isMedium
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${dept.rate}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
