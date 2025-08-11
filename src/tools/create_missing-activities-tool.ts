import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import createActivity from "../utils/create-activity";
import { log } from "console";
import Login from "../utils/login";
import getLatestClockIns from "../utils/get-latest-clock-ins";
import getLatestActivities from "../utils/get-latest-activities";
import transformToDTO from "../utils/format-activity";
import { Horario } from "../types/ponto";
import { MissingActivitiesMcpRequest, TaskMcpRequest } from "../types/activities";

const monthMap: { [key: string]: string } = {
  'jan': '01',
  'fev': '02',
  'mar': '03',
  'abr': '04',
  'mai': '05',
  'jun': '06',
  'jul': '07',
  'ago': '08',
  'set': '09',
  'out': '10',
  'nov': '11',
  'dez': '12'
};

export const createMissingActivitiesTool = {
    name: 'create-missing-activities',
    schema:{
        loginRequest: z.object({
            email: z.string(),
            password: z.string()
        }),
        taskMcpRequest: z.object({
            taskLog: z.array(z.object({
                description: z.string(),
                date: z.string()
            })),
            project: z.string(),
            globalDescription: z.string()
        })
    },
    handler: async (request: MissingActivitiesMcpRequest): Promise<CallToolResult> => {
      log('info', 'Processing create_missing_activities request');
      const cookie = await Login(request.loginRequest);
      const clockIns = await getLatestClockIns(cookie);
      const activities = await getLatestActivities(cookie);

      for (const clockIn of clockIns) {
        const activity = activities.find(activity => activity.data === clockIn.data);
        if (!activity || (activity.totalDia !== clockIn.totalDia && activity.horarios.length < clockIn.horarios.length)) {
          for (const horario of clockIn.horarios) {
            await createActivityForClockIn(horario, cookie, clockIn.data, request.taskMcpRequest);
          }
        }
      }

      return {
        content: [
          {
            type: 'text',
            text: 'Finished missing activities'
          }
        ]
      };
    },
  };

  async function createActivityForClockIn(horario: Horario, cookie: string, date: string, request: TaskMcpRequest) {
    log('info', 'Creating activity for clock in', { horario, date });

    var dateParts = date.split(', ')[1].split(' ');
    var day = dateParts[0];
    var month = monthMap[dateParts[1].toLowerCase()];
    var year = '20' + dateParts[2];

    const startDate = new Date(`${year}-${month}-${day}T${horario.entrada}`);
    const endDate = new Date(`${year}-${month}-${day}T${horario.saida}`);

    const description = request.taskLog.find(task => task.date.includes(`${year}-${month}-${day}`))?.description ?? request.globalDescription;

    const dto = transformToDTO({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        description: description,
        project: request.project
    });

    await createActivity(dto, cookie);
  }