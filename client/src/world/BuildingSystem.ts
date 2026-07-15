import * as THREE from "three";

/**
 * HEXAGONE Building System
 *
 * Responsibilities:
 * - Create optimized city buildings
 * - Use InstancedMesh for performance
 * - Prepare future district streaming
 */
export class BuildingSystem {

  private mesh: THREE.InstancedMesh;

  private buildingCount: number;


  constructor(scene: THREE.Scene) {

    this.buildingCount = 100;


    const geometry =
      new THREE.BoxGeometry(
        10,
        20,
        10
      );


    const material =
      new THREE.MeshLambertMaterial({
        color: 0x777777
      });


    this.mesh =
      new THREE.InstancedMesh(
        geometry,
        material,
        this.buildingCount
      );


    this.mesh.castShadow = false;
    this.mesh.receiveShadow = true;


    this.generateBuildings();


    scene.add(this.mesh);
  }


  /**
   * Generate city buildings.
   *
   * Future:
   * - procedural districts
   * - French architecture profiles
   * - LOD levels
   */
  private generateBuildings(): void {

    const dummy =
      new THREE.Object3D();


    for (
      let i = 0;
      i < this.buildingCount;
      i++
    ) {

      const x =
        (Math.random() - 0.5) * 300;

      const z =
        (Math.random() - 0.5) * 300;


      const height =
        10 + Math.random() * 40;


      dummy.position.set(
        x,
        height / 2,
        z
      );


      dummy.scale.set(
        1,
        height / 20,
        1
      );


      dummy.updateMatrix();


      this.mesh.setMatrixAt(
        i,
        dummy.matrix
      );
    }


    this.mesh.instanceMatrix.needsUpdate = true;
  }


  update(
    deltaTime: number
  ): void {

    // Future:
    // - streaming
    // - destruction
    // - interiors
  }


  getMesh(): THREE.InstancedMesh {
    return this.mesh;
  }


  dispose(): void {

    this.mesh.geometry.dispose();

    if (
      Array.isArray(
        this.mesh.material
      )
    ) {
      this.mesh.material.forEach(
        material => material.dispose()
      );
    } else {
      this.mesh.material.dispose();
    }

  }
}
