import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import createActivity from "../utils/create-activity";
import transformToDTO from "../utils/format-activity";
import { log } from "console";

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
    handler: async ({ startDate, endDate, description, project, email, password }: { startDate: string; endDate: string; description: string; project: string; email: string; password: string }): Promise<CallToolResult> => {
            log('info', 'Processing create_activity request');
            const dto = transformToDTO(startDate, endDate, description, project);
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
            };
    },
  };