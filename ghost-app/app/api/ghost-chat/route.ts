import { type NextRequest, NextResponse } from 'next/server';
import { getPersonaById } from '@/lib/personas';
import { buildSystemPrompt, generateConversation } from '@/lib/ai/chat-generator';

/**
 * AI会話生成APIエンドポイント
 * POST /api/ghost-chat
 */
export async function POST(req: NextRequest) {
  try {
    // リクエストボディから必要な情報を取得
    const body = await req.json();
    const { situation, personaIds, locale } = body;

    // バリデーション
    if (!situation || typeof situation !== 'string') {
      return NextResponse.json(
        { error: 'シチュエーションが必要です' },
        { status: 400 }
      );
    }

    if (!personaIds || !Array.isArray(personaIds) || personaIds.length === 0) {
      return NextResponse.json(
        { error: 'ペルソナIDが必要です' },
        { status: 400 }
      );
    }

    if (!locale || (locale !== 'ja' && locale !== 'en')) {
      return NextResponse.json(
        { error: '有効なロケールが必要です' },
        { status: 400 }
      );
    }

    // ペルソナIDから実際のペルソナオブジェクトを取得
    const personas = personaIds
      .map((id: string) => getPersonaById(id))
      .filter((p): p is NonNullable<typeof p> => p !== undefined);

    if (personas.length === 0) {
      return NextResponse.json(
        { error: '有効なペルソナが見つかりません' },
        { status: 400 }
      );
    }

    // システムプロンプトを構築
    const systemPrompt = buildSystemPrompt(situation, personas, locale);

    // AI会話を生成（ストリーミング）
    const stream = await generateConversation(systemPrompt, locale);

    return stream;
  } catch (error) {
    console.error('AI会話生成エラー:', error);
    return NextResponse.json(
      { error: '会話の生成に失敗しました' },
      { status: 500 }
    );
  }
}
