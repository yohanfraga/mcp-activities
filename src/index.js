#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';
import { FormData } from 'formdata-node';

const server = new Server(
  {
    name: 'mcp-activities',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const url = 'https://app.meupontoonline.com'

/**
 * Transform user input to DTO format according to dto-template.json
 */
function transformToDTO(startDate, endDate, project, description) {
  // Parse dates and times
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Format date as YYYY-MM-DD HH:mm
  const dataLancamento = start.toISOString().slice(0, 16).replace('T', ' ');
  
  // Format times as HH:mm:ss
  const horarioInicio = start.toTimeString().slice(0, 8);
  const horarioFim = end.toTimeString().slice(0, 8);
  
  return {
    dataLancamento,
    horarioInicio,
    horarioFim,
    observacao: "",
    idTarefa: 233, // Fixed value as per template
    detalheTarefa: `${project} - ${description}`
  };
}

/**
 * Send activity data to meupontoonline API
 */
async function createActivity(dto, email, password) {
  try {
    const formData = new FormData();
    
    // Add DTO fields to form data
    Object.keys(dto).forEach(key => {
      formData.append(key, dto[key]);
    });
    
    var cookie = await Login(email, password)

    const response = await axios.post(
      `${url}/Lancamentos/Create`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Cookie': cookie
        },
      }
    );
    
    return {
      success: true,
      data: response.data,
      status: response.status
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      status: error.response?.status || 500
    };
  }
}

async function Login(email, password) {
  try {
    const params = new URLSearchParams();
    params.append('email', email);
    params.append('senha', password);
    
    const response = await axios.post(
      `${url}/Login/RealizaLogin`,
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    var statusPlan = response.headers['set-cookie'][0].split(';')[0];
    var permissoesTela = response.headers['set-cookie'][1].split(';')[0];
    var empresaUsuarioList = response.headers['set-cookie'][2].split(';')[0];
    var usuario = response.headers['set-cookie'][3].split(';')[0];

    var cookie = statusPlan + ';' + permissoesTela + ';' + empresaUsuarioList + ';' + usuario;

    console.log('cookie:', cookie)

    return cookie;
  } catch (error) {
    console.error('Error logging in:', error);
    throw new McpError(
      ErrorCode.InternalError,
      'Failed to log in'
    );
  }
}

/**
 * Validate date input
 */
function validateDate(dateString) {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'create_activity',
        description: 'Create a new activity in meupontoonline system',
        inputSchema: {
          type: 'object',
          properties: {
            startDate: {
              type: 'string',
              description: 'Start date and time (ISO format: YYYY-MM-DDTHH:mm:ss or YYYY-MM-DD HH:mm)',
            },
            endDate: {
              type: 'string',
              description: 'End date and time (ISO format: YYYY-MM-DDTHH:mm:ss or YYYY-MM-DD HH:mm)',
            },
            project: {
              type: 'string',
              description: 'Project name',
            },
            description: {
              type: 'string',
              description: 'Activity description',
            },
            email: {
              type: 'string',
              description: 'Login email for meupontoonline',
            },
            password: {
              type: 'string',
              description: 'Login password for meupontoonline',
            },
          },
          required: ['startDate', 'endDate', 'project', 'description', 'email', 'password'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'create_activity') {
    try {
      const { startDate, endDate, description, project, email, password } = args;

      // Validate required fields
      if (!startDate || !endDate || !description || !project || !email || !password) {
        throw new McpError(
          ErrorCode.InvalidParams,
          'Missing required parameters: startDate, endDate, project, description, email and password are required'
        );
      }

      // Validate dates
      if (!validateDate(startDate)) {
        throw new McpError(
          ErrorCode.InvalidParams,
          'Invalid startDate format. Use ISO format: YYYY-MM-DDTHH:mm:ss or YYYY-MM-DD HH:mm'
        );
      }

      if (!validateDate(endDate)) {
        throw new McpError(
          ErrorCode.InvalidParams,
          'Invalid endDate format. Use ISO format: YYYY-MM-DDTHH:mm:ss or YYYY-MM-DD HH:mm'
        );
      }

      // Check if end date is after start date
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end <= start) {
        throw new McpError(
          ErrorCode.InvalidParams,
          'End date must be after start date'
        );
      }

      // Transform to DTO
      const dto = transformToDTO(startDate, endDate, project, description);

      // Create activity
      const result = await createActivity(dto, email, password);

      if (result.success) {
        return {
          content: [
            {
              type: 'text',
              text: `✅ Activity created successfully!\n\nDetails:\n- Start: ${startDate}\n- End: ${endDate}\n- Project: ${project}\n- Description: ${description}\n\nDTO sent:\n${JSON.stringify(dto, null, 2)}\n\nAPI Response Status: ${result.status}`,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: 'text',
              text: `❌ Failed to create activity!\n\nError: ${result.error}\nStatus: ${result.status}\n\nDTO that was attempted:\n${JSON.stringify(dto, null, 2)}`,
            },
          ],
        };
      }
    } catch (error) {
      if (error instanceof McpError) {
        throw error;
      }
      
      throw new McpError(
        ErrorCode.InternalError,
        `Unexpected error: ${error.message}`
      );
    }
  } else {
    throw new McpError(
      ErrorCode.MethodNotFound,
      `Unknown tool: ${name}`
    );
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP Activities server running on stdio');
}

main().catch((error) => {
  console.error('Server failed to start:', error);
  process.exit(1);
});