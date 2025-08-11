import axios from "axios";
import { JSDOM } from "jsdom";
import { url } from "..";
import { Horario, Ponto, PontoResponse } from "../types/ponto";

export default async function getLatestClockIns(cookies: string): Promise<Ponto[]> {
    const response = await axios.get(`${url}/Ponto/LoadPagination?dataPesquisa=&pageSize=50&pageNumber=1`, {
        headers: {
            'Cookie': cookies
        }
    });

    const pontoResponse = response.data as PontoResponse;

    return extractFromResponse(pontoResponse);
}

function extractFromResponse(pontoResponse: PontoResponse): Ponto[] {
    const dom = new JSDOM(pontoResponse.conteudo);
    const document = dom.window.document;

    const groupDivs = Array.from(document.querySelectorAll('.table-group-date')) as Element[];

    const result = groupDivs.map((group: Element) => {
        const date = group.querySelector('#dia_apontamento')?.textContent?.trim() ?? 'Data não encontrada';
        const totalDia = group.querySelector('#total_horas')?.textContent?.replace('Total:', '').trim() ?? '00:00:00';

        const horarios = Array.from(group.querySelectorAll('.table-row')).map((row: Element) => {
            const entrada = row.querySelector('.inicio')?.textContent?.trim() ?? '-';
            const saida = row.querySelector('.fim')?.textContent?.trim() ?? '-';
            const tempo = row.querySelector('.total')?.textContent?.trim() ?? '-';

            return {
                entrada,
                saida,
                tempo
            } as Horario;
        });

        return {
            data: date,
            totalDia,
            horarios
        } as Ponto;
    });

    return result;
}