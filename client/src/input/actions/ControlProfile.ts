import { GameAction } from './ActionMap';

/**
 * Control profile types for different platforms.
 * Each profile maps physical inputs to abstract actions.
 */
export enum ControlProfileType {
  PC = 'pc',
  MOBILE = 'mobile',
  GAMEPAD = 'gamepad',
  CONSOLE = 'console',
}

/**
 * Profile configuration for a specific input device type.
 * 
 * @class ControlProfile
 */
export class ControlProfile {
  type: ControlProfileType;
  name: string;
  description: string;
  enabled: boolean;
  priority: number; // Higher priority = checked first

  /**
   * Creates a new control profile.
   * 
   * @param {ControlProfileType} type - Profile type
   * @param {string} name - Human-readable name
   * @param {string} description - Profile description
   * @param {number} priority - Execution priority (higher = earlier)
   */
  constructor(
    type: ControlProfileType,
    name: string,
    description: string,
    priority: number = 0
  ) {
    this.type = type;
    this.name = name;
    this.description = description;
    this.enabled = true;
    this.priority = priority;
  }

  /**
   * Enable this control profile.
   */
  enable(): void {
    this.enabled = true;
  }

  /**
   * Disable this control profile.
   */
  disable(): void {
    this.enabled = false;
  }
}

/**
 * Default control profiles for common platforms.
 */
export const DEFAULT_PROFILES = {
  PC: new ControlProfile(
    ControlProfileType.PC,
    'PC Controls',
    'Keyboard + Mouse',
    100
  ),
  MOBILE: new ControlProfile(
    ControlProfileType.MOBILE,
    'Mobile Controls',
    'Touch virtual joystick + buttons',
    90
  ),
  GAMEPAD: new ControlProfile(
    ControlProfileType.GAMEPAD,
    'Gamepad Controls',
    'Bluetooth / USB gamepad',
    95
  ),
  CONSOLE: new ControlProfile(
    ControlProfileType.CONSOLE,
    'Console Controls',
    'Console controller support',
    80
  ),
};
