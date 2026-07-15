import { GameAction, ActionState } from './actions/ActionMap';
import { ControlProfile, ControlProfileType, DEFAULT_PROFILES } from './actions/ControlProfile';
import { KeyboardMouseInput } from './devices/KeyboardMouseInput';
import { TouchInput } from './devices/TouchInput';
import { GamepadInput } from './devices/GamepadInput';

/**
 * Central input manager orchestrating all input devices.
 * 
 * Responsibilities:
 * - Manage multiple input device handlers
 * - Normalize inputs to abstract actions
 * - Route actions to game systems
 * - Support multiple concurrent input profiles
 * - Enable/disable profiles based on platform
 * 
 * Architecture flow:
 * Physical Input (Keyboard/Touch/Gamepad) →
 * Device Handler (Keyboard/Touch/GamepadInput) →
 * InputManager (aggregation) →
 * ActionMap (abstract actions) →
 * Game Systems (Gameplay logic)
 * 
 * @class InputManager
 */
export class InputManager {
  private keyboardMouse: KeyboardMouseInput | null = null;
  private touch: TouchInput | null = null;
  private gamepad: GamepadInput | null = null;
  private profiles: Map<ControlProfileType, ControlProfile> = new Map();
  private activeProfiles: Set<ControlProfileType> = new Set();
  private actionListeners: Map<GameAction, Set<(state: ActionState) => void>> =
    new Map();
  private enabled: boolean = true;

  /**
   * Creates a new InputManager instance.
   * 
   * @param {Object} config - Configuration object
   * @param {boolean} [config.enableKeyboardMouse=true] - Enable keyboard/mouse input
   * @param {boolean} [config.enableTouch=true] - Enable touch input
   * @param {boolean} [config.enableGamepad=true] - Enable gamepad input
   * @param {ControlProfileType[]} [config.activeProfiles] - Initially active profiles
   */
  constructor(config: {
    enableKeyboardMouse?: boolean;
    enableTouch?: boolean;
    enableGamepad?: boolean;
    activeProfiles?: ControlProfileType[];
  } = {}) {
    // Initialize profiles
    this.registerProfile(DEFAULT_PROFILES.PC);
    this.registerProfile(DEFAULT_PROFILES.MOBILE);
    this.registerProfile(DEFAULT_PROFILES.GAMEPAD);
    this.registerProfile(DEFAULT_PROFILES.CONSOLE);

    // Setup input devices
    if (config.enableKeyboardMouse !== false) {
      this.keyboardMouse = new KeyboardMouseInput();
      this.keyboardMouse.onActionCallback((action, value) =>
        this.handleAction(action, value)
      );
    }

    if (config.enableTouch !== false && this.isTouchDevice()) {
      this.touch = new TouchInput();
      this.touch.onActionCallback((action, value) =>
        this.handleAction(action, value)
      );
      this.touch.onMovementCallback((vec) => this.handleMovement(vec));
    }

    if (config.enableGamepad !== false) {
      this.gamepad = new GamepadInput();
      this.gamepad.onActionCallback((action, value) =>
        this.handleAction(action, value)
      );
      this.gamepad.onMovementCallback((vec) => this.handleMovement(vec));
    }

    // Set active profiles
    const activeProfiles =
      config.activeProfiles || this.getDefaultProfiles();
    activeProfiles.forEach((p) => this.activateProfile(p));
  }

  /**
   * Check if device supports touch.
   * 
   * @private
   * @returns {boolean} True if touch is supported
   */
  private isTouchDevice(): boolean {
    return (
      window.matchMedia('(pointer:coarse)').matches ||
      navigator.maxTouchPoints > 0
    );
  }

  /**
   * Get default profiles for current platform.
   * 
   * @private
   * @returns {ControlProfileType[]} Default profiles
   */
  private getDefaultProfiles(): ControlProfileType[] {
    if (this.isTouchDevice()) {
      return [ControlProfileType.MOBILE, ControlProfileType.GAMEPAD];
    }
    return [ControlProfileType.PC, ControlProfileType.GAMEPAD];
  }

