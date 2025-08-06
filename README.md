# MCP Activities

A Model Context Protocol (MCP) server that allows Cursor to interact with the meupontoonline system to create activities.

## Features

- Create activities with start date, end date, and description
- Automatic DTO transformation according to the meupontoonline API format
- Form-data submission to the meupontoonline API
- Input validation and error handling
- ISO date format support

## Installation

1. Clone or download this project
2. Install dependencies:
```bash
npm install
```

## Usage

### Running the MCP Server

Start the server in development mode:
```bash
npm run dev
```

Or start in production mode:
```bash
npm start
```

### Cursor Integration

To use this MCP server with Cursor, follow these steps:

#### Method 1: Using Cursor Settings
1. Open Cursor
2. Go to Settings → Features → Model Context Protocol
3. Add a new server with this configuration:

```json
{
  "mcpServers": {
    "mcp-activities": {
      "command": "node",
      "args": ["src/index.js"],
      "cwd": "C:\\mcp\\mcp-activities"
    }
  }
}
```

#### Method 2: Manual Configuration File
Copy the configuration from `cursor-mcp-config.json` and paste it into Cursor's MCP settings.

#### Troubleshooting
- Ensure Node.js is installed and accessible from PATH
- Verify the file paths are correct for your system
- Check that all dependencies are installed with `npm install`
- Restart Cursor after adding the configuration

### Available Tools

#### create_activity

Creates a new activity in the meupontoonline system.

**Parameters:**
- `startDate` (string, required): Start date and time in ISO format (YYYY-MM-DDTHH:mm:ss or YYYY-MM-DD HH:mm)
- `endDate` (string, required): End date and time in ISO format (YYYY-MM-DDTHH:mm:ss or YYYY-MM-DD HH:mm)
- `project` (string, required): Project name
- `description` (string, required): Activity description

**Example usage in Cursor:**
```
Create an activity from 2025-01-15 09:00 to 2025-01-15 17:00 for project "Frontend Development" with description "Component Implementation"
```

## DTO Transformation

The server automatically transforms user input to the required DTO format:

**Input:**
- Start Date: `2025-01-15T09:00:00`
- End Date: `2025-01-15T17:00:00`
- Description: `"Project Development - Frontend Implementation"`

**Transformed DTO:**
```json
{
  "dataLancamento": "2025-01-15 09:00",
  "horarioInicio": "09:00:00",
  "horarioFim": "17:00:00",
  "observacao": "",
  "idTarefa": 233,
  "detalheTarefa": "Project Development - Frontend Implementation"
}
```

## API Integration

The server sends the transformed DTO as form-data to:
- **URL:** `https://app.meupontoonline.com/Lancamentos/Create`
- **Method:** POST
- **Content-Type:** multipart/form-data

## Error Handling

The server includes comprehensive error handling for:
- Missing required parameters
- Invalid date formats
- End date before start date
- API request failures
- Network errors

## Development

### Project Structure
```
mcp-activities/
├── src/
│   └── index.js          # Main MCP server implementation
├── dto-template.json     # DTO template reference
├── package.json          # Project configuration
└── README.md            # This file
```

### Dependencies
- `@modelcontextprotocol/sdk`: MCP server framework
- `axios`: HTTP client for API requests

## Author

Yohan Fraga Santos