# Implementation Plan

- [x] 1. Next.js 15プロジェクトのセットアップと基本構成
  - Next.js 16プロジェクトを作成し、TypeScript、Tailwind CSS、next-intlを設定
  - プロジェクト構造（app/[locale]、components、lib、messages、public/characters）を作成
  - 必要な依存関係（Vercel AI SDK、Motion、next-intl）をインストール
  - _Requirements: 1.1, 2.1_

- [x] 2. 多言語対応（i18n）の実装
  - [x] 2.1 next-intlの設定ファイルを作成
    - `lib/i18n/config.ts`でロケール設定を定義
    - `lib/i18n/request.ts`でリクエストごとのロケール取得を実装
    - _Requirements: 2.1_
  
  - [x] 2.2 翻訳ファイルを作成
    - `messages/ja.json`と`messages/en.json`を作成
    - UI要素（入力プレースホルダー、ボタン、エラーメッセージ）の翻訳を追加
    - _Requirements: 2.1_
  
  - [x] 2.3 ロケールルーティングを設定
    - `app/[locale]/layout.tsx`を作成してnext-intlプロバイダーを設定
    - ミドルウェアでロケール検出とリダイレクトを実装
    - _Requirements: 2.1_

- [x] 3. ペルソナシステムの実装
  - [x] 3.1 Personaインターフェースと型定義を作成
    - `lib/personas/types.ts`でPersonaインターフェースを定義
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [x] 3.2 デフォルトペルソナ（スケルトン、カボチャ、魔女）を実装
    - `lib/personas/skeleton.ts`、`pumpkin.ts`、`witch.ts`を作成
    - 各ペルソナの性格、話し方（日本語・英語）、ビジュアルスタイルを定義
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [x] 3.3 ペルソナレジストリとランダム選択機能を実装
    - `lib/personas/index.ts`で全ペルソナを登録
    - `selectRandomPersonas()`関数でランダムに3体選択する機能を実装
    - `getPersonaById()`関数でIDからペルソナを取得する機能を実装
    - _Requirements: 4.3, 6.5_

- [x] 4. キャラクター画像アセットの準備
  - `public/characters/`ディレクトリにプレースホルダーSVGファイルを作成
  - skeleton.svg、pumpkin.svg、witch.svgの基本的なSVGを配置
  - _Requirements: 3.4_

- [x] 5. キャラクター画像生成プロンプトの作成
  - [x] 5.1 プロンプトディレクトリを作成
    - `docs/image-prompt/`ディレクトリを作成
    - _Requirements: 3.4_
  
  - [x] 5.2 Pumpkinキャラクターの画像生成プロンプトを作成
    - `docs/image-prompt/pumpkin.md`を作成
    - かわいいハロウィンスタイルのカボチャキャラクターの詳細な画像生成プロンプトを記述
    - ペルソナの性格（明るく元気、ポジティブ）を反映したビジュアル要素を含める
    - _Requirements: 3.4, 6.2_
  
  - [x] 5.3 Skeletonキャラクターの画像生成プロンプトを作成
    - `docs/image-prompt/skeleton.md`を作成
    - かわいいハロウィンスタイルのスケルトンキャラクターの詳細な画像生成プロンプトを記述
    - ペルソナの性格（冷静で知的、論理的）を反映したビジュアル要素を含める
    - _Requirements: 3.4, 6.2_
  
  - [x] 5.4 Witchキャラクターの画像生成プロンプトを作成
    - `docs/image-prompt/witch.md`を作成
    - かわいいハロウィンスタイルの魔女キャラクターの詳細な画像生成プロンプトを記述
    - ペルソナの性格（ミステリアスで賢い、魔法的）を反映したビジュアル要素を含める
    - _Requirements: 3.4, 6.2_

- [x] 6. NoiseEffectコンポーネントの実装
  - [x] 6.1 ノイズエフェクトコンポーネントを作成
    - `components/NoiseEffect.tsx`を作成
    - Canvas APIまたはCSS animationでノイズエフェクトを実装
    - 2秒後にonCompleteコールバックを実行
    - _Requirements: 1.1, 1.2, 1.3_

- [x] 7. InputWindowコンポーネントの実装
  - [x] 7.1 入力ウィンドウコンポーネントを作成
    - `components/InputWindow.tsx`を作成
    - Motionでフェードインアニメーションを実装
    - テキスト入力フィールドと送信ボタンを配置
    - _Requirements: 2.1, 2.2_
  
  - [x] 7.2 入力バリデーションを実装
    - 最大500文字の入力制限を実装
    - 空文字チェックを実装
    - エラーメッセージ表示機能を追加
    - _Requirements: 2.3, 2.4, 2.5_

- [x] 8. LanguageSwitcherコンポーネントの実装
  - `components/LanguageSwitcher.tsx`を作成
  - next-intlのuseRouterを使用してロケール切り替えを実装
  - 日本語/英語のトグルボタンを配置
  - _Requirements: 2.1_

