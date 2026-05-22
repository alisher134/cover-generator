export interface FileExtractor {
  extract(buffer: Buffer): Promise<string>;
}
