'use server';

/**
 * @fileOverview A chess AI agent that suggests the best move for a given board state.
 *
 * - suggestBestMove - A function that handles the suggestion of the best move.
 * - SuggestBestMoveInput - The input type for the suggestBestMove function.
 * - SuggestBestMoveOutput - The return type for the suggestBestMove function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestBestMoveInputSchema = z.object({
  fen: z.string().describe('The current board state in FEN notation.'),
  engine: z.enum(['stockfish', 'crafty', 'fruit', 'toga2']).default('stockfish').describe('The chess engine to use.'),
  level: z.number().int().min(1).max(20).default(5).describe('The skill level of the chess engine.'),
});
export type SuggestBestMoveInput = z.infer<typeof SuggestBestMoveInputSchema>;

const SuggestBestMoveOutputSchema = z.object({
  move: z.string().describe('The best move suggested by the AI chess engine.'),
});
export type SuggestBestMoveOutput = z.infer<typeof SuggestBestMoveOutputSchema>;

export async function suggestBestMove(input: SuggestBestMoveInput): Promise<SuggestBestMoveOutput> {
  return suggestBestMoveFlow(input);
}

const suggestBestMoveFlow = ai.defineFlow(
  {
    name: 'suggestBestMoveFlow',
    inputSchema: SuggestBestMoveInputSchema,
    outputSchema: SuggestBestMoveOutputSchema,
  },
  async input => {
    const apiUrl = 'https://daviszinhovm.westus2.cloudapp.azure.com/api/move';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        return { move: data.response.move };
      } else {
        throw new Error(`API Error: ${data.message}`);
      }
    } catch (error: any) {
      console.error('Error fetching best move:', error);
      throw new Error(`Failed to get best move: ${error.message}`);
    }
  }
);
