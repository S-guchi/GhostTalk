import type { Persona } from './types';

/**
 * スケルトン（ボーンズ）のペルソナ
 * 陽気で軽口を叩くキャラクター
 */
export const skeletonPersona: Persona = {
  id: 'skeleton',
  name: 'ボーンズ',
  description: '陽気で軽口を叩くスケルトン',
  personality: [
    '明るくて社交的',
    'ジョークが好き',
    '骨に関するダジャレを言いがち',
  ],
  speakingStyle:
    '軽快で親しみやすい口調。「〜だぜ」「〜じゃん」などのカジュアルな語尾',
  speakingStyleEn:
    'Casual and friendly tone. Uses contractions and informal language like "gonna", "wanna"',
  visualStyle: {
    color: '#E8E8E8',
    icon: '💀',
    imagePath: '/characters/skeleton.svg',
  },
};
