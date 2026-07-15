import * as THREE from "three";

/**
 * HEXAGONE Terrain System
 *
 * Responsibilities:
 * - Create world ground
 * - Manage terrain mesh
 * - Prepare future chunk streaming
 */
export class Terrain {

  private mesh: THREE.Mesh;


  constructor(scene: THREE.Scene) {

    const geometry = new THREE.PlaneGeometry(
      400,
      400,
      1,
      1
    );


    const material = new THREE.MeshLambertMaterial({
      color: 0x3f6b3f
    });


    this.mesh = new THREE.Mesh(
      geometry,
      material
    );


    this.mesh.rotation.x = -Math.PI / 2;

    this.mesh.receiveShadow = true;


    scene.add(this.mesh);
  }


  /**
   * Future:
   * - terrain deformation
   * - roads
   * - vegetation
   * - biome changes
   */
  update(deltaTime: number): void {

  }


  getMesh(): THREE.Mesh {
    return this.mesh;
  }


  dispose(): void {

    this.mesh.geometry.dispose();

    if (Array.isArray(this.mesh.material)) {
      this.mesh.material.forEach(
        material => material.dispose()
      );
    } else {
      this.mesh.material.dispose();
    }

  }
}
