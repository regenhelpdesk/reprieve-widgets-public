import { Component, Input, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  CommandDefinition,
  CommandInstance,
  Device,
  COMMAND_DEFINITIONS,
  createCommandInstance,
  commandInstanceToString
} from './models';
import { RemoteCommandWidgetConfig } from './remote-command-config';
import { RemoteCommandService } from './remote-command.service';
import { MatrixApiService } from '../services/matrix-api.service';

@Component({
  selector: 'widget-remote-command',
  templateUrl: './remote-command.component.html',
  styleUrls: ['./remote-command.component.css']
})
export class RemoteCommandComponent implements OnInit {
  @Input() config: RemoteCommandWidgetConfig;

  // Device selection
  availableDevices: Device[] = [];
  selectedDeviceIds: Set<string> = new Set();
  loadingDevices: boolean = false;

  // Command definitions (all available commands)
  commandDefinitions: CommandDefinition[] = COMMAND_DEFINITIONS;
  normalCommands: CommandDefinition[] = [];
  testCommands: CommandDefinition[] = [];

  // Command queue (commands to send)
  commandQueue: CommandInstance[] = [];

  // Search/filter state
  searchTerm: string = '';
  filteredNormalCommands: CommandDefinition[] = [];
  filteredTestCommands: CommandDefinition[] = [];
  showCommandDropdown: boolean = false;

  // UI state
  sending: boolean = false;
  lastSendResult: { success: boolean; message: string } | null = null;

  // Config validation
  configValid: boolean = false;
  missingConfig: string[] = [];

  constructor(
    private remoteCommandService: RemoteCommandService,
    private matrixApiService: MatrixApiService
  ) {}

  async ngOnInit(): Promise<void> {
    // Validate configuration first
    this.validateConfig();

    if (!this.configValid) {
      // Don't proceed if config is invalid
      return;
    }

    // Separate commands by category
    this.normalCommands = this.commandDefinitions.filter(cmd => cmd.category === 'normal');
    this.testCommands = this.commandDefinitions.filter(cmd => cmd.category === 'test');

    // Initialize filtered lists
    this.filterCommands();

    // Load devices
    await this.loadDevices();
  }

  /**
   * Validates that all required configuration is present
   */
  private validateConfig(): void {
    this.missingConfig = [];

    if (!this.config) {
      this.missingConfig.push('config object');
      this.configValid = false;
      return;
    }

    if (!this.config.widgetConfig) {
      this.missingConfig.push('widgetConfig');
      this.configValid = false;
      return;
    }

    // Check required fields
    if (!this.config.widgetConfig.deviceId) {
      this.missingConfig.push('widgetConfig.deviceId - Reprieve device data model ID');
    }

    this.configValid = this.missingConfig.length === 0;
  }

  /**
   * Loads devices from the API
   */
  private async loadDevices(): Promise<void> {
    // Fetch from API if deviceId is configured
    if (!this.config?.widgetConfig?.deviceId) {
      console.warn('No deviceId configured in widget config. Cannot fetch devices.');
      this.availableDevices = [];
      return;
    }

    this.loadingDevices = true;
    try {
      this.availableDevices = await this.matrixApiService.fetchDevicesForWidget(
        this.config.widgetConfig.deviceId
      );
    } catch (error) {
      console.error('Failed to load devices:', error);
      this.availableDevices = [];
    } finally {
      this.loadingDevices = false;
    }
  }

  // ==================== Device Selection ====================

  isDeviceSelected(device: Device): boolean {
    return this.selectedDeviceIds.has(device.deviceInstanceId);
  }

  toggleDeviceSelection(device: Device): void {
    if (this.selectedDeviceIds.has(device.deviceInstanceId)) {
      this.selectedDeviceIds.delete(device.deviceInstanceId);
    } else {
      this.selectedDeviceIds.add(device.deviceInstanceId);
    }
  }

