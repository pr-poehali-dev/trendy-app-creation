import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SpaceRaidGameProps {
  onEarnCoins: (amount: number) => void;
  onClose: () => void;
}

interface Position {
  x: number;
  y: number;
}

interface Enemy {
  id: number;
  x: number;
  y: number;
  emoji: string;
  speed: number;
}

const SpaceRaidGame = ({ onEarnCoins, onClose }: SpaceRaidGameProps) => {
  const [playerPos, setPlayerPos] = useState<Position>({ x: 50, y: 80 });
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameActive, setGameActive] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [level, setLevel] = useState(1);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const enemyIdRef = useRef(0);

  const enemyEmojis = ['👾', '🛸', '☄️', '💀', '🤖'];

  useEffect(() => {
    if (!gameActive) return;

    const spawnEnemy = () => {
      const newEnemy: Enemy = {
        id: enemyIdRef.current++,
        x: Math.random() * 90,
        y: -5,
        emoji: enemyEmojis[Math.floor(Math.random() * enemyEmojis.length)],
        speed: 0.5 + level * 0.2,
      };
      setEnemies((prev) => [...prev, newEnemy]);
    };

    const spawnInterval = setInterval(spawnEnemy, Math.max(500, 1500 - level * 100));

    return () => clearInterval(spawnInterval);
  }, [gameActive, level]);

  useEffect(() => {
    if (!gameActive) return;

    const moveEnemies = setInterval(() => {
      setEnemies((prev) => {
        const updated = prev.map((enemy) => ({
          ...enemy,
          y: enemy.y + enemy.speed,
        }));

        const collision = updated.some(
          (enemy) =>
            enemy.y >= playerPos.y - 5 &&
            enemy.y <= playerPos.y + 5 &&
            Math.abs(enemy.x - playerPos.x) < 8
        );

        if (collision) {
          setLives((prevLives) => {
            const newLives = prevLives - 1;
            if (newLives <= 0) {
              endGame();
            }
            return newLives;
          });
          return updated.filter(
            (enemy) =>
              !(
                enemy.y >= playerPos.y - 5 &&
                enemy.y <= playerPos.y + 5 &&
                Math.abs(enemy.x - playerPos.x) < 8
              )
          );
        }

        return updated.filter((enemy) => enemy.y < 100);
      });
    }, 50);

    return () => clearInterval(moveEnemies);
  }, [gameActive, playerPos]);

  useEffect(() => {
    if (!gameActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!gameAreaRef.current) return;
      const rect = gameAreaRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      setPlayerPos({ x: Math.max(5, Math.min(95, x)), y: 80 });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!gameAreaRef.current) return;
      const rect = gameAreaRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      const x = ((touch.clientX - rect.left) / rect.width) * 100;
      setPlayerPos({ x: Math.max(5, Math.min(95, x)), y: 80 });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive) return;

    const scoreInterval = setInterval(() => {
      setScore((prev) => prev + level);
    }, 100);

    return () => clearInterval(scoreInterval);
  }, [gameActive, level]);

  useEffect(() => {
    if (score > 0 && score % 500 === 0) {
      setLevel((prev) => prev + 1);
    }
  }, [score]);

  const startGame = () => {
    setPlayerPos({ x: 50, y: 80 });
    setEnemies([]);
    setScore(0);
    setLives(3);
    setLevel(1);
    setGameActive(true);
    setShowResult(false);
  };

  const endGame = () => {
    setGameActive(false);
    setShowResult(true);
    if (score > 0) {
      onEarnCoins(Math.floor(score / 10));
    }
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-primary/50 animate-scale-in">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
              <Icon name="Rocket" size={28} className="text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Космический рейд</CardTitle>
              <p className="text-sm text-muted-foreground">
                Уклоняйся от врагов!
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {!gameActive && !showResult && (
            <div className="text-center space-y-4 py-8">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-xl font-bold">Правила игры:</h3>
              <ul className="text-left space-y-2 max-w-xs mx-auto text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Управляй кораблём мышкой или пальцем</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary">•</span>
                  <span>Уклоняйся от падающих врагов</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Чем дольше продержишься, тем больше очков</span>
                </li>
              </ul>
              <Button
                size="lg"
                className="w-full gradient-purple-pink hover:opacity-90 transition-opacity text-lg"
                onClick={startGame}
              >
                <Icon name="Play" size={24} className="mr-2" />
                Начать полёт
              </Button>
            </div>
          )}

          {gameActive && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <Badge variant="outline" className="text-base px-3 py-1">
                    <Icon name="Target" size={16} className="mr-1" />
                    Очки: {score}
                  </Badge>
                  <Badge variant="outline" className="text-base px-3 py-1 bg-accent/20 border-accent">
                    <Icon name="Zap" size={16} className="mr-1" />
                    Уровень {level}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        i < lives ? 'bg-destructive' : 'bg-muted'
                      }`}
                    >
                      <Icon name="Heart" size={16} className={i < lives ? 'text-white' : 'text-muted-foreground'} />
                    </div>
                  ))}
                </div>
              </div>

              <div
                ref={gameAreaRef}
                className="relative w-full h-96 bg-gradient-to-b from-purple-900/20 to-blue-900/20 rounded-xl border-2 border-primary/30 overflow-hidden cursor-none"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.2) 0%, rgba(0,0,0,0.8) 100%)',
                }}
              >
                {enemies.map((enemy) => (
                  <div
                    key={enemy.id}
                    className="absolute text-3xl transition-none pointer-events-none"
                    style={{
                      left: `${enemy.x}%`,
                      top: `${enemy.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {enemy.emoji}
                  </div>
                ))}

                <div
                  className="absolute text-4xl transition-none pointer-events-none"
                  style={{
                    left: `${playerPos.x}%`,
                    top: `${playerPos.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  🚀
                </div>

                <div className="absolute inset-0 flex items-center justify-center text-white/10 text-6xl font-bold pointer-events-none">
                  ✦ ✦ ✦
                </div>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Двигай мышкой или пальцем для управления
              </p>
            </div>
          )}

          {showResult && (
            <div className="text-center space-y-4 py-8">
              <div className="text-6xl mb-4">
                {score >= 1000 ? '🏆' : score >= 500 ? '⭐' : '💫'}
              </div>
              <h3 className="text-2xl font-bold">
                {score >= 1000 ? 'Невероятно!' : score >= 500 ? 'Отлично!' : 'Хорошая попытка!'}
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="border-primary/30">
                    <CardContent className="pt-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Очки</p>
                      <p className="text-3xl font-bold gradient-purple-pink bg-clip-text text-transparent">
                        {score}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-accent/30">
                    <CardContent className="pt-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Уровень</p>
                      <p className="text-3xl font-bold text-accent">{level}</p>
                    </CardContent>
                  </Card>
                </div>
                <p className="text-sm text-muted-foreground">
                  Награда: {Math.floor(score / 10)} монет
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                >
                  Выйти
                </Button>
                <Button
                  size="lg"
                  className="flex-1 gradient-purple-pink hover:opacity-90"
                  onClick={startGame}
                >
                  <Icon name="RotateCcw" size={20} className="mr-2" />
                  Ещё раз
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SpaceRaidGame;
