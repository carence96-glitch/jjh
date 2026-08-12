import React from 'react';
import { PraiseCard } from '../types';
import { CATEGORY_INFO } from '../data/presetData';
import { Thermometer, Award, TrendingUp, Users, Heart, X, Sparkles, Clock } from 'lucide-react';

interface PraiseThermometerModalProps {
  cards: PraiseCard[];
  isOpen: boolean;
  onClose: () => void;
}

export const PraiseThermometerModal: React.FC<PraiseThermometerModalProps> = ({
  cards,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  // Temperature calculation
  const cardCount = cards.length;
  const currentTemp = Math.min(100, Math.round((20 + cardCount * 1.6) * 10) / 10);

  // Hourly distribution calculation
  const hourlyCounts = Array.from({ length: 24 }, (_, hour) => {
    let label = `${hour}시`;
    if (hour >= 9 && hour <= 16) {
      label = `${hour - 8}교시(${hour}시)`;
    }
    return { hour, label, count: 0 };
  });

  cards.forEach((card) => {
    try {
      const date = new Date(card.createdAt);
      const hour = date.getHours();
      if (hourlyCounts[hour]) {
        hourlyCounts[hour].count += 1;
      }
    } catch (e) {}
  });

  // School time focus: 8am to 17pm
  const schoolHourCounts = hourlyCounts.slice(8, 18);
  const maxHourlyCount = Math.max(1, ...schoolHourCounts.map((h) => h.count));

  // Find peak hour
  const peakHourObj = [...schoolHourCounts].sort((a, b) => b.count - a.count)[0];

  // Category breakdown
  const categoryStats: Record<string, number> = {};
  cards.forEach((c) => {
    categoryStats[c.category] = (categoryStats[c.category] || 0) + 1;
  });

  // Participating unique classmates count
  const receiversSet = new Set(cards.map((c) => c.receiverName));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="w-full max-w-2xl my-8 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-amber-100 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner">
              🌡️
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">우리 반 칭찬 온도계</h3>
              <p className="text-xs text-white/90 font-medium">칭찬 카드가 차곡차곡 쌓이며 학급 온도가 올라가요!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Main Thermometer Visual Gauge */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 dark:from-slate-800 dark:to-slate-900 border border-amber-200 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-6">
            {/* Vertical Thermometer Bar */}
            <div className="relative w-14 h-56 bg-slate-200 dark:bg-slate-700 rounded-full p-2 flex flex-col justify-end items-center shadow-inner shrink-0">
              {/* Fill tube */}
              <div
                className="w-full rounded-full bg-gradient-to-t from-rose-500 via-amber-400 to-yellow-300 transition-all duration-700 shadow-md"
                style={{ height: `${Math.max(10, currentTemp)}%` }}
              />
              {/* Thermometer bulb */}
              <div className="absolute -bottom-3 w-16 h-16 rounded-full bg-rose-500 border-4 border-white dark:border-slate-800 shadow-lg flex items-center justify-center text-white font-black text-sm">
                {currentTemp}°
              </div>
            </div>

            {/* Temperature Stats Details */}
            <div className="flex-1 space-y-3 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-3xl font-black text-slate-900 dark:text-slate-100">{currentTemp}°C</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-200 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200">
                  {currentTemp >= 75 ? '🔥 열정 칭찬 왕국' : currentTemp >= 50 ? '🌸 칭찬 꽃피는 학급' : '☀️ 따뜻한 마음 학급'}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                현재 우리 반은 총 <strong className="text-rose-600 dark:text-rose-400">{cardCount}개</strong>의 칭찬 카드가 모였습니다.{' '}
                <strong>{receiversSet.size}명</strong>의 친구들이 마음 따뜻한 칭찬을 받았어요!
              </p>

              {/* Milestones list */}
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div className={`p-2 rounded-xl border flex items-center gap-1.5 font-bold ${currentTemp >= 36.5 ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-200' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                  <span>🌡️</span>
                  <span>36.5°C 체온 달성</span>
                </div>
                <div className={`p-2 rounded-xl border flex items-center gap-1.5 font-bold ${currentTemp >= 50 ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                  <span>🌸</span>
                  <span>50°C 칭찬 피어남</span>
                </div>
                <div className={`p-2 rounded-xl border flex items-center gap-1.5 font-bold ${currentTemp >= 75 ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                  <span>🤝</span>
                  <span>75°C 존중 학급</span>
                </div>
                <div className={`p-2 rounded-xl border flex items-center gap-1.5 font-bold ${currentTemp >= 100 ? 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-200' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                  <span>👑</span>
                  <span>100°C 칭찬 마스터</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hourly Praise Distribution Graph as requested! */}
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-500" />
                <span>오늘 시간대별 칭찬 릴레이 (학습 시간 분포)</span>
              </h4>
              {peakHourObj && peakHourObj.count > 0 && (
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-xl border border-rose-200 dark:border-rose-800">
                  🔥 가장 많이 주고받은 시간: {peakHourObj.label} ({peakHourObj.count}건)
                </span>
              )}
            </div>

            {/* Bar Chart */}
            <div className="h-36 flex items-end justify-between gap-1 pt-6 px-2 border-b border-slate-200 dark:border-slate-700">
              {schoolHourCounts.map((h) => {
                const heightPercent = Math.max(8, (h.count / maxHourlyCount) * 100);
                const isPeak = peakHourObj && peakHourObj.hour === h.hour && h.count > 0;
                return (
                  <div key={h.hour} className="flex-1 flex flex-col items-center gap-1 group">
                    <span className={`text-[10px] font-bold ${isPeak ? 'text-rose-600' : 'text-slate-400'}`}>
                      {h.count > 0 ? h.count : ''}
                    </span>
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        isPeak
                          ? 'bg-gradient-to-t from-rose-500 to-amber-400 shadow-md'
                          : h.count > 0
                          ? 'bg-rose-300 dark:bg-rose-700'
                          : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[9px] sm:text-[10px] font-semibold text-slate-500 dark:text-slate-400 truncate w-full text-center">
                      {h.hour}시
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Breakdown */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>우리 반이 가장 많이 주고받은 칭찬 분야</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {Object.entries(CATEGORY_INFO).map(([key, info]) => {
                const count = categoryStats[key] || 0;
                return (
                  <div
                    key={key}
                    className={`p-3 rounded-2xl border flex items-center justify-between ${info.bg} border-slate-200/60 dark:border-slate-700`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{info.icon}</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{info.label}</span>
                    </div>
                    <span className={`text-xs font-extrabold ${info.color}`}>{count}건</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
