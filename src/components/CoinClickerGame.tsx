import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface CoinClickerGameProps {
  onEarnCoins: (amount: number) => void;
  onClose: () => void;
}

interface FloatingCoin {
  id: number;
  x: number;
  y: number;
}

const CoinClickerGame = ({ onEarnCoins, onClose }: CoinClickerGameProps) => {
  const [clicks, setClicks] = useState(0);
  const [coins, setCoins] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [floatingCoins, setFloatingCoins] = useState<FloatingCoin[]>([]);
  const [shakeButton, setShakeButton] = useState(false);

  useEffect(() => {
    if (!gameActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive, timeLeft]);

  useEffect(() => {
    if (combo >= 10 && combo < 20) {
      setMultiplier(2);
    } else if (combo >= 20 && combo < 30) {
      setMultiplier(3);
    } else if (combo >= 30) {
      setMultiplier(5);
    } else {
      setMultiplier(1);
    }
  }, [combo]);

  useEffect(() => {
    if (!gameActive && timeLeft === 0 && coins > 0) {
      onEarnCoins(coins);
    }
  }, [gameActive, timeLeft, coins, onEarnCoins]);

  const startGame = () => {
    setClicks(0);
    setCoins(0);
    setCombo(0);
    setMultiplier(1);
    setTimeLeft(30);
    setGameActive(true);
    setFloatingCoins([]);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameActive) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newCoin: FloatingCoin = {
      id: Date.now() + Math.random(),
      x,
      y,
    };

    setFloatingCoins((prev) => [...prev, newCoin]);
    setTimeout(() => {
      setFloatingCoins((prev) => prev.filter((coin) => coin.id !== newCoin.id));
    }, 1000);

    setShakeButton(true);
    setTimeout(() => setShakeButton(false), 100);

    setClicks((prev) => prev + 1);
    setCombo((prev) => prev + 1);
    setCoins((prev) => prev + multiplier);
  };

  const getMultiplierColor = () => {
    if (multiplier === 5) return 'text-accent';
    if (multiplier === 3) return 'text-secondary';
    if (multiplier === 2) return 'text-primary';
    return 'text-muted-foreground';
  };

  const getComboMessage = () => {
    if (combo >= 30) return '🔥 МЕГА КОМБО! x5';
    if (combo >= 20) return '⚡ СУПЕР КОМБО! x3';
    if (combo >= 10) return '✨ КОМБО! x2';
    return '';
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-primary/50 animate-scale-in">
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
              <Icon name="Coins" size={28} className="text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Кликер монет</CardTitle>
              <p className="text-sm text-muted-foreground">
                Кликай быстрее, зарабатывай больше!
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {!gameActive && timeLeft === 30 && (
            <div className="text-center space-y-4 py-8">
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-xl font-bold">Правила игры:</h3>
              <ul className="text-left space-y-2 max-w-xs mx-auto text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Кликай по монете 30 секунд</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary">•</span>
                  <span>Собирай комбо для множителя</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>10+ кликов = x2, 20+ = x3, 30+ = x5!</span>
                </li>
              </ul>
              <Button
                size="lg"
                className="w-full gradient-purple-pink hover:opacity-90 transition-opacity text-lg"
                onClick={startGame}
              >
                <Icon name="Play" size={24} className="mr-2" />
                Начать игру
              </Button>
            </div>
          )}

          {gameActive && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-primary/30">
                  <CardContent className="pt-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Монеты</p>
                    <p className="text-3xl font-bold gradient-purple-pink bg-clip-text text-transparent">
                      {coins}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-accent/30">
                  <CardContent className="pt-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Время</p>
                    <p className="text-3xl font-bold text-accent">{timeLeft}s</p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Прогресс</span>
                  <Badge className={getMultiplierColor()}>
                    Множитель: x{multiplier}
                  </Badge>
                </div>
                <Progress value={(combo / 30) * 100} className="h-3" />
                {getComboMessage() && (
                  <p className="text-center font-bold text-lg animate-pulse">
                    {getComboMessage()}
                  </p>
                )}
              </div>

              <div className="relative flex items-center justify-center">
                <button
                  onClick={handleClick}
                  className={`relative w-48 h-48 rounded-full gradient-purple-pink flex items-center justify-center text-8xl hover:scale-110 active:scale-95 transition-transform cursor-pointer border-4 border-white/20 shadow-2xl ${
                    shakeButton ? 'animate-pulse' : ''
                  }`}
                  style={{
                    boxShadow: `0 0 ${40 + combo}px hsl(var(--primary) / 0.8)`,
                  }}
                >
                  💰
                  {floatingCoins.map((coin) => (
                    <span
                      key={coin.id}
                      className="absolute text-2xl font-bold text-accent animate-slide-up pointer-events-none"
                      style={{
                        left: coin.x,
                        top: coin.y,
                        animation: 'slide-up 1s ease-out forwards',
                      }}
                    >
                      +{multiplier}
                    </span>
                  ))}
                </button>
              </div>

              <div className="flex items-center justify-between text-sm bg-muted p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Icon name="MousePointerClick" size={18} className="text-primary" />
                  <span className="font-semibold">Кликов: {clicks}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Zap" size={18} className="text-secondary" />
                  <span className="font-semibold">Комбо: {combo}</span>
                </div>
              </div>
            </div>
          )}

          {!gameActive && timeLeft === 0 && (
            <div className="text-center space-y-4 py-8">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold">Игра окончена!</h3>
              <div className="space-y-2">
                <p className="text-lg">
                  Вы заработали:{' '}
                  <span className="font-bold text-accent text-2xl">{coins}</span> монет
                </p>
                <p className="text-sm text-muted-foreground">
                  Всего кликов: {clicks} • Макс комбо: {combo}
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

export default CoinClickerGame;
