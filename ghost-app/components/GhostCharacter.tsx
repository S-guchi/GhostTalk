"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { animate } from "motion";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import type { Persona } from "@/lib/personas/types";

interface GhostCharacterProps {
  persona: Persona;
  position: { x: number; y: number };
  isActive: boolean; // 現在話しているかどうか
  delay?: number; // 登場アニメーションの遅延時間（ミリ秒）
  isMobile?: boolean; // モバイル表示かどうか
}

export function GhostCharacter({
  persona,
  position,
  isActive,
  delay = 0,
  isMobile = false,
}: GhostCharacterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // レスポンシブ対応: 画面サイズに応じてキャラクターサイズを調整
  const characterSize = isMobile ? 100 : 150;

  // 登場アニメーション（スケール + フェードイン）
  // 要件: 各0.3秒間隔で順次登場
  useEffect(() => {
    if (containerRef.current) {
      if (prefersReducedMotion) {
        // アニメーション削減モードでは即座に表示
        containerRef.current.style.opacity = "1";
        containerRef.current.style.transform = "translate(-50%, -50%) scale(1)";
      } else {
        // 指定された遅延後にアニメーション開始
        const timer = setTimeout(() => {
          if (containerRef.current) {
            animate(
              containerRef.current,
              {
                opacity: [0, 1],
                scale: [0.5, 1.05, 1],
              },
              {
                duration: 0.5,
                easing: "ease-out",
              },
            );
          }
        }, delay);

        return () => clearTimeout(timer);
      }
    }
  }, [delay, prefersReducedMotion]);

  // isActiveの変化に応じた強調表示アニメーション
  useEffect(() => {
    if (containerRef.current && !prefersReducedMotion) {
      if (isActive) {
        animate(
          containerRef.current,
          {
            scale: [1, 1.1, 1],
            y: [0, -10, 0],
          },
          {
            duration: 0.3,
            easing: "ease-in-out",
          },
        );
      }
    }
  }, [isActive, prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="absolute transition-all duration-300"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: "translate(-50%, -50%)",
        opacity: 0,
      }}
      role="img"
      aria-label={`${persona.name}${isActive ? "（話し中）" : ""}`}
      aria-live={isActive ? "polite" : "off"}
    >
      <div
        className={`relative transition-all duration-300 ${
          isActive
            ? "drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]"
            : "drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
        }`}
      >
        {/* キャラクター画像またはフォールバック絵文字 */}
        {!imageError ? (
          <Image
            src={persona.visualStyle.imagePath}
            alt={persona.name}
            width={characterSize}
            height={characterSize}
            priority
            onError={() => setImageError(true)}
            className={`transition-all duration-300 ${
              isActive ? "brightness-110" : "brightness-100"
            }`}
          />
        ) : (
          <div
            className={`flex items-center justify-center ${
              isMobile
                ? "w-[100px] h-[100px] text-6xl"
                : "w-[150px] h-[150px] text-8xl"
            }`}
            style={{ color: persona.visualStyle.color }}
            role="img"
            aria-label={persona.name}
          >
            {persona.visualStyle.icon}
          </div>
        )}

        {/* キャラクター名表示 */}
        <div
          className={`absolute ${
            isMobile ? "-bottom-6" : "-bottom-8"
          } left-1/2 -translate-x-1/2 whitespace-nowrap px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
            isActive
              ? "bg-white/90 text-gray-900 scale-110"
              : "bg-black/70 text-white"
          }`}
          style={{
            borderColor: persona.visualStyle.color,
            borderWidth: isActive ? "2px" : "1px",
          }}
        >
          {persona.name}
        </div>

        {/* アクティブ時の追加エフェクト */}
        {isActive && (
          <div
            className="absolute inset-0 rounded-full animate-ping opacity-30"
            style={{
              backgroundColor: persona.visualStyle.color,
            }}
          />
        )}
      </div>
    </div>
  );
}
