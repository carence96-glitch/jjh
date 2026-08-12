export type PraiseCategory = 
  | 'kindness'   // 배려/친절
  | 'learning'   // 학습/발표
  | 'sports'     // 운동/체육
  | 'leadership' // 리더십/협동
  | 'humor'      // 유머/즐거움
  | 'gratitude'; // 일상/고마움

export type CardTheme = 
  | 'coral'   // 따뜻한 핑크 코랄
  | 'mint'    // 청량한 캔디 민트
  | 'yellow'  // 화사한 버터 옐로우
  | 'purple'  // 포근한 라벤더
  | 'blue'    // 시원한 스카이 블루
  | 'rose';   // 러블리 로즈

export interface ClassMember {
  id: string;
  name: string;
  avatar: string; // Emoji avatar like 🦊, 🐰
  bio?: string;
}

export interface ReactionCount {
  heart: number;    // 좋아요 ❤️
  thumb: number;    // 공감해요 👍
  touch: number;    // 감동이에요 🥹
  fire: number;     // 멋져요 🔥
}

export interface PraiseCard {
  id: string;
  classCode: string;
  receiverClass?: string; // 칭찬받는 학생의 학반 (e.g. "1학년 3반" or "103반")
  senderName: string;
  senderAvatar: string;
  receiverName: string;
  receiverAvatar: string;
  content: string;
  category: PraiseCategory;
  theme: CardTheme;
  isAnonymous: boolean;
  stickers: string[]; // e.g., ["⭐", "❤️", "🏆"]
  createdAt: string;  // ISO Date string
  reactions: ReactionCount;
  userReactions?: Record<string, string[]>; // cardId -> array of reaction types for current session
}

export interface ActiveUser {
  classCode: string;
  name: string;
  avatar: string;
}

export interface FilterState {
  viewMode: 'all' | 'received' | 'sent' | 'target' | 'category';
  targetFriend: string;
  category: PraiseCategory | 'all';
  searchQuery: string;
  sortBy: 'latest' | 'popular';
}

export interface HourlyCount {
  hour: number; // 0..23
  label: string; // e.g. "1교시(09시)", "2교시(10시)"
  count: number;
}
