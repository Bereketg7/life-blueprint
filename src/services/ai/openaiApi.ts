// OpenAI GPT-4 integration for AI Coach
import { CoachMessage } from '../../types';

const OPENAI_API_BASE = 'https://api.openai.com/v1/chat/completions';

let _apiKey = '';

export function setOpenAIApiKey(key: string): void {
  _apiKey = key;
}

export interface ChatCompletionMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function getChatCompletion(
  messages: ChatCompletionMessage[],
  model: string = 'gpt-4'
): Promise<string> {
  if (!_apiKey) {
    return 'AI Coach is not configured. Please set your OpenAI API key.';
  }

  const response = await fetch(OPENAI_API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${_apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const json = await response.json();
  return json.choices?.[0]?.message?.content?.trim() ?? '';
}

export function coachMessagesToOpenAI(
  messages: CoachMessage[],
  systemPrompt: string
): ChatCompletionMessage[] {
  const result: ChatCompletionMessage[] = [{ role: 'system', content: systemPrompt }];
  messages.forEach((m) => {
    result.push({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content,
    });
  });
  return result;
}
