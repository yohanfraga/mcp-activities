import { LoginRequest } from "./login";

export interface ActivityRequest {
    dataLancamento: string;
    horarioInicio: string;
    horarioFim: string;
    observacao: string;
    idTarefa: number;
    detalheTarefa: string;
}

export interface ActivityMcpRequest {
    startDate: string;
    endDate: string;
    description: string;
    project: string;
}

export interface TaskRequest {
    description: string;
    date: string;
}

export interface TaskMcpRequest {
    taskLog: TaskRequest[];
    project: string | 'Projeto';
}

export interface MissingActivitiesMcpRequest {
    loginRequest: LoginRequest;
    taskMcpRequest: TaskMcpRequest;
}


