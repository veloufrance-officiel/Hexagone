import { District } from "./District";

export type ChunkState = "loaded" | "unloaded";

export interface Chunk {
  id: string;
  district: District;
  state: ChunkState;
}

export class ChunkManager {
  private chunks: Map<string, Chunk> = new Map();

  public registerChunk(chunk: Chunk): void {
    this.chunks.set(chunk.id, chunk);
  }

  public loadChunk(id: string): void {
    const chunk = this.chunks.get(id);

    if (!chunk) {
      return;
    }

    chunk.state = "loaded";
    chunk.district.load();
  }

  public unloadChunk(id: string): void {
    const chunk = this.chunks.get(id);

    if (!chunk) {
      return;
    }

    chunk.state = "unloaded";
    chunk.district.unload();
  }

  public getChunk(id: string): Chunk | undefined {
    return this.chunks.get(id);
  }

  public getLoadedChunks(): Chunk[] {
    return Array.from(this.chunks.values()).filter(
      (chunk) => chunk.state === "loaded"
    );
  }

  public clear(): void {
    this.chunks.clear();
  }
}
