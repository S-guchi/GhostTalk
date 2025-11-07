"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "motion";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import type { Persona } from "@/lib/personas/types";

interface SpeechBubbleProps {
  message: string;
  persona: Persona;
  position: { x: number; y: number };
  onComplete?: () => void;
  isMobile?: boolean; // モバイル表示かどうか
}

export function SpeechBubble({
  message,
  persona,
  position,
  onComplete,
  isMobile = false,
}: SpeechBubbleProps) {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // ポップアップアニメーション
  // 要件: 吹き出しアニメーションのタイミング最適化
  useEffect(() => {
    if (bubbleRef.current) {
      if (prefersReducedMotion) {
        // アニメーション削減モードでは即座に表示
        bubbleRef.current.style.opacity = "1";
        bubbleRef.current.style.transform = "translate(-50%, -50%) scale(1)";
      } else {
        animate(
          bubbleRef.current,
          {
            opacity: [0, 1],
            scale: [0.8, 1.05, 1],
            y: [20, -5, 0],
          },
          {
            duration: 0.3,
            easing: [0.34, 1.56, 0.64, 1], // easeOutBack風のイージング
          },
        );
      }
    }
  }, [prefersReducedMotion]);

  // タイピングエフェクト
  useEffect(() => {
    if (!message) return;

    let currentIndex = 0;
    setDisplayedText("");
    setIsTypingComplete(false);

    // アニメーション削減モードでは即座に全文表示
    if (prefersReducedMotion) {
      setDisplayedText(message);
      setIsTypingComplete(true);
      if (onComplete) {
        onComplete();
      }
      return;
    }

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
  }, [message, onComplete, prefersReducedMotion]);

  return (
    <div
      ref={bubbleRef}
      className={`absolute z-10 ${isMobile ? "px-2" : ""}`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: "translate(-50%, -50%)",
        opacity: 0,
        maxWidth: isMobile ? "80vw" : "none",
      }}
      role="article"
      aria-label={`${persona.name}の発言`}
      aria-live="polite"
    >
      <div
        className={`relative ${
          isMobile ? "max-w-[280px]" : "max-w-xs sm:max-w-sm md:max-w-md"
        } px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-lg backdrop-blur-sm`}
        style={{
          backgroundColor: `${persona.visualStyle.color}15`,
          borderColor: persona.visualStyle.color,
          borderWidth: "2px",
          borderStyle: "solid",
        }}
      >
        {/* 吹き出しの尾 */}
        <div
          className={`absolute ${
            isMobile
              ? position.x > 50
                ? "-right-2 top-1/2 -translate-y-1/2"
                : "-left-2 top-1/2 -translate-y-1/2"
              : "-bottom-3 left-1/2 -translate-x-1/2"
          } w-0 h-0`}
          style={
            isMobile
              ? position.x > 50
                ? {
                    borderTop: "8px solid transparent",
                    borderBottom: "8px solid transparent",
                    borderLeft: `8px solid ${persona.visualStyle.color}`,
                  }
                : {
                    borderTop: "8px solid transparent",
                    borderBottom: "8px solid transparent",
                    borderRight: `8px solid ${persona.visualStyle.color}`,
                  }
              : {
                  borderLeft: "12px solid transparent",
                  borderRight: "12px solid transparent",
                  borderTop: `12px solid ${persona.visualStyle.color}`,
                }
          }
        />
        <div
          className={`absolute ${
            isMobile
              ? position.x > 50
                ? "-right-1 top-1/2 -translate-y-1/2"
                : "-left-1 top-1/2 -translate-y-1/2"
              : "-bottom-2 left-1/2 -translate-x-1/2"
          } w-0 h-0`}
          style={
            isMobile
              ? position.x > 50
                ? {
                    borderTop: "6px solid transparent",
                    borderBottom: "6px solid transparent",
                    borderLeft: `6px solid ${persona.visualStyle.color}15`,
                  }
                : {
                    borderTop: "6px solid transparent",
                    borderBottom: "6px solid transparent",
                    borderRight: `6px solid ${persona.visualStyle.color}15`,
                  }
              : {
                  borderLeft: "10px solid transparent",
                  borderRight: "10px solid transparent",
                  borderTop: `10px solid ${persona.visualStyle.color}15`,
                }
          }
        />

        {/* メッセージテキスト */}
        <p
          className="text-sm sm:text-base leading-relaxed"
          style={{ color: persona.visualStyle.color }}
          aria-label={message}
        >
          {displayedText}
          {/* タイピング中のカーソル */}
          {!isTypingComplete && !prefersReducedMotion && (
            <span
              className="inline-block w-0.5 h-4 ml-1 animate-pulse"
              style={{ backgroundColor: persona.visualStyle.color }}
              aria-hidden="true"
            />
          )}
        </p>

        {/* キャラクター名ラベル */}
        <div
          className={`absolute ${
            isMobile ? "-top-2.5 left-2" : "-top-3 left-4"
          } px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold`}
          style={{
            backgroundColor: persona.visualStyle.color,
            color: "#ffffff",
          }}
        >
          {persona.name}
        </div>
      </div>
    </div>
  );
}
