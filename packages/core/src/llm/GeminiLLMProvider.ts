import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ILLMProvider, LLMResponse, VRMExpression } from "./ILLMProvider";

export class GeminiLLMProvider implements ILLMProvider {
  private ai: GoogleGenAI | null = null;
  private modelName: string = "gemini-2.5-pro";

  async initialize(config?: {
    apiKey: string;
    modelName?: string;
  }): Promise<void> {
    if (!config?.apiKey) {
      console.warn("API Key required for GeminiLLMProvider");
      return;
    }
    this.ai = new GoogleGenAI({ apiKey: config.apiKey });
    if (config.modelName) {
      this.modelName = config.modelName;
    }
  }

  async generateResponse(inputText: string): Promise<LLMResponse> {
    if (!this.ai) throw new Error("ILLMProvider not initialized with API Key");

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        text: {
          type: Type.STRING,
          description: "The response text spoken by the avatar",
        },
        expression: {
          type: Type.STRING,
          enum: ["neutral", "happy", "angry", "sad", "relaxed", "surprised"],
          description: "The facial expression matching the text",
        },
        motion: {
          type: Type.STRING,
          description: "The animation motion to play",
        },
      },
      required: ["text", "expression", "motion"],
    };

    const response = await this.ai.models.generateContent({
      model: this.modelName,
      contents: inputText,
      config: {
        systemInstruction:
          "You are a friendly AI Avatar interacting with the user in WebAR.",
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text || "{}";
    return JSON.parse(jsonText) as LLMResponse;
  }
}
