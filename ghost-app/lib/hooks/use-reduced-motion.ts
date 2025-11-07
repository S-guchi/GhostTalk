import { useEffect, useState } from "react";

/**
 * prefers-reduced-motionメディアクエリを監視するカスタムフック
 * ユーザーがアニメーション削減を希望している場合はtrueを返す
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // メディアクエリを作成
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // 初期値を設定
    setPrefersReducedMotion(mediaQuery.matches);

    // メディアクエリの変更を監視
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // イベントリスナーを追加
    mediaQuery.addEventListener("change", handleChange);

    // クリーンアップ
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return prefersReducedMotion;
}
