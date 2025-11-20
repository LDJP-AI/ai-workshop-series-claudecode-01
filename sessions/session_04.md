# Session 04: ドキュメント生成～コードから仕様書を自動作成

## 📌 このセッションで学ぶこと

- 既存コードから仕様書を自動生成する方法
- アーキテクチャ図をテキスト形式で作成
- API ドキュメントを効率的に生成
- ClaudeCode を「ドキュメント作成ツール」として活用

---

## 🎯 セッション概要

| ステップ   | 目的                                 |
| ---------- | ------------------------------------ |
| ステップ 1 | ドキュメント作成の必要性を理解       |
| ステップ 2 | API 仕様書を生成依頼                 |
| ステップ 3 | アーキテクチャドキュメント生成       |
| ステップ 4 | データベーススキーマドキュメント生成 |

---

## ステップ 1: ドキュメント作成の必要性を理解

### 🎯 目的

なぜドキュメント作成が重要か、そして ClaudeCode でどう効率化するか理解します。

### 💬 参加者の操作

```
特にやることはありません。以下を理解してください：
```

### 📚 ドキュメント作成が難しい理由

これまでのセッション（Session 01-03）では **コードを書く** ことに集中していました。

しかし実際の開発では：

- 📋 **API 仕様書** が必要（フロントエンド開発者向け）
- 🏗️ **アーキテクチャドキュメント** が必要（チーム理解のため）
- 📊 **データベーススキーマ** の説明が必要
- 📖 **セットアップガイド** が必要

**手動でドキュメント作成すると：**

- ⏱️ 時間がかかる
- 🚫 コード変更時にドキュメントが古くなる
- 😅 ドキュメント更新が後回しになる

### 💡 ClaudeCode を使った効率化

ClaudeCode は **既存コードから自動生成** できます：

```
「API エンドポイント一覧を仕様書フォーマットで作成してください」

↓

Claude が以下を分析：
- app/api/ 配下のエンドポイント
- 各エンドポイントの役割
- リクエスト・レスポンス形式
- エラーハンドリング

↓

仕様書が自動生成される
```

### 💡 学習ポイント

- 📚 **ドキュメントは資産：** コードと同じくらい重要
- ⚡ **自動生成で効率化：** 手動作成の時間を削減
- 🔄 **常に最新：** コード変更後、すぐにドキュメント更新可能

---

## ステップ 2: API 仕様書を生成依頼

### 🎯 目的

GraphQL と Server Actions の API 仕様書を、複数のテキストフォーマットで生成してもらいます。

### 💬 参加者の操作

```
1. ClaudeCode チャットを開く

   ↓

2. 以下を入力して送信：

   「このプロジェクトの API 仕様書を、複数フォーマットで作成してください。

    対象：
    - GraphQL スキーマと Query・Mutation 一覧
    - Server Actions（lib/actions/tickets.ts）の関数一覧

    生成フォーマット：

    【1】docs/API.md
    - Markdown テーブル形式
    - 使用例を含む

    【2】docs/API.openapi.yaml
    - OpenAPI 仕様（YAML 形式）
    - フロントエンド開発者が使用可能

    【3】docs/API_FLOW.mmd
    - API フロー図（Mermaid 形式）
    - リクエスト → レスポンスの流れを図解

    3 つのファイルを作成してください」

   ↓

3. Claudeが複数フォーマットで生成
```

### 📚 何が起きているのか

Claude は CLAUDE.md から既に知っています：

- 📍 `lib/graphql/schema.ts` が GraphQL スキーマ
- 📍 `lib/graphql/resolvers.ts` が Query・Mutation の実装
- 📍 `lib/actions/tickets.ts` が Server Actions

**だから、3 つの異なるフォーマットで正確に生成できます：**

```
Markdown（人間が読みやすい）
     ↓
OpenAPI / GraphQL スキーマ（ツールが読める）
     ↓
Mermaid（図として可視化）
```

### 💡 学習ポイント

