export default function transformToDTO(startDate: string, endDate: string, description: string, project: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const dataLancamento = start.toISOString().slice(0, 16).replace('T', ' ');
    
    const horarioInicio = start.toTimeString().slice(0, 8);
    const horarioFim = end.toTimeString().slice(0, 8);
    
    return {
      dataLancamento,
      horarioInicio,
      horarioFim,
      observacao: "",
      idTarefa: 233,
      detalheTarefa: `${project} - ${description}`
    };
  }