# AIチャットボット コントロールパネル

AIチャットボットの性格をカスタマイズできるウェブアプリケーションです。スライダーやテキスト入力を使って、チャットボットの性格を細かく調整できます。

![スクリーンショット](./attached_assets/スクリーンショット%202025-02-03%2012.43.34.png)

## 主な機能

- チャットボットの名前とアイコンのカスタマイズ
- 性格パラメータの調整（平和と調和性、創造性、論理的思考、新規性、慎重さ）
- 追加の性格特性の自由記述
- リアルタイムのシステムプロンプトプレビュー
- LINE風のチャットインターフェース
- アイコンのアップロード機能

## 技術スタック

- フロントエンド
  - React
  - TypeScript
  - Tailwind CSS
  - shadcn/ui
  - Socket.IO Client

- バックエンド
  - Node.js
  - Express
  - Socket.IO
  - OpenAI API
  - PostgreSQL (Drizzle ORM)

## セットアップ手順

1. リポジトリのクローン
```bash
git clone https://github.com/tsubouchi/chatbot_control_panel.git
cd chatbot_control_panel
```

2. 依存関係のインストール
```bash
npm install
```

3. 環境変数の設定
```bash
# .envファイルを作成
OPENAI_API_KEY=your_api_key
DATABASE_URL=your_database_url
```

4. データベースのセットアップ
```bash
npm run db:push
```

5. 開発サーバーの起動
```bash
npm run dev
```

## ライセンス

MIT
