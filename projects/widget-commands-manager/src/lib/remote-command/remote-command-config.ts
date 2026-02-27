/**
 * Configuration object passed to the Remote Command Widget.
 * Contains user context and widget-specific settings.
 */
export class RemoteCommandWidgetConfig {
  /** Current authenticated user context */
  currentUser: any;

  /** Widget-specific configuration */
  widgetConfig: {
    /** Device ID of device data model of the Reprieve device */
    deviceId?: string;
    /** Device property set ID for command data */
    commandPropertySetId?: string;
    /** Property code key for storing commands in device data */
    commandPropertyCode?: string;
  };

  constructor() {
    this.widgetConfig = {};
  }
}
