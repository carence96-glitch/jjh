import React, { useState } from 'react';
import { ActiveUser, PraiseCategory, CardTheme, ClassMember } from '../types';
import { CATEGORY_INFO, THEME_STYLES, PRAISE_TEMPLATES, STICKER_OPTIONS } from '../data/presetData';
import { savePraiseCard, getClassMembers, addClassMember } from '../utils/storage';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, User, Eye, EyeOff, Send, Plus, X, Tag, Palette, GraduationCap, MessageSquareText } from 'lucide-react';

interface PraiseFormProps {
  activeUser: ActiveUser;
  isOpen: boolean;
  onClose: () => void;
  onCardSubmitted: () => void;
}

export const PraiseForm: React.FC<PraiseFormProps> = ({
  activeUser,
  isOpen,
  onClose,
  onCardSubmitted,
}) => {
  const classMembers = getClassMembers(activeUser.classCode);

  // Receiver Class (학반) - default to active user's class code or formatted grade/class
  const defaultClass = activeUser.classCode.includes('반') || activeUser.classCode.includes('학년')
    ? activeUser.classCode
    : `1학년 ${activeUser.classCode.replace(/\D/g, '') || '3'}반`;

  const [receiverClass, setReceiverClass] = useState(defaultClass);
  const [receiverName, setReceiverName] = useState(
    classMembers.find((m) => m.name !== activeUser.name)?.name || ''
  );
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<PraiseCategory>('kindness');
  const [theme, setTheme] = useState<CardTheme>('coral');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedStickers, setSelectedStickers] = useState<string[]>(['❤️', '⭐']);
  const [newMemberInput, setNewMemberInput] = useState('');
  const [showAddMember, setShowAddMember] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const availableReceivers = classMembers.filter((m) => m.name !== activeUser.name);

  const handleAddMember = () => {
    const trimmed = newMemberInput.trim();
    if (trimmed) {
      addClassMember(activeUser.classCode, trimmed, '🐥');
      setReceiverName(trimmed);
      setNewMemberInput('');
      setShowAddMember(false);
    }
  };

  const handleTemplateClick = (templateText: string) => {
    if (!content) {
      setContent(templateText);
    } else {
      setContent((prev) => prev + ' ' + templateText);
    }
  };

  const toggleSticker = (sticker: string) => {
    if (selectedStickers.includes(sticker)) {
      setSelectedStickers(selectedStickers.filter((s) => s !== sticker));
    } else if (selectedStickers.length < 5) {
      setSelectedStickers([...selectedStickers, sticker]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiverClass.trim()) {
      setErrorMsg('칭찬받는 학생의 학반을 입력해 주세요! (예: 1학년 3반)');
      return;
    }
    if (!receiverName.trim()) {
      setErrorMsg('칭찬받는 학생의 이름을 입력하거나 선택해 주세요!');
      return;
    }
    if (!content.trim() || content.trim().length < 5) {
      setErrorMsg('칭찬할 내용을 5자 이상 정성껏 입력해 주세요!');
      return;
    }

    const receiverObj = classMembers.find((m) => m.name === receiverName.trim());
    const receiverAvatar = receiverObj ? receiverObj.avatar : '🐥';

    savePraiseCard(activeUser.classCode, {
      classCode: activeUser.classCode,
      receiverClass: receiverClass.trim(),
      senderName: activeUser.name,
      senderAvatar: activeUser.avatar,
      receiverName: receiverName.trim(),
      receiverAvatar,
      content: content.trim(),
      category,
      theme,
      isAnonymous,
      stickers: selectedStickers,
    });

    // Trigger celebration confetti burst!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'],
      });
    } catch (e) {}

    // Reset and close
    setContent('');
    setErrorMsg('');
    onCardSubmitted();
    onClose();
  };

  const filteredTemplates = PRAISE_TEMPLATES.filter((t) => t.category === category);

  // Preset class options for quick selection
  const classPresets = ['1학년 1반', '1학년 2반', '1학년 3반', '1학년 4반', '1학년 5반'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="w-full max-w-2xl my-8 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-rose-100 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-inner">
              💌
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">마음을 담은 칭찬 카드 쓰기</h3>
              <p className="text-xs text-white/90 font-medium">친구의 학반과 이름, 칭찬할 내용을 작성하세요!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-xs font-bold text-center animate-bounce">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* ITEM 1: Receiver Class (칭찬받는 학생의 학반) */}
          <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-slate-800/40 border border-rose-100 dark:border-slate-700/80 space-y-2">
            <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-rose-500" />
              <span>칭찬받는 학생의 학반</span>
              <span className="text-rose-500 text-xs">*</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={receiverClass}
                onChange={(e) => setReceiverClass(e.target.value)}
                placeholder="예: 1학년 3반 또는 103"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>
            {/* Class Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-400">빠른 선택:</span>
              {classPresets.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setReceiverClass(preset)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                    receiverClass === preset
                      ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-rose-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* ITEM 2: Receiver Name (칭찬받는 학생의 이름) */}
          <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-slate-800/40 border border-rose-100 dark:border-slate-700/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <User className="w-4 h-4 text-rose-500" />
                <span>칭찬받는 학생의 이름</span>
                <span className="text-rose-500 text-xs">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowAddMember(!showAddMember)}
                className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>목록에 친구 추가</span>
              </button>
            </div>

            <input
              type="text"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              placeholder="칭찬받는 학생의 이름을 직접 입력하거나 아래 친구를 클릭하세요"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />

            {showAddMember && (
              <div className="p-3 rounded-xl bg-rose-100/70 dark:bg-slate-800 border border-rose-200 dark:border-slate-700 flex gap-2">
                <input
                  type="text"
                  placeholder="새 친구 이름 (예: 김하늘)"
                  value={newMemberInput}
                  onChange={(e) => setNewMemberInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-xs font-bold border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="px-3 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 cursor-pointer"
                >
                  추가
                </button>
              </div>
            )}

            {/* Quick Classmate Selector Buttons */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-1.5">
                우리 반 친구 목록에서 선택:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-32 overflow-y-auto p-1.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                {availableReceivers.map((m) => (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setReceiverName(m.name)}
                    className={`p-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                      receiverName === m.name
                        ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-200 dark:shadow-none scale-[1.02]'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span className="text-base leading-none">{m.avatar}</span>
                    <span className="truncate">{m.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ITEM 3: Praise Content (칭찬할 내용) */}
          <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-slate-800/40 border border-rose-100 dark:border-slate-700/80 space-y-2.5">
            <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <MessageSquareText className="w-4 h-4 text-rose-500" />
              <span>칭찬할 내용</span>
              <span className="text-rose-500 text-xs">*</span>
            </label>

            {/* Praise Category Selection */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                칭찬 카테고리:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(CATEGORY_INFO) as PraiseCategory[]).map((cat) => {
                  const info = CATEGORY_INFO[cat];
                  const isSelected = category === cat;
                  return (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                        isSelected
                          ? `${info.bg} ${info.color} border-current ring-2 ring-rose-300 dark:ring-rose-800 scale-105`
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{info.icon}</span>
                      <span>{info.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Template Recommendations */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>추천 문구 템플릿 (클릭 시 내용에 자동 추가):</span>
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto p-1.5 bg-amber-50/60 dark:bg-slate-900 rounded-xl border border-amber-200/60 dark:border-slate-700">
                {filteredTemplates.map((tpl, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => handleTemplateClick(tpl.text)}
                    className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium border border-amber-200 dark:border-slate-700 hover:border-rose-300 transition-all cursor-pointer text-left"
                  >
                    + {tpl.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea for Praise Content */}
            <div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="칭찬받는 친구의 고마운 점, 배려해 준 경험, 멋진 장점을 솔직하게 적어주세요! (5자 이상)"
                rows={4}
                maxLength={300}
                className="w-full p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs sm:text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-rose-400 transition-all"
              />
              <div className="text-right text-[11px] text-slate-400 font-semibold mt-1">
                {content.length} / 300자
              </div>
            </div>
          </div>

          {/* Card Theme Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-purple-500" />
              <span>카드 색상 테마</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(THEME_STYLES) as CardTheme[]).map((t) => {
                const style = THEME_STYLES[t];
                const isSelected = theme === t;
                return (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`px-3 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-rose-500 border-rose-400 scale-105 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: style.previewColor + '30' }}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10"
                      style={{ backgroundColor: style.previewColor }}
                    />
                    <span className="text-slate-800 dark:text-slate-200">{style.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sticker Decoration Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              스티커 붙이기 (최대 5개)
            </label>
            <div className="flex flex-wrap gap-2 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
              {STICKER_OPTIONS.map((st) => {
                const isPicked = selectedStickers.includes(st);
                return (
                  <button
                    type="button"
                    key={st}
                    onClick={() => toggleSticker(st)}
                    className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all cursor-pointer ${
                      isPicked
                        ? 'bg-amber-300 text-white scale-110 shadow-sm ring-2 ring-amber-400'
                        : 'bg-white dark:bg-slate-800 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Public vs Anonymous Choice */}
          <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isAnonymous ? (
                <EyeOff className="w-5 h-5 text-purple-500" />
              ) : (
                <Eye className="w-5 h-5 text-rose-500" />
              )}
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                  작성자 공개 설정
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isAnonymous ? '익명으로 마음을 전합니다 (마니또)' : `내 이름을 표시합니다 (${activeUser.name})`}
                </span>
              </div>
            </div>

            <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setIsAnonymous(false)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  !isAnonymous
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                🙋‍♂️ 실명
              </button>
              <button
                type="button"
                onClick={() => setIsAnonymous(true)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isAnonymous
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                🕵️ 익명
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 hover:from-rose-600 hover:to-amber-500 text-white font-extrabold text-sm shadow-lg shadow-rose-200 dark:shadow-none flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>칭찬 카드 전송하기</span>
          </button>
        </form>
      </div>
    </div>
  );
};

