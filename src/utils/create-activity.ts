import axios from "axios";
import { url } from "..";
import Login from "./login";
import log from "./logger";
import { ActivityRequest } from "../types/activities";

export default async function createActivity(dto: ActivityRequest, cookie: string) {
    try {
      log('info', 'Creating activity', { dto, cookie: cookie.substring(0, 3) + '***' });
      
      const formData = new FormData();
      
      Object.keys(dto).forEach((key: string) => {
        formData.append(key, dto[key as keyof ActivityRequest].toString());
      });
  
      log('info', 'Sending activity creation request to API');
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
      
      log('info', 'Activity created successfully', { status: response.status });
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error: any) {
      log('error', 'Failed to create activity', { error: error.message, status: error.response?.status });
      return {
        success: false,
        error: error.message,
        status: error.response?.status || 500
      };
    }
  }