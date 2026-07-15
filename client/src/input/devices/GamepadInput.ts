import {
  MovementAction,
  CameraAction,
  PlayerAction,
  VehicleAction,
  UIAction,
} from '../actions/ActionMap';

/**
 * Gamepad / Bluetooth controller input handler.
 * Maps standard gamepad inputs to gameplay actions.
 * 
 * Standard gamepad layout:
 * - Left stick: Movement
 * - Right stick: Camera (future)
 * - Buttons: A/Cross, B/Circle, X/Square, Y/Triangle
 * - Triggers: LT/L2 (brake), RT/R2 (accelerate)
 * - Bumpers: LB/L1, RB/R1
 * 
 * @class GamepadInput
 */
export class GamepadInput {
  private gamepads: Map<number, Gamepad | null> = new Map();
  private prevState: Map<number, GamepadState> = new Map();
  private onAction: ((action: string, value: number) => void) | null = null;
  private onMovement: ((vec: { x: number; y: number }) => void) | null = null;
  private pollingInterval: number | null = null;
  private readonly DEADZONE = 0.12;

  /**
   * Creates a new GamepadInput instance.
   */
  constructor() {
    this.startPolling();
    window.addEventListener('gamepadconnected', (e) => this.onGamepadConnected(e));
    window.addEventListener('gamepaddisconnected', (e) =>
      this.onGamepadDisconnected(e)
    );
  }

  /**
   * Start polling for gamepad updates.
   * 
   * @private
   */
  private startPolling(): void {
    this.pollingInterval = window.setInterval(() => {
      this.updateGamepads();
    }, 16); // ~60fps polling
  }

  /**
   * Handle gamepad connected event.
   * 
   * @private
   * @param {GamepadEvent} event - Gamepad event
   */
  private onGamepadConnected(event: GamepadEvent): void {
    const gamepad = event.gamepad;
    this.gamepads.set(gamepad.index, gamepad);
    console.log(`Gamepad connected: ${gamepad.id}`);
  }

  /**
   * Handle gamepad disconnected event.
   * 
   * @private
   * @param {GamepadEvent} event - Gamepad event
   */
  private onGamepadDisconnected(event: GamepadEvent): void {
    this.gamepads.delete(event.gamepad.index);
    this.prevState.delete(event.gamepad.index);
    console.log(`Gamepad disconnected: ${event.gamepad.id}`);
  }

  /**
   * Update gamepad states and emit actions.
   * 
   * @private
   */
  private updateGamepads(): void {
    const gamepads = navigator.getGamepads();

    for (let i = 0; i < gamepads.length; i++) {
      const gamepad = gamepads[i];
      if (!gamepad) continue;

      const currentState = this.parseGamepadState(gamepad);
      const prevState = this.prevState.get(i) || this.getEmptyState();

      this.processGamepadState(currentState, prevState, i);
      this.prevState.set(i, currentState);
    }
  }

  /**
   * Parse gamepad state.
   * 
   * @private
   * @param {Gamepad} gamepad - Gamepad object
   * @returns {GamepadState} Parsed state
   */
  private parseGamepadState(gamepad: Gamepad): GamepadState {
    const axes = gamepad.axes;
    const buttons = gamepad.buttons;

    return {
      // Left stick (movement)
      leftStickX: Math.abs(axes[0]) > this.DEADZONE ? axes[0] : 0,
      leftStickY: Math.abs(axes[1]) > this.DEADZONE ? axes[1] : 0,

      // Right stick (camera - future)
      rightStickX: Math.abs(axes[2]) > this.DEADZONE ? axes[2] : 0,
      rightStickY: Math.abs(axes[3]) > this.DEADZONE ? axes[3] : 0,

      // Buttons (standard layout)
      buttonA: buttons[0]?.pressed ?? false,
      buttonB: buttons[1]?.pressed ?? false,
      buttonX: buttons[2]?.pressed ?? false,
      buttonY: buttons[3]?.pressed ?? false,

      // Bumpers
      buttonLB: buttons[4]?.pressed ?? false,
      buttonRB: buttons[5]?.pressed ?? false,

      // Triggers
      triggerLT: buttons[6]?.value ?? 0,
      triggerRT: buttons[7]?.value ?? 0,

      // Center buttons
      buttonBack: buttons[8]?.pressed ?? false,
      buttonStart: buttons[9]?.pressed ?? false,

      // Stick buttons (L3, R3)
      buttonLeftStick: buttons[10]?.pressed ?? false,
      buttonRightStick: buttons[11]?.pressed ?? false,

      // Guide/Home button
      buttonGuide: buttons[12]?.pressed ?? false,
    };
  }

