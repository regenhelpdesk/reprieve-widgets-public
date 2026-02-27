/**
 * Defines the type of input for a command argument
 */
export type ArgumentType = 'text' | 'number' | 'select' | 'boolean';

/**
 * Defines a single argument for a command
 */
export interface ArgumentDef {
  /** Argument identifier/code (e.g., 'd', 'm', 'YY') */
  name: string;
  /** Display label (e.g., 'Day', 'Month', 'Year') */
  label: string;
  /** Input type for the argument */
  type: ArgumentType;
  /** Available options for select type */
  options?: string[];
  /** Whether this argument is required */
  required: boolean;
  /** Placeholder text for text/number inputs */
  placeholder?: string;
  /** Min value for number inputs */
  min?: number;
  /** Max value for number inputs */
  max?: number;
}

/**
 * Command category type based on Manufacturing Port Specification:
 * - normal: Commands that can be sent at any time
 * - test: Test Mode Commands (section 1.1.1) — require 'te 1' to be sent first
 */
export type CommandCategory = 'normal' | 'test';

/**
 * Defines a command that can be sent to a device
 */
export interface CommandDefinition {
  /** Command code (e.g., 'csd', 'cst', 'pad') */
  code: string;
  /** Short name/title for the command */
  name: string;
  /** Full description of what the command does */
  description: string;
  /** Category: normal or test (test commands require 'te 1' first) */
  category: CommandCategory;
  /** Arguments this command accepts */
  arguments: ArgumentDef[];
}
