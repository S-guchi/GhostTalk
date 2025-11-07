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
    // ランダムに3体のペルソナを選択
    const selectedPersonas = selectRandomPersonas(3);
    const personaIds = selectedPersonas.map(p => p.id).join(',');
    
    // チャット画面へナビゲーション（クエリパラメータで情報を渡す）
    const params = new URLSearchParams({
      situation,
      personas: personaIds,
    });
    
    router.push(`/chat?${params.toString()}`);
  };

  return (
    <div 
      className="relative min-h-screen bg-gradient-to-br from-purple-950 via-black to-orange-950"
      lang="ja"
    >
      {/* ノイズエフェクト（起動演出） */}
      {showNoise && <NoiseEffect onComplete={handleNoiseComplete} />}
      
      {/* 入力ウィンドウ */}
      <main className="flex min-h-screen items-center justify-center p-4">
        <InputWindow onSubmit={handleSubmit} isVisible={showInput} />
      </main>
    </div>
  );
}
