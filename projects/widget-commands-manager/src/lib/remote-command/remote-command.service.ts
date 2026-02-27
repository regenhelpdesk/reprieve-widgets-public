import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Device } from './models/device';
import { RemoteCommandWidgetConfig } from './remote-command-config';
import { MatrixApiService } from '../services/matrix-api.service';

export interface SendCommandResult {
  deviceId: string;
  success: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RemoteCommandService {
  private readonly DEFAULT_API = 'https://api.galencloud.com';

  constructor(
    private matrixApiService: MatrixApiService
  ) { }

  /**
   * Sends commands to multiple devices.
   * Creates one DB entry per device with the command string.
   *
   * @param config Widget configuration
   * @param devices Array of devices to send commands to
   * @param commandString The pipe-separated command string (e.g., "csd 15 01 26|cst 14 30 00")
   * @returns Promise with results for each device
   */
  async sendCommandsToDevices(
    config: RemoteCommandWidgetConfig,
    devices: Device[],
    commandString: string
  ): Promise<SendCommandResult[]> {
    const results: SendCommandResult[] = [];

    // Validate required config
    // if (!config?.widgetConfig?.deviceId) {
    //   throw new Error('deviceId is required in widget config');
    // }
    // if (!config?.widgetConfig?.devicePropertySetId) {
    //   throw new Error('devicePropertySetId is required in widget config');
    // }
    // if (!config?.widgetConfig?.commandPropertyCode) {
    //   throw new Error('commandPropertyCode is required in widget config');
    // }

    for (const device of devices) {
      try {
        await this.sendCommandToDevice(config, device.deviceInstanceId, commandString);
        results.push({
          deviceId: device.deviceInstanceId,
          success: true,
          message: 'Commands sent successfully'
        });
      } catch (error) {
        results.push({
          deviceId: device.deviceInstanceId,
          success: false,
          message: (error as Error).message || 'Failed to send commands'
        });
      }
    }

    return results;
  }

  /**
   * Sends command string to a single device by saving it as device data.
   *
   * @param config Widget configuration with device data model settings
   * @param deviceInstanceId Target device instance ID (used as ownerId)
   * @param commandString The pipe-separated command string
   */
  private async sendCommandToDevice(
    config: RemoteCommandWidgetConfig,
    deviceInstanceId: string,
    commandString: string
  ): Promise<void> {
    // const propertyCode = config.widgetConfig.commandPropertyCode!;
    const propertyCode = "Commands";

    const requestBody = {
      // deviceDataModelId: config.widgetConfig.deviceId!,
      deviceDataModelId: "18ebef7d-5ebf-4471-8246-4453db7a7583",
      // devicePropertySetId: config.widgetConfig.devicePropertySetId!, 
      devicePropertySetId: "006b3375-c713-4cea-bacf-279325df8a46",
      // deviceDataId: null, // null for new data, or can be used to update existing data
      ownerId: deviceInstanceId, // Device instance ID is the owner
      data: {
        [propertyCode]: commandString
      }
    };

    await lastValueFrom(
      this.matrixApiService.postDeviceData(requestBody)
    );
  }
}