- [x] 9. メインページ（起動演出 + 入力UI）の実装
  - [x] 9.1 メインページコンポーネントを作成
    - `app/[locale]/page.tsx`を作成
    - NoiseEffect → InputWindowの順で表示する状態管理を実装
    - LanguageSwitcherを配置
    - _Requirements: 1.1, 1.2, 2.1_
  
  - [x] 9.2 シチュエーション送信時の処理を実装
    - ランダムに3体のペルソナを選択
    - チャット画面へのナビゲーションを実装
    - 選択されたペルソナIDとシチュエーションをクエリパラメータまたは状態で渡す
    - _Requirements: 2.4, 3.1, 4.1_

- [x] 10. GhostCharacterコンポーネントの実装
  - `components/GhostCharacter.tsx`を作成
  - Next.js Imageコンポーネントでキャラクター画像を表示
  - Motionで登場アニメーション（スケール + フェードイン）を実装
  - isActiveがtrueの時の強調表示スタイルを実装
  - 画像読み込み失敗時のフォールバック（絵文字アイコン）を実装
  - _Requirements: 3.2, 3.3, 3.4_

- [x] 11. SpeechBubbleコンポーネントの実装
  - `components/SpeechBubble.tsx`を作成
  - 吹き出しUIをペルソナのカラーに応じてスタイリング
  - タイピングエフェクトで文字を順次表示する機能を実装
  - Motionでポップアップアニメーションを実装
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 12. AI会話生成APIの実装
  - [ ] 12.1 API Routeを作成
    - `app/api/ghost-chat/route.ts`を作成
    - リクエストボディから`situation`、`personaIds`、`locale`を取得
    - _Requirements: 4.1, 4.2_
  
  - [ ] 12.2 システムプロンプト構築ロジックを実装
    - `lib/ai/chat-generator.ts`を作成
    - ペルソナIDから実際のペルソナオブジェクトを取得
    - ロケールに応じた話し方（speakingStyleまたはspeakingStyleEn）を使用
    - シチュエーションとペルソナ情報を含むシステムプロンプトを構築
    - _Requirements: 4.2, 4.3_
  
  - [ ] 12.3 Vercel AI SDKでストリーミング生成を実装
    - `streamText`を使用してAI会話を生成
    - 各発言をJSON形式（personaId、message）で構造化
    - ストリーミングレスポンスを返す
    - _Requirements: 4.1, 4.4, 4.5_
  
  - [ ] 12.4 エラーハンドリングを実装
    - タイムアウト処理（30秒）を追加
    - エラー時の適切なレスポンスを返す
    - _Requirements: 4.1_

- [ ] 13. ChatStageコンポーネントの実装
  - [ ] 13.1 チャットステージコンポーネントを作成
    - `components/ChatStage.tsx`を作成
    - 3体のGhostCharacterを配置（位置を計算）
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [ ] 13.2 AI APIからのストリーミングレスポンス処理を実装
    - Vercel AI SDKの`useChat`または`useCompletion`を使用
    - ストリーミングで受信したメッセージを順次表示
    - 各メッセージに対応するSpeechBubbleを表示
    - _Requirements: 4.4, 4.5, 5.3, 5.4_
  
  - [ ] 13.3 会話の表示タイミング制御を実装
    - 発言間に1-2秒の間隔を設定
    - 現在話しているキャラクターをハイライト
    - _Requirements: 5.4_

- [ ] 14. チャット画面ページの実装
  - `app/[locale]/chat/page.tsx`を作成
  - クエリパラメータまたは状態からシチュエーションとペルソナIDを取得
  - ChatStageコンポーネントを配置
  - LanguageSwitcherを配置
  - _Requirements: 3.1, 4.1_

- [ ] 15. アニメーション統合とタイミング調整
  - 起動演出のタイミング（ノイズ: 0-2秒、フェードイン: 2-2.5秒）を調整
  - お化け登場アニメーション（各0.3秒間隔）を調整
  - 吹き出しアニメーションのタイミングを調整
  - _Requirements: 1.1, 1.2, 1.3, 3.3, 5.3_

- [ ] 16. エラーハンドリングとユーザーフィードバックの実装
  - API呼び出し失敗時のエラーメッセージ表示を実装
  - ローディング状態の表示を実装
  - 入力バリデーションエラーの表示を実装
  - _Requirements: 2.3, 2.4_

- [ ] 17. アクセシビリティ対応
  - キーボード操作対応を実装
  - ARIA属性を追加
  - prefers-reduced-motionメディアクエリでアニメーション無効化オプションを実装
  - _Requirements: 1.1, 2.1, 3.3, 5.3_

- [ ] 18. レスポンシブデザインの実装
  - モバイル、タブレット、デスクトップでのレイアウト調整
  - キャラクター配置の画面サイズ対応
  - 吹き出しの位置調整
  - _Requirements: 2.1, 3.2, 5.1_

- [ ]* 19. 追加ペルソナの実装例
  - [ ]* 19.1 ゴーストペルソナを追加
    - `lib/personas/ghost.ts`を作成
    - `public/characters/ghost.svg`を追加
    - `lib/personas/index.ts`のallPersonas配列に追加
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [ ]* 19.2 ヴァンパイアペルソナを追加
    - `lib/personas/vampire.ts`を作成
    - `public/characters/vampire.svg`を追加
    - `lib/personas/index.ts`のallPersonas配列に追加
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