  /**
   * Register a control profile.
   * 
   * @param {ControlProfile} profile - Profile to register
   */
  registerProfile(profile: ControlProfile): void {
    this.profiles.set(profile.type, profile);
  }

  /**
   * Activate a control profile.
   * 
   * @param {ControlProfileType} type - Profile type
   * @returns {boolean} True if activated
   */
  activateProfile(type: ControlProfileType): boolean {
    const profile = this.profiles.get(type);
    if (!profile) return false;
    profile.enable();
    this.activeProfiles.add(type);
    return true;
  }

  /**
   * Deactivate a control profile.
   * 
   * @param {ControlProfileType} type - Profile type
   * @returns {boolean} True if deactivated
   */
  deactivateProfile(type: ControlProfileType): boolean {
    const profile = this.profiles.get(type);
    if (!profile) return false;
    profile.disable();
    this.activeProfiles.delete(type);
    return true;
  }

  /**
   * Check if profile is active.
   * 
   * @param {ControlProfileType} type - Profile type
   * @returns {boolean} True if active
   */
  isProfileActive(type: ControlProfileType): boolean {
    return this.activeProfiles.has(type);
  }

  /**
   * Register action listener.
   * 
   * @param {GameAction} action - Action to listen for
   * @param {Function} callback - Callback when action occurs
   */
  on(action: GameAction, callback: (state: ActionState) => void): void {
    if (!this.actionListeners.has(action)) {
      this.actionListeners.set(action, new Set());
    }
    this.actionListeners.get(action)!.add(callback);
  }

  /**
   * Unregister action listener.
   * 
   * @param {GameAction} action - Action to stop listening
   * @param {Function} callback - Callback to remove
   */
  off(action: GameAction, callback: (state: ActionState) => void): void {
    const listeners = this.actionListeners.get(action);
    if (listeners) listeners.delete(callback);
  }

  /**
   * Emit action to all listeners.
   * 
   * @private
   * @param {GameAction} action - Action to emit
   * @param {number} value - Action value (0-1)
   */
  private handleAction(action: string, value: number): void {
    if (!this.enabled) return;
    const listeners = this.actionListeners.get(action as GameAction);
    if (!listeners) return;

    const state: ActionState = {
      action: action as GameAction,
      pressed: value > 0.5,
      value,
      delta: 0, // TODO: track delta between frames
    };

    listeners.forEach((callback) => callback(state));
  }

  /**
   * Handle movement input (joystick/sticks).
   * Internal routing for movement vectors.
   * 
   * @private
   * @param {Object} vec - Movement vector
   */
  private handleMovement(vec: { x: number; y: number }): void {
    if (!this.enabled) return;
    // Movement is broadcast via separate system
    // This can be extended with a movement event bus
  }

  /**
   * Enable input processing.
   */
  enable(): void {
    this.enabled = true;
  }

  /**
   * Disable input processing.
   */
  disable(): void {
    this.enabled = false;
  }

  /**
   * Check if input manager is enabled.
   * 
   * @returns {boolean} True if enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Get current movement vector (from touch joystick or gamepad).
   * 
   * @returns {Object} Movement vector or null if no movement
   */
  getMovementVector(): { x: number; y: number } | null {
    if (this.touch && this.activeProfiles.has(ControlProfileType.MOBILE)) {
      const vec = this.touch.getJoystickVector();
      if (vec.x !== 0 || vec.y !== 0) return vec;
    }

    // TODO: Get gamepad movement vector

    return null;
  }

  /**
   * Dispose all input handlers.
   */
  dispose(): void {
    this.keyboardMouse?.dispose();
    this.touch?.dispose();
    this.gamepad?.dispose();
    this.actionListeners.clear();
  }
}
