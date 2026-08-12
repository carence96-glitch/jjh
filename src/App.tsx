import React, { useState, useEffect, useCallback } from 'react';
import { ActiveUser, PraiseCard, ClassMember } from './types';
import {
  getStoredActiveUser,
  setStoredActiveUser,
  getPraiseCards,
  getClassMembers,
  subscribeToSync,
} from './utils/storage';
import { Header } from './components/Header';
import { JoinClassModal } from './components/JoinClassModal';
import { PraiseForm } from './components/PraiseForm';
import { PraiseFeed } from './components/PraiseFeed';
import { PraiseThermometerModal } from './components/PraiseThermometerModal';
import { ImageExportModal } from './components/ImageExportModal';
import { AddMemberModal } from './components/AddMemberModal';
import { NotificationToast } from './components/NotificationToast';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, ShieldCheck, MessageSquarePlus, Trophy, Users } from 'lucide-react';

export default function App() {
  const [activeUser, setActiveUser] = useState<ActiveUser | null>(getStoredActiveUser());
  const [cards, setCards] = useState<PraiseCard[]>([]);
  const [classMembers, setClassMembers] = useState<ClassMember[]>([]);

  // Modals state
  const [isJoinOpen, setIsJoinOpen] = useState<boolean>(!getStoredActiveUser());
  const [isWriterOpen, setIsWriterOpen] = useState<boolean>(false);
  const [isThermometerOpen, setIsThermometerOpen] = useState<boolean>(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState<boolean>(false);
  const [exportTargetCard, setExportTargetCard] = useState<PraiseCard | null>(null);

  // Real-time notification
  const [notificationCard, setNotificationCard] = useState<PraiseCard | null>(null);

  // Load data for active class code
  const reloadData = useCallback(() => {
    const currentClassCode = activeUser ? activeUser.classCode : '103';
    const loadedCards = getPraiseCards(currentClassCode);
    const loadedMembers = getClassMembers(currentClassCode);
    setCards(loadedCards);
    setClassMembers(loadedMembers);
  }, [activeUser]);

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  // Cross-tab real-time sync listener via BroadcastChannel
  useEffect(() => {
    const unsubscribe = subscribeToSync((msg) => {
      if (activeUser && msg.classCode === activeUser.classCode) {
        reloadData();
        if (msg.type === 'CARD_ADDED' && msg.card) {
          setNotificationCard(msg.card);
          // If the card was sent to current user, fire confetti!
          if (msg.card.receiverName === activeUser.name) {
            try {
              confetti({
                particleCount: 100,
                spread: 80,
                origin: { y: 0.5 },
                colors: ['#f43f5e', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'],
              });
            } catch (e) {}
          }
        }
      }
    });
    return () => unsubscribe();
  }, [activeUser, reloadData]);

  const handleUserJoin = (user: ActiveUser) => {
    setActiveUser(user);
    setIsJoinOpen(false);
  };

  const handleLogoutChangeUser = () => {
    setStoredActiveUser(null);
    setActiveUser(null);
    setIsJoinOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/50 via-amber-50/30 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        activeUser={activeUser}
        cardCount={cards.length}
        onOpenWriter={() => setIsWriterOpen(true)}
        onOpenThermometer={() => setIsThermometerOpen(true)}
        onOpenAddMember={() => setIsAddMemberOpen(true)}
        onChangeUser={handleLogoutChangeUser}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Banner Hero */}
        <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 text-white shadow-md overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 z-10 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>중학교 1학년 학급 인성 교육 & 관계 형성</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              칭찬으로 이어지는 따뜻한 우리 반 릴레이 🌸
            </h2>
            <p className="text-xs sm:text-sm font-medium text-white/95 max-w-xl leading-relaxed">
              서로의 고마웠던 순간과 숨은 장점을 발견해 따뜻한 카드를 전해보세요. 작은 칭찬 한마디가 우리 반의 커다란 웃음이 됩니다!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 z-10 w-full sm:w-auto">
            <button
              onClick={() => setIsWriterOpen(true)}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white text-rose-600 font-extrabold text-sm shadow-md hover:bg-rose-50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>지금 칭찬 카드 보내기</span>
            </button>
          </div>

          {/* Decorative Background Circles */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute left-1/2 -top-10 w-32 h-32 rounded-full bg-amber-300/20 blur-lg pointer-events-none" />
        </div>

        {/* Praise Feed Area */}
        <PraiseFeed
          cards={cards}
          activeUser={activeUser}
          classMembers={classMembers}
          onOpenWriter={() => setIsWriterOpen(true)}
          onOpenExportModal={(card) => setExportTargetCard(card)}
          onCardUpdated={reloadData}
        />
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-rose-100 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xs text-slate-500 dark:text-slate-400 text-xs text-center">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>개인정보 안심 보장: 학생 입력 데이터는 기기(Local Storage)에만 저장됩니다.</span>
          </div>
          <div>
            <span>© 칭찬 릴레이 | 중학교 학급 활동 인성 교육 웹앱</span>
          </div>
        </div>
      </footer>

      {/* Modals & Toasts */}
      <JoinClassModal
        isOpen={isJoinOpen}
        onJoin={handleUserJoin}
      />

      {activeUser && (
        <>
          <PraiseForm
            activeUser={activeUser}
            isOpen={isWriterOpen}
            onClose={() => setIsWriterOpen(false)}
            onCardSubmitted={reloadData}
          />

          <AddMemberModal
            activeUser={activeUser}
            isOpen={isAddMemberOpen}
            onClose={() => setIsAddMemberOpen(false)}
            onMembersChanged={reloadData}
          />
        </>
      )}

      <PraiseThermometerModal
        cards={cards}
        isOpen={isThermometerOpen}
        onClose={() => setIsThermometerOpen(false)}
      />

      <ImageExportModal
        card={exportTargetCard}
        onClose={() => setExportTargetCard(null)}
      />

      <NotificationToast
        latestCard={notificationCard}
        activeUserName={activeUser?.name}
        onClose={() => setNotificationCard(null)}
      />
    </div>
  );
}
