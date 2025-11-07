'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChatStage } from '@/components/ChatStage';
import { getPersonaById } from '@/lib/personas';
import type { Persona } from '@/lib/personas/types';

/**
 * チャット画面の内部コンポーネント
 */
function ChatPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [situation, setSituation] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // クエリパラメータから情報を取得
      const situationParam = searchParams.get('situation');
      const personasParam = searchParams.get('personas');

      // バリデーション
      if (!situationParam || !personasParam) {
        setError('シチュエーションまたはペルソナ情報が見つかりません');
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
        setError('有効なペルソナが見つかりません');
        return;
      }

      setSituation(situationParam);
      setPersonas(loadedPersonas);
    } catch (err) {
      console.error('パラメータ読み込みエラー:', err);
      setError('予期しないエラーが発生しました');
    }
  }, [searchParams]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-950 via-black to-orange-950">
      {/* エラー表示 */}
      {error && (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-red-900/80 border-2 border-red-500 rounded-lg px-8 py-6 text-white max-w-md">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">⚠️</span>
              <p className="font-bold text-xl">エラー</p>
            </div>
            <p className="mb-4">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold transition-colors"
            >
              ホームに戻る
            </button>
          </div>
        </div>
      )}

      {/* チャットステージ */}
      {!error && personas.length > 0 && situation && (
        <ChatStage personas={personas} situation={situation} />
      )}
    </div>
  );
}

/**
 * チャット画面ページ
 * クエリパラメータからシチュエーションとペルソナIDを取得し、
 * ChatStageコンポーネントで会話を表示する
 */
export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="relative min-h-screen bg-gradient-to-br from-purple-950 via-black to-orange-950 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">読み込み中...</div>
      </div>
    }>
      <ChatPageContent />
    </Suspense>
  );
}
