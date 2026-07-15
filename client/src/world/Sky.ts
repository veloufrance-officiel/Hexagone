import * as THREE from "three";

/**
 * Sky system for HEXAGONE world.
 *
 * Responsibilities:
 * - Create sky environment
 * - Manage sun light direction
 * - Prepare future day/night cycle
 */
export class Sky {
  private skyMesh: THREE.Mesh;
  private sun: THREE.DirectionalLight;

  private time: number = 0;

  constructor(scene: THREE.Scene) {
    this.skyMesh = this.createSky();

    scene.add(this.skyMesh);

    this.sun = new THREE.DirectionalLight(
      0xffffff,
      1.2
    );

    this.sun.position.set(
      50,
      100,
      50
    );

    scene.add(this.sun);
  }

  /**
   * Create optimized sky dome.
   */
  private createSky(): THREE.Mesh {
    const geometry = new THREE.SphereGeometry(
      500,
      32,
      16
    );

    const material = new THREE.MeshBasicMaterial({
      color: 0x87ceeb,
      side: THREE.BackSide
    });

    return new THREE.Mesh(
      geometry,
      material
    );
  }

  /**
   * Update sky state.
   */
  update(deltaTime: number): void {
    this.time += deltaTime;

    // Future:
    // - sun movement
    // - weather
    // - atmosphere changes
  }

  /**
   * Get sun light.
   */
  getSun(): THREE.DirectionalLight {
    return this.sun;
  }

  /**
   * Cleanup.
   */
  dispose(): void {
    this.skyMesh.geometry.dispose();

    if (Array.isArray(this.skyMesh.material)) {
      this.skyMesh.material.forEach(
        material => material.dispose()
      );
    } else {
      this.skyMesh.material.dispose();
    }

    this.sun.dispose();
  }
}
