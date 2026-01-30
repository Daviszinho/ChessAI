'use server';

/**
 * @fileOverview An AI agent that explains the rationale behind a chess move suggested by the chess API.
 *
 * - explainAiMove - A function that handles the explanation of the AI's move.
 * - ExplainAiMoveInput - The input type for the explainAiMove function.
 * - ExplainAiMoveOutput - The return type for the explainAiMove function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainAiMoveInputSchema = z.object({
  fen: z.string().describe('The current board state in FEN notation.'),
  move: z.string().describe('The AI suggested move in algebraic notation (e.g., e2e4).'),
  engine: z.string().optional().describe('The engine used to generate the move (e.g., stockfish).'),
  level: z.number().optional().describe('The skill level of the engine (1-20).'),
});
export type ExplainAiMoveInput = z.infer<typeof ExplainAiMoveInputSchema>;

const ExplainAiMoveOutputSchema = z.object({
  explanation: z.string().describe('The AI explanation of the move.'),
});
export type ExplainAiMoveOutput = z.infer<typeof ExplainAiMoveOutputSchema>;

export async function explainAiMove(input: ExplainAiMoveInput): Promise<ExplainAiMoveOutput> {
  return explainAiMoveFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainAiMovePrompt',
  input: {schema: ExplainAiMoveInputSchema},
  output: {schema: ExplainAiMoveOutputSchema},
  prompt: `You are a chess grandmaster. You are explaining to a novice player why the AI suggested the move {{move}} from the FEN position {{fen}}. Consider the engine level {{level}} when explaining the move. Explain the move in terms that a novice chess player can understand. What are the immediate tactical and strategic reasons for this move? What are the likely responses from the other player, and what are the follow-up moves that you anticipate?
`,
});

const explainAiMoveFlow = ai.defineFlow(
  {
    name: 'explainAiMoveFlow',
    inputSchema: ExplainAiMoveInputSchema,
    outputSchema: ExplainAiMoveOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