- 📖 **複数フォーマット活用：** 目的に応じて使い分け
- 🔌 **ツール連携：** OpenAPI / GraphQL スキーマはツール・IDE が自動読み込み可能
- 📊 **可視化：** Mermaid フロー図で、API の流れが一目瞭然
- 🔄 **テキストベース：** すべてテキスト形式だから、バージョン管理・再生成が容易

---

## ステップ 3: アーキテクチャドキュメント生成

### 🎯 目的

プロジェクト全体のアーキテクチャを、複数フォーマットで図解します。

### 💬 参加者の操作

```
1. チャットで以下を入力：

   「プロジェクトのアーキテクチャドキュメントを、複数フォーマットで作成してください。

    生成フォーマット：

    【1】docs/ARCHITECTURE.md
    - テキストベースの説明
    - ディレクトリ構成
    - 各層の責務説明
    - 技術スタック一覧

    【2】docs/ARCHITECTURE.mmd
    - システムアーキテクチャ図（Mermaid 形式）
    - 各層の関係を図解

    【3】docs/DATA_FLOW.mmd
    - データフロー図（Mermaid 形式）
    - UI → Server → DB への流れを図解

    3 つのファイルを作成してください」

   ↓

2. Claudeが複数フォーマットで生成
```

### 📚 生成されるドキュメント

```
例（Mermaid）：

graph TD
    UI["🎨 React Components"]
    Server["⚙️ Server Components"]
    Data["📊 Data Layer"]
    GraphQL["🔌 GraphQL"]
    Prisma["🗄️ Prisma ORM"]
    DB["💾 SQLite"]

    UI -->|Server Props| Server
    Server -->|Query| Data
    Server -->|Query| GraphQL
    Data --> Prisma
    GraphQL --> Prisma
    Prisma --> DB
```

### 💡 学習ポイント

- 🏗️ **テキスト図の力：** Markdown だけでは表現しきれない複雑な関係も、Mermaid で明確に
- 📖 **複数視点：** テキスト説明 + 図で、多角的に理解可能
- 🔄 **自動レンダリング：** GitHub で自動的に図が表示される
- 🎯 **オンボーディング効率化：** 図があると、新人が素早く理解可能

---

## ステップ 4: データベーススキーマドキュメント生成

### 🎯 目的

Prisma スキーマから、複数フォーマットで ER 図とテーブル説明を生成します。

### 💬 参加者の操作

```
1. チャットで以下を入力：

   「Prisma スキーマをドキュメント化してください。

    生成フォーマット：

    【1】docs/DATABASE.md
    - テーブル定義（Markdown テーブル）
    - 各フィールドの型と制約
    - リレーション説明

    【2】docs/DATABASE_ER.puml
    - Entity Relationship Diagram（PlantUML 形式）
    - テーブル間の関係を図解

    【3】docs/SCHEMA.mmd
    - クラス図（Mermaid 形式）
    - テーブルとフィールドを図解

    3 つのファイルを作成してください」

   ↓

2. Claudeが複数フォーマットで生成
```

### 📚 生成されるドキュメント

```
例（PlantUML ER 図）：

@startuml
entity User {
  id : String <<PK>>
  name : String
  email : String <<UK>>
}

entity Ticket {
  id : String <<PK>>
  title : String
  description : String
  priority : String
  userId : String <<FK>>
}

entity Comment {
  id : String <<PK>>
  content : String
  ticketId : String <<FK>>
}

User ||--o{ Ticket : creates
Ticket ||--o{ Comment : has
@enduml

例（テーブル定義）：

### User テーブル
| フィールド | 型 | 制約 | 説明 |
|-----------|----|----|------|
| id | String | PK | ユーザー ID |
| name | String | - | ユーザー名 |
| email | String | UK | メール（一意） |
```

### 💡 学習ポイント

- 🗂️ **複数視点でスキーマ理解：** テキスト + 図で多角的に理解
- 🔗 **リレーション可視化：** PlantUML / Mermaid で関係が明確に
- 📖 **保守性向上：** DB 変更時、複数フォーマットで自動更新可能
- 🔄 **テキストベース：** PlantUML / Mermaid はテキスト形式だから、Git で差分追跡可能

