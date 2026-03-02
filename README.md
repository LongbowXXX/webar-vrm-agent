# WebAR VRM Agent Project

A WebXR application that allows users to interact with a 3D VRM avatar via text and voice, augmented by Language Models (LLM) and Text-to-Speech (TTS) capabilities.

## Architecture

This project is built as a monorepo using **pnpm workspaces** and **Turborepo** for optimal dependency mapping and build caching.

### Packages & Apps

- **`apps/web-ar-app`**: The main Vite + React frontend application implementing WebXR via `@react-three/xr`.
- **`packages/core`**: Abstract interfaces and concrete providers for LLM (Google Gemini) and TTS (VoiceVox).
- **`packages/vrm-viewer`**: An abstracted React component utilizing `@pixiv/three-vrm` and `@react-three/fiber` for rendering the VRM avatar.

## Requirements

- Node.js (>= 18)
- [pnpm](https://pnpm.io/)
- Google Gemini API Key
- A locally or remotely hosted VoiceVox Engine

## Installation & Setup

1. **Install Dependencies**:

   ```bash
   pnpm install
   ```

2. **Supply a VRM Model**:
   Place your standard `.vrm` 3D model in the public assets directory of the main application:
   `apps/web-ar-app/public/models/avatar.vrm`

3. **Start Development Server**:

   ```bash
   pnpm run dev
   ```

   > **Note on Mobile Testing**: If you wish to test the AR capabilities on a physical device, run the app with the `--host` flag to expose it on your local network:
   > `pnpm --filter web-ar-app run dev --host`

4. **Initialize Providers**:
   Once the site is loaded, input your Gemini API Key and your VoiceVox Engine URL (e.g. `http://localhost:50021` or your PC's local IP address if testing from mobile).

## Built With

- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [Turborepo](https://turbo.build/)
- [Three.js](https://threejs.org/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
- [React Three XR](https://docs.pmnd.rs/xr/getting-started/introduction)
- [Three-VRM](https://github.com/pixiv/three-vrm)
- [Google GenAI SDK](https://github.com/google/generative-ai-js)
