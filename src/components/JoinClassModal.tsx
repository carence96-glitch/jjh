import React, { useState } from 'react';
import { ActiveUser } from '../types';
import { AVATAR_OPTIONS, DEFAULT_CLASS_MEMBERS } from '../data/presetData';
import { setStoredActiveUser, addClassMember } from '../utils/storage';
import { ShieldCheck, Sparkles, ArrowRight, School } from 'lucide-react';

interface JoinClassModalProps {
  isOpen: boolean;
  onJoin: (user: ActiveUser) => void;
  onClose?: () => void;
}

export const JoinClassModal: React.FC<JoinClassModalProps> = ({
  isOpen,
  onJoin,
}) => {
  const [classCode, setClassCode] = useState('103');
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🦊');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedCode = classCode.trim() || '103';

    if (!trimmedName) {
      setErrorMsg('이름 또는 별명을 입력해 주세요!');
      return;
    }

    if (trimmedName.length > 12) {
      setErrorMsg('이름/별명은 12자 이내로 입력해 주세요.');
      return;
    }

    const newUser: ActiveUser = {
      classCode: trimmedCode,
      name: trimmedName,
      avatar: selectedAvatar,
    };

    // Store in localStorage & ensure student is registered in class roster
    setStoredActiveUser(newUser);
    addClassMember(trimmedCode, trimmedName, selectedAvatar);

    setErrorMsg('');
    onJoin(newUser);
  };

  const handleQuickPreset = (code: string, sampleName: string, avatar: string) => {
    setClassCode(code);
    setName(sampleName);
    setSelectedAvatar(avatar);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-rose-100 dark:border-slate-800 overflow-hidden">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 p-6 text-white text-center relative">
          <div className="w-16 h-16 mx-auto mb-2 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner">
            🌸
          </div>
          <h2 className="text-2xl font-black tracking-tight">칭찬 릴레이 세션 입장</h2>
          <p className="text-xs text-white/90 font-medium mt-1">
            별도의 회원가입 없이 학급 코드와 별명만으로 참여해요!
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-xs font-bold text-center">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Class Code Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <School className="w-4 h-4 text-rose-500" />
              <span>학급 코드 (예: 103, 1학년 3반)</span>
            </label>
            <input
              type="text"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              placeholder="예: 103"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-rose-400 transition-all"
            />
            <div className="flex gap-1.5 mt-2 flex-wrap">
              <span className="text-[11px] text-slate-400 font-semibold self-center">빠른 학급 선택:</span>
              {['103', '101', '102', '우리반'].map((code) => (
                <button
                  type="button"
                  key={code}
                  onClick={() => setClassCode(code)}
                  className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    classCode === code
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300 border border-rose-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          {/* Student Nickname Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>나의 이름 또는 별명</span>
              </span>
              <span className="text-[11px] text-slate-400 font-normal">실명 및 비밀번호 요구 없음</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 김민준, 민준이, 긍정대장"
              maxLength={12}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-rose-400 transition-all"
            />
          </div>

          {/* Quick Member Pickers from Sample Class 103 */}
          {classCode === '103' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                💡 1학년 3반 예시 학생 선택하기:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {DEFAULT_CLASS_MEMBERS.slice(0, 5).map((m) => (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => handleQuickPreset('103', m.name, m.avatar)}
                    className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                  >
                    <span>{m.avatar}</span>
                    <span>{m.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Avatar Icon Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              나만의 프로필 이모티콘 선택
            </label>
            <div className="grid grid-cols-8 gap-1.5 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700">
              {AVATAR_OPTIONS.map((avatar) => (
                <button
                  type="button"
                  key={avatar}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`p-2 rounded-xl text-xl transition-all cursor-pointer flex items-center justify-center ${
                    selectedAvatar === avatar
                      ? 'bg-rose-400 text-white scale-110 shadow-md shadow-rose-200 dark:shadow-none'
                      : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy Guarantee Box */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-200 text-xs font-medium flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed text-[11px]">
              <p className="font-bold text-emerald-900 dark:text-emerald-100">개인정보 안심 보장 안내</p>
              <p className="text-emerald-700 dark:text-emerald-300 mt-0.5">
                학번, 주민번호, 비밀번호 등 민감 정보를 수집하지 않습니다. 작성된 내용은 현재 기기(Local Storage)에 안전하게 저장됩니다.
              </p>
            </div>
          </div>

          {/* Submit Entry Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 hover:from-rose-600 hover:to-amber-500 text-white font-extrabold text-sm shadow-lg shadow-rose-200 dark:shadow-none flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
          >
            <span>칭찬 릴레이 시작하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
