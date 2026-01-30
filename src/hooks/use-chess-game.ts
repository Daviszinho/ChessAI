'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Chess, type Square } from 'chess.js';
import { useToast } from '@/hooks/use-toast';
import type {
  HistoryItem,
  GameStatus,
  Move,
  EngineType,
} from '@/lib/types';
import { suggestBestMove } from '@/ai/flows/suggest-best-move';

export const useChessGame = () => {
  const [game, setGame] = useState(new Chess());
  const [position, setPosition] = useState(game.fen());
  const [status, setStatus] = useState<GameStatus>('in-progress');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isAITurn, setIsAITurn] = useState(false);
  const [isLoadingAiMove, setIsLoadingAiMove] = useState(false);
  const [engine, setEngine] = useState<EngineType>('stockfish');

  const { toast } = useToast();

  const updateGame = useCallback((gameInstance: Chess) => {
    setPosition(gameInstance.fen());
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
      const getAiMove = async () => {
        setIsLoadingAiMove(true);
        try {
          const { move: aiMove } = await suggestBestMove({
            fen: game.fen(),
            engine: engine,
            level: 5,
          });

          const gameCopy = new Chess(game.fen());
          if (gameCopy.move(aiMove)) {
            setGame(gameCopy);
            updateGame(gameCopy);
          } else {
            console.error('API move is invalid', aiMove);
            toast({
              variant: 'destructive',
              title: 'AI Error',
              description: 'AI returned an invalid move.',
            });
          }
        } catch (error: any) {
          console.error('Failed to get AI move from API.', error);
          toast({
            variant: 'destructive',
            title: 'AI Error',
            description: `Could not fetch AI move: ${error.message}`,
          });
        } finally {
          setIsLoadingAiMove(false);
        }
      };

      // Delay AI move slightly for better UX
      setTimeout(getAiMove, 500);
    }
  }, [isAITurn, status, game, updateGame, toast, engine]);

  const newGame = useCallback(() => {
    const newGameInstance = new Chess();
    setGame(newGameInstance);
    updateGame(newGameInstance);
  }, [updateGame]);

  const loadFen = useCallback((fen: string) => {
    try {
      const newGameInstance = new Chess(fen);
      setGame(newGameInstance);
      updateGame(newGameInstance);
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
  }, [game, updateGame]);

  const onDrop = (sourceSquare: Square, targetSquare: Square): boolean => {
    if (isAITurn) return false;

    const gameCopy = new Chess(game.fen());
    try {
        const move = gameCopy.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q', // NOTE: always promote to a queen for example simplicity
        });
        
        // illegal move
        if (move === null) {
            return false;
        }

        setGame(gameCopy);
        updateGame(gameCopy);
        return true;

    } catch (error) {
        return false;
    }
  };


  const lastMove: Move | null = useMemo(() => {
    const history = game.history({ verbose: true });
    if (history.length === 0) return null;
    const last = history[history.length - 1];
    return { from: last.from, to: last.to };
  }, [game]);

  return {
    position,
    status,
    history,
    isAITurn,
    isLoadingAiMove,
    lastMove,
    engine,
    setEngine,
    newGame,
    undoMove,
    loadFen,
    onDrop,
  };
};
