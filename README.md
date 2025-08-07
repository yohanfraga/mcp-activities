# MCP Activities

A Model Context Protocol (MCP) server that allows Cursor to interact with the meupontoonline system to create activities. The server is deployed on Railway and supports both local development and cloud deployment.

## Features

- Create activities with start date, end date, and description
- Automatic DTO transformation according to the meupontoonline API format
- Form-data submission to the meupontoonline API
- HTTP transport for cloud deployment
- TypeScript support for development

## Installation

1. Clone or download this project
2. Install dependencies:
```bash
npm install
```

## Usage

### Running the MCP Server

#### Local Development
Start the server in development mode:
```bash
npm run dev
```

Or start in production mode:
```bash
npm start
```

#### Railway Deployment
The server is deployed on Railway and accessible via HTTP transport.

### Cursor Integration

To use this MCP server with Cursor, follow these steps:

#### Method 1: Railway Deployment (Recommended)
1. Open Cursor
2. Go to Settings → Features → Model Context Protocol
3. Add a new server with this configuration:

```json
{
  "mcpServers": {
    "mcp-activities": {
      "url": "https://mcp-activities.up.railway.app/mcp"
    }
  }
}
```

#### Method 2: Local Development
For local development, use this configuration:

```json
{
  "mcpServers": {
    "mcp-activities": {
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

#### Troubleshooting
- **For Railway deployment**: Ensure the URL is correct and the server is running
- **For local development**: Ensure Node.js is installed and accessible from PATH
- Verify the file paths are correct for your system
- Check that all dependencies are installed with `npm install`
- Restart Cursor after adding the configuration
- Build the project with `npm run build` before running locally

### Available Tools

#### create_activity

Creates a new activity in the meupontoonline system.

**Parameters:**
- `startDate` (string, required): Start date and time in ISO format (YYYY-MM-DDTHH:mm:ss or YYYY-MM-DD HH:mm)
- `endDate` (string, required): End date and time in ISO format (YYYY-MM-DDTHH:mm:ss or YYYY-MM-DD HH:mm)
- `project` (string, required): Project name
- `description` (string, required): Activity description
- `email` (string, required): Login email for meupontoonline
- `password` (string, required): Login password for meupontoonline

**Example usage in Cursor:**
```
Create an activity from 2025-01-15 09:00 to 2025-01-15 17:00 for project "Frontend Development" with description "Component Implementation" using email "user@example.com" and password "password123"
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

## Authentication

The server requires authentication to access the meupontoonline API. The login process:

1. **Login Request**: Sends credentials to `https://app.meupontoonline.com/Login/RealizaLogin`
2. **Cookie Extraction**: Extracts authentication cookies from the response
3. **Session Management**: Uses cookies for subsequent API requests

**Required Credentials:**
- `email`: Your meupontoonline login email
- `password`: Your meupontoonline login password

## API Integration

The server sends the transformed DTO as form-data to:
- **URL:** `https://app.meupontoonline.com/Lancamentos/Create`
- **Method:** POST
- **Content-Type:** multipart/form-data
- **Authentication**: Uses cookies from login session

## Error Handling

The server includes comprehensive error handling for:
- Missing required parameters
- Invalid date formats
- End date before start date
- Authentication failures (invalid credentials)
- API request failures
- Network errors
- Session expiration

## Development

### Project Structure
```
mcp-activities/
├── src/
│   ├── index.ts          # Main MCP server implementation (TypeScript)
│   └── tools/            # Tool implementations
├── dist/                 # Compiled JavaScript output
├── dto-template.json     # DTO template reference
├── package.json          # Project configuration
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

### Scripts
- `npm run build`: Compile TypeScript to JavaScript
- `npm run dev`: Run in development mode with hot reload
- `npm start`: Run compiled version
- `npm run dev:watch`: Run with file watching

### Dependencies
- `@modelcontextprotocol/sdk`: MCP server framework
- `express`: HTTP server framework
- `axios`: HTTP client for API requests
- `typescript`: TypeScript compiler
- `tsx`: TypeScript execution environment

## Author

Yohan Fraga Santos