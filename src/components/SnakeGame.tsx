import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Direction, Point } from '../types';
import { GlitchText } from './GlitchText';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = Direction.UP;

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case Direction.UP:
          newHead.y -= 1;
          break;
        case Direction.DOWN:
          newHead.y += 1;
          break;
        case Direction.LEFT:
          newHead.x -= 1;
          break;
        case Direction.RIGHT:
          newHead.x += 1;
          break;
      }

      // Check collisions
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE ||
        prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== Direction.DOWN) setDirection(Direction.UP);
          break;
        case 'ArrowDown':
          if (direction !== Direction.UP) setDirection(Direction.DOWN);
          break;
        case 'ArrowLeft':
          if (direction !== Direction.RIGHT) setDirection(Direction.LEFT);
          break;
        case 'ArrowRight':
          if (direction !== Direction.LEFT) setDirection(Direction.RIGHT);
          break;
        case ' ':
          setIsPaused((p) => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const interval = setInterval(moveSnake, 150);
    return () => clearInterval(interval);
  }, [moveSnake]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid (subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(canvas.width, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#39FF14' : '#39FF1488';
      ctx.shadowBlur = isHead ? 15 : 0;
      ctx.shadowColor = '#39FF14';
      
      ctx.fillRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      );
    });

    // Draw food
    ctx.fillStyle = '#FF00FF';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#FF00FF';
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;

  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative p-1 bg-dark-surface rounded-xl border-4 border-dark-surface shadow-[0_0_30px_rgba(57,255,20,0.1)]">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="block rounded-lg"
        />
        
        {(isGameOver || isPaused) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-10">
            {isGameOver ? (
              <>
                <GlitchText text="SYSTEM_HALTED" className="text-neon-magenta text-2xl font-pixel mb-4" />
                <button
                  onClick={resetGame}
                  className="px-6 py-2 border border-neon-cyan text-neon-cyan font-pixel text-xs hover:bg-neon-cyan hover:text-black transition-colors"
                >
                  REBOOT_SYSTEM
                </button>
              </>
            ) : (
              <>
                <GlitchText text="PAUSED" className="text-neon-cyan text-2xl font-pixel mb-4" />
                <button
                  onClick={() => setIsPaused(false)}
                  className="px-6 py-2 border border-neon-magenta text-neon-magenta font-pixel text-xs hover:bg-neon-magenta hover:text-black transition-colors"
                >
                  RESUME_EXECUTION
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="text-neon-cyan/50 font-terminal text-lg tracking-widest">
        [ ARROW_KEYS ] TO NAVIGATE | [ SPACE ] TO PAUSE
      </div>
    </div>
  );
};
