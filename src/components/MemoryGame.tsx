import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MemoryGameProps {
  onEarnCoins: (amount: number) => void;
  onClose: () => void;
}

interface CardType {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const emojis = ['🚀', '⚡', '🎮', '🏆', '💎', '🔥', '⭐', '🎯'];

const MemoryGame = ({ onEarnCoins, onClose }: MemoryGameProps) => {
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!gameActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive, timeLeft]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      const firstCard = cards.find((c) => c.id === first);
      const secondCard = cards.find((c) => c.id === second);

      if (firstCard?.emoji === secondCard?.emoji) {
        setCards((prev) =>
          prev.map((card) =>
            card.id === first || card.id === second
              ? { ...card, isMatched: true }
              : card
          )
        );
        setMatches((prev) => prev + 1);
        setFlippedCards([]);

        if (matches + 1 === emojis.length) {
          setTimeout(() => endGame(), 500);
        }
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === first || card.id === second
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
      setMoves((prev) => prev + 1);
    }
  }, [flippedCards]);

  const startGame = () => {
    const shuffledEmojis = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(shuffledEmojis);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setTimeLeft(60);
    setGameActive(true);
    setShowResult(false);
    setScore(0);
  };

  const handleCardClick = (id: number) => {
    if (
      flippedCards.length >= 2 ||
      flippedCards.includes(id) ||
      cards.find((c) => c.id === id)?.isMatched
    ) {
      return;
    }

    setCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, isFlipped: true } : card
      )
    );
    setFlippedCards((prev) => [...prev, id]);
  };

  const endGame = () => {
    setGameActive(false);
    setShowResult(true);

    const timeBonus = timeLeft * 10;
    const movesPenalty = Math.max(0, moves - emojis.length * 2) * 5;
    const matchBonus = matches * 100;
    const finalScore = Math.max(0, matchBonus + timeBonus - movesPenalty);

    setScore(finalScore);
    if (finalScore > 0) {
      onEarnCoins(finalScore);
    }
  };

  const getEfficiency = () => {
    if (moves === 0) return 0;
    return Math.min(100, Math.round((matches * 2 / moves) * 100));
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
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Icon name="Brain" size={28} className="text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Мемори</CardTitle>
              <p className="text-sm text-muted-foreground">
                Найди все пары карт!
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {!gameActive && !showResult && (
            <div className="text-center space-y-4 py-8">
              <div className="text-6xl mb-4">🧩</div>
              <h3 className="text-xl font-bold">Правила игры:</h3>
              <ul className="text-left space-y-2 max-w-xs mx-auto text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Открывай по 2 карты за ход</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary">•</span>
                  <span>Найди все 8 пар за 60 секунд</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Бонус за скорость и меньше ходов</span>
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
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <Badge variant="outline" className="text-base px-3 py-1">
                    <Icon name="MousePointerClick" size={16} className="mr-1" />
                    {moves} ходов
                  </Badge>
                  <Badge variant="outline" className="text-base px-3 py-1">
                    <Icon name="CheckCheck" size={16} className="mr-1" />
                    {matches}/{emojis.length}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Clock" size={18} className="text-accent" />
                  <span className={`font-bold text-lg ${timeLeft <= 10 ? 'text-destructive animate-pulse' : 'text-accent'}`}>
                    {timeLeft}s
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {cards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    disabled={card.isFlipped || card.isMatched}
                    className={`aspect-square rounded-xl border-2 text-4xl font-bold transition-all duration-300 hover-scale ${
                      card.isFlipped || card.isMatched
                        ? 'bg-gradient-purple-pink border-primary'
                        : 'bg-card border-border hover:border-primary/50'
                    } ${card.isMatched ? 'opacity-50 scale-95' : ''}`}
                  >
                    {card.isFlipped || card.isMatched ? card.emoji : '❓'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showResult && (
            <div className="text-center space-y-4 py-8">
              <div className="text-6xl mb-4">
                {matches === emojis.length ? '🏆' : '💪'}
              </div>
              <h3 className="text-2xl font-bold">
                {matches === emojis.length ? 'Победа!' : 'Время вышло!'}
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <Card className="border-primary/30">
                    <CardContent className="pt-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Очки</p>
                      <p className="text-2xl font-bold gradient-purple-pink bg-clip-text text-transparent">
                        {score}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-accent/30">
                    <CardContent className="pt-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Пары</p>
                      <p className="text-2xl font-bold text-accent">{matches}/8</p>
                    </CardContent>
                  </Card>
                  <Card className="border-secondary/30">
                    <CardContent className="pt-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Точность</p>
                      <p className="text-2xl font-bold text-secondary">{getEfficiency()}%</p>
                    </CardContent>
                  </Card>
                </div>
                <p className="text-sm text-muted-foreground">
                  Всего ходов: {moves}
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

export default MemoryGame;
