import type { Persona } from "./types";
import { pumpkinPersona } from "./pumpkin";
import { skeletonPersona } from "./skeleton";
import { witchPersona } from "./witch";

/**
 * 全ペルソナのレジストリ
 * 新しいペルソナを追加する場合は、ここにインポートして配列に追加する
 */
export const allPersonas: Persona[] = [
  skeletonPersona,
  pumpkinPersona,
  witchPersona,
  // 新しいペルソナをここに追加
];

/**
 * ランダムに指定数のペルソナを選択する
 * @param count 選択するペルソナの数（デフォルト: 3）
 * @returns ランダムに選択されたペルソナの配列
 */
export function selectRandomPersonas(count = 3): Persona[] {
  // 配列をシャッフル
  const shuffled = [...allPersonas].sort(() => Math.random() - 0.5);

  // 指定数または利用可能な数の少ない方を返す
  return shuffled.slice(0, Math.min(count, allPersonas.length));
}

/**
 * IDでペルソナを取得する
 * @param id ペルソナのID
 * @returns 見つかったペルソナ、または undefined
 */
export function getPersonaById(id: string): Persona | undefined {
  return allPersonas.find((p) => p.id === id);
}

// 型と個別のペルソナもエクスポート
export type { Persona } from "./types";
export { pumpkinPersona } from "./pumpkin";
export { skeletonPersona } from "./skeleton";
export { witchPersona } from "./witch";
