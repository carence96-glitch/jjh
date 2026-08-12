import React, { useState } from 'react';
import { ActiveUser, ClassMember } from '../types';
import { getClassMembers, addClassMember } from '../utils/storage';
import { AVATAR_OPTIONS } from '../data/presetData';
import { Users, UserPlus, X, Trash2 } from 'lucide-react';

interface AddMemberModalProps {
  activeUser: ActiveUser;
  isOpen: boolean;
  onClose: () => void;
  onMembersChanged: () => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  activeUser,
  isOpen,
  onClose,
  onMembersChanged,
}) => {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🐥');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const members = getClassMembers(activeUser.classCode);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setErrorMsg('친구의 이름이나 별명을 입력해 주세요.');
      return;
    }

    addClassMember(activeUser.classCode, trimmed, selectedAvatar);
    setName('');
    setErrorMsg('');
    onMembersChanged();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="w-full max-w-md my-8 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-rose-100 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-white" />
            <h3 className="text-lg font-black tracking-tight">우리 반 친구 목록 관리</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Add form */}
          <form onSubmit={handleAdd} className="space-y-3">
            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold text-center">
                ⚠️ {errorMsg}
              </div>
            )}
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              새 친구 추가하기
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="친구 이름/별명 (예: 김하늘)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={12}
                className="flex-1 px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-extrabold flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>추가</span>
              </button>
            </div>

            {/* Avatar picker */}
            <div className="flex gap-1.5 overflow-x-auto py-1">
              {AVATAR_OPTIONS.slice(0, 10).map((av) => (
                <button
                  type="button"
                  key={av}
                  onClick={() => setSelectedAvatar(av)}
                  className={`p-1.5 rounded-xl text-lg transition-all cursor-pointer ${
                    selectedAvatar === av
                      ? 'bg-rose-400 text-white scale-110 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </form>

          {/* Current Class Member List */}
          <div>
            <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
              등록된 친구 목록 ({members.length}명)
            </span>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2"
                >
                  <span className="text-base">{m.avatar}</span>
                  <span className="truncate">{m.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
