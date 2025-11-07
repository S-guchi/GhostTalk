'use client';

import { useEffect, useRef } from 'react';
import { animate } from 'motion';

interface NoiseEffectProps {
  onComplete: () => void;
  duration?: number; // デフォルト: 2000ms（要件: 0-2秒）
}

export default function NoiseEffect({ onComplete, duration = 2000 }: NoiseEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // キャンバスサイズを画面全体に設定
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // ノイズエフェクトのアニメーション
    const drawNoise = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      // ランダムなノイズを生成
      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;     // Red
        data[i + 1] = value; // Green
        data[i + 2] = value; // Blue
        data[i + 3] = 255;   // Alpha
      }

      ctx.putImageData(imageData, 0, 0);
      animationFrameRef.current = requestAnimationFrame(drawNoise);
    };

    drawNoise();

    // 指定時間後にアニメーションを停止してコールバックを実行
    // 要件: ノイズエフェクトは2秒以内、フェードアウトは0.3秒
    const timer = setTimeout(() => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      // motionライブラリを使ってフェードアウトアニメーション（0.3秒）
      animate(
        container,
        { opacity: 0 },
        { duration: 0.3, easing: 'ease-out' }
      ).finished.then(() => {
        onComplete();
      });
    }, duration);

    // クリーンアップ
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      clearTimeout(timer);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [onComplete, duration]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        aria-label="ノイズエフェクト"
      />
    </div>
  );
}
