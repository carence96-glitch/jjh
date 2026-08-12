import React, { useEffect, useState } from 'react';
import { PraiseCard } from '../types';
import { Sparkles, Heart, X } from 'lucide-react';

interface NotificationToastProps {
  latestCard: PraiseCard | null;
  activeUserName?: string;
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  latestCard,
  activeUserName,
  onClose,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (latestCard) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [latestCard, onClose]);

  if (!visible || !latestCard) return null;

  const isForMe = activeUserName && latestCard.receiverName === activeUserName;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border-2 border-rose-300 dark:border-rose-800 p-4 animate-in slide-in-from-bottom-5 fade-in duration-300 flex items-start gap-3">
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-400 to-amber-300 flex items-center justify-center text-xl shrink-0 shadow-xs">
        {isForMe ? '🎁' : '💌'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-xs font-black text-rose-600 dark:text-rose-400">
            {isForMe ? '축하해요! 내가 받은 새 칭찬 카드!' : '실시간 칭찬 도착!'}
          </span>
        </div>
        <p className="text-xs font-extrabold text-slate-800 dark:text-slate-100 truncate">
          To. {latestCard.receiverName}
        </p>
        <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 mt-0.5 font-medium">
          "{latestCard.content}"
        </p>
      </div>
      <button
        onClick={() => {
          setVisible(false);
          onClose();
        }}
        className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
