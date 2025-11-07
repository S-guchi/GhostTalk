# アクセシビリティ実装ガイド

このドキュメントでは、Ghost Chatアプリケーションに実装されたアクセシビリティ機能について説明します。

## 実装された機能

### 1. キーボード操作対応

#### InputWindowコンポーネント
- **自動フォーカス**: 入力ウィンドウが表示されると、テキストエリアに自動的にフォーカスが移動します
- **Ctrl+Enter / Cmd+Enter**: シチュエーションを送信
- **Escape**: 入力内容をクリア
- **Tab**: フォーカス移動（標準的なタブナビゲーション）

#### ボタンとフォーム要素
- すべてのインタラクティブ要素にフォーカスリングを追加
- `focus:ring-2`クラスで視覚的なフォーカスインジケーターを実装

### 2. ARIA属性

#### セマンティックHTML
- `<main>`: メインコンテンツ領域
- `<h1>`, `<h2>`: 適切な見出し階層
- `<form>`: フォーム要素
- `<label>`: 入力フィールドのラベル

#### ARIA属性の使用

**NoiseEffect**
- `role="presentation"`: 装飾的な要素として識別
- `aria-live="polite"`: 状態変化をスクリーンリーダーに通知
- `aria-label="アプリケーション起動中"`: 要素の説明
- `aria-hidden="true"`: キャンバス要素を支援技術から隠す
- `.sr-only`: スクリーンリーダー専用のテキスト

**InputWindow**
- `role="main"`: メインコンテンツ領域として識別
- `aria-label`: フォームとボタンの説明
- `aria-invalid`: 入力エラー状態の通知
- `aria-describedby`: エラーメッセージや文字数カウントとの関連付け
- `aria-live="polite"`: 文字数カウントの動的更新を通知
- `role="alert"`: エラーメッセージの即座の通知
- `role="note"`: 補足情報の識別

**GhostCharacter**
- `role="img"`: キャラクター全体を画像として識別
- `aria-label`: キャラクター名と状態（話し中かどうか）
- `aria-live="polite"`: アクティブ状態の変化を通知

**SpeechBubble**
- `role="article"`: 発言を独立したコンテンツとして識別
- `aria-label`: 発言者の識別
- `aria-live="polite"`: 新しい発言の通知
- `aria-hidden="true"`: タイピングカーソルを支援技術から隠す

**ChatStage**
- `role="main"`: メインコンテンツ領域
- `role="group"`: キャラクターのグループ化
- `role="status"`: ローディング状態の通知
- `role="alert"`: エラーメッセージの即座の通知
- `aria-live="polite"` / `aria-live="assertive"`: 状態変化の通知レベル

### 3. prefers-reduced-motion対応

#### useReducedMotionフック
`lib/hooks/use-reduced-motion.ts`で実装されたカスタムフックが、ユーザーのアニメーション設定を監視します。

```typescript
const prefersReducedMotion = useReducedMotion();
```

#### アニメーション削減の実装

**NoiseEffect**
- アニメーション削減モードでは、ノイズエフェクトを100msで即座に完了

**InputWindow**
- フェードインアニメーションをスキップし、即座に表示
- 自動フォーカスの遅延を削除

**GhostCharacter**
- 登場アニメーションをスキップし、即座に表示
- アクティブ状態の強調アニメーションを無効化

**SpeechBubble**
- ポップアップアニメーションをスキップし、即座に表示
- タイピングエフェクトを無効化し、全文を即座に表示
- タイピングカーソルを非表示

#### グローバルCSS設定
`app/globals.css`に以下のメディアクエリを追加：

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 4. スクリーンリーダー対応

#### .sr-onlyクラス
視覚的には非表示だが、スクリーンリーダーには読み上げられるテキスト用のユーティリティクラス：

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

#### 使用例
```tsx
<div className="sr-only">
  アプリケーションを起動しています。しばらくお待ちください。
</div>
```

## テスト方法

### キーボード操作のテスト
1. Tabキーでフォーカスを移動
2. Enterキーでボタンを押下
3. Ctrl+Enterでフォームを送信
4. Escapeで入力をクリア

### スクリーンリーダーのテスト
- **macOS**: VoiceOver（Cmd+F5で起動）
- **Windows**: NVDA または JAWS
- **Chrome**: ChromeVox拡張機能

### アニメーション削減のテスト

#### macOS
1. システム設定 > アクセシビリティ > ディスプレイ
2. 「視差効果を減らす」を有効化

#### Windows
1. 設定 > 簡単操作 > ディスプレイ
2. 「Windowsでアニメーションを表示する」を無効化

#### ブラウザ開発者ツール
Chrome DevToolsで以下を実行：
```javascript
// アニメーション削減を有効化
matchMedia('(prefers-reduced-motion: reduce)').matches
```

## WCAG 2.1準拠レベル

このアプリケーションは以下のWCAG 2.1基準を満たすように設計されています：

### レベルA
- ✅ 1.1.1 非テキストコンテンツ（代替テキスト）
- ✅ 2.1.1 キーボード操作
- ✅ 2.1.2 キーボードトラップなし
- ✅ 3.1.1 ページの言語（lang属性）
- ✅ 4.1.1 構文解析（有効なHTML）
- ✅ 4.1.2 名前、役割、値（ARIA属性）

### レベルAA
- ✅ 1.4.3 コントラスト比（最小）
- ✅ 2.4.7 フォーカスの可視化
- ✅ 3.2.4 一貫した識別性

### レベルAAA
- ✅ 2.3.3 インタラクションアニメーション（prefers-reduced-motion）

## 今後の改善案

1. **キーボードショートカットのカスタマイズ**
   - ユーザーが独自のショートカットを設定できる機能

2. **ハイコントラストモード**
   - `prefers-contrast: high`メディアクエリへの対応

3. **音声フィードバック**
   - 重要なアクションに対する音声通知（オプション）

4. **フォントサイズ調整**
   - ユーザーがフォントサイズを変更できる機能

5. **カラーブラインドモード**
   - 色覚異常に配慮した配色オプション

## 参考資料

- [WCAG 2.1ガイドライン](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Web Accessibility](https://developer.mozilla.org/ja/docs/Web/Accessibility)
- [WebAIM](https://webaim.org/)
