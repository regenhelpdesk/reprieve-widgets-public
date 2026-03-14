/**
 * Configuration object passed to the Remote Command Widget.
 * Contains user context and widget-specific settings.
 */
export class RemoteCommandWidgetConfig {
  /** Current authenticated user context */
  currentUser: any;

  /** Widget-specific configuration */
  widgetConfig: {
    /** Device ID of the Reprieve device from the list of devices (not the device instances) */
    deviceId?: string;
    /** Device Data Model ID of the Remote Commands data table in the Reprieve Data Model */
    commandDataModelId?: string;
    /** Device property set ID for command data */
    commandPropertySetId?: string;
    /** Property code key for storing commands in device data */
    commandPropertyCode?: string;
  };

  constructor() {
    this.widgetConfig = {};
  }
}
