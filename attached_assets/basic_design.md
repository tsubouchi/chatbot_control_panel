# Basic Design Document: Amazon 購買自動化エージェント
*Version: 1.0*  
*作成日: 2025-01-01*  
*作成者: Sakura (チョコレートノート)*

---

## 1. はじめに

本ドキュメントは、Amazon 上の商品情報を自動でリサーチし、条件に合致する最適な商品を選定、そして自動で購入する AI エージェントの基本設計（Basic Design）を網羅的にまとめたものです。  
本システムは、AI 駆動開発と Browser Use の技術を活用し、Cursor Composerおよび cursorrulesを用いたオーケストレーションによって、ブラウザ操作の自動化を実現します。

本設計は、要件定義、システムアーキテクチャ、各モジュールの詳細仕様、インターフェース、非機能要件、運用・テスト戦略などを含み、技術者が実装に着手するための指針を提供します。

---

## 2. システム概要
### 2.1 目的

- ユーザーが入力した購買条件（例：「価格1000円以下、評価4以上のノートパソコン」）に基づき、Amazon 上で対象商品の検索、比較、選定を自動で実行する。
- 選定された商品の購入手続きをブラウザ自動操作で実施し、最適な購買体験を提供する。

### 2.2 ユースケース

1. **ユーザー入力**  
   ユーザーは Web UI で購入条件を入力する。

2. **条件解析**  
   入力テキストを解析し、検索条件を抽出する（テキスト解析エージェント）。

3. **商品情報取得**  
   Amazon API もしくはスクレイピングにより、条件に合致する商品のデータを取得する（商品取得エージェント）。

4. **商品比較**  
   取得した複数の商品の中から、評価、価格、その他の指標をもとに最適な商品を選定する（比較評価エージェント）。

5. **ブラウザ操作自動化**  
   Browser Use と Cursor Composer を活用し、選定商品のページへ遷移し、自動で購入手続きを実行する（ブラウザ操作エージェント）。

6. **結果ログの記録とフィードバック**  
   各プロセスの結果やエラーログをデータベースに記録し、運用改善のためのフィードバックループを構築する。

---

## 3. システムアーキテクチャ
### 3.1 全体構成

本システムは、以下の主要コンポーネントから構成されます：

- **Web UI (フロントエンド)**  
  ユーザーが入力条件を設定し、結果を確認するためのインターフェース（React などのモダンフレームワーク）。LatestのStableバージョンを利用

- **バックエンド API サーバ**  
  FastAPI（または Flask）を用いて各種処理を統合し、エージェント間の連携、データ管理、ログ収集を実施。
  。LatestのStableバージョンを利用

- **オーケストレーションエンジン**  
  Cursor Composer と cursorrules を用いて、AI エージェントのシナリオ（エージェントフロー）を定義・実行する。

- **ブラウザ自動操作モジュール**  
  Browser Use ライブラリを利用し、実際のブラウザ上で操作を自動化するモジュール。
  https://github.com/browser-use/browser-use

- **データベース**  
  PostgreSQL をメインに、Redis（キャッシュ）、Elasticsearch（全文検索）などを利用し、ユーザー情報、商品データ、ログなどを保存。

- **タスク管理と非同期処理**  
  Celery や Apache Airflow を用いて、バックグラウンドでのタスク実行、スケジュール管理、エラー処理を実施。

### 3.2 データフロー図

