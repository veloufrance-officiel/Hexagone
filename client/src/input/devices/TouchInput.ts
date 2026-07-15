import {
  MovementAction,
  PlayerAction,
  VehicleAction,
} from '../actions/ActionMap';

/**
 * Touch input handler for mobile platforms.
 * Implements virtual joystick + contextual buttons.
 * 
 * Legacy behavior from city-fixed.html:
 * - Virtual joystick: driveJoyBase / driveJoyStick
 * - Buttons: tri (jump), carre (interact), rond (attack), croix (vehicle)
 * 
 * @class TouchInput
 */
export class TouchInput {
  private joystickBase: HTMLElement | null;
  private joystickStick: HTMLElement | null;
  private buttons: Map<string, HTMLElement>;
  private joystickActive: number | null = null;
  private joystickVec: { x: number; y: number } = { x: 0, y: 0 };
  private maxRadius: number = 40;
  private onAction: ((action: string, value: number) => void) | null = null;
  private onMovement: ((vec: { x: number; y: number }) => void) | null = null;

  /**
   * Creates a new TouchInput instance.
   * 
   * @param {Object} config - Configuration object
   * @param {string} [config.joystickBaseId='driveJoyBase'] - Base joystick element ID
   * @param {string} [config.joystickStickId='driveJoyStick'] - Stick joystick element ID
   * @param {Object} [config.buttonIds] - Button element IDs
   */
  constructor(config: {
    joystickBaseId?: string;
    joystickStickId?: string;
    buttonIds?: { [key: string]: string };
  } = {}) {
    this.joystickBase = document.getElementById(
      config.joystickBaseId || 'driveJoyBase'
    );
    this.joystickStick = document.getElementById(
      config.joystickStickId || 'driveJoyStick'
    );

    this.buttons = new Map();
    const buttonIds = config.buttonIds || {
      jump: 'tri',
      interact: 'carre',
      attack: 'rond',
      vehicle: 'croix',
    };

    for (const [action, id] of Object.entries(buttonIds)) {
      const el = document.getElementById(id);
      if (el) this.buttons.set(action, el);
    }

    this.setupJoystick();
    this.setupButtons();
  }

  /**
   * Setup virtual joystick pointer events.
   * 
   * @private
   */
  private setupJoystick(): void {
    if (!this.joystickBase) return;

    this.joystickBase.addEventListener('pointerdown', (e) =>
      this.onJoystickDown(e as PointerEvent)
    );
    this.joystickBase.addEventListener('pointermove', (e) =>
      this.onJoystickMove(e as PointerEvent)
    );
    this.joystickBase.addEventListener('pointerup', (e) =>
      this.onJoystickUp(e as PointerEvent)
    );
    this.joystickBase.addEventListener('pointercancel', (e) =>
      this.onJoystickCancel(e as PointerEvent)
    );
  }

  /**
   * Setup contextual buttons.
   * 
   * @private
   */
  private setupButtons(): void {
    const buttonActions: { [key: string]: string } = {
      jump: PlayerAction.Jump,
      interact: PlayerAction.Interact,
      attack: PlayerAction.Attack,
      vehicle: VehicleAction.EnterVehicle,
    };

    this.buttons.forEach((el, action) => {
      const gameAction = buttonActions[action] || action;

      const onPress = (e: Event) => {
        e.preventDefault();
        if (this.onAction) this.onAction(gameAction, 1);
        el.classList.add('active');
      };

      const onRelease = (e: Event) => {
        e.preventDefault();
        if (this.onAction) this.onAction(gameAction, 0);
        el.classList.remove('active');
      };

      el.addEventListener('touchstart', onPress, { passive: false });
      el.addEventListener('touchend', onRelease, { passive: false });
      el.addEventListener('touchcancel', onRelease, { passive: false });
      el.addEventListener('mousedown', onPress);
      el.addEventListener('mouseup', onRelease);
      el.addEventListener('mouseleave', onRelease);
    });
  }

  /**
   * Handle joystick pointer down.
   * 
   * @private
   * @param {PointerEvent} event - Pointer event
   */
  private onJoystickDown(event: PointerEvent): void {
    if (this.joystickActive !== null) return;
    event.preventDefault();

    this.joystickActive = event.pointerId;
    this.joystickBase?.setPointerCapture(event.pointerId);

    // Recalculate max radius based on actual element size
    if (this.joystickBase && this.joystickStick) {
      this.maxRadius =
        this.joystickBase.clientWidth / 2 -
        this.joystickStick.clientWidth / 2;
    }

    this.updateJoystickPosition(event);
  }

  /**
   * Handle joystick pointer move.
   * 
   * @private
   * @param {PointerEvent} event - Pointer event
   */
  private onJoystickMove(event: PointerEvent): void {
    if (event.pointerId !== this.joystickActive) return;
    event.preventDefault();
    this.updateJoystickPosition(event);
  }

  /**
   * Handle joystick pointer up.
   * 
   * @private
   * @param {PointerEvent} event - Pointer event
   */
  private onJoystickUp(event: PointerEvent): void {
    if (event.pointerId !== this.joystickActive) return;
    this.resetJoystick();
  }

  /**
   * Handle joystick pointer cancel.
   * 
   * @private
   * @param {PointerEvent} event - Pointer event
   */
  private onJoystickCancel(event: PointerEvent): void {
    if (event.pointerId !== this.joystickActive) return;
    this.resetJoystick();
  }

  /**
   * Update joystick position and emit movement action.
   * 
   * @private
   * @param {PointerEvent} event - Pointer event
   */
  private updateJoystickPosition(event: PointerEvent): void {
    if (!this.joystickBase || !this.joystickStick) return;

    const rect = this.joystickBase.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let dx = event.clientX - centerX;
    let dy = event.clientY - centerY;
    const dist = Math.hypot(dx, dy);

    if (dist > this.maxRadius) {
      dx = (dx / dist) * this.maxRadius;
      dy = (dy / dist) * this.maxRadius;
    }

    // Update stick visual position
    this.joystickStick.style.transform = `translate(${dx}px, ${dy}px)`;

    // Normalize to -1 to 1
    this.joystickVec.x = dx / this.maxRadius;
    this.joystickVec.y = dy / this.maxRadius;

    // Emit movement
    if (this.onMovement) {
      this.onMovement(this.joystickVec);
    }
  }

  /**
   * Reset joystick to center.
   * 
   * @private
   */
  private resetJoystick(): void {
    this.joystickActive = null;
    this.joystickVec = { x: 0, y: 0 };

    if (this.joystickStick) {
      this.joystickStick.style.transform = 'translate(0px, 0px)';
    }

    if (this.onMovement) {
      this.onMovement(this.joystickVec);
    }
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
   * Called when joystick moves.
   * 
   * @param {Function} callback - Movement callback
   */
  onMovementCallback(
    callback: (vec: { x: number; y: number }) => void
  ): void {
    this.onMovement = callback;
  }

  /**
   * Get current joystick vector.
   * 
   * @returns {Object} Vector with x and y components (-1 to 1)
   */
  getJoystickVector(): { x: number; y: number } {
    return { ...this.joystickVec };
  }

  /**
   * Dispose input handlers.
   */
  dispose(): void {
    this.buttons.clear();
  }
}
