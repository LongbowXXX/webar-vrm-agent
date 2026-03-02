# WebAR AI Avatar Project - Context & Handover Document

## 1. プロジェクトの目的とゴール

WebXR標準APIを利用し、ブラウザ上でVRM形式の3DキャラクターをAR表示し、音声およびテキストで対話できるアプリケーションを構築する。将来的な拡張性を担保するため、対話ロジックや3D描画コンポーネントは独立したパッケージとして分割・管理する。
最終ターゲットはAndroidの標準ブラウザ（Chrome等）およびiOSのWebXR Viewerとする。

## 2. アーキテクチャと技術スタック

モノリポジトリ構成を採用し、アプリケーションとライブラリを明確に分離する。

- **パッケージ管理:** pnpm workspaces + Turborepo
- **フロントエンド基盤:** Vite + React + TypeScript
- **3D / AR描画:** Three.js, React Three Fiber, `@react-three/xr`, `@pixiv/three-vrm`
- **LLM (言語モデル):** Google AI SDK (Gemini 3 Pro 等) ※Structured Outputsを利用
- **TTS (音声合成):** Voice Vox

### ディレクトリ構成案

```text
/
├── packages/
│   ├── core/           # LLM/TTSの抽象インターフェース定義 (ILLMProvider, ITTSProvider等)
│   └── vrm-viewer/     # R3Fとthree-vrmをラップしたVRM描画・制御用Reactコンポーネント群
└── apps/
    └── web-ar-app/     # 最終的なWebXRアプリケーション (Vite + React)

```

## 3. 実装上の重要な制約・ルール (Agent向け指示)

- **LLMとTTSの抽象化:**
  特定のプロバイダ（GeminiやVoiceVox）に強く依存しないよう、`packages/core` でインターフェースを定義し、Dependency Injection（依存性の注入）のパターンを用いて `apps/web-ar-app` 側で具体クラスを初期化すること。
- **表情とモーションの同時生成:**
  LLM (Gemini) の呼び出し時は「Structured Outputs (JSON Schema)」を使用すること。レスポンスには、発話テキスト (`text`) だけでなく、VRMモデルの表情 (`expression`) とモーション (`motion`) のメタデータを必ず含めるスキーマを定義する。
- **テストと検証 (Browser Agentの活用):**
  UIコンポーネントやLLMとのAPI通信ロジックは、AntigravityのBrowser Agentを用いて自動テスト・検証を行うこと。ただし、WebXRのARカメラ機能自体はPCのブラウザエージェントでは動作しないため、最終的なAR表示テストは人間が実機（Android/iOS）で行う。エージェントはローカルサーバー起動時に `--host` オプションを付与し、実機アクセス用のIPアドレスをターミナルに出力して待機する状態までを構築すること。

## 4. 次のステップ (Initial Task)

Agentは本ドキュメントを読み込んだ後、Agent Managerの「Planning Mode」を利用して以下の手順で作業を開始してください。

1. **計画立案:** TurborepoとViteを用いたモノリポジトリのセットアップ手順、および `packages/core` におけるLLM/TTSインターフェースの設計書 (Artifact) を作成し、ユーザーの承認を得る。
2. **基盤構築:** 承認後、ターミナルでセットアップスクリプトを実行し、ディレクトリ構造の雛形を作成する。
