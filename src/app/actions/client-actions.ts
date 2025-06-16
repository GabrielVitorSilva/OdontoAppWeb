'use server';

import { summarizeClientHistory } from '@/ai/flows/summarize-client-history';
import type { SummarizeClientHistoryInput, SummarizeClientHistoryOutput } from '@/ai/flows/summarize-client-history';

export async function getClientHistorySummary(
  input: SummarizeClientHistoryInput
): Promise<SummarizeClientHistoryOutput | { error: string }> {
  try {
    // Basic validation (can be expanded with Zod if input structure is more complex)
    if (!input.history || typeof input.history !== 'string' || input.history.trim() === '') {
      return { error: 'O histórico do cliente não pode estar vazio.' };
    }

    // Call the (now mocked) summarizeClientHistory function
    const summaryOutput = await summarizeClientHistory(input);
    return summaryOutput;
  } catch (error) {
    console.error('Error generating client history summary:', error);
    // It's good practice to not expose raw error messages to the client
    // For a real app, log this error and return a generic message.
    if (error instanceof Error) {
        return { error: `Falha ao gerar resumo: ${error.message}` };
    }
    return { error: 'Ocorreu um erro desconhecido ao gerar o resumo do histórico do cliente.' };
  }
}
