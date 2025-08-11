import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import { url } from "..";
import log from "./logger";
import { LoginRequest } from "../types/login";


export default async function Login(loginRequest: LoginRequest): Promise<string> {
    try {
      log('info', 'Attempting to login', { email: loginRequest.email.substring(0, 3) + '***' });
      
      const params = new URLSearchParams();
      params.append('email', loginRequest.email);
      params.append('senha', loginRequest.password);
      
      const response = await axios.post( `${url}/Login/RealizaLogin`,
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
  
      log('info', 'Login successful, extracting cookies', { status: response.status });
      
      var statusPlan = response.headers['set-cookie']?.[0]?.split(';')[0] ?? '';
      var permissoesTela = response.headers['set-cookie']?.[1]?.split(';')[0] ?? '';
      var empresaUsuarioList = response.headers['set-cookie']?.[2]?.split(';')[0] ?? '';
      var usuario = response.headers['set-cookie']?.[3]?.split(';')[0] ?? '';
  
      var cookie = statusPlan + ';' + permissoesTela + ';' + empresaUsuarioList + ';' + usuario;
  
      log('debug', 'Cookies extracted successfully');
  
      return cookie;
    } catch (error: any) {
      log('error', 'Login failed', { error: error.message, status: error.response?.status });
      throw new McpError(
        ErrorCode.InternalError,
        'Failed to log in'
      );
    }
  }