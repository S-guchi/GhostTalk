"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChatStage } from "@/components/ChatStage";
import { getPersonaById } from "@/lib/personas";
import type { Persona } from "@/lib/personas/types";

/**
 * チャット画面の内部コンポーネント
 */
function ChatPageContent() {
  const searchParams = useSearchParams();

  const [personas, setPersonas] = useState<Persona[]>([]);
  const [situation, setSituation] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // クエリパラメータから情報を取得
    const situationParam = searchParams.get("situation");
    const personasParam = searchParams.get("personas");

    // バリデーション
    if (!situationParam || !personasParam) {
      setError("シチュエーションまたはペルソナ情報が見つかりません");
      return;
    }

    // ペルソナIDをカンマ区切りで分割
    const personaIds = personasParam.split(",");

    // IDからペルソナオブジェクトを取得
    const loadedPersonas = personaIds
      .map((id) => getPersonaById(id.trim()))
      .filter((p): p is Persona => p !== undefined);

    // ペルソナが見つからない場合
    if (loadedPersonas.length === 0) {
      setError("有効なペルソナが見つかりません");
      return;
    }

    setSituation(situationParam);
    setPersonas(loadedPersonas);
  }, [searchParams]);

  return (
    <div
      className="relative min-h-screen bg-gradient-to-br from-purple-950 via-black to-orange-950"
      lang="ja"
    >
      {/* エラー表示 */}
      {error && (
        <div
          className="flex items-center justify-center min-h-screen p-4"
          role="alert"
          aria-live="assertive"
        >
          <div className="bg-red-500/20 border-2 border-red-500 rounded-lg px-4 sm:px-6 py-3 sm:py-4 text-white max-w-md w-full">
            <h2 className="font-bold mb-2 text-base sm:text-lg">エラー</h2>
            <p className="text-sm sm:text-base">{error}</p>
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
    <Suspense
      fallback={
        <div
          className="relative min-h-screen bg-gradient-to-br from-purple-950 via-black to-orange-950 flex items-center justify-center"
          role="status"
          aria-live="polite"
          aria-label="ページを読み込み中"
        >
          <div className="text-white text-lg sm:text-xl animate-pulse">
            読み込み中...
          </div>
        </div>
      }
    >
      <ChatPageContent />
    </Suspense>
  );
}
