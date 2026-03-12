import { CoachMessage, CoachConversation } from '../../types';
import { sendMessage, ChatMessage } from './openaiApi';

function makeId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function makeConvId(): string {
  return `conv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export class VoiceCoach {
  private userId: string;
  private conversationId: string;
  private messages: CoachMessage[] = [];
  private startedAt: string;

  constructor(userId: string) {
    this.userId = userId;
    this.conversationId = makeConvId();
    this.startedAt = new Date().toISOString();
  }

  startSession(): void {
    this.messages = [];
    this.conversationId = makeConvId();
    this.startedAt = new Date().toISOString();
  }

  endSession(): CoachConversation {
    const endedAt = new Date().toISOString();
    return {
      id: this.conversationId,
      userId: this.userId,
      messages: [...this.messages],
      startedAt: this.startedAt,
      endedAt,
      topic: this.inferTopic(),
    };
  }

  async sendTextMessage(text: string): Promise<CoachMessage> {
    const userMessage: CoachMessage = {
      id: makeId(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    this.messages.push(userMessage);

    const history: ChatMessage[] = this.messages.map((m) => ({
      role: m.role === 'coach' ? 'assistant' : 'user',
      content: m.content,
    }));

    const responseText = await sendMessage(history, this.userId);

    const coachMessage: CoachMessage = {
      id: makeId(),
      role: 'coach',
      content: responseText,
      timestamp: new Date().toISOString(),
    };
    this.messages.push(coachMessage);
    return coachMessage;
  }

  getConversationHistory(): CoachMessage[] {
    return [...this.messages];
  }

  private inferTopic(): string {
    const allText = this.messages.map((m) => m.content).join(' ').toLowerCase();
    if (allText.includes('workout') || allText.includes('exercise')) return 'fitness';
    if (allText.includes('calorie') || allText.includes('nutrition')) return 'nutrition';
    if (allText.includes('sleep')) return 'sleep';
    if (allText.includes('stress') || allText.includes('mood')) return 'mental_health';
    return 'general';
  }
}