  /**
   * Process gamepad state changes and emit actions.
   * 
   * @private
   * @param {GamepadState} current - Current state
   * @param {GamepadState} prev - Previous state
   * @param {number} gamepadIndex - Gamepad index
   */
  private processGamepadState(
    current: GamepadState,
    prev: GamepadState,
    gamepadIndex: number
  ): void {
    if (!this.onAction) return;

    // Left stick movement
    if (current.leftStickX !== 0 || current.leftStickY !== 0) {
      if (this.onMovement) {
        this.onMovement({
          x: current.leftStickX,
          y: current.leftStickY,
        });
      }
    }

    // Button actions (on press)
    if (current.buttonA && !prev.buttonA) {
      this.onAction(PlayerAction.Jump, 1);
    }
    if (current.buttonX && !prev.buttonX) {
      this.onAction(PlayerAction.Interact, 1);
    }
    if (current.buttonY && !prev.buttonY) {
      this.onAction(PlayerAction.Attack, 1);
    }

    // Vehicle control
    if (current.buttonB && !prev.buttonB) {
      this.onAction(VehicleAction.ExitVehicle, 1);
    }

    // Bumpers for vehicle controls (alternative)
    if (current.buttonLB && !prev.buttonLB) {
      this.onAction(VehicleAction.SteerLeft, 1);
    }
    if (current.buttonRB && !prev.buttonRB) {
      this.onAction(VehicleAction.SteerRight, 1);
    }

    // Triggers for vehicle acceleration/braking
    if (current.triggerRT > 0.1) {
      this.onAction(VehicleAction.Accelerate, current.triggerRT);
    }
    if (current.triggerLT > 0.1) {
      this.onAction(VehicleAction.Brake, current.triggerLT);
    }

    // Menu buttons
    if (current.buttonStart && !prev.buttonStart) {
      this.onAction(UIAction.Pause, 1);
    }
    if (current.buttonBack && !prev.buttonBack) {
      this.onAction(UIAction.Cancel, 1);
    }
  }

  /**
   * Get empty gamepad state.
   * 
   * @private
   * @returns {GamepadState} Empty state
   */
  private getEmptyState(): GamepadState {
    return {
      leftStickX: 0,
      leftStickY: 0,
      rightStickX: 0,
      rightStickY: 0,
      buttonA: false,
      buttonB: false,
      buttonX: false,
      buttonY: false,
      buttonLB: false,
      buttonRB: false,
      triggerLT: 0,
      triggerRT: 0,
      buttonBack: false,
      buttonStart: false,
      buttonLeftStick: false,
      buttonRightStick: false,
      buttonGuide: false,
    };
  }

  /**
   * Register action callback.
   * 
   * @param {Function} callback - Action callback
   */
  onActionCallback(callback: (action: string, value: number) => void): void {
    this.onAction = callback;
  }

  /**
   * Register movement callback.
   * 
   * @param {Function} callback - Movement callback
   */
  onMovementCallback(
    callback: (vec: { x: number; y: number }) => void
  ): void {
    this.onMovement = callback;
  }

  /**
   * Get connected gamepads count.
   * 
   * @returns {number} Number of connected gamepads
   */
  getGamepadCount(): number {
    return navigator.getGamepads().length;
  }

  /**
   * Dispose gamepad input handler.
   */
  dispose(): void {
    if (this.pollingInterval !== null) {
      clearInterval(this.pollingInterval);
    }
    window.removeEventListener('gamepadconnected', (e) =>
      this.onGamepadConnected(e as GamepadEvent)
    );
    window.removeEventListener('gamepaddisconnected', (e) =>
      this.onGamepadDisconnected(e as GamepadEvent)
    );
  }
}

/**
 * Internal gamepad state representation.
 * 
 * @interface GamepadState
 */
interface GamepadState {
  // Analog sticks
  leftStickX: number;
  leftStickY: number;
  rightStickX: number;
  rightStickY: number;

  // Face buttons
  buttonA: boolean;
  buttonB: boolean;
  buttonX: boolean;
  buttonY: boolean;

  // Shoulder buttons
  buttonLB: boolean;
  buttonRB: boolean;

  // Triggers
  triggerLT: number;
  triggerRT: number;

  // Center buttons
  buttonBack: boolean;
  buttonStart: boolean;

  // Stick click buttons
  buttonLeftStick: boolean;
  buttonRightStick: boolean;

  // Guide/Home
  buttonGuide: boolean;
}
