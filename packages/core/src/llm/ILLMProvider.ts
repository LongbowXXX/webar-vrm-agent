export type VRMExpression =
  | "neutral"
  | "happy"
  | "angry"
  | "sad"
  | "relaxed"
  | "surprised";

export interface LLMResponse {
  text: string;
  expression: VRMExpression;
  motion: string;
}

export interface ILLMProvider {
  initialize(config?: any): Promise<void>;
  generateResponse(inputText: string): Promise<LLMResponse>;
}
