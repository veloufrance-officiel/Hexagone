/**
 * Abstract gameplay actions.
 * All input devices must map to these actions.
 * Decouples input devices from gameplay logic.
 */

/**
 * Movement actions
 */
export enum MovementAction {
  MoveForward = 'move:forward',
  MoveBackward = 'move:backward',
  MoveLeft = 'move:left',
  MoveRight = 'move:right',
  Sprint = 'move:sprint',
}

/**
 * Camera/Look actions
 */
export enum CameraAction {
  LookHorizontal = 'camera:look-h',
  LookVertical = 'camera:look-v',
}

/**
 * Player action attacks/interactions
 */
export enum PlayerAction {
  Jump = 'player:jump',
  Interact = 'player:interact',
  Attack = 'player:attack',
}

/**
 * Vehicle control actions
 */
export enum VehicleAction {
  EnterVehicle = 'vehicle:enter',
  ExitVehicle = 'vehicle:exit',
  Accelerate = 'vehicle:accelerate',
  Brake = 'vehicle:brake',
  SteerLeft = 'vehicle:steer-left',
  SteerRight = 'vehicle:steer-right',
}

/**
 * UI/Menu actions
 */
export enum UIAction {
  OpenInventory = 'ui:inventory',
  OpenMap = 'ui:map',
  OpenPhone = 'ui:phone',
  Pause = 'ui:pause',
  Cancel = 'ui:cancel',
}

/**
 * All possible actions in the game
 */
export type GameAction =
  | MovementAction
  | CameraAction
  | PlayerAction
  | VehicleAction
  | UIAction;

/**
 * Action state: can be binary (pressed/released) or analog (0-1)
 */
export interface ActionState {
  action: GameAction;
  pressed: boolean;
  value: number; // 0-1 for analog inputs
  delta: number; // change since last frame
}
