/*
 * Public API Surface of widget-commands-manager
 */

// Existing Device Management Widget
export * from './lib/widget-command-manager.module';

// Remote Command Widget
export * from './lib/remote-command/remote-command.component';
export * from './lib/remote-command/remote-command-config';
export * from './lib/remote-command/remote-command.service';

// Remote Command Models
export * from './lib/remote-command/models/command-definition';
export * from './lib/remote-command/models/command-instance';
export * from './lib/remote-command/models/command-definitions';
export * from './lib/remote-command/models/device';

// Shared Services
export * from './lib/services/matrix-api.service';
