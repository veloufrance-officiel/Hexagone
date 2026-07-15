import { MovementAction, PlayerAction, VehicleAction, UIAction } from '../actions/ActionMap';

/**
 * Keyboard and Mouse input handler.
 * Maps PC keyboard/mouse inputs to gameplay actions.
 * 
 * Legacy mapping from city-fixed.html:
 * - Joystick replacement: WASD or ZQSD (French AZERTY)
 * - Jump: Space
 * - Interact: E
 * - Attack: Right Click
 * - Vehicle: F
 * 
 * @class KeyboardMouseInput
 */
export class KeyboardMouseInput {
  private keys: Map<string, boolean>;
  private mouseButtons: Map<number, boolean>;
  private onAction: ((action: string, value: number) => void) | null = null;

  /**
   * Creates a new KeyboardMouseInput instance.
   */
  constructor() {
    this.keys = new Map();
    this.mouseButtons = new Map();
    this.attachListeners();
  }

  /**
   * Attach keyboard and mouse event listeners.
   * 
   * @private
   */
  private attachListeners(): void {
    window.addEventListener('keydown', (e) => this.onKeyDown(e));
    window.addEventListener('keyup', (e) => this.onKeyUp(e));
    window.addEventListener('mousedown', (e) => this.onMouseDown(e));
    window.addEventListener('mouseup', (e) => this.onMouseUp(e));
  }

  /**
   * Handle keyboard down events.
   * 
   * @private
   * @param {KeyboardEvent} event - Keyboard event
   */
  private onKeyDown(event: KeyboardEvent): void {
    const key = event.key.toLowerCase();
    this.keys.set(key, true);
    this.handleKeyAction(key, true);
  }

  /**
   * Handle keyboard up events.
   * 
   * @private
   * @param {KeyboardEvent} event - Keyboard event
   */
  private onKeyUp(event: KeyboardEvent): void {
    const key = event.key.toLowerCase();
    this.keys.set(key, false);
    this.handleKeyAction(key, false);
  }

  /**
   * Map keyboard keys to gameplay actions.
   * Supports QWERTY and AZERTY layouts.
   * 
   * @private
   * @param {string} key - Key code
   * @param {boolean} pressed - Key state
   */
  private handleKeyAction(key: string, pressed: boolean): void {
    if (!this.onAction) return;

    // Movement (WASD or ZQSD for AZERTY)
    switch (key) {
      case 'w':
      case 'z':
        if (pressed) this.onAction(MovementAction.MoveForward, 1);
        break;
      case 's':
        if (pressed) this.onAction(MovementAction.MoveBackward, 1);
        break;
      case 'a':
      case 'q':
        if (pressed) this.onAction(MovementAction.MoveLeft, 1);
        break;
      case 'd':
        if (pressed) this.onAction(MovementAction.MoveRight, 1);
        break;
      case 'shift':
        this.onAction(MovementAction.Sprint, pressed ? 1 : 0);
        break;

      // Player actions
      case ' ':
        this.onAction(PlayerAction.Jump, pressed ? 1 : 0);
        event.preventDefault();
        break;
      case 'e':
        this.onAction(PlayerAction.Interact, pressed ? 1 : 0);
        break;
      case 'r':
        this.onAction(PlayerAction.Attack, pressed ? 1 : 0);
        break;

      // Vehicle
      case 'f':
        this.onAction(
          pressed ? VehicleAction.EnterVehicle : VehicleAction.ExitVehicle,
          1
        );
        break;

      // UI
      case 'i':
        this.onAction(UIAction.OpenInventory, pressed ? 1 : 0);
        break;
      case 'm':
        this.onAction(UIAction.OpenMap, pressed ? 1 : 0);
        break;
      case 'p':
        this.onAction(UIAction.Pause, pressed ? 1 : 0);
        break;
      case 'escape':
        this.onAction(UIAction.Cancel, pressed ? 1 : 0);
        break;
    }
  }

  /**
   * Handle mouse button down events.
   * 
   * @private
   * @param {MouseEvent} event - Mouse event
   */
  private onMouseDown(event: MouseEvent): void {
    this.mouseButtons.set(event.button, true);
    this.handleMouseAction(event.button, true);
  }

  /**
   * Handle mouse button up events.
   * 
   * @private
   * @param {MouseEvent} event - Mouse event
   */
  private onMouseUp(event: MouseEvent): void {
    this.mouseButtons.set(event.button, false);
    this.handleMouseAction(event.button, false);
  }

  /**
   * Map mouse buttons to gameplay actions.
   * Button 0 = Left, 1 = Middle, 2 = Right
   * 
   * @private
   * @param {number} button - Mouse button code
   * @param {boolean} pressed - Button state
   */
  private handleMouseAction(button: number, pressed: boolean): void {
    if (!this.onAction) return;

    // Right click for attack
    if (button === 2) {
      this.onAction(PlayerAction.Attack, pressed ? 1 : 0);
    }
  }

  /**
   * Register action callback.
   * Called when an input action occurs.
   * 
   * @param {Function} callback - Action callback
   */
  onActionCallback(callback: (action: string, value: number) => void): void {
    this.onAction = callback;
  }

  /**
   * Check if a specific key is currently pressed.
   * 
   * @param {string} key - Key to check
   * @returns {boolean} True if key is pressed
   */
  isKeyPressed(key: string): boolean {
    return this.keys.get(key.toLowerCase()) ?? false;
  }

  /**
   * Check if a specific mouse button is pressed.
   * 
   * @param {number} button - Mouse button code
   * @returns {boolean} True if button is pressed
   */
  isMouseButtonPressed(button: number): boolean {
    return this.mouseButtons.get(button) ?? false;
  }

  /**
   * Dispose input handlers.
   * Call before destroying this input handler.
   */
  dispose(): void {
    window.removeEventListener('keydown', (e) => this.onKeyDown(e));
    window.removeEventListener('keyup', (e) => this.onKeyUp(e));
    window.removeEventListener('mousedown', (e) => this.onMouseDown(e));
    window.removeEventListener('mouseup', (e) => this.onMouseUp(e));
  }
}
