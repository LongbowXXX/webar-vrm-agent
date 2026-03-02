/* eslint-disable */
import { useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { ARButton, XR } from "@react-three/xr";
import { VRMAvatar } from "@webar/vrm-viewer";
import { GeminiLLMProvider, VoiceVoxTTSProvider } from "@webar/core";
import type { ThreeElements } from "@react-three/fiber";
import "./App.css";

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements extends ThreeElements {}
    }
  }
}

const llmProvider = new GeminiLLMProvider();
const ttsProvider = new VoiceVoxTTSProvider();

function App() {
  const [expression, setExpression] = useState("neutral");
  const [inputText, setInputText] = useState("");

  const [apiKey, setApiKey] = useState(
    import.meta.env.VITE_GEMINI_API_KEY || "",
  );
  const [voiceVoxUrl, setVoiceVoxUrl] = useState("/api/voicevox");
  const [isInitialized, setIsInitialized] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);

  // We assume a demo vrm is placed at this location.
  const modelUrl = "/models/avatar.vrm";

  const handleInit = async () => {
    try {
      await llmProvider.initialize({ apiKey });
      await ttsProvider.initialize({ apiUrl: voiceVoxUrl });

      const AudioCtx =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      audioContextRef.current = new AudioCtx();

      setIsInitialized(true);
      alert("Providers Initialized!");
    } catch (err: unknown) {
      alert("Error initializing: " + String(err));
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || !isInitialized) return;
    setIsProcessing(true);

    try {
      const response = await llmProvider.generateResponse(inputText);
      setExpression(response.expression);
      console.log("Motion:", response.motion);

      const audioBuffer = await ttsProvider.synthesize(response.text);
      if (audioContextRef.current) {
        if (audioContextRef.current.state === "suspended") {
          await audioContextRef.current.resume();
        }
        const audioBufferData =
          await audioContextRef.current.decodeAudioData(audioBuffer);
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBufferData;
        source.connect(audioContextRef.current.destination);
        source.start(0);
      }
    } catch (err) {
      console.error(err);
      alert("Error: " + String(err));
    } finally {
      setIsProcessing(false);
      setInputText("");
    }
  };

  return (
    <div className="app-container">
      <ARButton sessionInit={{ requiredFeatures: ["hit-test"] }} />
      <div className="canvas-wrapper">
        <Canvas>
          <XR>
            <ambientLight intensity={0.5} />
            <directionalLight position={[1, 1, 1]} intensity={1} />
            <group position={[0, -1.5, -2]}>
              {/* Note: This URL must return a valid VRM. Without a valid model url, you'll see console errors. */}
              <VRMAvatar url={modelUrl} expression={expression} />
            </group>
          </XR>
        </Canvas>
      </div>

      <div className="controls">
        {!isInitialized ? (
          <div className="config-panel">
            <input
              type="password"
              placeholder="Gemini API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <input
              type="text"
              placeholder="VoiceVox URL"
              value={voiceVoxUrl}
              onChange={(e) => setVoiceVoxUrl(e.target.value)}
            />
            <button onClick={handleInit}>Initialize</button>
          </div>
        ) : (
          <div className="chat-panel">
            <select
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
            >
              <option value="neutral">Neutral</option>
              <option value="happy">Happy</option>
              <option value="angry">Angry</option>
              <option value="sad">Sad</option>
              <option value="relaxed">Relaxed</option>
              <option value="surprised">Surprised</option>
            </select>
            <input
              type="text"
              placeholder="Talk to avatar..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isProcessing}
            />
            <button onClick={handleSend} disabled={isProcessing}>
              {isProcessing ? "Thinking..." : "Send"}
            </button>
            <button onClick={() => setIsInitialized(false)}>Config</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
