import * as THREE from "three";

import { ChunkManager } from "./ChunkManager";
import { StreamingController } from "./StreamingController";
import { WorldRegistry } from "./WorldRegistry";

import { Sky } from "./Sky";
import { Lighting } from "./Lighting";
import { Terrain } from "./Terrain";
import { BuildingSystem } from "./BuildingSystem";


export class World {

  public readonly registry: WorldRegistry;

  public readonly chunkManager: ChunkManager;

  public readonly streamingController: StreamingController;


  private sky?: Sky;
  private lighting?: Lighting;
  private terrain?: Terrain;
  private buildings?: BuildingSystem;


  constructor(
    private scene?: THREE.Scene
  ) {

    this.registry =
      new WorldRegistry();


    this.chunkManager =
      new ChunkManager();


    this.streamingController =
      new StreamingController(
        this.chunkManager
      );

  }


  /**
   * Initialise HEXAGONE World
   */
  public load(): void {

    if (!this.scene) {
      return;
    }


    this.sky =
      new Sky(this.scene);


    this.lighting =
      new Lighting(this.scene);


    this.terrain =
      new Terrain(this.scene);


    this.buildings =
      new BuildingSystem(this.scene);


    console.log(
      "HEXAGONE World loaded"
    );
  }



  /**
   * Update world systems
   */
  public update(
    playerX: number,
    playerZ: number,
    deltaTime: number = 0
  ): void {


    this.streamingController.update(
      playerX,
      playerZ
    );


    this.sky?.update(deltaTime);

    this.lighting?.update(deltaTime);

    this.terrain?.update(deltaTime);

    this.buildings?.update(deltaTime);

  }



  /**
   * Cleanup
   */
  public dispose(): void {


    this.sky?.dispose();

    this.lighting?.dispose();

    this.terrain?.dispose();

    this.buildings?.dispose();


    this.chunkManager.clear();

    this.registry.clear();

  }

}
