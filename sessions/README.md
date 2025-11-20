# 🎓 AI Workshop Series - ClaudeCode マスターコース

このディレクトリには、ClaudeCode を習得するための包括的なワークショップシリーズが含まれています。

5つのセッションを通じて、基本から応用まで、段階的に ClaudeCode を使いこなしましょう。

---

## 📋 セッション一覧

### [Session 01: ClaudeCode の基本体験～コンテキスト活用で開発を加速](./session_01.md)

ClaudeCode の最大の特徴である**コンテキスト自動生成**を体験します。

**学習ポイント：**

- ClaudeCode の基本操作（`/init`、`@` 指定、ドラッグ&ドロップ）
- `/init` コマンドでプロジェクト全体を自動解析
- CLAUDE.md の活用
- Claudeに正確な質問をして、高速にコード情報を取得する方法

**前提条件：** Git ブランチの作成（`workshop/[あなたの名前]`）

---

### [Session 02: コンテキストを活用した機能追加～優先度フィルター実装](./session_02.md)

Session 01 で習得したコンテキストを活用して、**実装完結までの全フロー** を体験します。

**学習ポイント：**

- 要件 → 実装 → テストのサイクル
- CLAUDE.md があれば、詳細指示は不要
- 動作確認とテスト実行の重要性

**実装例：** チケット一覧に優先度フィルター機能を追加

---

### [Session 03: 複雑な機能開発～プランモードを活用したカレンダー機能実装](./session_03.md)

複雑な要件を扱う時は **プランモード** が活躍します。

**学習ポイント：**

- プランモード（Shift+Tab）の有効化
- 複雑な要件を段階的に計画する方法
- プラン確認してから実装に進む流れ
- 複数の関連機能を一度に実装

**実装例：** カレンダー機能（月表示・週表示、期限表示、タスク作成）

---

### [Session 04: ドキュメント生成～コードから仕様書を自動作成](./session_04.md)

実装したコードから、複数フォーマットの**ドキュメントを自動生成**します。

**学習ポイント：**

- API 仕様書の生成（Markdown / OpenAPI / Mermaid）
- アーキテクチャドキュメント生成
- データベーススキーマドキュメント生成
- テキストベースで「できない」を「できる」に変える思考法

**ドキュメント形式：**

- **Markdown**: 人間が読みやすい
- **OpenAPI / GraphQL**: ツール連携可能
- **Mermaid / PlantUML**: 図表として可視化

**プレビューツール紹介：**

- Mermaid Live Editor
- PlantUML Online Editor
- VSCode 拡張（PlantUML、AsciiDoc など）

---

### [Session 05: 応用編～ClaudeCode を使いこなす](./session_05.md)

これまで習得したスキルを応用して、**自由実装 + 高度な機能探索** を行います。

**学習ポイント：**

- 自由実装パート（参加者が好きな機能を実装）
- Claudeとの要件説明の試行錯誤（簡潔 vs 詳細）
- **高度な機能の紹介：**
  - **MCP**（Model Context Protocol）: 外部データソース連携
  - **スラッシュコマンド**: カスタムコマンド作成
  - **hook**: イベント駆動の自動処理

**実装パターン例：**

- 既存機能の拡張（フィルター、ソート）
- 新規ページ・機能（ユーザープロフィール、通知）
- UI/UX 改善（ダークモード、ページネーション）

---

## 🚀 セッション実施の流れ

```
1. 準備
   ├─ Git ブランチを作成（workshop/[あなたの名前]）
   └─ Session 01 を開始

2. セッション実施
   ├─ Session 01-05 を順番に進める
   └─ 各セッション終了後、git commit でチェックポイント作成

3. セッション間の移行
   ├─ 前セッションをコミット
   ├─ git log で進捗確認
   └─ 次セッションを開始
```

---

## 💾 コミットのベストプラクティス

各セッション終了後、必ず **git commit** で進捗を保存してください。

```bash
# Session 01 完了後
git add .
git commit -m "feat: Session 01 complete - CLAUDE.md generated and context learned

- Generated CLAUDE.md with project analysis
- Verified ClaudeCode question/answer workflow
- Confirmed context-based development efficiency"

# Session 02 完了後
git add .
git commit -m "feat: Session 02 complete - priority filter implementation

- Implemented ticket priority dropdown filter
- Added filtering logic to /tickets page
- Created E2E tests for priority filter
- All tests passing"

# 以降も同様に...
```

**メリット：**

- ✅ 各セッション間で「安全な地点」を保存
- ✅ セッション間で簡単に切り替え可能
- ✅ 作業失敗時も前の安全な状態に戻せる

---

## 📚 参考リソース

### ClaudeCode 公式ドキュメント

- [ClaudeCode Documentation](https://claude.com/claude-code)
- [Claude Agent SDK](https://github.com/anthropics/claude-agent-sdk)

### 高度な機能

- [ClaudeCode MCP](https://code.claude.com/docs/ja/mcp)
- [ClaudeCode スラッシュコマンド](https://code.claude.com/docs/ja/slash-commands)
- [ClaudeCode Hooks](https://code.claude.com/docs/ja/hooks)

### ドキュメント形式

- [Mermaid Official](https://mermaid.js.org/)
- [PlantUML Official](https://plantuml.com/)
- [AsciiDoc](https://asciidoc.org/)

---

## 🎯 セッション修了後の次のステップ

Session 01-05 をすべて修了した後：

1. **基本を日常開発に活用**
   - 新しいプロジェクトで `/init` を実行
   - CLAUDE.md をコンテキストとして活用

2. **カスタマイズを始める**
   - スラッシュコマンドを 2-3 個作成
   - hook を有効化して自動化
   - MCP で外部データを活用

3. **チーム開発へ**
   - CLAUDE.md をチーム内で共有
   - カスタムコマンドをチーム標準に
   - MCP で情報共有自動化

---

## 💡 このワークショップシリーズの特徴

✅ **段階的な学習**: 基本 → 実装 → ドキュメント → 応用

✅ **実践的**: 実際のチケット管理アプリを題材

✅ **自動化重視**: ClaudeCode の効率化スキルを習得

✅ **ハンズオン**: 各セッションで実装・確認・テストを体験

✅ **拡張性**: Session 05 以降も継続学習可能

---

## 📞 よくある質問

**Q: 複数のセッションを一度にやってもいい？**

A: はい、大丈夫です。ただし、各セッション終了後に必ず `git commit` してください。

**Q: セッションを飛ばしてもいい？**

A: 推奨しません。Session 01-02 は基礎なので、Session 03 以降の理解を深めます。

**Q: セッションに失敗したら？**

A: `git reset` で前のセッションの状態に戻して、もう一度トライしてください。

**Q: Session 05 の自由実装は何をしたらいい？**

A: Session 05 の「実装パターン例」を参考に、好きな機能を選んで実装してください。

---

**Happy Learning! 🚀**

ClaudeCode を使いこなして、開発効率を 10 倍以上に加速させましょう！
