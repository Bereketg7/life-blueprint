// XP manager – tracks XP gains across the app
import { XpTransaction, UserLevel } from '../../types';
import { calcLevelFromXp } from './levelingSystem';

const _transactions: XpTransaction[] = [];

function generateId(): string {
  return `xp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function awardXp(
  userId: string,
  amount: number,
  source: XpTransaction['source'],
  description: string
): XpTransaction {
  const transaction: XpTransaction = {
    id: generateId(),
    userId,
    amount,
    source,
    description,
    timestamp: new Date().toISOString(),
  };
  _transactions.push(transaction);
  return transaction;
}

export function getTotalXp(userId: string): number {
  return _transactions
    .filter((t) => t.userId === userId)
    .reduce((s, t) => s + t.amount, 0);
}

export function getXpHistory(userId: string): XpTransaction[] {
  return _transactions.filter((t) => t.userId === userId);
}

export function getXpBreakdown(userId: string): Record<XpTransaction['source'], number> {
  const history = getXpHistory(userId);
  return history.reduce(
    (acc, t) => {
      acc[t.source] = (acc[t.source] ?? 0) + t.amount;
      return acc;
    },
    {} as Record<XpTransaction['source'], number>
  );
}

export function checkLevelUp(
  userId: string,
  previousLevel: number
): { leveledUp: boolean; newLevel: number } {
  const totalXp = getTotalXp(userId);
  const { level } = calcLevelFromXp(totalXp);
  return { leveledUp: level > previousLevel, newLevel: level };
}
