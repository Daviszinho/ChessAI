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
import https from 'https';

const SuggestBestMoveInputSchema = z.object({
  fen: z.string().describe('The current board state in FEN notation.'),
  engine: z
    .enum(['stockfish', 'gnuchess', 'toga2', 'sjeng', 'phalanx'])
    .default('stockfish')
    .describe('The chess engine to use.'),
  level: z
    .number()
    .int()
    .min(1)
    .max(20)
    .default(5)
    .describe('The skill level of the chess engine.'),
});
export type SuggestBestMoveInput = z.infer<typeof SuggestBestMoveInputSchema>;

const SuggestBestMoveOutputSchema = z.object({
  move: z.string().describe('The best move suggested by the AI chess engine.'),
});
export type SuggestBestMoveOutput = z.infer<
  typeof SuggestBestMoveOutputSchema
>;

export async function suggestBestMove(
  input: SuggestBestMoveInput
): Promise<SuggestBestMoveOutput> {
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
    const postData = JSON.stringify(input);
    const url = new URL(apiUrl);

    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Connection': 'close'
      },
      rejectUnauthorized: false, // Bypass SSL certificate validation
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, res => {
        let data = '';
        res.on('data', chunk => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              const jsonData = JSON.parse(data);
              if (jsonData.success) {
                if (jsonData.response && jsonData.response.move) {
                  resolve({move: jsonData.response.move});
                } else {
                  reject(new Error('API response missing expected move data.'));
                }
              } else {
                reject(new Error(`API Error: ${jsonData.error || jsonData.message || 'Unknown API error'}`));
              }
            } else {
              reject(new Error(`HTTP error! Status: ${res.statusCode}, Body: ${data}`));
            }
          } catch (e: any) {
            reject(new Error(`Failed to parse API response: ${e.message}. Response body: ${data}`));
          }
        });
      });

      req.on('error', e => {
        console.error('Error fetching best move:', e);
        reject(new Error(`Failed to get best move: ${e.message}`));
      });

      req.write(postData);
      req.end();
    });
  }
);
