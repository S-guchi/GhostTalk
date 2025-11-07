'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';

/**
 * 言語切り替えコンポーネント
 * 日本語と英語を切り替えるトグルボタンを提供
 */
export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  /**
   * ロケールを切り替える
   * 現在のパスを維持しながら、ロケールのみを変更
   */
  const switchLocale = (newLocale: Locale) => {
    if (newLocale === locale) return;

    // 現在のパスからロケール部分を新しいロケールに置き換え
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');

    router.push(newPath);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex items-center gap-2 bg-gray-800/80 backdrop-blur-sm rounded-full p-1 shadow-lg">
        {locales.map((loc) => (
          <button
            key={loc}
            onClick={() => switchLocale(loc)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
              ${
                locale === loc
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }
            `}
            aria-label={`Switch to ${loc === 'ja' ? 'Japanese' : 'English'}`}
            aria-pressed={locale === loc}
          >
            {loc === 'ja' ? '日本語' : 'English'}
          </button>
        ))}
      </div>
    </div>
  );
}
