'use client';

import { useEffect, useRef, useState } from 'react';
import { animate } from 'motion';
import type { Persona } from '@/lib/personas/types';

interface SpeechBubbleProps {
  message: string;
  persona: Persona;
  position: { x: number; y: number };
  onComplete?: () => void;
}

export function SpeechBubble({ 
  message, 
  persona, 
  position, 
  onComplete 
}: SpeechBubbleProps) {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  // ポップアップアニメーション
  // 要件: 吹き出しアニメーションのタイミング最適化
  useEffect(() => {
    if (bubbleRef.current) {
      animate(
        bubbleRef.current,
        { 
          opacity: [0, 1],
          scale: [0.8, 1.05, 1],
          y: [20, -5, 0]
        },
        { 
          duration: 0.3,
          easing: [0.34, 1.56, 0.64, 1] // easeOutBack風のイージング
        }
      );
    }
  }, []);

  // タイピングエフェクト
  useEffect(() => {
    if (!message) return;

    let currentIndex = 0;
    setDisplayedText('');
    setIsTypingComplete(false);

    // タイピング速度（ミリ秒）
    // 要件: 自然な会話の流れを実現するため、適度な速度に調整
    const typingSpeed = 40;

    const typingInterval = setInterval(() => {
      if (currentIndex < message.length) {
        setDisplayedText(message.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTypingComplete(true);
        
        // タイピング完了後にコールバックを実行
        if (onComplete) {
          onComplete();
        }
      }
    }, typingSpeed);

    return () => clearInterval(typingInterval);
  }, [message, onComplete]);

  return (
    <div
      ref={bubbleRef}
      className="absolute z-10"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        opacity: 0
      }}
    >
      <div
        className="relative max-w-xs sm:max-w-sm md:max-w-md px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm"
        style={{
          backgroundColor: `${persona.visualStyle.color}15`,
          borderColor: persona.visualStyle.color,
          borderWidth: '2px',
          borderStyle: 'solid'
        }}
      >
        {/* 吹き出しの尾 */}
        <div
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0"
          style={{
            borderLeft: '12px solid transparent',
            borderRight: '12px solid transparent',
            borderTop: `12px solid ${persona.visualStyle.color}`
          }}
        />
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0"
          style={{
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: `10px solid ${persona.visualStyle.color}15`
          }}
        />

        {/* メッセージテキスト */}
        <p 
          className="text-sm sm:text-base leading-relaxed"
          style={{ color: persona.visualStyle.color }}
        >
          {displayedText}
          {/* タイピング中のカーソル */}
          {!isTypingComplete && (
            <span 
              className="inline-block w-0.5 h-4 ml-1 animate-pulse"
              style={{ backgroundColor: persona.visualStyle.color }}
            />
          )}
        </p>

        {/* キャラクター名ラベル */}
        <div
          className="absolute -top-3 left-4 px-2 py-0.5 rounded-full text-xs font-bold"
          style={{
            backgroundColor: persona.visualStyle.color,
            color: '#ffffff'
          }}
        >
          {persona.name}
        </div>
      </div>
    </div>
  );
}
