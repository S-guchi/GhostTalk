'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NoiseEffect from '@/components/NoiseEffect';
import { InputWindow } from '@/components/InputWindow';
import { selectRandomPersonas } from '@/lib/personas';

/**
 * メインページコンポーネント
 * NoiseEffect → InputWindowの順で表示し、シチュエーション送信後にチャット画面へ遷移
 */
export default function Home() {
  const router = useRouter();
  
  // 表示状態の管理
  const [showNoise, setShowNoise] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * ノイズエフェクト完了時のハンドラー
   * InputWindowをフェードイン表示
   */
  const handleNoiseComplete = () => {
    setShowNoise(false);
    setShowInput(true);
  };

  /**
   * シチュエーション送信時のハンドラー
   * ランダムに3体のペルソナを選択し、チャット画面へ遷移
   */
  const handleSubmit = (situation: string) => {
    try {
      setIsSubmitting(true);
      
      // ランダムに3体のペルソナを選択
      const selectedPersonas = selectRandomPersonas(3);
      const personaIds = selectedPersonas.map(p => p.id).join(',');
      
      // チャット画面へナビゲーション（クエリパラメータで情報を渡す）
      const params = new URLSearchParams({
        situation,
        personas: personaIds,
      });
      
      router.push(`/ja/chat?${params.toString()}`);
    } catch (error) {
      console.error('ナビゲーションエラー:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-950 via-black to-orange-950">
      {/* ノイズエフェクト（起動演出） */}
      {showNoise && <NoiseEffect onComplete={handleNoiseComplete} />}
      
      {/* 入力ウィンドウ */}
      <main className="flex min-h-screen items-center justify-center p-4">
        <InputWindow onSubmit={handleSubmit} isVisible={showInput} isLoading={isSubmitting} />
      </main>
      
      {/* 送信中のローディングオーバーレイ */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-purple-900/80 border-2 border-purple-500 rounded-lg px-8 py-6 text-center">
            <div className="text-white text-xl mb-4 animate-pulse">
              お化けを呼んでいます...
            </div>
            <div className="flex justify-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
