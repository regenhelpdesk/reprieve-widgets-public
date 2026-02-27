import { CommandDefinition } from './command-definition';

/**
 * Represents an instance of a command with filled-in argument values.
 * This is what gets added to the command queue.
 */
export interface CommandInstance {
  /** Unique ID for this instance (for drag/drop tracking) */
  id: string;
  /** The command definition this instance is based on */
  definition: CommandDefinition;
  /** Filled-in argument values keyed by argument name */
  argumentValues: Record<string, string | number | boolean>;
}

/**
 * Creates a new command instance with default/empty argument values
 */
export function createCommandInstance(definition: CommandDefinition): CommandInstance {
  const argumentValues: Record<string, string | number | boolean> = {};

  for (const arg of definition.arguments) {
    if (arg.type === 'boolean') {
      argumentValues[arg.name] = false;
    } else if (arg.type === 'select' && arg.options && arg.options.length > 0) {
      argumentValues[arg.name] = arg.options[0];
    } else if (arg.type === 'number') {
      argumentValues[arg.name] = arg.min ?? 0;
    } else {
      argumentValues[arg.name] = '';
    }
  }

  return {
    id: generateUniqueId(),
    definition,
    argumentValues
  };
}

/**
 * Converts a command instance to its string representation for sending
 * Format: "code arg1 arg2 arg3"
 */
export function commandInstanceToString(instance: CommandInstance): string {
  const parts = [instance.definition.code];

  for (const arg of instance.definition.arguments) {
    const value = instance.argumentValues[arg.name];
    if (arg.type === 'boolean') {
      parts.push(value ? '1' : '0');
    } else {
      parts.push(String(value));
    }
  }

  return parts.join(' ');
}

/**
 * Generates a unique ID for command instances
 */
function generateUniqueId(): string {
  return `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
