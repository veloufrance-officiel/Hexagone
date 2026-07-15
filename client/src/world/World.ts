import { ChunkManager } from "./ChunkManager";
import { StreamingController } from "./StreamingController";
import { WorldRegistry } from "./WorldRegistry";

export class World {
  public readonly registry: WorldRegistry;
  public readonly chunkManager: ChunkManager;
  public readonly streamingController: StreamingController;

  constructor() {
    this.registry = new WorldRegistry();

    this.chunkManager = new ChunkManager();

    this.streamingController =
      new StreamingController(
        this.chunkManager
      );
  }

  public load(): void {
    console.log("HEXAGONE World initialized");
  }

  public update(
    playerX: number,
    playerZ: number
  ): void {
    this.streamingController.update(
      playerX,
      playerZ
    );
  }

  public dispose(): void {
    this.chunkManager.clear();
    this.registry.clear();
  }
}
