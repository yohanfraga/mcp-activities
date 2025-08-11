import { ActivityMcpRequest, ActivityRequest } from "../types/activities";

export default function transformToDTO(request: ActivityMcpRequest): ActivityRequest {
    const start = new Date(request.startDate);
    const end = new Date(request.endDate);
    
    const dataLancamento = start.toISOString().slice(0, 16).replace('T', ' ');
    
    const horarioInicio = start.toTimeString().slice(0, 8);
    const horarioFim = end.toTimeString().slice(0, 8);
    
    return {
      dataLancamento,
      horarioInicio,
      horarioFim,
      observacao: "",
      idTarefa: 233,
      detalheTarefa: `${request.project} - ${request.description}`
    } as ActivityRequest;
  }