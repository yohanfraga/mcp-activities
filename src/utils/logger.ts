export default function log(level: string, message: string, data: any = null) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    if (data) {
      console.error(logMessage, data);
    } else {
      console.error(logMessage);
    }
  }