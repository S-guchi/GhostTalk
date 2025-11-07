'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect, useRef, type FormEvent } from 'react';
import { animate } from 'motion';

interface InputWindowProps {
  onSubmit: (situation: string) => void;
  isVisible: boolean;
}

export function InputWindow({ onSubmit, isVisible }: InputWindowProps) {
  const t = useTranslations();
  const [situation, setSituation] = useState('');
  const [error, setError] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const MAX_LENGTH = 500;

  // フェードインアニメーション
  useEffect(() => {
    if (isVisible && containerRef.current) {
      animate(
        containerRef.current,
        { opacity: [0, 1], y: [20, 0] },
        { duration: 0.5, easing: 'ease-out' }
      );
    }
  }, [isVisible]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // 空文字チェック
    const trimmedSituation = situation.trim();
    if (!trimmedSituation) {
      setError(t('errors.emptyInput'));
      return;
    }

    // 最大文字数チェック
    if (trimmedSituation.length > MAX_LENGTH) {
      setError(`${t('home.maxLength')}`);
      return;
    }

    onSubmit(trimmedSituation);
  };

  const handleInputChange = (value: string) => {
    setSituation(value);
    // 入力時にエラーをクリア
    if (error) {
      setError('');
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="w-full max-w-2xl mx-auto px-4"
      style={{ opacity: 0 }}
    >
      <div className="bg-gradient-to-br from-purple-900/80 to-orange-900/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-purple-500/30">
        <h2 className="text-3xl font-bold text-center mb-6 text-orange-100">
          {t('common.appName')}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              value={situation}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={t('home.inputPlaceholder')}
              maxLength={MAX_LENGTH}
              rows={4}
              className="w-full px-4 py-3 bg-black/30 border border-purple-400/50 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              aria-label={t('home.inputPlaceholder')}
              aria-invalid={!!error}
              aria-describedby={error ? 'input-error' : 'char-count'}
            />
            <div className="absolute bottom-2 right-2 text-xs text-purple-300/70">
              {situation.length} / {MAX_LENGTH}
            </div>
          </div>

          {error && (
            <div
              id="input-error"
              className="text-red-400 text-sm px-2"
              role="alert"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!situation.trim()}
            className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
          >
            {t('home.submitButton')}
          </button>

          <p className="text-center text-xs text-purple-300/70">
            {t('home.maxLength')}
          </p>
        </form>
      </div>
    </div>
  );
}
