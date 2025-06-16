// Summarizes client history for quick understanding of past treatments and needs.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeClientHistoryInputSchema = z.object({
  history: z
    .string()
    .describe(
      'The complete historical records of a client, including past treatments, notes, and other relevant information.'
    ),
});

export type SummarizeClientHistoryInput = z.infer<typeof SummarizeClientHistoryInputSchema>;

const SummarizeClientHistoryOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of the client history, highlighting key treatments, issues, and needs.'
    ),
});

export type SummarizeClientHistoryOutput = z.infer<typeof SummarizeClientHistoryOutputSchema>;

export async function summarizeClientHistory(
  input: SummarizeClientHistoryInput
): Promise<SummarizeClientHistoryOutput> {
  return summarizeClientHistoryFlow(input);
}

const summarizeClientHistoryPrompt = ai.definePrompt({
  name: 'summarizeClientHistoryPrompt',
  input: {schema: SummarizeClientHistoryInputSchema},
  output: {schema: SummarizeClientHistoryOutputSchema},
  prompt: `You are an expert medical professional.

  Please summarize the following client history, highlighting key treatments, issues, and needs:

  Client History: {{{history}}}`,
});

const summarizeClientHistoryFlow = ai.defineFlow(
  {
    name: 'summarizeClientHistoryFlow',
    inputSchema: SummarizeClientHistoryInputSchema,
    outputSchema: SummarizeClientHistoryOutputSchema,
  },
  async input => {
    const {output} = await summarizeClientHistoryPrompt(input);
    return output!;
  }
);