  getSelectedDeviceCount(): number {
    return this.selectedDeviceIds.size;
  }

  // ==================== Command Search/Filter ====================

  filterCommands(): void {
    const term = this.searchTerm.toLowerCase().trim();

    const filterFn = (cmd: CommandDefinition) =>
      cmd.code.toLowerCase().includes(term) ||
      cmd.name.toLowerCase().includes(term) ||
      cmd.description.toLowerCase().includes(term);

    if (!term) {
      this.filteredNormalCommands = [...this.normalCommands];
      this.filteredTestCommands = [...this.testCommands];
    } else {
      this.filteredNormalCommands = this.normalCommands.filter(filterFn);
      this.filteredTestCommands = this.testCommands.filter(filterFn);
    }
  }

  onSearchInput(): void {
    this.filterCommands();
  }

  toggleDropdown(): void {
    this.showCommandDropdown = !this.showCommandDropdown;
    if (this.showCommandDropdown) {
      this.filterCommands();
    }
  }

  closeDropdown(): void {
    this.showCommandDropdown = false;
  }

  // ==================== Command Queue Management ====================

  addCommand(definition: CommandDefinition): void {
    const instance = createCommandInstance(definition);
    this.commandQueue.push(instance);
    this.closeDropdown();
    this.searchTerm = '';
    this.filterCommands();
  }

  removeCommand(index: number): void {
    this.commandQueue.splice(index, 1);
  }

  onDrop(event: CdkDragDrop<CommandInstance[]>): void {
    moveItemInArray(this.commandQueue, event.previousIndex, event.currentIndex);
  }

  getArgumentDescription(definition: CommandDefinition): string {
    if (definition.arguments.length === 0) {
      return 'No arguments';
    }
    return 'Arguments: ' + definition.arguments.map(arg => {
      if (arg.type === 'select' && arg.options) {
        return `${arg.name} (${arg.options.join('|')})`;
      }
      return arg.name;
    }).join(', ');
  }

  // ==================== Building Command String ====================

  buildCommandString(): string {
    return this.commandQueue.map(instance => commandInstanceToString(instance)).join('|');
  }

  // ==================== Send Commands ====================

  async sendCommands(): Promise<void> {
    if (this.commandQueue.length === 0) {
      this.lastSendResult = { success: false, message: 'No commands to send' };
      return;
    }

    if (this.selectedDeviceIds.size === 0) {
      this.lastSendResult = { success: false, message: 'No devices selected' };
      return;
    }

    this.sending = true;
    this.lastSendResult = null;

    const commandString = this.buildCommandString();
    const selectedDevices = this.availableDevices.filter(d => this.selectedDeviceIds.has(d.deviceInstanceId));

    try {
      const results = await this.remoteCommandService.sendCommandsToDevices(
        this.config,
        selectedDevices,
        commandString
      );

      const successCount = results.filter(r => r.success).length;
      const failCount = results.length - successCount;

      if (failCount === 0) {
        this.lastSendResult = {
          success: true,
          message: `Commands sent successfully to ${successCount} device(s)`
        };
      } else {
        this.lastSendResult = {
          success: false,
          message: `Sent to ${successCount} device(s), failed for ${failCount} device(s)`
        };
      }
    } catch (error) {
      this.lastSendResult = {
        success: false,
        message: 'Error sending commands: ' + (error as Error).message
      };
    } finally {
      this.sending = false;
    }
  }

  // ==================== Validation ====================

  canSend(): boolean {
    return this.commandQueue.length > 0 &&
           this.selectedDeviceIds.size > 0 &&
           !this.sending &&
           this.areAllArgumentsValid();
  }

  areAllArgumentsValid(): boolean {
    for (const instance of this.commandQueue) {
      for (const arg of instance.definition.arguments) {
        if (arg.required) {
          const value = instance.argumentValues[arg.name];
          if (value === undefined || value === null || value === '') {
            return false;
          }
        }
      }
    }
    return true;
  }
}
