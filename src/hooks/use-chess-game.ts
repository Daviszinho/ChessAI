'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Chess, type Square, type Piece } from 'chess.js';
import { useToast } from '@/hooks/use-toast';
import type {
  HistoryItem,
  GameStatus,
  ChessPiece,
  Move,
} from '@/lib/types';

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export const useChessGame = () => {
  const [game, setGame] = useState(new Chess());
  const [board, setBoard] = useState<(ChessPiece | null)[][]>(game.board());
  const [status, setStatus] = useState<GameStatus>('in-progress');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isAITurn, setIsAITurn] = useState(false);
  const [isLoadingAiMove, setIsLoadingAiMove] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState<Square | null>(null);

  const { toast } = useToast();

  const updateGame = useCallback((gameInstance: Chess) => {
    setBoard(gameInstance.board());
    const moves = gameInstance.history({ verbose: true });
    setHistory(
      moves.map((move, i) => ({
        san: move.san,
        fen: gameInstance.history({ verbose: true })[i].after,
        by: move.color === 'w' ? 'player' : 'ai',
      }))
    );

    if (gameInstance.isCheckmate()) setStatus('checkmate');
    else if (gameInstance.isStalemate()) setStatus('stalemate');
    else if (gameInstance.isDraw()) setStatus('draw');
    else setStatus('in-progress');

    setIsAITurn(gameInstance.turn() === 'b');
  }, []);

  useEffect(() => {
    if (isAITurn && status === 'in-progress') {
      setIsLoadingAiMove(true);
      const getAiMove = () => {
        const moves = game.moves();
        if (moves.length > 0) {
          const move = moves[Math.floor(Math.random() * moves.length)];
          game.move(move);
          const newGame = new Chess(game.fen());
          setGame(newGame);
          updateGame(newGame);
        }
        setIsLoadingAiMove(false);
      };
      // Delay AI move slightly for better UX
      setTimeout(getAiMove, 500);
    }
  }, [isAITurn, status, game, updateGame]);

  const newGame = useCallback(() => {
    const newGameInstance = new Chess();
    setGame(newGameInstance);
    updateGame(newGameInstance);
    setSelectedPiece(null);
  }, [updateGame]);

  const loadFen = useCallback((fen: string) => {
    try {
      const newGameInstance = new Chess(fen);
      setGame(newGameInstance);
      updateGame(newGameInstance);
      setSelectedPiece(null);
      return true;
    } catch (e) {
      return false;
    }
  }, [updateGame]);

  const undoMove = useCallback(() => {
    const newGameInstance = new Chess(game.fen());
    // Undo twice: player's move and AI's move
    newGameInstance.undo();
    newGameInstance.undo(); 
    setGame(newGameInstance);
    updateGame(newGameInstance);
    setSelectedPiece(null);
  }, [game, updateGame]);

  const handleSquareClick = useCallback(
    (square: Square) => {
      if (isAITurn) return;

      if (!selectedPiece) {
        const piece = game.get(square);
        if (piece && piece.color === game.turn()) {
          setSelectedPiece(square);
        }
      } else {
        try {
          const move = game.move({ from: selectedPiece, to: square, promotion: 'q' });
          if(move) {
            const newGame = new Chess(game.fen());
            setGame(newGame);
            updateGame(newGame);
          }
        } catch (e) {
          // invalid move
        } finally {
            setSelectedPiece(null);
        }
      }
    },
    [game, selectedPiece, isAITurn, updateGame]
  );

  const legalMoves = useMemo(() => {
    if (!selectedPiece) return [];
    const moves = game.moves({ square: selectedPiece, verbose: true });
    return moves.map((move) => move.to);
  }, [selectedPiece, game]);

  const lastMove: Move | null = useMemo(() => {
    const history = game.history({ verbose: true });
    if (history.length === 0) return null;
    const last = history[history.length - 1];
    return { from: last.from, to: last.to };
  }, [game]);

  return {
    board,
    status,
    history,
    isAITurn,
    isLoadingAiMove,
    selectedPiece,
    legalMoves,
    lastMove,
    newGame,
    undoMove,
    loadFen,
    handleSquareClick,
  };
};
