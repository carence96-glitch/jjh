import React, { useState } from 'react';
import { PraiseCard, ActiveUser } from '../types';
import { CATEGORY_INFO, THEME_STYLES } from '../data/presetData';
import { toggleCardReaction, deletePraiseCard } from '../utils/storage';
import { Download, Share2, Heart, ThumbsUp, Flame, Sparkles, Trash2, Check, Clock } from 'lucide-react';

interface PraiseCardItemProps {
  card: PraiseCard;
  activeUser: ActiveUser | null;
  userReactions: string[];
  onOpenExportModal: (card: PraiseCard) => void;
  onCardUpdated: () => void;
}

export const PraiseCardItem: React.FC<PraiseCardItemProps> = ({
  card,
  activeUser,
  userReactions,
  onOpenExportModal,
  onCardUpdated,
}) => {
  const [copiedText, setCopiedText] = useState(false);

  const themeStyle = THEME_STYLES[card.theme] || THEME_STYLES.coral;
  const categoryInfo = CATEGORY_INFO[card.category] || CATEGORY_INFO.kindness;

  const handleReaction = (type: 'heart' | 'thumb' | 'touch' | 'fire') => {
    if (!activeUser) return;
    toggleCardReaction(card.classCode, card.id, type, activeUser.name);
    onCardUpdated();
  };

  const handleDelete = () => {
    if (!activeUser) return;
    if (confirm('이 칭찬 카드를 정말 삭제하시겠습니까?')) {
      deletePraiseCard(card.classCode, card.id);
      onCardUpdated();
    }
  };

  const handleCopyText = () => {
    const classBadge = card.receiverClass ? `[${card.receiverClass}] ` : '';
    const textToCopy = `[칭찬 릴레이 🌸]\nTo. ${classBadge}${card.receiverName}\n${card.content}\nFrom. ${card.isAnonymous ? '익명의 친구' : card.senderName}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const isOwner = activeUser && (activeUser.name === card.senderName || activeUser.name === '선생님');

  // Format creation time relative / readable
  const formattedTime = new Date(card.createdAt).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`relative group rounded-3xl p-6 border shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br ${themeStyle.bgGradient} ${themeStyle.borderColor}`}
    >
      {/* Top Bar: Category Tag & Date/Options */}
      <div className="flex items-center justify-between mb-4 gap-2">
        <span
          className={`px-3 py-1 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 shadow-xs ${categoryInfo.bg} ${categoryInfo.color}`}
        >
          <span>{categoryInfo.icon}</span>
          <span>{categoryInfo.label}</span>
        </span>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formattedTime}</span>
          </span>

          {isOwner && (
            <button
              onClick={handleDelete}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white/60 transition-colors cursor-pointer"
              title="삭제하기"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Recipient Header */}
      <div className="flex items-center gap-3 mb-3 bg-white/70 dark:bg-slate-900/60 p-3 rounded-2xl backdrop-blur-xs border border-white/60 dark:border-slate-800">
        <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-slate-800 flex items-center justify-center text-2xl shadow-inner shrink-0">
          {card.receiverAvatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              칭찬 받는 친구
            </span>
            {card.receiverClass && (
              <span className="px-2 py-0.5 rounded-lg bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-300 text-[10px] font-extrabold border border-rose-200/60 dark:border-rose-800">
                {card.receiverClass}
              </span>
            )}
          </div>
          <span className="text-base font-extrabold text-slate-900 dark:text-slate-100 truncate block">
            {card.receiverName}
          </span>
        </div>
      </div>

      {/* Main Praise Text Body */}
      <div className="bg-white/85 dark:bg-slate-900/80 p-4 rounded-2xl border border-white/80 dark:border-slate-800/80 mb-4 shadow-2xs">
        <p className="text-sm sm:text-base font-medium leading-relaxed text-slate-800 dark:text-slate-100 whitespace-pre-wrap">
          {card.content}
        </p>

        {/* Sticker badges */}
        {card.stickers && card.stickers.length > 0 && (
          <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-lg">
            {card.stickers.map((st, i) => (
              <span key={i} className="hover:scale-125 transition-transform">
                {st}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Sender Badge */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">From.</span>
          {card.isAnonymous ? (
            <span className="px-2.5 py-1 rounded-xl bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 text-xs font-extrabold flex items-center gap-1 border border-purple-200">
              <span>🕵️</span>
              <span>익명의 마니또</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-xl bg-white/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-extrabold flex items-center gap-1.5 border border-slate-200/80 dark:border-slate-700">
              <span className="text-sm leading-none">{card.senderAvatar}</span>
              <span>{card.senderName}</span>
            </span>
          )}
        </div>

        {/* Share & Download Image Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopyText}
            className="p-1.5 rounded-xl bg-white/80 hover:bg-white dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1 border border-slate-200/80 dark:border-slate-700 transition-all cursor-pointer"
            title="텍스트 복사"
          >
            {copiedText ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Share2 className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">{copiedText ? '복사됨' : '복사'}</span>
          </button>

          <button
            onClick={() => onOpenExportModal(card)}
            className="p-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
            title="카드 이미지 저장 (PNG)"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">이미지 저장</span>
          </button>
        </div>
      </div>

      {/* Reaction Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2 pt-3 border-t border-slate-200/60 dark:border-slate-800/80">
        {/* Heart */}
        <button
          onClick={() => handleReaction('heart')}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer ${
            userReactions.includes('heart')
              ? 'bg-rose-500 text-white scale-105 shadow-xs'
              : 'bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-100'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${userReactions.includes('heart') ? 'fill-white' : 'text-rose-500'}`} />
          <span>{card.reactions?.heart || 0}</span>
        </button>

        {/* Thumb */}
        <button
          onClick={() => handleReaction('thumb')}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer ${
            userReactions.includes('thumb')
              ? 'bg-blue-500 text-white scale-105 shadow-xs'
              : 'bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-100'
          }`}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${userReactions.includes('thumb') ? 'fill-white' : 'text-blue-500'}`} />
          <span>{card.reactions?.thumb || 0}</span>
        </button>

        {/* Touch */}
        <button
          onClick={() => handleReaction('touch')}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer ${
            userReactions.includes('touch')
              ? 'bg-purple-500 text-white scale-105 shadow-xs'
              : 'bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
          <span>{card.reactions?.touch || 0}</span>
        </button>

        {/* Fire */}
        <button
          onClick={() => handleReaction('fire')}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer ${
            userReactions.includes('fire')
              ? 'bg-amber-500 text-white scale-105 shadow-xs'
              : 'bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-100'
          }`}
        >
          <Flame className={`w-3.5 h-3.5 ${userReactions.includes('fire') ? 'fill-white' : 'text-amber-500'}`} />
          <span>{card.reactions?.fire || 0}</span>
        </button>
      </div>
    </div>
  );
};
