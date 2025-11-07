'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { ChatStage } from '@/components/ChatStage';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { getPersonaById } from '@/lib/personas';
import type { Persona } from '@/lib/personas/types';

/**
 * チャット画面ページ
 * クエリパラメータからシチュエーションとペルソナIDを取得し、
 * ChatStageコンポーネントで会話を表示する
 */
export default function ChatPage() {
  const searchParams = useSearchParams();
  const locale = useLocale() as 'ja' | 'en';
  
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [situation, setSituation] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // クエリパラメータから情報を取得
    const situationParam = searchParams.get('situation');
    const personasParam = searchParams.get('personas');

    // バリデーション
    if (!situationParam || !personasParam) {
      setError(
        locale === 'ja'
          ? 'シチュエーションまたはペルソナ情報が見つかりません'
          : 'Situation or persona information not found'
      );
      return;
    }

    // ペルソナIDをカンマ区切りで分割
    const personaIds = personasParam.split(',');
    
    // IDからペルソナオブジェクトを取得
    const loadedPersonas = personaIds
      .map((id) => getPersonaById(id.trim()))
      .filter((p): p is Persona => p !== undefined);

    // ペルソナが見つからない場合
    if (loadedPersonas.length === 0) {
      setError(
        locale === 'ja'
          ? '有効なペルソナが見つかりません'
          : 'No valid personas found'
      );
      return;
    }

    setSituation(situationParam);
    setPersonas(loadedPersonas);
  }, [searchParams, locale]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-950 via-black to-orange-950">
      {/* 言語切り替えボタン */}
      <LanguageSwitcher />

      {/* エラー表示 */}
      {error && (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-red-500/20 border-2 border-red-500 rounded-lg px-6 py-4 text-white max-w-md">
            <p className="font-bold mb-2">
              {locale === 'ja' ? 'エラー' : 'Error'}
            </p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* チャットステージ */}
      {!error && personas.length > 0 && situation && (
        <ChatStage personas={personas} situation={situation} locale={locale} />
      )}
    </div>
  );
}
