/**
 * Represents a device that can receive commands
 */
export interface Device {
  /** Unique device identifier */
  deviceInstanceId: string;
  /** Device identifier (serial number) */
  identifier: string;
}
