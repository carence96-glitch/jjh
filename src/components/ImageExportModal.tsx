import React, { useEffect, useState } from 'react';
import { PraiseCard } from '../types';
import { generateCardPNGDataUrl } from '../utils/canvasExport';
import { Download, Share2, ShieldAlert, Check, X, Sparkles } from 'lucide-react';

interface ImageExportModalProps {
  card: PraiseCard | null;
  onClose: () => void;
}

export const ImageExportModal: React.FC<ImageExportModalProps> = ({ card, onClose }) => {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    if (card) {
      setLoading(true);
      generateCardPNGDataUrl(card).then((url) => {
        setDataUrl(url);
        setLoading(false);
      });
    }
  }, [card]);

  if (!card) return null;

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `praise_card_${card.receiverName}_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyLink = () => {
    const text = `[칭찬 릴레이 🌸] ${card.receiverName}님에게 온 칭찬 카드:\n"${card.content}"`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="w-full max-w-lg my-8 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-rose-100 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-200" />
            <h3 className="text-lg font-black tracking-tight">칭찬 카드 이미지 저장 및 공유</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Explicit Privacy Notice Box as requested! */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-medium flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold block text-amber-950 dark:text-amber-100 mb-0.5">
                📢 내보내기 & 공유 정보 안내
              </span>
              <span>
                저장되거나 외부로 내보내지는 이미지/문구에는 <strong>칭찬 메시지</strong>, <strong>학급 코드({card.classCode})</strong>, 및 <strong>작성자/수신자 별명</strong>만 포함됩니다. 학번, 개인 전화번호, 비밀번호 등 개인 식별 정보는 일절 포함되지 않습니다.
              </span>
            </div>
          </div>

          {/* Image Preview Box */}
          <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-4 flex items-center justify-center min-h-[300px] border border-slate-200 dark:border-slate-700">
            {loading ? (
              <div className="flex flex-col items-center gap-2 text-slate-400 font-bold text-xs">
                <div className="w-8 h-8 border-4 border-rose-400 border-t-transparent rounded-full animate-spin" />
                <span>예쁜 카드 이미지를 생성 중입니다...</span>
              </div>
            ) : dataUrl ? (
              <img
                src={dataUrl}
                alt="Praise Card Preview"
                className="max-h-[380px] w-auto rounded-xl shadow-lg border border-white dark:border-slate-700 object-contain"
              />
            ) : (
              <span className="text-xs text-rose-500 font-bold">이미지를 생성하지 못했습니다.</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={handleDownload}
              disabled={loading || !dataUrl}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-rose-500 hover:bg-rose-600 disabled:bg-slate-300 text-white font-extrabold text-sm shadow-md shadow-rose-200 dark:shadow-none flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>PNG 이미지 다운로드</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-extrabold text-sm flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>텍스트 복사됨!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-rose-500" />
                  <span>메시지 텍스트 복사</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
