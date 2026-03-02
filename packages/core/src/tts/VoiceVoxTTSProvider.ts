import { ITTSProvider } from "./ITTSProvider";

export class VoiceVoxTTSProvider implements ITTSProvider {
  private apiUrl: string;
  private speakerId: number;

  constructor(
    apiUrl: string = "http://127.0.0.1:50021",
    speakerId: number = 1,
  ) {
    this.apiUrl = apiUrl;
    this.speakerId = speakerId;
  }

  async initialize(config?: {
    apiUrl?: string;
    speakerId?: number;
  }): Promise<void> {
    if (config?.apiUrl) this.apiUrl = config.apiUrl;
    if (config?.speakerId !== undefined) this.speakerId = config.speakerId;
  }

  async synthesize(text: string): Promise<ArrayBuffer> {
    // 1. Create Audio Query
    const queryRes = await fetch(
      `${this.apiUrl}/audio_query?text=${encodeURIComponent(text)}&speaker=${this.speakerId}`,
      {
        method: "POST",
      },
    );
    if (!queryRes.ok)
      throw new Error("Failed to create audio query from VoiceVox");
    const query = await queryRes.json();

    // 2. Synthesize Audio
    const synthRes = await fetch(
      `${this.apiUrl}/synthesis?speaker=${this.speakerId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(query),
      },
    );
    if (!synthRes.ok)
      throw new Error("Failed to synthesize audio from VoiceVox");

    return await synthRes.arrayBuffer();
  }
}
