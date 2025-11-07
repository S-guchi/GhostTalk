import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import type { Persona } from '@/lib/personas/types';

// OpenAIプロバイダーを初期化
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

/**
 * システムプロンプトを構築する
 * @param situation ユーザーが入力したシチュエーション
 * @param personas 会話に参加するペルソナの配列
 * @param locale 言語設定（'ja' または 'en'）
 * @returns 構築されたシステムプロンプト
 */
export function buildSystemPrompt(
  situation: string,
  personas: Persona[],
  locale: 'ja' | 'en'
): string {
  // ロケールに応じたプロンプトテンプレート
  const templates = {
    ja: {
      intro: 'あなたは複数のハロウィンキャラクターの会話を生成するAIです。',
      situation: `\n\n## シチュエーション\n${situation}`,
      characters: '\n\n## 登場キャラクター',
      rules: `\n\n## 会話のルール
1. 各キャラクターは自分の性格と話し方に忠実に会話してください
2. シチュエーションに基づいた自然な対話を生成してください
3. キャラクター同士が交互に話すようにしてください
4. 各発言は1-3文程度の長さにしてください
5. 合計で8-12回の発言を生成してください
6. 各発言は以下のJSON形式で出力してください：
{"personaId": "キャラクターID", "message": "発言内容"}

各発言を改行で区切って出力してください。`,
    },
    en: {
      intro: 'You are an AI that generates conversations between multiple Halloween characters.',
      situation: `\n\n## Situation\n${situation}`,
      characters: '\n\n## Characters',
      rules: `\n\n## Conversation Rules
1. Each character must stay true to their personality and speaking style
2. Generate natural dialogue based on the situation
3. Characters should take turns speaking
4. Keep each message to 1-3 sentences
5. Generate a total of 8-12 messages
6. Output each message in the following JSON format:
{"personaId": "character_id", "message": "message_content"}

Separate each message with a newline.`,
    },
  };

  const template = templates[locale];

  // システムプロンプトを構築
  let prompt = template.intro;
  prompt += template.situation;
  prompt += template.characters;

  // 各ペルソナの情報を追加
  for (const persona of personas) {
    const speakingStyle = locale === 'ja' ? persona.speakingStyle : (persona.speakingStyleEn || persona.speakingStyle);
    
    prompt += `\n\n### ${persona.name} (ID: ${persona.id})`;
    prompt += `\n- ${locale === 'ja' ? '説明' : 'Description'}: ${persona.description}`;
    prompt += `\n- ${locale === 'ja' ? '性格' : 'Personality'}: ${persona.personality.join(', ')}`;
    prompt += `\n- ${locale === 'ja' ? '話し方' : 'Speaking Style'}: ${speakingStyle}`;
  }

  prompt += template.rules;

  return prompt;
}

/**
 * AI会話を生成する（ストリーミング）
 * @param systemPrompt システムプロンプト
 * @param locale 言語設定
 * @returns ストリーミングレスポンス
 */
export async function generateConversation(
  systemPrompt: string,
  locale: 'ja' | 'en'
) {
  const userMessage = locale === 'ja' 
    ? '上記のシチュエーションとキャラクターで会話を始めてください。'
    : 'Please start the conversation with the above situation and characters.';

  try {
    // タイムアウト処理（30秒）
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    // AI会話を生成
    const result = streamText({
      model: openai('gpt-4-turbo'),
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
      temperature: 0.8,
      abortSignal: controller.signal,
    });

    clearTimeout(timeoutId);
    return result.toTextStreamResponse();
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('AI会話生成がタイムアウトしました');
    }
    console.error('AI会話生成エラー:', error);
    throw error;
  }
}
