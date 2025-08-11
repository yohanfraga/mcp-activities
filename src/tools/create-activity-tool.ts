import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import createActivity from "../utils/create-activity";
import transformToDTO from "../utils/format-activity";
import { log } from "console";
import { ActivityMcpRequest } from "../types/activities";
import Login from "../utils/login";
import { LoginRequest } from "../types/login";

export const createActivityTool = {
    name: 'create-activity',
    schema:{
        startDate: z.string(),
        endDate: z.string(),
        description: z.string(),
        project: z.string(),
        email: z.string(),
        password: z.string(),
    },
    handler: async (request: ActivityMcpRequest & LoginRequest): Promise<CallToolResult> => {
            log('info', 'Processing create_activity request');
            const dto = transformToDTO(request);
            const cookie = await Login(request);
            const result = await createActivity(dto, cookie);
            if (result.success) {
                return {
                  content: [
                    {
                      type: 'text',
                      text: `✅ Activity created successfully!\n\nDetails:\n- Start: ${request.startDate}\n- End: ${request.endDate}\n- Project: ${request.project}\n- Description: ${request.description}\n\nDTO sent:\n${JSON.stringify(dto, null, 2)}\n\nAPI Response Status: ${result.status}`,
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
            };
    },
  };