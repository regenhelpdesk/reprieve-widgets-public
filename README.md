# reprieve-widgets-public

A public Angular workspace hosting widget libraries for **Matrix Connect** integration with Reprieve devices. Libraries are published to npm under the `@regenesismed` scope.

## Libraries

| Library | npm Package | Version | Description |
|---|---|---|---|
| [widget-commands-manager](./projects/widget-commands-manager/README.md) | [`@regenesismed/widget-commands-manager`](https://www.npmjs.com/package/@regenesismed/widget-commands-manager) | 0.0.1 | Remote command widget for sending commands to Reprieve devices |

## Repository Structure

```
reprieve-widgets-public/
├── projects/
│   └── widget-commands-manager/   # Angular library source
│       ├── src/
│       │   ├── lib/               # Components, services, models
│       │   └── public-api.ts      # Public exports
│       ├── package.json
│       ├── README.md
│       └── CHANGELOG.md
├── angular.json
├── package.json
└── tsconfig.json
```

## Prerequisites

- Node.js (LTS)
- npm
- Angular CLI ~15.2

## Getting Started

Install dependencies:

```bash
npm install
```

## Development

### Building a Library

```bash
npm run build:lib
```

Build output is placed in `dist/widget-commands-manager/`.

### Running Tests

```bash
npm test
```

## Publishing

Scripts are provided at the workspace root to version and publish libraries.

### Version Bump

```bash
npm run version:patch   # 0.0.1 → 0.0.2
npm run version:minor   # 0.0.1 → 0.1.0
npm run version:major   # 0.0.1 → 1.0.0
```

### One-Step Release

```bash
npm run release:patch   # bump version + build + publish
npm run release:minor
npm run release:major
```

### Push Tags to Remote

```bash
npm run push:tags
```

See each library's own `README.md` for detailed publishing prerequisites and troubleshooting.

## License

MIT — see individual library `package.json` files for details.
