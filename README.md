# 👥 Employee Manager

従業員情報を管理するためのWebアプリケーションです。  
Reactベースで構築され、CSVファイルを用いたインポート／エクスポート機能を備えています。

## 🚀 機能一覧

- 従業員一覧のテーブル表示
- 従業員の詳細閲覧・編集・削除
- 新規従業員の追加
- CSVファイルの読み込み（インポート）
- CSVファイルの保存（エクスポート）
- ユーザー権限の切り替え（一般社員・管理者）

## 🧾 管理対象の項目

| 項目名     | 説明                     |
|------------|--------------------------|
| 氏名       | 従業員のフルネーム       |
| 所属       | 部署名                   |
| 役職       | 役職名（例：課長、主任） |
| メール     | メールアドレス           |
| 電話番号   | 連絡先電話番号           |
| 雇用形態   | 正社員／契約社員など     |
| 入社日     | 入社年月日               |
| ステータス | 在籍 or 退職             |

## 🛠️ 使用技術

- フロントエンド: React + Vite
- スタイリング: CSS Modules or TailwindCSS（任意）
- 状態管理: useState / useEffect
- データ保存形式: CSV ファイル

## 📁 ディレクトリ構成
employee-manager/
├── public/ # 静的ファイル
├── src/
│ ├── components/ # UIコンポーネント（テーブルなど）
│ ├── pages/ # 各画面（一覧、詳細など）
│ ├── utils/ # CSV処理などのユーティリティ
│ ├── App.tsx # ルートコンポーネント
│ └── main.tsx # エントリポイント
├── employees.csv # サンプルデータ（CSV）
├── package.json # プロジェクト設定
└── README.md # このファイル


## 🔧 起動方法（ローカル環境）

```bash
# 1. リポジトリをクローン
git clone https://github.com/nori07-dev/employee-manager.git
cd employee-manager

# 2. パッケージインストール
npm install

# 3. アプリを起動
npm run dev

# ブラウザで http://localhost:5173 にアクセス
