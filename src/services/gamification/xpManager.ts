import { XpTransaction } from '../../types';
import { calculateLevel, buildUserLevel } from './levelingSystem';

// In-memory XP store
const userTotalXp: Map<string, number> = new Map();
const xpHistory: Map<string, XpTransaction[]> = new Map();

let transactionCounter = 0;

function generateTransactionId(): string {
  return `xp_txn_${Date.now()}_${++transactionCounter}`;
}

export async function awardXp(
  userId: string,
  amount: number,
  source: XpTransaction['source'],
  description?: string,
): Promise<XpTransaction> {
  const current = userTotalXp.get(userId) ?? 0;
  const prevLevel = calculateLevel(current);
  userTotalXp.set(userId, current + amount);
  const newLevel = calculateLevel(current + amount);

  const transaction: XpTransaction = {
    id: generateTransactionId(),
    userId,
    amount,
    source,
    description: description ?? `+${amount} XP from ${source}`,
    timestamp: new Date().toISOString(),
  };

  const history = xpHistory.get(userId) ?? [];
  xpHistory.set(userId, [transaction, ...history].slice(0, 500));

  if (newLevel > prevLevel) {
    // Level up event could be emitted here; stored in history instead
    xpHistory.set(userId, [
      {
        id: generateTransactionId(),
        userId,
        amount: 0,
        source: 'manual',
        description: `🎉 Level up! You reached level ${newLevel}!`,
        timestamp: new Date().toISOString(),
      },
      ...xpHistory.get(userId)!,
    ]);
  }

  return transaction;
}

export async function getXpHistory(
  userId: string,
  limit: number = 50,
): Promise<XpTransaction[]> {
  return (xpHistory.get(userId) ?? []).slice(0, limit);
}

export async function getTotalXp(userId: string): Promise<number> {
  return userTotalXp.get(userId) ?? 0;
}

export function setTotalXp(userId: string, xp: number): void {
  userTotalXp.set(userId, xp);
}

export async function getUserLevelData(userId: string) {
  const totalXp = await getTotalXp(userId);
  return buildUserLevel(userId, totalXp);
}
