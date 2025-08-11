export interface Horario {
    entrada: string;
    saida: string;
    tempo: string;
}
  
export interface Ponto {
    data: string;
    totalDia: string;
    horarios: Horario[];
}

export interface PontoResponse {
    conteudo: string;
    erros: string;
    mensagem: string;
    sucesso: boolean;
}