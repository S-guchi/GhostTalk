import type { Persona } from "./types";

/**
 * カボチャ（パンプ）のペルソナ
 * 元気いっぱいで少し天然なキャラクター
 */
export const pumpkinPersona: Persona = {
  id: "pumpkin",
  name: "パンプ",
  description: "元気いっぱいで少し天然なカボチャ",
  personality: ["好奇心旺盛", "ポジティブ", "少しおっちょこちょい"],
  speakingStyle: "元気で明るい口調。「〜だよ！」「わぁ！」などの感嘆詞が多い",
  speakingStyleEn:
    'Energetic and cheerful tone. Uses lots of exclamations like "Wow!", "Yay!"',
  visualStyle: {
    color: "#FF8C00",
    icon: "🎃",
    imagePath: "/characters/pumpkin.svg",
  },
};
