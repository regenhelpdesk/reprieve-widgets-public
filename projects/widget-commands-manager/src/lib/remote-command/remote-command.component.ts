import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
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
export class RemoteCommandComponent implements OnInit, OnDestroy {
  @Input() config: RemoteCommandWidgetConfig;

  // Device autocomplete state
  deviceSearchTerm: string = '';
  deviceSuggestions: Device[] = [];
  showDeviceSuggestions: boolean = false;
  searchingDevices: boolean = false;
  selectedDevices: Device[] = [];
  private deviceSearch$ = new Subject<string>();
  private deviceSearchSub: Subscription;

  // Command definitions (all available commands)
  commandDefinitions: CommandDefinition[] = COMMAND_DEFINITIONS;
  normalCommands: CommandDefinition[] = [];
  testCommands: CommandDefinition[] = [];

  // Command queue (commands to send)
  readonly MAX_COMMANDS = 8;
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

  ngOnInit(): void {
    // Validate configuration first
    this.validateConfig();

    if (!this.configValid) {
      return;
    }

    // Separate commands by category
    this.normalCommands = this.commandDefinitions.filter(cmd => cmd.category === 'normal');
    this.testCommands = this.commandDefinitions.filter(cmd => cmd.category === 'test');

    // Initialize filtered lists
    this.filterCommands();

    // Set up debounced device search
    this.deviceSearchSub = this.deviceSearch$.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(async term => {
      if (term.length >= 2) {
        this.searchingDevices = true;
        try {
          const results = await this.matrixApiService.searchDevicesForWidget(
            this.config.widgetConfig.deviceId,
            term
          );
          this.deviceSuggestions = results;
          this.showDeviceSuggestions = true;
        } catch (error) {
          console.error('Device search failed:', error);
          this.deviceSuggestions = [];
        } finally {
          this.searchingDevices = false;
        }
      } else {
        this.deviceSuggestions = [];
        this.showDeviceSuggestions = false;
        this.searchingDevices = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.deviceSearchSub) {
      this.deviceSearchSub.unsubscribe();
    }
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
      this.missingConfig.push('widgetConfig.deviceId - Reprieve device Device ID');
    }
    if (!this.config.widgetConfig.commandDataModelId) {
      this.missingConfig.push('widgetConfig.commandDataModelId - Reprieve Remote Commands data model ID');
    }
    if (!this.config.widgetConfig.commandPropertySetId) {
      this.missingConfig.push('widgetConfig.commandPropertySetId - Reprieve Command(s) property set ID');
    }
    if (!this.config.widgetConfig.commandPropertyCode) {
      this.missingConfig.push('widgetConfig.commandPropertyCode - Reprieve Command(s) property code');
    }

    this.configValid = this.missingConfig.length === 0;
  }

  // ==================== Device Autocomplete ====================

  onDeviceSearchInput(): void {
    this.deviceSearch$.next(this.deviceSearchTerm);
  }

  onSearchBlur(): void {
    setTimeout(() => {
      this.showDeviceSuggestions = false;
    }, 150);
  }

  selectDevice(device: Device): void {
    if (this.isDeviceSelected(device)) {
      this.selectedDevices = this.selectedDevices.filter(
        d => d.deviceInstanceId !== device.deviceInstanceId
      );
    } else {
      this.selectedDevices.push(device);
    }
  }

  removeDevice(device: Device): void {
    this.selectedDevices = this.selectedDevices.filter(
      d => d.deviceInstanceId !== device.deviceInstanceId
    );
  }

  clearAllDevices(): void {
    this.selectedDevices = [];
  }

  isDeviceSelected(device: Device): boolean {
    return this.selectedDevices.some(d => d.deviceInstanceId === device.deviceInstanceId);
  }

  getSelectedDeviceCount(): number {
    return this.selectedDevices.length;
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

    if (this.selectedDevices.length === 0) {
      this.lastSendResult = { success: false, message: 'No devices selected' };
      return;
    }

    this.sending = true;
    this.lastSendResult = null;

    const commandString = this.buildCommandString();

    try {
      const results = await this.remoteCommandService.sendCommandsToDevices(
        this.config,
        this.selectedDevices,
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

  // ==================== Public API ====================

  public refresh(): void {
    this.selectedDevices = [];
    this.deviceSearchTerm = '';
    this.deviceSuggestions = [];
    this.showDeviceSuggestions = false;
    this.searchingDevices = false;
    this.commandQueue = [];
    this.searchTerm = '';
    this.showCommandDropdown = false;
    this.sending = false;
    this.lastSendResult = null;
    this.filterCommands();
  }

  // ==================== Validation ====================

  canSend(): boolean {
    return this.commandQueue.length > 0 &&
           this.selectedDevices.length > 0 &&
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
