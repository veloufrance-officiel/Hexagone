import * as THREE from "three";

/**
 * HEXAGONE Lighting System
 *
 * Responsibilities:
 * - Manage global world lights
 * - Provide scalable quality levels
 * - Prepare future day/night cycle
 */
export class Lighting {
  private ambientLight: THREE.AmbientLight;
  private hemisphereLight: THREE.HemisphereLight;
  private sunLight: THREE.DirectionalLight;

  private time: number = 0;

  constructor(scene: THREE.Scene) {

    this.ambientLight = new THREE.AmbientLight(
      0xffffff,
      0.4
    );

    scene.add(this.ambientLight);


    this.hemisphereLight =
      new THREE.HemisphereLight(
        0x87ceeb,
        0x444444,
        0.5
      );

    scene.add(this.hemisphereLight);


    this.sunLight =
      new THREE.DirectionalLight(
        0xffffff,
        0.85
      );

    this.sunLight.position.set(
      50,
      100,
      50
    );

    this.sunLight.castShadow = false;

    scene.add(this.sunLight);
  }


  /**
   * Update lighting state.
   * Future:
   * - sunrise
   * - sunset
   * - weather
   */
  update(deltaTime: number): void {
    this.time += deltaTime;
  }


  /**
   * Switch quality depending on device.
   */
  setQuality(
    level: "mobile" | "pc" | "console"
  ): void {

    switch(level) {

      case "mobile":
        this.sunLight.intensity = 0.7;
        this.ambientLight.intensity = 0.5;
        break;


      case "pc":
        this.sunLight.intensity = 1;
        this.ambientLight.intensity = 0.4;
        break;


      case "console":
        this.sunLight.intensity = 1.1;
        this.ambientLight.intensity = 0.35;
        break;
    }
  }


  getSun(): THREE.DirectionalLight {
    return this.sunLight;
  }


  dispose(): void {

    this.ambientLight.dispose();
    this.hemisphereLight.dispose();
    this.sunLight.dispose();

  }
}
