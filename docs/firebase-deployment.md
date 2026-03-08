# Firebaseへのデプロイ方法

このドキュメントでは、作成したWebアプリ（`apps/web-ar-app`）をGoogle Firebase Hostingを使用して公開する手順を説明します。

## 必要なもの

- Googleアカウント
- [Firebase プロジェクト](https://console.firebase.google.com/)
- [Node.js](https://nodejs.org/)
- `pnpm` (パッケージマネージャー)

## 手順

### 1. Firebase CLIのインストールとログイン

Firebaseをコマンドラインから操作するためのツールをインストールし、Googleアカウントでログインします。

```bash
# Firebase CLIのインストール（グローバル）
npm install -g firebase-tools

# Firebaseへのログイン
firebase login
```

### 2. プロジェクトのビルド

デプロイする前に、Webアプリをビルドして公開用ファイル（`dist`ディレクトリ）を生成します。
プロジェクトのルートディレクトリで以下のコマンドを実行します。

```bash
cd apps/web-ar-app
pnpm run build
```

### 3. Firebase プロジェクトの設定

プロジェクトのルートディレクトリに、Firebaseの設定ファイルを作成します。

#### `.firebaserc` (ルートディレクトリ)

デプロイ先のFirebaseプロジェクトIDを指定します。

```json
{
  "projects": {
    "default": "YOUR_PROJECT_ID"
  }
}
```

※ `YOUR_PROJECT_ID` はご自身のFirebaseプロジェクトIDに置き換えてください。

#### `firebase.json` (ルートディレクトリ)

Firebase Hostingの設定を行います。SPA（Single Page Application）としてルーティングを処理するための設定が含まれています。

```json
{
  "hosting": {
    "public": "apps/web-ar-app/dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### 4. デプロイの実行

設定が完了したら、以下のコマンドを実行してFirebase Hostingにデプロイします。

```bash
# プロジェクトのルートディレクトリで実行
firebase deploy --only hosting
```

コマンドが成功すると、**Hosting URL**（例: `https://YOUR_PROJECT_ID.web.app`）が表示されます。
ブラウザでそのURLにアクセスし、アプリが正常に表示されることを確認してください。

### 5. 公開の停止（非アクティブ化）

もしWebアプリの公開を止めたい場合は、以下のコマンドを実行してFirebase Hostingを無効にすることができます。

```bash
# プロジェクトのルートディレクトリで実行
firebase hosting:disable
```

確認プロンプトが表示されるので `y` を入力すると、公開が停止されてURLにアクセスできなくなります。再度公開したい場合は、もう一度手順4のデプロイコマンド（`firebase deploy --only hosting`）を実行してください。
