import { ClassMember, PraiseCategory, CardTheme, PraiseCard } from '../types';

export const AVATAR_OPTIONS = [
  '🦊', '🐰', '🐻', '🐱', '🐼', '🐥', '🐶', '🐯', 
  '🐨', '🦄', '🐬', '🍓', '🌟', '🍀', '🐣', '🚀'
];

export const CATEGORY_INFO: Record<PraiseCategory, { label: string; icon: string; color: string; bg: string }> = {
  kindness: { label: '배려/친절', icon: '🌸', color: 'text-pink-600', bg: 'bg-pink-100 dark:bg-pink-900/30' },
  learning: { label: '학습/발표', icon: '📚', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  sports: { label: '운동/체육', icon: '⚽', color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  leadership: { label: '리더십/협동', icon: '🤝', color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  humor: { label: '유머/즐거움', icon: '🎉', color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  gratitude: { label: '일상/고마움', icon: '💌', color: 'text-rose-600', bg: 'bg-rose-100 dark:bg-rose-900/30' },
};

export const THEME_STYLES: Record<CardTheme, {
  bgGradient: string;
  borderColor: string;
  badgeBg: string;
  textColor: string;
  accentColor: string;
  name: string;
  previewColor: string;
}> = {
  coral: {
    name: '따뜻한 코랄',
    bgGradient: 'from-amber-50 via-rose-50 to-orange-100',
    borderColor: 'border-rose-200',
    badgeBg: 'bg-rose-200 text-rose-800',
    textColor: 'text-slate-800',
    accentColor: 'text-rose-600',
    previewColor: '#fda4af'
  },
  mint: {
    name: '청량한 민트',
    bgGradient: 'from-emerald-50 via-teal-50 to-cyan-100',
    borderColor: 'border-emerald-200',
    badgeBg: 'bg-teal-200 text-teal-800',
    textColor: 'text-slate-800',
    accentColor: 'text-emerald-600',
    previewColor: '#6ee7b7'
  },
  yellow: {
    name: '화사한 버터',
    bgGradient: 'from-yellow-50 via-amber-50 to-orange-50',
    borderColor: 'border-amber-200',
    badgeBg: 'bg-amber-200 text-amber-900',
    textColor: 'text-slate-800',
    accentColor: 'text-amber-600',
    previewColor: '#fde047'
  },
  purple: {
    name: '포근한 라벤더',
    bgGradient: 'from-purple-50 via-indigo-50 to-pink-50',
    borderColor: 'border-purple-200',
    badgeBg: 'bg-purple-200 text-purple-900',
    textColor: 'text-slate-800',
    accentColor: 'text-purple-600',
    previewColor: '#c084fc'
  },
  blue: {
    name: '시원한 스카이',
    bgGradient: 'from-sky-50 via-blue-50 to-indigo-100',
    borderColor: 'border-sky-200',
    badgeBg: 'bg-sky-200 text-sky-900',
    textColor: 'text-slate-800',
    accentColor: 'text-sky-600',
    previewColor: '#7dd3fc'
  },
  rose: {
    name: '러블리 로즈',
    bgGradient: 'from-pink-50 via-rose-100 to-red-50',
    borderColor: 'border-pink-200',
    badgeBg: 'bg-pink-200 text-pink-900',
    textColor: 'text-slate-800',
    accentColor: 'text-pink-600',
    previewColor: '#f472b6'
  }
};

export const PRAISE_TEMPLATES: { category: PraiseCategory; text: string }[] = [
  { category: 'kindness', text: '항상 친절한 말투로 따뜻하게 응대해 줘서 매번 감동이야! 🌸' },
  { category: 'kindness', text: '내가 숙제나 준비물 물어볼 때 친절하게 가르쳐줘서 너무 고마웠어! 😊' },
  { category: 'learning', text: '모둠 수업할 때 정리도 잘하고 아이디어도 멋지게 내줘서 든든했어! 📚' },
  { category: 'learning', text: '발표할 때 또박또박 큰 소리로 전달력 있게 잘해서 멋졌어! 👏' },
  { category: 'sports', text: '체육 시간에 끝까지 포기하지 않고 팀을 위해 최선을 다하는 모습이 짱이었어! ⚽' },
  { category: 'sports', text: '운동 신경도 좋고 경기 규칙도 친구들에게 신사적으로 설명해줘서 멋져! 🏆' },
  { category: 'leadership', text: '학급 청소 시간에 구석구석 솔선수범해서 챙기는 모습에 반했어! 🧹' },
  { category: 'leadership', text: '친구들 의견 잘 들어주고 조화롭게 배려하는 리더십이 인상 깊어! 🤝' },
  { category: 'humor', text: '쉬는 시간마다 재치 있는 입담으로 우리 반 분위기를 환하게 만들어줘서 고마워! 🎉' },
  { category: 'humor', text: '기분 우울할 때 먼저 다가와서 웃겨주는 따뜻한 센스쟁이! 😆' },
  { category: 'gratitude', text: '아침에 교실 들어올 때 먼저 기분 좋게 인사 건네줘서 하루가 행복해져! ☀️' },
  { category: 'gratitude', text: '언제나 긍정적인 에너지를 전해주는 너는 우리 반의 진짜 보물이야! 💖' },
];

export const STICKER_OPTIONS = ['❤️', '⭐', '🌟', '🌈', '🍀', '🐣', '🎁', '🏆', '👏', '🔥', '💌', '🌸'];

export const DEFAULT_CLASS_MEMBERS: ClassMember[] = [
  { id: '1', name: '김민준', avatar: '🦊', bio: '체육을 좋아하는 열정 왕' },
  { id: '2', name: '이서연', avatar: '🐰', bio: '그림 그리기와 인형 수집' },
  { id: '3', name: '박지후', avatar: '🐻', bio: '수학 문제 풀기 좋아하는 아이디어맨' },
  { id: '4', name: '최하은', avatar: '🐱', bio: '피아노 연주와 음악 감상' },
  { id: '5', name: '정도윤', avatar: '🐼', bio: '축구와 게임 이야기 좋아하는 친구' },
  { id: '6', name: '강수아', avatar: '🐥', bio: '웃음 많고 다정한 우리 반 분위기 메이커' },
  { id: '7', name: '윤시우', avatar: '🐶', bio: '책 읽는 것을 좋아하는 조용한 모범생' },
  { id: '8', name: '한예린', avatar: '🐯', bio: '댄스와 운동에 열정 넘치는 친구' },
  { id: '9', name: '임현우', avatar: '🐨', bio: '컴퓨터와 코딩에 관심이 많은 친구' },
  { id: '10', name: '오지민', avatar: '🦄', bio: '만화 그리기를 잘하는 감성 유저' },
];

export const PRESET_PRAISE_CARDS: PraiseCard[] = [
  {
    id: 'preset-1',
    classCode: '103',
    receiverClass: '1학년 3반',
    senderName: '이서연',
    senderAvatar: '🐰',
    receiverName: '김민준',
    receiverAvatar: '🦊',
    content: '지난번 체육 시간에 발야구할 때 공을 놓쳐서 시무룩해진 나에게 "괜찮아! 다음 회에 다시 하면 돼!" 하고 격려해 줘서 진짜 큰 힘이 되었어. 진짜 멋진 스포츠맨이야! ⚽',
    category: 'sports',
    theme: 'mint',
    isAnonymous: false,
    stickers: ['⚽', '🏆', '👏'],
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    reactions: { heart: 8, thumb: 5, touch: 6, fire: 12 }
  },
  {
    id: 'preset-2',
    classCode: '103',
    receiverClass: '1학년 3반',
    senderName: '마니또 친구',
    senderAvatar: '🎁',
    receiverName: '최하은',
    receiverAvatar: '🐱',
    content: '수업 시간에 어려운 단원 지문 읽을 때 항상 맑고 안정적인 목소리로 차분하게 읽어줘서 반 전체 분위기가 평온해져. 그리고 짝꿍 챙겨줄 때도 배려심 넘쳐! 🌸',
    category: 'kindness',
    theme: 'coral',
    isAnonymous: true,
    stickers: ['🌸', '❤️', '🌟'],
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    reactions: { heart: 12, thumb: 7, touch: 9, fire: 2 }
  },
  {
    id: 'preset-3',
    classCode: '103',
    receiverClass: '1학년 3반',
    senderName: '박지후',
    senderAvatar: '🐻',
    receiverName: '정도윤',
    receiverAvatar: '🐼',
    content: '과학 실습 모둠 활동할 때 보조 준비물 챙기고 정리까지 솔선수범해줘서 고마웠어. 도윤이 덕분에 우리 조가 제일 먼저 실험 끝내고 잘 마칠 수 있었어! 🔬',
    category: 'leadership',
    theme: 'yellow',
    isAnonymous: false,
    stickers: ['🤝', '⭐', '🔥'],
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4 hours ago
    reactions: { heart: 6, thumb: 10, touch: 4, fire: 9 }
  },
  {
    id: 'preset-4',
    classCode: '103',
    receiverClass: '1학년 3반',
    senderName: '강수아',
    senderAvatar: '🐥',
    receiverName: '이서연',
    receiverAvatar: '🐰',
    content: '미술 시간에 내가 물감 색 조합을 몰라서 고민할 때 다가와서 따뜻하게 알려주고 서연이 물감도 나눠 써줘서 감동이었어. 그림도 진짜 예쁘게 잘 그려! 🎨',
    category: 'learning',
    theme: 'purple',
    isAnonymous: false,
    stickers: ['🎨', '💖', '🐣'],
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(), // 6 hours ago
    reactions: { heart: 15, thumb: 8, touch: 14, fire: 3 }
  },
  {
    id: 'preset-5',
    classCode: '103',
    receiverClass: '1학년 3반',
    senderName: '익명의 친구',
    senderAvatar: '🌟',
    receiverName: '강수아',
    receiverAvatar: '🐥',
    content: '아침 자율 학습 시간 전마다 반에 들어오는 친구들에게 먼저 큰 소리로 "안녕!" 하고 웃으며 인사해 주는 모습에 매일 아침 기분이 밝아져. 너는 우리 반의 비타민이야! ☀️',
    category: 'gratitude',
    theme: 'rose',
    isAnonymous: true,
    stickers: ['☀️', '🍀', '❤️'],
    createdAt: new Date(Date.now() - 1000 * 60 * 480).toISOString(), // 8 hours ago
    reactions: { heart: 18, thumb: 11, touch: 13, fire: 7 }
  }
];
