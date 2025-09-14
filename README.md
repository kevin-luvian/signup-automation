# Signup Automation

A TypeScript-based automation project using Puppeteer for automated Upwork profile creation and signup processes. This tool automates the complete profile setup workflow including personal information, work experience, education, and profile submission.

## Features

- 🤖 **Automated Upwork Profile Creation**: Complete automation of the Upwork signup and profile setup process
- 📊 **CSV Data Processing**: Bulk account processing from CSV files
- 🎭 **Stealth Mode**: Uses puppeteer-extra with stealth plugins to avoid detection
- 🔄 **Error Handling**: Comprehensive error handling with screenshot capture for debugging
- 🧪 **Testing Suite**: Jest-based testing framework with Puppeteer integration
- 📝 **TypeScript**: Fully typed codebase for better maintainability

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Chrome/Chromium browser (for Puppeteer)

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

3. Prepare your data:
   - Place your account data in `assets/accounts.csv` (see CSV format below)
   - Add a profile photo as `assets/photo.jpg`

## Usage

### Running the Automation
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

### Development with Debugging
```bash
npm run dev:debug
```

### Running Tests
```bash
npm test
```

### Watch Mode for Development
```bash
npm run watch
```

## CSV Data Format

The `assets/accounts.csv` file should contain the following columns:

| Column | Description | Example |
|--------|-------------|---------|
| skip | Whether to skip this account | true/false |
| email | Account email | user@example.com |
| password | Account password | securepassword123 |
| first_name | First name | John |
| last_name | Last name | Doe |
| phone_number | Phone number | +1234567890 |
| country | Country | United States |
| city | City | New York |
| role | Professional role | Software Developer |
| skill | Primary skill | JavaScript |
| ex_company | Previous company | Tech Corp |
| ex_description | Work experience description | Developed web applications... |
| ex_start_month | Experience start month | January |
| ex_start_year | Experience start year | 2020 |
| edu_school | Educational institution | University of Technology |
| edu_field_of_study | Field of study | Computer Science |
| edu_degree | Degree level | Bachelor's |
| edu_start_year | Education start year | 2016 |
| edu_end_year | Education end year | 2020 |
| address | Street address | 123 Main St |
| postal_code | Postal/ZIP code | 10001 |
| date_of_birth | Date of birth | 1995-01-01 |
| bio_description | Professional bio | Experienced developer... |

## Project Structure

```
signup-automation/
├── src/
│   ├── automation/
│   │   ├── puppeteer/
│   │   │   ├── navigator.ts              # Puppeteer browser navigation utilities
│   │   │   └── upworkAutomationService.ts # Main Upwork automation logic
│   │   └── userAgents.ts                 # User agent rotation utilities
│   ├── ingester/
│   │   └── csvIngester.ts                # CSV file processing
│   ├── parser/
│   │   ├── account.ts                    # Account data model and parser
│   │   └── default.ts                    # Default CSV parsing utilities
│   └── index.ts                          # Main entry point
├── tests/
│   ├── artifacts/                        # Test HTML files and artifacts
│   ├── dev.test.ts                       # Development tests
│   ├── page.test.ts                      # Page interaction tests
│   └── setup.ts                          # Test setup configuration
├── assets/
│   ├── accounts.csv                      # Account data file
│   ├── photo.jpg                         # Profile photo
│   └── errors/                           # Error screenshots and HTML dumps
├── dist/                                 # Compiled JavaScript output
├── package.json                          # Project dependencies and scripts
├── tsconfig.json                         # TypeScript configuration
├── jest.config.js                        # Jest testing configuration
└── README.md                             # This file
```

## Key Components

### UpworkAutomationService
The main automation service that handles:
- Login/logout processes
- Profile information filling
- Work experience entry
- Education history
- Language proficiency setup
- Bio description
- Hourly rate configuration
- Photo upload
- Profile submission

### PuppeteerNavigator
A wrapper around Puppeteer that provides:
- Browser instance management
- Page navigation utilities
- Error handling and logging
- Random sleep intervals
- Screenshot capture for debugging

### CsvIngester
Handles CSV file processing:
- Async CSV reading
- Custom row parsing
- Error handling for file operations

## Error Handling

The automation includes comprehensive error handling:
- Screenshots are automatically captured on errors
- HTML dumps are saved for debugging
- Error logs are stored in `assets/errors/`
- Retry mechanisms for critical operations
- Graceful cleanup on failures

## Configuration

### Environment Variables
Create a `.env` file in the root directory for any environment-specific configurations.

### TypeScript Configuration
The project uses strict TypeScript settings:
- ES2020 target
- CommonJS modules
- Strict type checking
- Source maps for debugging
- Path mapping for clean imports

## Testing

The project includes a comprehensive testing suite:
- Unit tests for individual components
- Integration tests with Puppeteer
- Test artifacts for HTML parsing
- Jest configuration with TypeScript support

## Troubleshooting

### Common Issues

1. **Browser not launching**: Ensure Chrome/Chromium is installed
2. **CSV parsing errors**: Check CSV format and file path
3. **Login failures**: Verify account credentials and network connection
4. **Element not found**: Check if Upwork has changed their UI structure

### Debug Mode
Use `npm run dev:debug` to run with Node.js inspector for debugging.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Run build (`npm run build`)
6. Commit your changes (`git commit -m 'Add some amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## License

ISC

## Disclaimer

This tool is for educational and personal use only. Please ensure you comply with Upwork's Terms of Service and use responsibly. The authors are not responsible for any misuse of this automation tool.