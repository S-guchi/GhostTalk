'use client';

import { useState, useEffect, useCallback } from 'react';
import { GhostCharacter } from './GhostCharacter';
import { SpeechBubble } from './SpeechBubble';
import type { Persona } from '@/lib/personas/types';

interface ChatMessage {
  personaId: string;
  message: string;
}

interface ChatStageProps {
  personas: Persona[];
  situation: string;
  locale: 'ja' | 'en';
}

/**
 * キャラクターの位置を計算する
 * 3体のキャラクターを画面上に配置
 */
function calculatePositions(count: number): Array<{ x: number; y: number }> {
  if (count === 3) {
    return [
      { x: 20, y: 50 },  // 左
      { x: 50, y: 40 },  // 中央上
      { x: 80, y: 50 },  // 右
    ];
  }
  
  // 3体以外の場合は円形に配置
  const positions: Array<{ x: number; y: number }> = [];
  const centerX = 50;
  const centerY = 50;
  const radius = 30;
  
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
    positions.push({
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    });
  }
  
  return positions;
}

/**
 * 吹き出しの位置を計算する
 * キャラクターの上に表示
 */
function calculateBubblePosition(
  characterPosition: { x: number; y: number }
): { x: number; y: number } {
  return {
    x: characterPosition.x,
    y: characterPosition.y - 20, // キャラクターの上に配置
  };
}

export function ChatStage({ personas, situation, locale }: ChatStageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePersonaId, setActivePersonaId] = useState<string | null>(null);

  // キャラクターの位置を計算
  const characterPositions = calculatePositions(personas.length);

  // AI APIから会話を取得
  useEffect(() => {
    const fetchConversation = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/ghost-chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            situation,
            personaIds: personas.map((p) => p.id),
            locale,
          }),
        });

        if (!response.ok) {
          throw new Error('会話の生成に失敗しました');
        }

        // ストリーミングレスポンスを処理
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        if (!reader) {
          throw new Error('レスポンスの読み取りに失敗しました');
        }

        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          
          // 改行で分割してJSONメッセージをパース
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // 最後の不完全な行はバッファに残す

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            try {
              // JSON形式のメッセージをパース
              const parsed = JSON.parse(trimmed);
              if (parsed.personaId && parsed.message) {
                setMessages((prev) => [...prev, parsed]);
              }
            } catch (e) {
              // JSONパースエラーは無視（部分的なデータの可能性）
              console.warn('JSONパースエラー:', e);
            }
          }
        }

        setIsLoading(false);
      } catch (err) {
        console.error('会話取得エラー:', err);
        setError(err instanceof Error ? err.message : '不明なエラー');
        setIsLoading(false);
      }
    };

    fetchConversation();
  }, [situation, personas, locale]);

  // メッセージを順次表示する
  useEffect(() => {
    if (messages.length === 0 || isLoading) return;

    // 最初のメッセージを表示
    if (currentMessageIndex === -1) {
      setCurrentMessageIndex(0);
      setActivePersonaId(messages[0].personaId);
      return;
    }

    // 次のメッセージがある場合
    if (currentMessageIndex < messages.length - 1) {
      // 1-2秒の間隔で次のメッセージを表示
      const delay = 1000 + Math.random() * 1000; // 1-2秒
      const timer = setTimeout(() => {
        const nextIndex = currentMessageIndex + 1;
        setCurrentMessageIndex(nextIndex);
        setActivePersonaId(messages[nextIndex].personaId);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [messages, currentMessageIndex, isLoading]);

  // 現在表示中のメッセージ
  const currentMessage = currentMessageIndex >= 0 ? messages[currentMessageIndex] : null;
  const currentPersona = currentMessage
    ? personas.find((p) => p.id === currentMessage.personaId)
    : null;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* キャラクターを配置 */}
      {personas.map((persona, index) => (
        <GhostCharacter
          key={persona.id}
          persona={persona}
          position={characterPositions[index]}
          isActive={activePersonaId === persona.id}
        />
      ))}

      {/* 現在のメッセージの吹き出しを表示 */}
      {currentMessage && currentPersona && (
        <SpeechBubble
          key={currentMessageIndex}
          message={currentMessage.message}
          persona={currentPersona}
          position={calculateBubblePosition(
            characterPositions[personas.findIndex((p) => p.id === currentPersona.id)]
          )}
        />
      )}

      {/* ローディング表示 */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-xl animate-pulse">
            {locale === 'ja' ? '会話を生成中...' : 'Generating conversation...'}
          </div>
        </div>
      )}

      {/* エラー表示 */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-red-500/20 border-2 border-red-500 rounded-lg px-6 py-4 text-white">
            <p className="font-bold mb-2">
              {locale === 'ja' ? 'エラー' : 'Error'}
            </p>
            <p>{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
