# プロジェクトアシスタント

Next.js 15とTypeScriptを使用したWebアプリケーションです。Azure OpenAIとAzure Cosmosデータベースを活用した議事録管理とアシスタント機能を提供します。

## 機能

- **議事録管理**: 会議の議事録作成、管理、検索機能
- **AIアシスタント**: Azure OpenAIを使用したチャット機能
- **プロジェクト管理**: プロジェクト単位での議事録管理

## 技術スタック

- **フロントエンド**: Next.js 15, React 19, TypeScript
- **スタイリング**: Tailwind CSS
- **データベース**: Azure Cosmos DB
- **AI**: Azure OpenAI, OpenAI
- **認証**: Azure Identity
- **ストレージ**: Azure Blob Storage

## セットアップ

### 前提条件

- Node.js 20.x
- npm

### インストール

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアプリケーションにアクセスできます。

### ビルド

```bash
npm run build
```

### 本番環境での起動

```bash
npm start
```

## プロジェクト構造

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API ルート
│   ├── minutes/        # 議事録機能
│   └── layout.tsx      # レイアウトコンポーネント
├── components/         # 再利用可能なコンポーネント
├── context/           # React Context
├── models/            # データモデル
├── types/             # TypeScript型定義
└── util/              # ユーティリティ関数
    ├── cosmos/        # Azure Cosmos DB操作
    └── openai/        # OpenAI操作
```

## API エンドポイント

- `/api/meetings/getbyproject` - プロジェクト別会議取得
- `/api/minutes/inference` - 議事録推論
- `/api/minutes/regist/transcript` - 議事録登録
- `/api/projects/getall` - 全プロジェクト取得

## 開発

### リント

```bash
npm run lint
```

### 環境変数

必要な環境変数をセットアップしてください（Azure関連の設定が必要です）。

## ライセンス

プライベートプロジェクト
