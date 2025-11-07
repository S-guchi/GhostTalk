"use client";

import { useState, useEffect } from "react";
import { GhostCharacter } from "./GhostCharacter";
import { SpeechBubble } from "./SpeechBubble";
import type { Persona } from "@/lib/personas/types";

interface ChatMessage {
  personaId: string;
  message: string;
}

interface ChatStageProps {
  personas: Persona[];
  situation: string;
}

/**
 * キャラクターの位置を計算する
 * 3体のキャラクターを画面上に配置
 * レスポンシブ対応: 画面サイズに応じて位置を調整
 */
function calculatePositions(
  count: number,
  isMobile: boolean,
): Array<{ x: number; y: number }> {
  if (count === 3) {
    if (isMobile) {
      // モバイル: 縦に配置
      return [
        { x: 50, y: 25 }, // 上
        { x: 50, y: 50 }, // 中央
        { x: 50, y: 75 }, // 下
      ];
    }
    // デスクトップ/タブレット: 横に配置
    return [
      { x: 20, y: 50 }, // 左
      { x: 50, y: 40 }, // 中央上
      { x: 80, y: 50 }, // 右
    ];
  }

  // 3体以外の場合は円形に配置
  const positions: Array<{ x: number; y: number }> = [];
  const centerX = 50;
  const centerY = 50;
  const radius = isMobile ? 25 : 30;

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
 * キャラクターの上または横に表示（画面サイズに応じて調整）
 */
function calculateBubblePosition(
  characterPosition: { x: number; y: number },
  isMobile: boolean,
): { x: number; y: number } {
  if (isMobile) {
    // モバイル: キャラクターの横に配置（画面端を避ける）
    const isLeft = characterPosition.x < 50;
    return {
      x: isLeft ? characterPosition.x + 25 : characterPosition.x - 25,
      y: characterPosition.y,
    };
  }
  // デスクトップ/タブレット: キャラクターの上に配置
  return {
    x: characterPosition.x,
    y: characterPosition.y - 20,
  };
}

export function ChatStage({ personas, situation }: ChatStageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePersonaId, setActivePersonaId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // 画面サイズの検出
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // キャラクターの位置を計算（レスポンシブ対応）
  const characterPositions = calculatePositions(personas.length, isMobile);

  // AI APIから会話を取得
  useEffect(() => {
    const fetchConversation = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // タイムアウト処理（30秒）
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const response = await fetch("/api/ghost-chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            situation,
            personaIds: personas.map((p) => p.id),
            locale: "ja",
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          // HTTPステータスコードに応じたエラーメッセージ
          if (response.status >= 500) {
            throw new Error(
              "お化けたちが現れませんでした。もう一度お試しください。",
            );
          }
          if (response.status === 408 || response.status === 504) {
            throw new Error("タイムアウトしました。もう一度お試しください。");
          }
          throw new Error(
            "お化けたちが現れませんでした。もう一度お試しください。",
          );
        }

        // ストリーミングレスポンスを処理
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        if (!reader) {
          throw new Error(
            "お化けたちが現れませんでした。もう一度お試しください。",
          );
        }

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // 改行で分割してJSONメッセージをパース
          const lines = buffer.split("\n");
          buffer = lines.pop() || ""; // 最後の不完全な行はバッファに残す

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
              console.warn("JSONパースエラー:", e);
            }
          }
        }

        setIsLoading(false);
      } catch (err) {
        console.error("会話取得エラー:", err);

        // エラーの種類に応じたメッセージ
        if (err instanceof Error) {
          if (err.name === "AbortError") {
            setError("タイムアウトしました。もう一度お試しください。");
          } else if (err.message.includes("fetch")) {
            setError(
              "ネットワークエラーが発生しました。接続を確認してください。",
            );
          } else {
            setError(err.message);
          }
        } else {
          setError("予期しないエラーが発生しました。");
        }

        setIsLoading(false);
      }
    };

    fetchConversation();
  }, [situation, personas]);

  // メッセージを順次表示する
  useEffect(() => {
    if (messages.length === 0 || isLoading) return;

    // 最初のメッセージを表示
    // 要件: キャラクター登場後に会話開始（最後のキャラクター登場は0.9秒後）
    if (currentMessageIndex === -1) {
      // キャラクター登場完了を待つ（3体 × 0.3秒 + 0.5秒のアニメーション = 1.4秒）
      const initialDelay = setTimeout(() => {
        setCurrentMessageIndex(0);
        setActivePersonaId(messages[0].personaId);
      }, 1500);

      return () => clearTimeout(initialDelay);
    }

    // 次のメッセージがある場合
    if (currentMessageIndex < messages.length - 1) {
      // 要件: 発言間に1-2秒の間隔を設定
      const currentMsg = messages[currentMessageIndex];
      // メッセージの長さに応じて間隔を調整（最小1.5秒、最大3秒）
      const baseDelay = 1500;
      const lengthDelay = Math.min(currentMsg.message.length * 30, 1500);
      const delay = baseDelay + lengthDelay;

      const timer = setTimeout(() => {
        const nextIndex = currentMessageIndex + 1;
        setCurrentMessageIndex(nextIndex);
        setActivePersonaId(messages[nextIndex].personaId);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [messages, currentMessageIndex, isLoading]);

  // 現在表示中のメッセージ
  const currentMessage =
    currentMessageIndex >= 0 ? messages[currentMessageIndex] : null;
  const currentPersona = currentMessage
    ? personas.find((p) => p.id === currentMessage.personaId)
    : null;

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      role="main"
      aria-label="ゴーストチャット会話画面"
    >
      {/* キャラクターを配置 */}
      {/* 要件: 各0.3秒間隔で順次登場 */}
      <div role="group" aria-label="お化けキャラクター">
        {personas.map((persona, index) => (
          <GhostCharacter
            key={persona.id}
            persona={persona}
            position={characterPositions[index]}
            isActive={activePersonaId === persona.id}
            delay={index * 300} // 0.3秒間隔
            isMobile={isMobile}
          />
        ))}
      </div>

      {/* 現在のメッセージの吹き出しを表示 */}
      {currentMessage && currentPersona && (
        <SpeechBubble
          key={currentMessageIndex}
          message={currentMessage.message}
          persona={currentPersona}
          position={calculateBubblePosition(
            characterPositions[
              personas.findIndex((p) => p.id === currentPersona.id)
            ],
            isMobile,
          )}
          isMobile={isMobile}
        />
      )}

      {/* ローディング表示 */}
      {isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          role="status"
          aria-live="polite"
          aria-label="会話を生成中"
        >
          <div className="bg-purple-900/80 border-2 border-purple-500 rounded-lg px-4 sm:px-8 py-4 sm:py-6 text-center max-w-sm">
            <div className="text-white text-lg sm:text-xl mb-4 animate-pulse">
              会話を生成中...
            </div>
            <div className="flex justify-center space-x-2" aria-hidden="true">
              <div
                className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* エラー表示 */}
      {error && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          role="alert"
          aria-live="assertive"
        >
          <div className="bg-red-900/80 border-2 border-red-500 rounded-lg px-4 sm:px-8 py-4 sm:py-6 text-white max-w-md w-full">
            <div className="flex items-center mb-4">
              <span className="text-2xl sm:text-3xl mr-3" aria-hidden="true">
                ⚠️
              </span>
              <h2 className="font-bold text-lg sm:text-xl">エラー</h2>
            </div>
            <p className="mb-4 text-sm sm:text-base">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-red-900 text-sm sm:text-base"
              aria-label="ページを再読み込みしてもう一度試す"
            >
              もう一度試す
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
