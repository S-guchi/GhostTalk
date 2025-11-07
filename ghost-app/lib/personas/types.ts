/**
 * ペルソナの型定義
 * 各お化けキャラクターの性格、話し方、ビジュアルスタイルを定義
 */

export interface Persona {
  /** ユニークID（例: 'skeleton', 'pumpkin', 'witch'） */
  id: string;

  /** キャラクター名 */
  name: string;

  /** キャラクターの説明 */
  description: string;

  /** 性格の特徴（配列） */
  personality: string[];

  /** 日本語での話し方 */
  speakingStyle: string;

  /** 英語での話し方（オプション） */
  speakingStyleEn?: string;

  /** ビジュアルスタイル */
  visualStyle: {
    /** テーマカラー（HEX形式） */
    color: string;

    /** 絵文字アイコン（フォールバック用） */
    icon: string;

    /** SVG画像のパス */
    imagePath: string;
  };
}

/** ペルソナのタイプ（IDの型安全性のため） */
export type PersonaType =
  | "skeleton"
  | "pumpkin"
  | "witch"
  | "ghost"
  | "vampire";
