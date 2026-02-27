import { CommandDefinition, CommandCategory } from './command-definition';

/**
 * Command definitions from Manufacturing Port Specification (096-01-D0030)
 * Order matches the PDF document.
 *
 * Categories:
 * - normal: Commands that can be sent at any time
 * - test: Test Mode Commands (section 1.1.1) — require 'te 1' to be sent first
 */
export const COMMAND_DEFINITIONS: CommandDefinition[] = [
  // ==================== NORMAL COMMANDS ====================

  // {
  //   code: 'a',
  //   name: 'Print Analog Values',
  //   description: 'Print all Analog Values (Feedback_A, Feedback_B, 24VDC)',
  //   category: 'normal',
  //   arguments: []
  // },
  // {
  //   code: 'cr',
  //   name: 'Print Date/Time',
  //   description: 'Print device Date and Time',
  //   category: 'normal',
  //   arguments: []
  // },
  // {
  //   code: 'gc',
  //   name: 'Print Calibration Settings',
  //   description: 'Show all calibration settings: PadA High, Setpoint, Low; PadB High, Setpoint, Low (if second pad exists)',
  //   category: 'normal',
  //   arguments: []
  // },
  // {
  //   code: 'gs',
  //   name: 'Print Device Settings',
  //   description: 'Print all device settings: Serial Number, Device Mode, Pad count, Pulse duration/rate, Sham mode, Device Type',
  //   category: 'normal',
  //   arguments: []
  // },
  // {
  //   code: 'gv',
  //   name: 'Print Firmware Version',
  //   description: 'Print Firmware version numbers',
  //   category: 'normal',
  //   arguments: []
  // },
  // {
  //   code: 'mtc',
  //   name: 'Print Treatment Count',
  //   description: 'Report count of available Treatment Sessions in history',
  //   category: 'normal',
  //   arguments: []
  // },
  {
    code: 'mtoa',
    name: 'Offload Treatment Records',
    description: 'Offload all treatment session records',
    category: 'normal',
    arguments: []
  },
  {
    code: 'su',
    name: 'Set User Power-on',
    description: 'Enable/Disable User Power-on. When enabled, at power up the Reprieve60 unit will clear the Set Future',
    category: 'normal',
    arguments: [
      { name: 'enabled', label: 'Enabled', type: 'boolean', required: true }
    ]
  },
  {
    code: 'te',
    name: 'Enter/Exit Test Mode',
    description: 'Enter or Exit Test Mode. Must be enabled before using test mode commands',
    category: 'normal',
    arguments: [
      { name: 'enabled', label: 'Enter Test Mode', type: 'boolean', required: true }
    ]
  },
  {
    code: 'tm',
    name: 'Set Monitor Port Lock',
    description: 'Enable/Disable Monitor Port Lock. When locked open, monitor port remains active between power cycles',
    category: 'normal',
    arguments: [
      { name: 'enabled', label: 'Enabled', type: 'boolean', required: true }
    ]
  },
  {
    code: 'ur',
    name: 'Request Firmware Update',
    description: 'Firmware Update request. Activates flag signaling bootloader that firmware update is requested, then reboots',
    category: 'normal',
    arguments: []
  },
  {
    code: 'uv',
    name: 'Verify Firmware Update',
    description: 'Firmware Update verified. Sets flag indicating to bootloader that application has been verified',
    category: 'normal',
    arguments: []
  },
  {
    code: 'v',
    name: 'Set Verification Reporting',
    description: 'Enable/Disable Verification reporting category: 1=Analog, 2=Button, 3=NONE, 4=Display, 5=History, 6=RTC, 7=Settings, 8=Treatment, 9=General',
    category: 'normal',
    arguments: [
      { name: 'category', label: 'Category', type: 'select', required: true, options: ['1', '2', '3', '4', '5', '6', '7', '8', '9'] },
      { name: 'enabled', label: 'Enabled', type: 'boolean', required: true }
    ]
  },

  // ==================== TEST MODE COMMANDS (section 1.1.1) ====================
  // These commands require 'te 1' to be sent first.

  {
    code: 'csd',
    name: 'Set Device Date',
    description: 'Set device Date. Set the date before setting the time. Values are INT, do not start with 0',
    category: 'test',
    arguments: [
      { name: 'd', label: 'Day', type: 'number', required: true, placeholder: '1-31', min: 1, max: 31 },
      { name: 'm', label: 'Month', type: 'number', required: true, placeholder: '1-12', min: 1, max: 12 },
      { name: 'YY', label: 'Year', type: 'number', required: true, placeholder: '00-99', min: 0, max: 99 }
    ]
  },
  {
    code: 'cst',
    name: 'Set Device Time',
    description: 'Set device Time and write Date/Time to RTC. Values are INT, do not start with 0',
    category: 'test',
    arguments: [
      { name: 'H', label: 'Hour', type: 'number', required: true, placeholder: '0-23', min: 0, max: 23 },
      { name: 'm', label: 'Minute', type: 'number', required: true, placeholder: '0-59', min: 0, max: 59 },
      { name: 's', label: 'Second', type: 'number', required: true, placeholder: '0-59', min: 0, max: 59 }
    ]
  },
  {
    code: 'pad',
    name: 'Set Pad RF',
    description: 'Enable or disable applicator pad RF. Enabling pad will cause setpoint seeking control to operate',
    category: 'test',
    arguments: [
      { name: 'pad', label: 'Pad', type: 'select', required: true, options: ['a', 'b'] },
      { name: 'enabled', label: 'Enabled', type: 'boolean', required: true }
    ]
  },
  {
    code: 'h',
    name: 'Set Pad Calibration',
    description: 'Set the applicator pad Low, Setpoint or High Limit to the entered value',
    category: 'test',
    arguments: [
      { name: 'pad', label: 'Pad', type: 'select', required: true, options: ['a', 'b'] },
      { name: 'limit', label: 'Limit Type', type: 'select', required: true, options: ['l', 's', 'h'] },
      { name: 'value', label: 'Value', type: 'number', required: true, placeholder: '0-1023', min: 0, max: 1023 }
    ]
  },
  {
    code: 'jt',
    name: 'Force Audible Tone',
    description: 'Force audible tone (1-6)',
    category: 'test',
    arguments: [
      { name: 'tone', label: 'Tone', type: 'number', required: true, placeholder: '1-6', min: 1, max: 6 }
    ]
  },
  {
    code: 'jv',
    name: 'Force Audible Volume',
    description: 'Force audible volume: 0=Off, 1=Low, 2=Med, 3=High',
    category: 'test',
    arguments: [
      { name: 'volume', label: 'Volume', type: 'select', required: true, options: ['0', '1', '2', '3'] }
    ]
  },
  {
    code: 'pb',
    name: 'Force Display Power',
    description: 'Force Display Power ON/OFF',
    category: 'test',
    arguments: [
      { name: 'enabled', label: 'Power On', type: 'boolean', required: true }
    ]
  },
  {
    code: 'rh',
    name: 'Reset History',
    description: 'Clear History records',
    category: 'test',
    arguments: []
  },
  {
    code: 'rf',
    name: 'Reset Factory',
    description: 'Clear all: History, Settings, Date/Time',
    category: 'test',
    arguments: []
  },
  {
    code: 'rs',
    name: 'Reset Settings',
    description: 'Reset Settings/NV Data - Clear all configuration/calibration',
    category: 'test',
    arguments: []
  },
  {
    code: 'sa',
    name: 'Set Days Active',
    description: 'Set the number of operating days for Reprieve60 model operation. Used to calculate end date for treatment',
    category: 'test',
    arguments: [
      { name: 'days', label: 'Days', type: 'number', required: true, placeholder: '1-60', min: 1, max: 60 }
    ]
  },
  {
    code: 'sc',
    name: 'Set Pad Count',
    description: 'Set expected count of connected applicator pads. Changing this clears calibration values',
    category: 'test',
    arguments: [
      { name: 'count', label: 'Count', type: 'number', required: true, placeholder: '0-2', min: 0, max: 2 }
    ]
  },
  {
    code: 'sl',
    name: 'Set RF Power Limit',
    description: 'Limit on RF Power (DAC) setting in Continuous Wave mode. Default 530. Caution: Higher values may damage device',
    category: 'test',
    arguments: [
      { name: 'limit', label: 'Limit', type: 'number', required: true, placeholder: '0-1023', min: 0, max: 1023 }
    ]
  },
  {
    code: 'sn',
    name: 'Set Serial Number',
    description: 'Set serial number (up to 12 characters)',
    category: 'test',
    arguments: [
      { name: 'serial', label: 'Serial Number', type: 'text', required: true, placeholder: 'Up to 12 chars' }
    ]
  },
  {
    code: 'sm',
    name: 'Set Device Mode',
    description: 'Set device mode: Continuous Wave or Pulsed Wave. Changing this clears calibration values',
    category: 'test',
    arguments: [
      { name: 'mode', label: 'Mode', type: 'select', required: true, options: ['c', 'p'] }
    ]
  },
  {
    code: 'sh',
    name: 'Set SHAM Mode',
    description: 'Enable or disable SHAM mode',
    category: 'test',
    arguments: [
      { name: 'enabled', label: 'Enabled', type: 'boolean', required: true }
    ]
  },
  {
    code: 'sp',
    name: 'Set Pulse Duration',
    description: 'Set pulse duration in microseconds (20-100 uS). Changing this clears calibration values',
    category: 'test',
    arguments: [
      { name: 'duration', label: 'Duration (uS)', type: 'number', required: true, placeholder: '20-100', min: 20, max: 100 }
    ]
  },
  {
    code: 'sr',
    name: 'Set Pulse Frequency',
    description: 'Set pulse recurrence frequency (200-1000 Hz). Changing this clears calibration values',
    category: 'test',
    arguments: [
      { name: 'frequency', label: 'Frequency (Hz)', type: 'number', required: true, placeholder: '200-1000', min: 200, max: 1000 }
    ]
  },
  {
    code: 'st',
    name: 'Set Device Type',
    description: 'Set Device Type: r=Reprieve, c=Reprieve60 (CCA60).',
    category: 'test',
    arguments: [
      { name: 'type', label: 'Type', type: 'select', required: true, options: ['r', 'c'] }
    ]
  },
  {
    code: 'sf',
    name: 'Set RF Pattern',
    description: 'Enable or disable RF pattern',
    category: 'test',
    arguments: [
      { name: 'enabled', label: 'Enabled', type: 'boolean', required: true }
    ]
  },
  {
    code: 'w',
    name: 'Watchdog Test',
    description: 'Trigger watchdog test',
    category: 'test',
    arguments: []
  }
];

/**
 * Returns commands filtered by category
 */
export function getCommandsByCategory(category: CommandCategory): CommandDefinition[] {
  return COMMAND_DEFINITIONS.filter(cmd => cmd.category === category);
}

/**
 * Returns normal commands (can be sent at any time)
 */
export function getNormalCommands(): CommandDefinition[] {
  return getCommandsByCategory('normal');
}

/**
 * Returns test mode commands (require 'te 1' first)
 */
export function getTestCommands(): CommandDefinition[] {
  return getCommandsByCategory('test');
}

/**
 * Finds a command by its code
 */
export function findCommandByCode(code: string): CommandDefinition | undefined {
  return COMMAND_DEFINITIONS.find(cmd => cmd.code === code);
}
