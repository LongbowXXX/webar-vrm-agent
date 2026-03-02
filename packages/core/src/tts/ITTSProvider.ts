export interface ITTSProvider {
  initialize(config?: any): Promise<void>;
  synthesize(text: string): Promise<ArrayBuffer>;
}
