# Signup Automation

A TypeScript-based automation project using Puppeteer for automated signup processes.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/kevin-luvian/signup-automation.git
cd signup-automation
```

2. Install dependencies:
```bash
npm install
```

## Development

### Running in Development Mode
```bash
npm run dev
```

### Building the Project
```bash
npm run build
```

### Running the Built Project
```bash
npm start
```

### Watching for Changes
```bash
npm run watch
```

## Project Structure

```
signup-automation/
├── automation/
│   └── puppeteer/
│       └── index.ts          # Main automation script
├── dist/                     # Compiled JavaScript output
├── package.json              # Project dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
```

## Scripts

- `npm run dev` - Run the TypeScript file directly with ts-node
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled JavaScript
- `npm run watch` - Watch for changes and recompile automatically

## TypeScript Configuration

The project uses a strict TypeScript configuration with:
- ES2020 target
- CommonJS modules
- Strict type checking
- Source maps for debugging
- Declaration files generation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run build` to ensure everything compiles
5. Submit a pull request

## License

ISC