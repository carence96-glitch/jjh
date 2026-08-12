import React, { useState } from 'react';
import { PraiseCard, ActiveUser, FilterState, PraiseCategory, ClassMember } from '../types';
import { PraiseCardItem } from './PraiseCardItem';
import { CATEGORY_INFO } from '../data/presetData';
import { getUserReactionsForUser } from '../utils/storage';
import { Search, Heart, Mail, Edit3, User, Sparkles, Filter, Plus, MessageSquareHeart } from 'lucide-react';

interface PraiseFeedProps {
  cards: PraiseCard[];
  activeUser: ActiveUser | null;
  classMembers: ClassMember[];
  onOpenWriter: () => void;
  onOpenExportModal: (card: PraiseCard) => void;
  onCardUpdated: () => void;
}

export const PraiseFeed: React.FC<PraiseFeedProps> = ({
  cards,
  activeUser,
  classMembers,
  onOpenWriter,
  onOpenExportModal,
  onCardUpdated,
}) => {
  const [filter, setFilter] = useState<FilterState>({
    viewMode: 'all',
    targetFriend: '',
    category: 'all',
    searchQuery: '',
    sortBy: 'latest',
  });

  const userReactionsMap = activeUser
    ? getUserReactionsForUser(activeUser.classCode, activeUser.name)
    : {};

  // Apply filtering & search
  let filteredCards = cards.filter((card) => {
    // 1. View Mode Filter
    if (filter.viewMode === 'received' && activeUser) {
      if (card.receiverName !== activeUser.name) return false;
    } else if (filter.viewMode === 'sent' && activeUser) {
      if (card.senderName !== activeUser.name) return false;
    } else if (filter.viewMode === 'target' && filter.targetFriend) {
      if (card.receiverName !== filter.targetFriend && card.senderName !== filter.targetFriend) {
        return false;
      }
    }

    // 2. Category Filter
    if (filter.category !== 'all') {
      if (card.category !== filter.category) return false;
    }

    // 3. Search Query
    if (filter.searchQuery.trim()) {
      const q = filter.searchQuery.trim().toLowerCase();
      const matchContent = card.content.toLowerCase().includes(q);
      const matchReceiver = card.receiverName.toLowerCase().includes(q);
      const matchSender = card.senderName.toLowerCase().includes(q);
      if (!matchContent && !matchReceiver && !matchSender) return false;
    }

    return true;
  });

  // Sort
  if (filter.sortBy === 'popular') {
    filteredCards.sort((a, b) => {
      const totalA = (a.reactions?.heart || 0) + (a.reactions?.thumb || 0) + (a.reactions?.touch || 0) + (a.reactions?.fire || 0);
      const totalB = (b.reactions?.heart || 0) + (b.reactions?.thumb || 0) + (b.reactions?.touch || 0) + (b.reactions?.fire || 0);
      return totalB - totalA;
    });
  } else {
    // Latest
    filteredCards.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Count received cards for current user
  const myReceivedCount = activeUser
    ? cards.filter((c) => c.receiverName === activeUser.name).length
    : 0;

  return (
    <div className="space-y-6">
      {/* Search & Main Filter Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-rose-100 dark:border-slate-800 shadow-sm space-y-4">
        {/* Search Input & Sort Selector */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="친구 이름이나 칭찬 키워드로 검색해보세요..."
              value={filter.searchQuery}
              onChange={(e) => setFilter({ ...filter, searchQuery: e.target.value })}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-400 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <select
              value={filter.sortBy}
              onChange={(e) => setFilter({ ...filter, sortBy: e.target.value as 'latest' | 'popular' })}
              className="px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="latest">⏱️ 최신순 정렬</option>
              <option value="popular">🔥 인기 반응순</option>
            </select>

            <button
              onClick={onOpenWriter}
              className="px-4 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>칭찬 쓰기</span>
            </button>
          </div>
        </div>

        {/* View Mode Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setFilter({ ...filter, viewMode: 'all' })}
            className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              filter.viewMode === 'all'
                ? 'bg-rose-500 text-white shadow-sm scale-102'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-50'
            }`}
          >
            <span>🌟 전체 칭찬 피드</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">{cards.length}</span>
          </button>

          {activeUser && (
            <>
              <button
                onClick={() => setFilter({ ...filter, viewMode: 'received' })}
                className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                  filter.viewMode === 'received'
                    ? 'bg-rose-500 text-white shadow-sm scale-102'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-50'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>내가 받은 칭찬만 보기</span>
                {myReceivedCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-200 text-rose-800 font-bold">
                    {myReceivedCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setFilter({ ...filter, viewMode: 'sent' })}
                className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                  filter.viewMode === 'sent'
                    ? 'bg-rose-500 text-white shadow-sm scale-102'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-50'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>내가 쓴 칭찬만 보기</span>
              </button>
            </>
          )}

          {/* Target Friend Filter Dropdown button */}
          <div className="relative shrink-0">
            <select
              value={filter.targetFriend}
              onChange={(e) => {
                const val = e.target.value;
                setFilter({
                  ...filter,
                  viewMode: val ? 'target' : 'all',
                  targetFriend: val,
                });
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                filter.viewMode === 'target'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <option value="">👥 특정 친구 칭찬 모아보기</option>
              {classMembers.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.avatar} {m.name}의 칭찬
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 scrollbar-none border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>분야:</span>
          </span>
          <button
            onClick={() => setFilter({ ...filter, category: 'all' })}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
              filter.category === 'all'
                ? 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
            }`}
          >
            전체 분야
          </button>
          {(Object.keys(CATEGORY_INFO) as PraiseCategory[]).map((cat) => {
            const info = CATEGORY_INFO[cat];
            const isSel = filter.category === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilter({ ...filter, category: cat })}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all shrink-0 cursor-pointer ${
                  isSel
                    ? `${info.bg} ${info.color} border border-current scale-105`
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                <span>{info.icon}</span>
                <span>{info.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Praise Cards Grid */}
      {filteredCards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredCards.map((card) => (
            <PraiseCardItem
              key={card.id}
              card={card}
              activeUser={activeUser}
              userReactions={userReactionsMap[card.id] || []}
              onOpenExportModal={onOpenExportModal}
              onCardUpdated={onCardUpdated}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-rose-100 dark:border-slate-800 shadow-sm space-y-4">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-3xl">
            💌
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
              조건에 해당하는 칭찬 카드가 아직 없어요!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">
              친구의 멋진 장점이나 고마웠던 일상을 발견했다면, 가장 먼저 첫 번째 칭찬 카드를 보내보세요!
            </p>
          </div>
          <button
            onClick={onOpenWriter}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-extrabold text-xs shadow-md shadow-rose-200 dark:shadow-none inline-flex items-center gap-2 cursor-pointer"
          >
            <MessageSquareHeart className="w-4 h-4" />
            <span>첫 칭찬 작성하기</span>
          </button>
        </div>
      )}
    </div>
  );
};