```mermaid
flowchart TD
    A[ユーザー入力(UI)] --> B[テキスト解析モジュール]
    B --> C[検索条件抽出]
    C --> D[商品取得モジュール]
    D --> E[商品データ (API/スクレイピング)]
    E --> F[商品比較モジュール]
    F --> G[最適商品の選定]
    G --> H[Cursor Composerシナリオ]
    H --> I[Browser Use操作]
    I --> J[自動購買処理]
    J --> K[結果ログ記録(DB)]
    K --> L[フィードバックループ]

###4. モジュール詳細仕様
### 4.1 ユーザー入力解析モジュール
    •   関数名: parse_user_input(input_text: str) -> dict
    •   機能: ユーザーが入力したテキストから、検索条件（価格、評価、カテゴリなど）を抽出する。
    •   入出力:
    •   入力: ユーザー入力テキスト
    •   出力: 辞書形式の条件データ例    

{
  "max_price": 1000,
  "min_rating": 4,
  "category": "ノートパソコン"
}    

    •   実装手法: シンプルなルールベース解析、必要に応じて NLP モデルの導入

### 4.2 商品取得モジュール
    •   関数名: fetch_products(conditions: dict) -> list
    •   機能: Amazon API もしくはスクレイピングにより、条件に合致する商品の情報を取得する。
    •   入出力:
    •   入力: 検索条件
    •   出力: 商品情報リスト

 [
  {"id": "P001", "name": "ノートPC A", "price": 950, "rating": 4.5},
  {"id": "P002", "name": "ノートPC B", "price": 1050, "rating": 4.2},
  ...
]   

    •   注意事項: API キー管理、レートリミット、エラーハンドリングを実装

### 4.3 商品比較モジュール
    •   関数名: compare_products(products: list) -> dict
    •   機能: 複数の商品データを比較し、ユーザー条件に最も適合する商品を選定する。
    •   入出力:
    •   入力: 商品情報リスト
    •   出力: 最適な商品の情報（辞書形式）

{"id": "P001", "name": "ノートPC A", "price": 950, "rating": 4.5}   

    •   実装例: シンプルなスコアリングアルゴリズム（例：score = rating / price）の利用

### 4.4 ブラウザ操作モジュール
    •   ツール: Browser Use, Node.js
    •   機能: Amazon のブラウザ操作（検索、商品ページ遷移、購入ボタンのクリック、フォーム入力など）を自動化する。
    •   実装概要:
    •   操作対象のセレクタ: Amazon ページの DOM 要素の正確なセレクタを設定
    •   操作手順:
    1.  ページ遷移と読み込み待機
    2.  テキスト入力とクリック操作
    3.  エラーチェックとリトライ処理

### 4.5 オーケストレーションモジュール
    •   関数名: auto_purchase_agent(user_input: str) -> dict
    •   機能: 各モジュール（テキスト解析、商品取得、比較、ブラウザ操作）を統合し、シナリオを管理する。
    •   実装手法:
    •   Python のサブプロセスを利用して、Cursor Composer と Browser Use の各スクリプトを呼び出す。
    •   エラー発生時のフォールバック処理、タイムアウト処理を実装。 

## 5. データベースおよびインターフェース設計
### 5.1 データベース設計
    •   テーブル: users
ユーザー情報（認証情報、購入履歴、設定など）
    •   テーブル: search_conditions
ユーザー入力条件と解析結果の保存
    •   テーブル: products
取得した商品情報のキャッシュ（ID、名前、価格、評価、取得日時）
    •   テーブル: purchase_logs
自動購買処理の結果、ログ、エラーメッセージの記録

### 5.2 API インターフェース設計
    •   GET /api/products
検索条件に基づく商品情報の取得
    •   POST /api/purchase
自動購買プロセスの開始（ユーザー入力条件を受け取る）
    •   GET /api/logs
購入ログ、エラーログの参照
    •   その他: 各モジュール間の内部 API 連携用エンドポイント    

## 6. 開発プロセスと進め方
### 6.1 要件定義・仕様書作成
    •   ユースケースシナリオ、機能要件、非機能要件、データフロー図、モジュール間の依存関係を詳細に文書化
    •   アーキテクチャ図、シーケンス図の作成

### 6.2 環境構築
    •   Python 仮想環境の構築、必要ライブラリのインストール
    •   Node.js 環境のセットアップと Browser Use の依存ライブラリ導入
    •   CI/CD パイプライン（GitHub Actions 等）の初期設定

### 6.3 Cursor Composer でのシナリオ作成
    •   cursorrules を参考に、シナリオの各操作ルール（クリック、入力、スクロールなど）を YAML 形式で定義
    •   Cursor Composer の CLI/API を利用してシナリオファイル（例: amazon_purchase_scenario.yaml）を作成

### 6.4 各モジュールの実装と統合
    •   ユーザー入力解析、商品取得、比較の各モジュールを個別に実装し、単体テストを実施
    •   Browser Use を用いたブラウザ操作スクリプト（Node.js）を実装
    •   Python のオーケストレーションモジュールで各処理を順次実行し、統合テストを実施

### 6.5 テスト、デバッグ、リファクタリング
    •   単体テスト、統合テスト、E2E テストを実施
    •   ログの収集と分析により、各モジュールの動作を検証
    •   必要に応じてコードのリファクタリング、パフォーマンス最適化

### 6.6 デプロイと運用
    •   段階的リリース（機能フラグ利用）、ステージング環境での試験運用
    •   運用監視（エラーログ、パフォーマンスメトリクス）、ユーザーからのフィードバックの収集
    •   定期的な再学習、シナリオのアップデート、セキュリティパッチの適用   
    
## 7. 非機能要件
    •   安全性・セキュリティ
API キー、認証情報、決済データの暗号化・安全な管理
ブラウザ操作の自動化における誤操作防止機構の実装
    •   パフォーマンス
キャッシュ（Redis 等）によるデータ取得の高速化
非同期処理や並列実行によるレスポンスタイムの短縮
    •   拡張性
モジュール化された設計により、他の EC サイトや追加機能への拡張が容易
マイクロサービスアーキテクチャの採用検討
    •   保守性
コードのモジュール化、リファクタリング、ドキュメント整備
自動テストと CI/CD パイプラインによる品質担保     

## 8. セキュリティと運用管理
### 8.1 セキュリティ対策
    •   API 認証、OAuth、JWT の導入によるアクセス制御
    •   HTTPS、SSL/TLS による通信の暗号化
    •   定期的な脆弱性診断とセキュリティパッチの適用

### 8.2 運用監視
    •   ログ収集システム（ELK Stack、Prometheus、Grafana）による監視
    •   アラートシステムの構築（Slack 通知、メール通知など）
    •   定期的な運用レビューとフィードバックループの構築

## 9. 開発上の注意点
    •   エラーハンドリング
各モジュールで適切なエラーチェックを実装し、例外発生時のリトライやフォールバックを検討
    •   環境依存性の管理
環境変数や設定ファイルによる柔軟な構成管理
開発・ステージング・本番環境の明確な区分け
    •   コード品質の維持
コードレビュー、静的解析、テスト自動化の徹底
    •   ユーザー操作の安全性
実際の購入処理における最終確認やキャンセル可能な設計の検討    

## 10. 今後の展望と拡張
    •   多サイト対応: 現在は Amazon を対象としていますが、他の EC サイトにも対応可能な汎用フレームワークへの拡張
    •   マルチエージェント連携: 複数のエージェントが協調して動作するシステム（例: 市場全体の価格比較、レビュー解析の統合）
    •   AI モデルの高度化: NLP や画像認識、推論アルゴリズムのさらなる精度向上と、ユーザー条件の自動学習
    •   ユーザーインターフェースの最適化: AI の推論根拠の可視化、ユーザーへのフィードバック強化
    •   運用自動化とセルフヘルプ機能: 運用中のエラーや問題発生時に自動対応する仕組みの構築