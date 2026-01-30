import type { Piece, Square } from 'chess.js';

export type HistoryItem = {
  san: string;
  fen: string;
  by: 'player' | 'ai';
};

export type GameStatus =
  | 'in-progress'
  | 'checkmate'
  | 'stalemate'
  | 'draw'
  | 'threefold-repetition'
  | 'insufficient-material';

export type ChessPiece = {
  type: Piece['type'];
  color: Piece['color'];
};

export type Move = { from: Square; to: Square; promotion?: Piece['type'] };
