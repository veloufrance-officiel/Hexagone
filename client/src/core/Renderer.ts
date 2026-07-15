import * as THREE from 'three';

/**
 * Renderer class manages all WebGL rendering concerns.
 * 
 * Responsibilities:
 * - Initialize THREE.WebGLRenderer with optimal settings
 * - Handle window resize events
 * - Provide render interface for Engine
 * - Support future AR/VR rendering modes
 * 
 * @class Renderer
 */
export class Renderer {
  private renderer: THREE.WebGLRenderer;
  private width: number;
  private height: number;

  /**
   * Creates a new Renderer instance.
   * 
   * @param {HTMLElement} container - DOM element to attach renderer to
   * @throws {Error} If container is not provided
   */
  constructor(container: HTMLElement) {
    if (!container) {
      throw new Error('Renderer: container element is required');
    }

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      precision: 'highp',
    });

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    container.appendChild(this.renderer.domElement);

    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());
  }

  /**
   * Handle window resize events.
   * Updates renderer and camera aspect ratio.
   * 
   * @private
   */
  private onWindowResize(): void {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer.setSize(this.width, this.height);

    // Emit resize event for camera updates
    window.dispatchEvent(new CustomEvent('renderer:resize', {
      detail: { width: this.width, height: this.height }
    }));
  }

  /**
   * Render a scene from a camera perspective.
   * 
   * @param {THREE.Scene} scene - The scene to render
   * @param {THREE.Camera} camera - The camera to render from
   */
  render(scene: THREE.Scene, camera: THREE.Camera): void {
    this.renderer.render(scene, camera);
  }

  /**
   * Get the underlying WebGL renderer.
   * Use with caution - prefer using public methods.
   * 
   * @returns {THREE.WebGLRenderer} The Three.js renderer instance
   */
  getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  /**
   * Get current viewport dimensions.
   * 
   * @returns {Object} Object with width and height
   */
  getSize(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }

  /**
   * Get device pixel ratio for high-DPI support.
   * 
   * @returns {number} Current pixel ratio
   */
  getPixelRatio(): number {
    return this.renderer.getPixelRatio();
  }

  /**
   * Dispose renderer resources.
   * Call before application shutdown.
   */
  dispose(): void {
    this.renderer.dispose();
    window.removeEventListener('resize', () => this.onWindowResize());
  }
}