---

## 💡 Tips: テキストベースで「できない」を「できる」に変える

### Claude の能力と制限

Claude は **テキスト（文字）** しか生成できません：

```
❌ できない：
- Excel ファイル生成
- Word ファイル生成
- JPEG / PNG 画像生成

✅ できる：
- テキスト生成
- Markdown 生成
- コード生成
```

### しかし「できない」は「方法を変えれば できる」

重要なマインドセット：

> 「Claude ができないなら諦める」のではなく、
> 「テキストベースでそれを実現する方法を考える」

### テキストベース代替案

| できないこと        | テキストベース代替案                    | 用途                  |
| ------------------- | --------------------------------------- | --------------------- |
| **Excel ファイル**  | Markdown / AsciiDoc                     | 仕様書、ドキュメント  |
| **Word ファイル**   | Markdown / AsciiDoc                     | ドキュメント、設計書  |
| **JPEG / PNG 画像** | SVG / Mermaid / PlantUML / Draw.io XML  | 図表、ER 図、フロー図 |
| **PowerPoint**      | Markdown スライド形式(Marp) / Reveal.js | プレゼンテーション    |

### 実例

#### 例 1: ER 図（JPEG の代わりに PlantUML）

```
❌ 従来：ER 図を JPEG で保存

✅ ClaudeCode：PlantUML テキストで生成

「ER 図を PlantUML 形式で生成してください」

↓

Claude が PlantUML コード生成

↓

PlantUML コードを `.puml` ファイルに保存

↓

オンラインの PlantUML エディタで画像化可能
```

#### 例 2: フロー図（PNG の代わりに Mermaid）

```
❌ 従来：フロー図を手書きして PNG で保存

✅ ClaudeCode：Mermaid テキストで生成

「実装フローを Mermaid 形式で図解してください」

↓

Claude が Mermaid テキスト生成

↓

Mermaid コードを Markdown に埋め込み

↓

そのまま GitHub で表示 & 画像化可能
```

#### 例 3: 仕様書（Excel の代わりに Markdown）

```
❌ 従来：仕様書を Excel で作成 → 手作業で実装

✅ ClaudeCode：Markdown で仕様書生成 → そのまま実装

「API 仕様書を Markdown で作成してください」

↓

Claude が Markdown テーブル形式で生成

↓

その Markdown をそのまま実装に使用

↓

コードと仕様書が完全に同期
```

### ドキュメント → コード の活用例

```
【ステップ 1】Markdown で設計書を作成（または Claude に生成させる）

## API 仕様書
| エンドポイント | メソッド | 入力 | 出力 |
|------------|--------|------|------|
| /tickets | GET | - | Ticket[] |
| /tickets | POST | { title, description } | Ticket |

↓

【ステップ 2】その Markdown を Claude に貼り付け

「以下の API 仕様書に基づいて、
 GraphQL リゾルバーを実装してください」

↓

【ステップ 3】Claude が実装コードを自動生成

```

### 💡 重要なマインドセット

```
「Claude にできないこと」を見つけたとき：

❌ 「無理だから諦める」
✅ 「テキストベースではどうやる？」と考える

この習慣が、AI 開発の効率を大きく左右します。
```

### 代替フォーマット リファレンス

| 目的             | テキストフォーマット                   | 用途                 |
| ---------------- | -------------------------------------- | -------------------- |
| **テーブル**     | Markdown テーブル / CSV                | ドキュメント、仕様書 |
| **図表**         | Mermaid / PlantUML / ASCII Art         | フロー図、ER 図      |
| **ドキュメント** | Markdown / AsciiDoc / ReStructuredText | 設計書、API 仕様     |
| **Web 図**       | SVG / Draw.io XML                      | 複雑な図表           |
| **データ交換**   | JSON / YAML / TOML                     | ドキュメント、設定   |

