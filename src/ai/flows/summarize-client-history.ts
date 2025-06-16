// Summarizes client history for quick understanding of past treatments and needs. (MOCKED)

'use server';

// Genkit and Zod are not used for this mocked version.

export interface SummarizeClientHistoryInput {
  history: string;
}

export interface SummarizeClientHistoryOutput {
  summary: string;
}

export async function summarizeClientHistory(
  // input: SummarizeClientHistoryInput // Input is ignored for mock
): Promise<SummarizeClientHistoryOutput> {
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 500)); 
  
  return {
    summary: "Este é um resumo mockado do histórico do cliente, gerado localmente para fins de demonstração. O paciente apresenta um bom quadro geral de saúde bucal, com visitas regulares para profilaxia. Últimos procedimentos incluem uma limpeza completa há 6 meses e uma pequena restauração no molar inferior direito há 2 anos. Nenhuma alergia reportada. Recomenda-se manter a rotina de check-ups semestrais.",
  };
}
