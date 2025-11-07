'use client';

import { useState, useEffect, useRef, type FormEvent } from 'react';
import { animate } from 'motion';

interface InputWindowProps {
  onSubmit: (situation: string) => void;
  isVisible: boolean;
  isLoading?: boolean;
}

export function InputWindow({ onSubmit, isVisible, isLoading = false }: InputWindowProps) {
  const [situation, setSituation] = useState('');
  const [error, setError] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const MAX_LENGTH = 500;

  // フェードインアニメーション
  // 要件: ノイズ完了後（2秒）から0.5秒でフェードイン（2-2.5秒）
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
      setError('シチュエーションを入力してください');
      return;
    }

    // 最大文字数チェック
    if (trimmedSituation.length > MAX_LENGTH) {
      setError('最大500文字まで入力できます');
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
          ゴーストチャット
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              value={situation}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="シチュエーションを入力してください..."
              maxLength={MAX_LENGTH}
              rows={4}
              className="w-full px-4 py-3 bg-black/30 border border-purple-400/50 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              aria-label="シチュエーション入力"
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
            disabled={!situation.trim() || isLoading}
            className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                読み込み中...
              </span>
            ) : (
              'お化けを呼ぶ'
            )}
          </button>

          <p className="text-center text-xs text-purple-300/70">
            最大500文字
          </p>
        </form>
      </div>
    </div>
  );
}
