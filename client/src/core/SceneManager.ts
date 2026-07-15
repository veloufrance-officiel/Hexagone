import * as THREE from 'three';
import { World } from '../world/World';

/**
 * SceneManager manages Three.js Scene lifecycle and object management.
 *
 * Responsibilities:
 * - Create and maintain THREE.Scene
 * - Add/remove objects from scene graph
 * - Manage lighting and environmental settings
 * - Provide access to HEXAGONE World system
 * - Support future streaming/culling systems
 *
 * @class SceneManager
 */
export class SceneManager {
  private scene: THREE.Scene;
  private objects: Map<string, THREE.Object3D>;
  private objectCount: number;
  private world: World;

  /**
   * Creates a new SceneManager instance.
   * Initializes Three.js scene and HEXAGONE world.
   */
  constructor() {
    this.scene = new THREE.Scene();
    this.objects = new Map();
    this.objectCount = 0;

    this.world = new World();
    this.world.load();
  }

  /**
   * Get the underlying Three.js Scene.
   */
  getScene(): THREE.Scene {
    return this.scene;
  }

  /**
   * Get HEXAGONE World instance.
   */
  getWorld(): World {
    return this.world;
  }

  /**
   * Update world systems.
   *
   * @param playerX Player world position X
   * @param playerZ Player world position Z
   */
  updateWorld(playerX: number, playerZ: number): void {
    this.world.update(playerX, playerZ);
  }

  /**
   * Add an object to the scene.
   */
  add(object: THREE.Object3D, id?: string): string {
    const objectId = id || `object_${this.objectCount++}`;

    this.scene.add(object);
    this.objects.set(objectId, object);

    return objectId;
  }

  /**
   * Remove an object from the scene.
   */
  remove(id: string): boolean {
    const object = this.objects.get(id);

    if (!object) {
      return false;
    }

    this.scene.remove(object);
    this.objects.delete(id);

    return true;
  }

  /**
   * Get an object by ID.
   */
  getObject(id: string): THREE.Object3D | undefined {
    return this.objects.get(id);
  }

  /**
   * Remove all objects from scene.
   */
  clear(): void {
    this.objects.forEach((object) => {
      this.scene.remove(object);
      this.disposeObject(object);
    });

    this.objects.clear();
  }

  /**
   * Dispose Three.js resources.
   */
  private disposeObject(object: THREE.Object3D): void {
    object.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();

        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((material) => material.dispose());
          } else {
            child.material.dispose();
          }
        }
      }
    });
  }

  /**
   * Set scene background.
   */
  setBackground(color: THREE.Color | number | string): void {
    this.scene.background = new THREE.Color(color);
  }

  /**
   * Set scene fog.
   */
  setFog(fog: THREE.Fog | THREE.FogExp2 | null): void {
    this.scene.fog = fog;
  }

  /**
   * Get total objects in scene.
   */
  getObjectCount(): number {
    return this.objects.size;
  }

  /**
   * Dispose scene and world.
   */
  dispose(): void {
    this.world.dispose();
    this.clear();
  }
}
