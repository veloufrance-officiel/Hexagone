import { ChunkManager } from "./ChunkManager";

export class StreamingController {
  private readonly chunkManager: ChunkManager;

  private loadDistance: number;
  private unloadDistance: number;

  constructor(
    chunkManager: ChunkManager,
    loadDistance = 1000,
    unloadDistance = 1500
  ) {
    this.chunkManager = chunkManager;
    this.loadDistance = loadDistance;
    this.unloadDistance = unloadDistance;
  }

  public update(
    playerX: number,
    playerZ: number
  ): void {
    // Préparation du système de streaming.
    // La logique de distance sera connectée
    // aux chunks réels dans la prochaine étape.
  }

  public setDistances(
    loadDistance: number,
    unloadDistance: number
  ): void {
    this.loadDistance = loadDistance;
    this.unloadDistance = unloadDistance;
  }

  public getLoadDistance(): number {
    return this.loadDistance;
  }

  public getUnloadDistance(): number {
    return this.unloadDistance;
  }
}
