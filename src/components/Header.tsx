import React from 'react';
import { ActiveUser } from '../types';
import { Heart, Thermometer, UserCheck, Plus, LogOut, Users } from 'lucide-react';

interface HeaderProps {
  activeUser: ActiveUser | null;
  cardCount: number;
  onOpenWriter: () => void;
  onOpenThermometer: () => void;
  onOpenAddMember: () => void;
  onChangeUser: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeUser,
  cardCount,
  onOpenWriter,
  onOpenThermometer,
  onOpenAddMember,
  onChangeUser,
}) => {
  // Calculate temp °C (base 20°C, max 100°C)
  const currentTemp = Math.min(100, Math.round((20 + cardCount * 1.6) * 10) / 10);

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-rose-100 dark:border-slate-800 shadow-xs transition-all">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* App Title & Class Code */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-400 via-pink-400 to-amber-300 flex items-center justify-center text-white shadow-md shadow-rose-200 dark:shadow-none text-xl font-bold">
            🌸
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100">
                칭찬 릴레이
              </h1>
              {activeUser && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                  {activeUser.classCode}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block font-medium">
              서로의 장점을 발견하고 전하는 학급 소통 공간
            </p>
          </div>
        </div>

        {/* Thermometer Quick Widget */}
        <button
          onClick={onOpenThermometer}
          className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 border border-amber-200/80 dark:border-amber-800/80 text-amber-800 dark:text-amber-200 text-xs sm:text-sm font-semibold transition-all group cursor-pointer"
          title="칭찬 온도계 보기"
        >
          <div className="p-1 rounded-xl bg-amber-200/70 dark:bg-amber-800/60 text-amber-700 dark:text-amber-300 group-hover:scale-110 transition-transform">
            <Thermometer className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold leading-none">우리 반 칭찬 온도</span>
            <span className="font-extrabold text-amber-700 dark:text-amber-300 text-sm">{currentTemp}°C</span>
          </div>
        </button>

        {/* Action Controls & Active Profile */}
        <div className="flex items-center gap-2 ml-auto sm:ml-0">
          {activeUser ? (
            <>
              {/* Member Add button */}
              <button
                onClick={onOpenAddMember}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
                title="친구 이름 목록 추가"
              >
                <Users className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>친구 목록 관리</span>
              </button>

              {/* Active Profile Pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-rose-50/80 dark:bg-slate-800 border border-rose-200/70 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold">
                <span className="text-base leading-none">{activeUser.avatar}</span>
                <span className="font-bold max-w-[80px] sm:max-w-[120px] truncate">{activeUser.name}</span>
                <button
                  onClick={onChangeUser}
                  className="p-1 rounded-lg hover:bg-rose-200/60 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors ml-1 cursor-pointer"
                  title="프로필 변경 / 로그아웃"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Write Praise Card Button */}
              <button
                onClick={onOpenWriter}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-200 dark:shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>칭찬 쓰기</span>
              </button>
            </>
          ) : (
            <button
              onClick={onChangeUser}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>학급 입장하기</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
