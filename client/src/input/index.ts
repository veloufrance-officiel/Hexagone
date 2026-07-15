/**
 * Input system module.
 * Provides cross-platform input handling for all devices.
 */

export { InputManager } from './InputManager';

// Actions
export {
  MovementAction,
  CameraAction,
  PlayerAction,
  VehicleAction,
  UIAction,
  type GameAction,
  type ActionState,
} from './actions/ActionMap';

// Control profiles
export {
  ControlProfile,
  ControlProfileType,
  DEFAULT_PROFILES,
} from './actions/ControlProfile';

// Input devices
export { KeyboardMouseInput } from './devices/KeyboardMouseInput';
export { TouchInput } from './devices/TouchInput';
export { GamepadInput } from './devices/GamepadInput';
