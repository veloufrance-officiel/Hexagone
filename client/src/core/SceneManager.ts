import * as THREE from 'three';

/**
 * SceneManager manages Three.js Scene lifecycle and object management.
 * 
 * Responsibilities:
 * - Create and maintain THREE.Scene
 * - Add/remove objects from scene graph
 * - Manage lighting and environmental settings
 * - Support future streaming/culling systems
 * 
 * @class SceneManager
 */
export class SceneManager {
  private scene: THREE.Scene;
  private objects: Map<string, THREE.Object3D>;
  private objectCount: number;

  /**
   * Creates a new SceneManager instance.
   * Initializes an empty Three.js scene.
   */
  constructor() {
    this.scene = new THREE.Scene();
    this.objects = new Map();
    this.objectCount = 0;
  }

  /**
   * Get the underlying Three.js Scene.
   * 
   * @returns {THREE.Scene} The scene instance
   */
  getScene(): THREE.Scene {
    return this.scene;
  }

  /**
   * Add an object to the scene.
   * 
   * @param {THREE.Object3D} object - Object to add
   * @param {string} [id] - Optional unique identifier for later retrieval
   * @returns {string} The object ID
   */
  add(object: THREE.Object3D, id?: string): string {
    const objectId = id || `object_${this.objectCount++}`;
    this.scene.add(object);
    this.objects.set(objectId, object);
    return objectId;
  }

  /**
   * Remove an object from the scene.
   * 
   * @param {string} id - Object identifier
   * @returns {boolean} True if object was removed, false if not found
   */
  remove(id: string): boolean {
    const object = this.objects.get(id);
    if (!object) return false;
    this.scene.remove(object);
    this.objects.delete(id);
    return true;
  }

  /**
   * Get an object by ID.
   * 
   * @param {string} id - Object identifier
   * @returns {THREE.Object3D | undefined} The object or undefined
   */
  getObject(id: string): THREE.Object3D | undefined {
    return this.objects.get(id);
  }

  /**
   * Remove all objects from scene.
   * Useful for scene transitions or cleanup.
   */
  clear(): void {
    this.objects.forEach((object) => {
      this.scene.remove(object);
      this.disposeObject(object);
    });
    this.objects.clear();
  }

  /**
   * Recursively dispose of a Three.js object and its resources.
   * 
   * @private
   * @param {THREE.Object3D} object - Object to dispose
   */
  private disposeObject(object: THREE.Object3D): void {
    // Dispose geometries and materials
    object.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      }
    });
  }

  /**
   * Set the scene background color.
   * 
   * @param {THREE.Color | number | string} color - Background color
   */
  setBackground(color: THREE.Color | number | string): void {
    this.scene.background = new THREE.Color(color);
  }

  /**
   * Set the scene fog.
   * 
   * @param {THREE.Fog | THREE.FogExp2 | null} fog - Fog instance or null to disable
   */
  setFog(fog: THREE.Fog | THREE.FogExp2 | null): void {
    this.scene.fog = fog;
  }

  /**
   * Get total objects in scene.
   * 
   * @returns {number} Object count
   */
  getObjectCount(): number {
    return this.objects.size;
  }

  /**
   * Dispose all scene resources.
   * Call before application shutdown.
   */
  dispose(): void {
    this.clear();
  }
}
