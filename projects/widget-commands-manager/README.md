# Widget Commands Manager

Angular widget for managing remote commands to Reprieve devices from Galen Web Portal. This package is designed for Matrix Connect integration.

## Installation

```bash
npm install @regenesismed/widget-commands-manager
```

## Requirements

- Angular ~15.2.0
- @angular/cdk ~15.2.0

## Usage

### 1. Import the Module

```typescript
import { NgModule } from '@angular/core';
import { WidgetCommandManagerModule } from '@regenesismed/widget-commands-manager';

@NgModule({
  imports: [
    WidgetCommandManagerModule
  ]
})
export class AppModule { }
```

### 2. Use the Remote Command Component

```typescript
import { Component } from '@angular/core';
import { RemoteCommandWidgetConfig } from '@regenesismed/widget-commands-manager';

@Component({
  selector: 'app-device-manager',
  template: `
    <widget-remote-command [config]="widgetConfig"></widget-remote-command>
  `
})
export class DeviceManagerComponent {
  widgetConfig: RemoteCommandWidgetConfig = {
    currentUser: { /* user object */ },
    widgetConfig: {
      deviceId: 'your-device-model-id',
      commandPropertySetId: 'Device property set ID for command data',
      commandPropertyCode: 'Property code key for storing commands in device data'
    }
  };
}
```

### 3. Configuration

The widget requires a `RemoteCommandWidgetConfig` object with:

- `currentUser` - Current authenticated user context
- `widgetConfig.deviceId` - Device ID of the Reprieve device data model

If configuration is missing, the widget will display an error message listing required fields.

## Features

- **Device Selection** - Select multiple target devices from available Reprieve devices
- **Command Queue** - Build a queue of commands with drag-and-drop reordering
- **Command Categories** - Normal and Test commands based on Reprieve device specifications
- **Command Arguments** - Dynamic argument inputs (text, number, select, boolean)
- **Command Preview** - See the pipe-separated command string before sending
- **Batch Sending** - Send commands to multiple devices simultaneously
- **Result Tracking** - View success/failure status for each device

## API Services

The package exports shared services for Matrix API integration:

```typescript
import { MatrixApiService } from '@regenesismed/widget-commands-manager';

// Fetch device instances
matrixApiService.getDeviceInstances(deviceId, ...options);

// Fetch devices for widget
matrixApiService.fetchDevicesForWidget(deviceId);

// Post device data
matrixApiService.postDeviceData(requestBody);
```

## Development

### Building the Library

```bash
npm run build:lib
```

Build artifacts will be placed in `dist/widget-commands-manager/`.

## Publishing (For Maintainers)

### Prerequisites

1. **npm Account** with publish access to the `@regenesismed` organization
2. **npm Login**:
   ```bash
   npm login
   npm whoami  # Verify login
   ```
3. **Organization Access**: Member of @regenesismed organization
4. **Git Setup**: Commit access to the repository

### First-Time Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create npm account** (if needed):
   - Visit https://www.npmjs.com/signup
   - Verify email address

3. **Login to npm:**
   ```bash
   npm login
   ```

4. **Test build:**
   ```bash
   npm run build:lib
   ```

5. **Test dry-run:**
   ```bash
   npm run publish:lib:dry-run
   ```

### Publishing Workflow

The library uses **semantic versioning** (MAJOR.MINOR.PATCH):
- **PATCH** (0.0.X): Bug fixes and minor changes
- **MINOR** (0.X.0): New features, backwards compatible
- **MAJOR** (X.0.0): Breaking changes

#### Quick Release (Recommended)

Complete release in one command:

```bash
# Patch release (0.0.1 -> 0.0.2)
npm run release:patch

# Minor release (0.0.1 -> 0.1.0)
npm run release:minor

# Major release (0.0.1 -> 1.0.0)
npm run release:major
```

This will:
1. Bump version in package.json
2. Create git commit and tag
3. Build library in production mode
4. Publish to npm

After publishing:
```bash
npm run push:tags  # Push to Bitbucket
```

#### Step-by-Step Release (Advanced)

For more control:

1. **Bump version:**
   ```bash
   npm run version:patch  # or version:minor / version:major
   ```

2. **Test build:**
   ```bash
   npm run build:lib
   ```

3. **Dry run:**
   ```bash
   npm run publish:lib:dry-run
   ```

4. **Publish:**
   ```bash
   npm run publish:lib
   ```

5. **Push to git:**
   ```bash
   npm run push:tags
   ```

### Post-Publishing

1. **Verify publication:**
   - Visit https://www.npmjs.com/package/@regenesismed/widget-commands-manager
   - Confirm new version is live

2. **Test installation:**
   ```bash
   npm install @regenesismed/widget-commands-manager@latest
   ```

3. **Update CHANGELOG.md** with changes

### Troubleshooting

#### "npm ERR! 403 Forbidden"
- Ensure logged in: `npm whoami`
- Verify @regenesismed organization access
- Check if organization exists: https://www.npmjs.com/org/regenesismed

#### "npm ERR! You must be logged in to publish packages"
- Run `npm login` and enter credentials
- Verify with `npm whoami`

#### "npm ERR! You cannot publish over the previously published version"
- Version already exists on npm
- Bump version: `npm run version:patch`

#### "prepublishOnly script failed"
- Don't run `npm publish` from project root
- Always use `npm run publish:lib` (builds first)

#### Build fails with compilation errors
- Check TypeScript errors: `npm run build:lib`
- Ensure dependencies installed: `npm install`
- Verify Angular/TypeScript compatibility

#### Version bump failed
- Ensure git working directory is clean
- Commit or stash changes first
- Check you're in the correct directory

### Development Workflow

Normal workflow for making changes:

1. **Make changes** to library code in `projects/widget-commands-manager/src/`

2. **Test locally:**
   ```bash
   npm run build:lib
   # Test in consuming application
   ```

3. **Commit changes:**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

4. **Release:**
   ```bash
   npm run release:patch  # or release:minor / release:major
   ```

5. **Push:**
   ```bash
   npm run push:tags
   ```

## Version History

See [CHANGELOG.md](./CHANGELOG.md) for version history and changes.

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions specific to Matrix Connect integration, contact the Reprieve support team.
