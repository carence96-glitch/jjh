import { ActiveUser, PraiseCard, ClassMember } from '../types';
import { PRESET_PRAISE_CARDS, DEFAULT_CLASS_MEMBERS } from '../data/presetData';

const STORAGE_KEYS = {
  ACTIVE_USER: 'praise_relay_active_user',
  CARDS_PREFIX: 'praise_relay_cards_',
  MEMBERS_PREFIX: 'praise_relay_members_',
  REACTIONS_PREFIX: 'praise_relay_reactions_',
};

// BroadcastChannel for real-time tab synchronization on the same device/browser
let channel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    channel = new BroadcastChannel('praise_relay_sync_channel');
  }
} catch (e) {
  console.log('BroadcastChannel not supported or disabled', e);
}

// Active User
export function getStoredActiveUser(): ActiveUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function setStoredActiveUser(user: ActiveUser | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
    }
  } catch (e) {
    console.error(e);
  }
}

// Class Members
export function getClassMembers(classCode: string): ClassMember[] {
  try {
    const key = STORAGE_KEYS.MEMBERS_PREFIX + classCode;
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw);
    }
    // Default fallback: if class code is default sample '103', return preset members
    if (classCode === '103' || classCode === '1학년 3반') {
      localStorage.setItem(key, JSON.stringify(DEFAULT_CLASS_MEMBERS));
      return DEFAULT_CLASS_MEMBERS;
    }
    // For a new class code, start with a default set or empty list
    const initialMembers = [
      { id: '1', name: '김민준', avatar: '🦊' },
      { id: '2', name: '이서연', avatar: '🐰' },
      { id: '3', name: '박지후', avatar: '🐻' },
      { id: '4', name: '최하은', avatar: '🐱' },
      { id: '5', name: '강수아', avatar: '🐥' },
    ];
    localStorage.setItem(key, JSON.stringify(initialMembers));
    return initialMembers;
  } catch (e) {
    return DEFAULT_CLASS_MEMBERS;
  }
}

export function addClassMember(classCode: string, name: string, avatar: string): ClassMember[] {
  const current = getClassMembers(classCode);
  const exists = current.some((m) => m.name.trim() === name.trim());
  if (exists) return current;

  const newMember: ClassMember = {
    id: 'm-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    name: name.trim(),
    avatar,
  };
  const updated = [...current, newMember];
  try {
    localStorage.setItem(STORAGE_KEYS.MEMBERS_PREFIX + classCode, JSON.stringify(updated));
    broadcastSync({ type: 'MEMBERS_UPDATED', classCode });
  } catch (e) {
    console.error(e);
  }
  return updated;
}

// Praise Cards
export function getPraiseCards(classCode: string): PraiseCard[] {
  try {
    const key = STORAGE_KEYS.CARDS_PREFIX + classCode;
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw);
    }
    if (classCode === '103' || classCode === '1학년 3반') {
      localStorage.setItem(key, JSON.stringify(PRESET_PRAISE_CARDS));
      return PRESET_PRAISE_CARDS;
    }
    return [];
  } catch (e) {
    return [];
  }
}

export function savePraiseCard(classCode: string, newCard: Omit<PraiseCard, 'id' | 'createdAt' | 'reactions'>): PraiseCard {
  const cards = getPraiseCards(classCode);
  const createdCard: PraiseCard = {
    ...newCard,
    id: 'card-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    createdAt: new Date().toISOString(),
    reactions: { heart: 0, thumb: 0, touch: 0, fire: 0 },
  };

  const updated = [createdCard, ...cards];
  try {
    localStorage.setItem(STORAGE_KEYS.CARDS_PREFIX + classCode, JSON.stringify(updated));
    broadcastSync({ type: 'CARD_ADDED', classCode, card: createdCard });
  } catch (e) {
    console.error(e);
  }
  return createdCard;
}

export function toggleCardReaction(
  classCode: string,
  cardId: string,
  reactionType: 'heart' | 'thumb' | 'touch' | 'fire',
  userName: string
): PraiseCard[] {
  const cards = getPraiseCards(classCode);
  const userReactionKey = `${STORAGE_KEYS.REACTIONS_PREFIX}${classCode}_${userName}`;
  
  let userReactionsMap: Record<string, string[]> = {};
  try {
    const rawMap = localStorage.getItem(userReactionKey);
    if (rawMap) userReactionsMap = JSON.parse(rawMap);
  } catch (e) {}

  const currentReactionsForCard = userReactionsMap[cardId] || [];
  const hasReacted = currentReactionsForCard.includes(reactionType);

  const updatedCards = cards.map((card) => {
    if (card.id === cardId) {
      const currentCount = card.reactions[reactionType] || 0;
      const newCount = hasReacted ? Math.max(0, currentCount - 1) : currentCount + 1;

      return {
        ...card,
        reactions: {
          ...card.reactions,
          [reactionType]: newCount,
        },
      };
    }
    return card;
  });

  // Update user reaction record
  if (hasReacted) {
    userReactionsMap[cardId] = currentReactionsForCard.filter((r) => r !== reactionType);
  } else {
    userReactionsMap[cardId] = [...currentReactionsForCard, reactionType];
  }

  try {
    localStorage.setItem(STORAGE_KEYS.CARDS_PREFIX + classCode, JSON.stringify(updatedCards));
    localStorage.setItem(userReactionKey, JSON.stringify(userReactionsMap));
    broadcastSync({ type: 'REACTION_UPDATED', classCode });
  } catch (e) {
    console.error(e);
  }

  return updatedCards;
}

export function getUserReactionsForUser(classCode: string, userName: string): Record<string, string[]> {
  try {
    const userReactionKey = `${STORAGE_KEYS.REACTIONS_PREFIX}${classCode}_${userName}`;
    const rawMap = localStorage.getItem(userReactionKey);
    return rawMap ? JSON.parse(rawMap) : {};
  } catch (e) {
    return {};
  }
}

export function deletePraiseCard(classCode: string, cardId: string): PraiseCard[] {
  const cards = getPraiseCards(classCode);
  const updated = cards.filter((c) => c.id !== cardId);
  try {
    localStorage.setItem(STORAGE_KEYS.CARDS_PREFIX + classCode, JSON.stringify(updated));
    broadcastSync({ type: 'CARD_DELETED', classCode });
  } catch (e) {
    console.error(e);
  }
  return updated;
}

// Broadcast messaging for tab sync
function broadcastSync(msg: { type: string; classCode: string; card?: PraiseCard }) {
  if (channel) {
    try {
      channel.postMessage(msg);
    } catch (e) {}
  }
}

export function subscribeToSync(callback: (msg: { type: string; classCode: string; card?: PraiseCard }) => void): () => void {
  if (!channel) return () => {};
  const handler = (event: MessageEvent) => {
    callback(event.data);
  };
  channel.addEventListener('message', handler);
  return () => {
    if (channel) channel.removeEventListener('message', handler);
  };
}
