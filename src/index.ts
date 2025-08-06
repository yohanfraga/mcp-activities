import 'dotenv/config';
import express, { Request, Response } from "express";
import { createActivityTool } from "./tools/create-activity-tool.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

export const url = 'https://app.meupontoonline.com'
const PORT = process.env.PORT || 3000;

function getServer() {
  const server = new McpServer({
    name: "streamable-mcp-server",
    version: "1.0.0",
  });

  server.tool(
    createActivityTool.name,
    'A tool that creates activities in meupontoonline',
    createActivityTool.schema,
    createActivityTool.handler
  );

  return server;
}

const app = express();

app.use(express.json());

app.post('/mcp', async (req: Request, res: Response) => {
  try {
    const server = getServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    res.on('close', () => {
      console.log('Request closed');
      transport.close();
      server.close();
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error: any) {
    console.error('Error handling MCP request:', error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Internal server error',
        },
        id: null,
      });
    }
  }
});

app.listen(PORT, () => {
  console.log(`MCP Stateless Streamable HTTP Server listening on port ${PORT}`);
}); 