### 💡 学習ポイント

- 🧠 **制約をチャンスに：** Claude の制限 = 創造的な解決策を考えるチャンス
- 📄 **テキスト至上主義：** テキストベースなら、バージョン管理・再利用・自動化が容易
- 🔄 **双方向自動化：** コード ↔ ドキュメント の両方向で自動生成
- 🚀 **スケーラビリティ：** テキスト形式なら、あらゆる段階で自動化・連携が可能

---

## 🔍 生成されたドキュメントをプレビューする

Mermaid、PlantUML、Markdown、AsciiDoc などのテキストベース図をプレビューするための便利なツールとVSCode拡張を紹介します。

### 📱 オンラインエディタ（ブラウザ）

| フォーマット | エディタ                                                            | 特徴                                              |
| ------------ | ------------------------------------------------------------------- | ------------------------------------------------- |
| **Mermaid**  | [Mermaid Live Editor](https://mermaid.live)                         | コードをコピペして即座に図表化。GitHub 連携も可能 |
| **PlantUML** | [PlantUML Online Editor](http://www.plantuml.com/plantuml/uml/)     | ER 図、シーケンス図など複数の図形式に対応         |
| **PlantUML** | [PlantUML Gists](https://www.planttext.com/)                        | PlantUML コードを保存・共有可能                   |
| **AsciiDoc** | [AsciiDoctor.js Live](https://asciidoctor.org/docs/asciidoctor.js/) | AsciiDoc をリアルタイムでプレビュー               |
| **Markdown** | [StackEdit](https://stackedit.io/)                                  | Markdown エディタ。複数フォーマット対応           |
| **Draw.io**  | [draw.io（app.diagrams.net）](https://app.diagrams.net/)            | SVG や XML フォーマットで図を保存                 |

### 🔧 VSCode 拡張

#### Mermaid 対応

| 拡張                                     | インストール方法                                       | 特徴                                      |
| ---------------------------------------- | ------------------------------------------------------ | ----------------------------------------- |
| **Markdown Preview Mermaid Support**     | `esbena.prettier-vscode` + `Markdown Preview Enhanced` | Markdown 内の Mermaid コードをプレビュー  |
| **Mermaid Markdown Syntax Highlighting** | VSCode Marketplace から検索                            | Mermaid コードのシンタックスハイライト    |
| **Markdown Preview Mermaid Support**     | `bierner.markdown-preview-github-styles`               | GitHub スタイルの Markdown + Mermaid 対応 |

#### PlantUML 対応

| 拡張                | インストール方法             | 特徴                                            |
| ------------------- | ---------------------------- | ----------------------------------------------- |
| **PlantUML**        | `jebbs.plantuml`             | VSCode 内で PlantUML をプレビュー・エクスポート |
| **PlantUML Syntax** | `notalien.notalien.plantuml` | PlantUML のシンタックスハイライト               |

#### AsciiDoc 対応

| 拡張         | インストール方法                 | 特徴                                |
| ------------ | -------------------------------- | ----------------------------------- |
| **AsciiDoc** | `asciidoctor.asciidoctor-vscode` | AsciiDoc をプレビュー・エクスポート |

#### 総合図形対応

| 拡張                    | インストール方法           | 特徴                                                  |
| ----------------------- | -------------------------- | ----------------------------------------------------- |
| **Draw.io Integration** | `hediet.vscode-drawio`     | draw.io での図作成・編集。SVG や PNG エクスポート可能 |
| **Excalidraw**          | `pomdtr.excalidraw-editor` | Excalidraw（手書き風の図）を VSCode で編集            |

### 💻 インストール方法（VSCode）

```bash
# 例：PlantUML 拡張をインストール
code --install-extension jebbs.plantuml

# 例：Mermaid プレビューをインストール
code --install-extension bierner.markdown-preview-github-styles
```

または、VSCode の拡張タブから直接インストール：

```
1. Ctrl+Shift+X（Mac: Cmd+Shift+X）で拡張を開く
2. 「PlantUML」と検索
3. 「Install」をクリック
```

### 🎯 推奨セットアップ

**Session 04 を最大限活用するなら、以下をインストール：**

```bash
# すべてをインストール
code --install-extension jebbs.plantuml
code --install-extension bierner.markdown-preview-github-styles
code --install-extension asciidoctor.asciidoctor-vscode
code --install-extension hediet.vscode-drawio
```

### 💡 使用例

#### Mermaid をプレビューする

1. VSCode で Markdown ファイル（`.md`）を開く
2. 拡張 `Markdown Preview Mermaid Support` がインストール済みなら、「プレビュー」タブで自動表示
3. または、`Mermaid Live Editor` にコードをコピペして確認

#### PlantUML をプレビューする

1. VSCode で PlantUML ファイル（`.puml`）を開く
2. 拡張 `PlantUML` がインストール済みなら、右上に「Preview」ボタンが出現
3. または、`PlantUML Online Editor` にコードをコピペして確認

#### GitHub での自動レンダリング

```
✅ Mermaid コード：
- GitHub で Markdown ファイルを表示すると、自動的に図として表示されます
- .mmd ファイルなど PlantUML も GitHub が対応

❌ PlantUML / AsciiDoc：
- GitHub ネイティブ対応なし
- ただしオンラインエディタで確認可能
```

### 📌 各フォーマットの使い分け

| フォーマット | 用途                                             | 利点                              | 欠点                      |
| ------------ | ------------------------------------------------ | --------------------------------- | ------------------------- |
| **Mermaid**  | フロー図、シーケンス図、ガントチャート           | GitHub 自動レンダリング、シンプル | 複雑な図には不向き        |
| **PlantUML** | ER 図、クラス図、複雑な構造図                    | 詳細な図が描ける                  | GitHub ネイティブ対応なし |
| **AsciiDoc** | 複雑なドキュメント（テーブル、リスト、埋め込み） | Markdown より高機能               | GitHub ネイティブ対応なし |
| **Markdown** | シンプルなドキュメント、テーブル                 | GitHub 完全対応、学習曲線が低い   | 複雑な図は不向き          |

---

## ✅ セッション完了チェック

- [ ] ドキュメント作成の重要性を理解した
- [ ] API 仕様書を生成依頼して、docs/API.md が作成された
- [ ] アーキテクチャドキュメントを生成依頼して、docs/ARCHITECTURE.md が作成された
- [ ] データベーススキーマドキュメントを生成依頼して、docs/DATABASE.md が作成された
- [ ] 生成されたドキュメントを確認した

---

## 💾 セッション完了後のコミット

**Session 04 で生成したドキュメントを Git に保存しておきましょう。**

```bash
# 変更を確認
git status

# ドキュメントを追加
git add .

# Session 04 完了時点をコミット
git commit -m "docs: Session 04 complete - auto-generated documentation

- Generated API specification (Markdown + OpenAPI + Mermaid)
- Generated Architecture documentation (text + diagrams)
- Generated Database schema documentation (Markdown + PlantUML + Mermaid)
- All documentation reviewed and verified"

# 進捗確認
git log --oneline
```

---

## 📌 このセッションで学んだこと

- 📚 **自動ドキュメント生成：** ClaudeCode で手作業を削減
- ✅ **ドキュメントの価値：** コードと同じくらい重要
- 🔄 **メンテナンス効率化：** コード変更時も、ドキュメント一緒に更新可能
- 🎯 **チーム開発対応：** ドキュメントがあると、チーム理解・新人教育が効率的

---

## 📌 次のセッションへ向けて

次のセッション（Session 05）では：

- **テストカバレッジの改善**
- **パフォーマンス最適化の分析**
- **セキュリティレビュー**

Session 04 で学んだ「ドキュメント生成」のスキルは、これからの全ての開発で活用できます。

💡 **コード + ドキュメント = 完全な開発成果物。ClaudeCode で両方を効率的に管理できます！**
