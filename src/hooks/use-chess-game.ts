'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Chess, type Square, type Piece } from 'chess.js';
import { useToast } from '@/hooks/use-toast';
import { suggestBestMove } from '@/ai/flows/suggest-best-move';
import { explainAiMove } from '@/ai/flows/explain-ai-move';
import type {
  Engine,
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

  const [engines, setEngines] = useState<Engine[]>([]);
  const [settings, setSettings] = useState({ engine: 'stockfish', level: 5 });

  const [selectedPiece, setSelectedPiece] = useState<Square | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

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
    const fetchEngines = async () => {
      try {
        const response = await fetch(
          'https://daviszinhovm.westus2.cloudapp.azure.com/api/engines'
        );
        const data = await response.json();
        setEngines(data.engines);
      } catch (error) {
        console.error('Failed to fetch engines:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not fetch chess engines from the server.',
        });
      }
    };
    fetchEngines();
  }, [toast]);

  useEffect(() => {
    if (isAITurn && status === 'in-progress') {
      setIsLoadingAiMove(true);
      const getAiMove = async () => {
        try {
          const result = await suggestBestMove({
            fen: game.fen(),
            engine: settings.engine,
            level: settings.level,
          });
          if (result && result.move) {
            game.move(result.move);
            const newGame = new Chess(game.fen());
            setGame(newGame);
            updateGame(newGame);
          }
        } catch (error) {
          console.error('Error getting AI move:', error);
          toast({
            variant: 'destructive',
            title: 'AI Error',
            description: 'Could not get a move from the AI.',
          });
        } finally {
          setIsLoadingAiMove(false);
        }
      };
      // Delay AI move slightly for better UX
      setTimeout(getAiMove, 500);
    }
  }, [isAITurn, status, game, settings, toast, updateGame]);

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

  const getAiExplanation = useCallback(async (move: HistoryItem) => {
      setIsExplaining(true);
      try {
        const result = await explainAiMove({ fen: move.fen, move: move.san, level: settings.level, engine: settings.engine });
        setAiExplanation(result.explanation);
      } catch (error) {
        console.error('Error getting AI explanation:', error);
        setAiExplanation('Could not get an explanation from the AI.');
      } finally {
        setIsExplaining(false);
      }
    }, [settings]);

  const closeExplanation = () => setAiExplanation(null);

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
    engines,
    settings,
    isAITurn,
    isLoadingAiMove,
    aiExplanation,
    isExplaining,
    selectedPiece,
    legalMoves,
    lastMove,
    newGame,
    undoMove,
    loadFen,
    handleSquareClick,
    setSettings,
    getAiExplanation,
    closeExplanation,
  };
};
