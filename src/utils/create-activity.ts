import axios from "axios";
import { url } from "..";
import Login from "./login";
import log from "./logger";

export default async function createActivity(dto: any, email: string, password: string) {
    try {
      log('info', 'Creating activity', { dto, email: email.substring(0, 3) + '***' });
      
      const formData = new FormData();
      
      // Add DTO fields to form data
      Object.keys(dto).forEach(key => {
        formData.append(key, dto[key]);
      });
      
      var cookie = await Login(email, password)
  
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
    } catch (error) {
      log('error', 'Failed to create activity', { error: error.message, status: error.response?.status });
      return {
        success: false,
        error: error.message,
        status: error.response?.status || 500
      };
    }
  }