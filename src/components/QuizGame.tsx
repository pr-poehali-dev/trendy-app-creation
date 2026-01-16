import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface QuizGameProps {
  onEarnCoins: (amount: number) => void;
  onClose: () => void;
}

interface Question {
  question: string;
  answers: string[];
  correct: number;
  emoji: string;
}

const questions: Question[] = [
  {
    question: 'Какая планета самая большая в Солнечной системе?',
    answers: ['Земля', 'Юпитер', 'Сатурн', 'Нептун'],
    correct: 1,
    emoji: '🪐',
  },
  {
    question: 'Сколько континентов на Земле?',
    answers: ['5', '6', '7', '8'],
    correct: 2,
    emoji: '🌍',
  },
  {
    question: 'Какой язык программирования создал Гвидо ван Россум?',
    answers: ['JavaScript', 'Python', 'Ruby', 'Java'],
    correct: 1,
    emoji: '🐍',
  },
  {
    question: 'В каком году основали Google?',
    answers: ['1996', '1998', '2000', '2002'],
    correct: 1,
    emoji: '🔍',
  },
  {
    question: 'Какая самая высокая гора в мире?',
    answers: ['К2', 'Эльбрус', 'Эверест', 'Килиманджаро'],
    correct: 2,
    emoji: '⛰️',
  },
  {
    question: 'Сколько игроков в футбольной команде на поле?',
    answers: ['9', '10', '11', '12'],
    correct: 2,
    emoji: '⚽',
  },
  {
    question: 'Какой элемент обозначается символом Au?',
    answers: ['Серебро', 'Золото', 'Алюминий', 'Аргон'],
    correct: 1,
    emoji: '🥇',
  },
  {
    question: 'Какая столица Японии?',
    answers: ['Киото', 'Осака', 'Токио', 'Нагоя'],
    correct: 2,
    emoji: '🗾',
  },
];

const QuizGame = ({ onEarnCoins, onClose }: QuizGameProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [streak, setStreak] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);

  useEffect(() => {
    if (!gameActive || timeLeft <= 0 || selectedAnswer !== null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive, timeLeft, selectedAnswer]);

  const startGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameActive(true);
    setTimeLeft(15);
    setStreak(0);
    setTotalCorrect(0);
  };

  const handleTimeout = () => {
    setStreak(0);
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
        setTimeLeft(15);
      }, 1500);
    } else {
      endGame();
    }
  };

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === questions[currentQuestion].correct;

    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / 3);
      const streakBonus = streak * 10;
      const points = 50 + timeBonus + streakBonus;
      setScore((prev) => prev + points);
      setStreak((prev) => prev + 1);
      setTotalCorrect((prev) => prev + 1);
    } else {
      setStreak(0);
    }

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
        setTimeLeft(15);
      }, 1500);
    } else {
      setTimeout(() => {
        endGame();
      }, 1500);
    }
  };

  const endGame = () => {
    setGameActive(false);
    setShowResult(true);
    if (score > 0) {
      onEarnCoins(score);
    }
  };

  const getAnswerColor = (index: number) => {
    if (selectedAnswer === null) return '';
    if (index === questions[currentQuestion].correct) return 'bg-primary text-primary-foreground border-primary';
    if (index === selectedAnswer) return 'bg-destructive text-destructive-foreground border-destructive';
    return 'opacity-50';
  };

  const getAccuracy = () => {
    return Math.round((totalCorrect / questions.length) * 100);
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
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
              <Icon name="Zap" size={28} className="text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Быстрый квиз</CardTitle>
              <p className="text-sm text-muted-foreground">
                Отвечай быстро и правильно!
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {!gameActive && !showResult && (
            <div className="text-center space-y-4 py-8">
              <div className="text-6xl mb-4">🧠</div>
              <h3 className="text-xl font-bold">Правила игры:</h3>
              <ul className="text-left space-y-2 max-w-xs mx-auto text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>8 вопросов на разные темы</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary">•</span>
                  <span>15 секунд на каждый ответ</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Бонус за скорость и серию правильных ответов</span>
                </li>
              </ul>
              <Button
                size="lg"
                className="w-full gradient-purple-pink hover:opacity-90 transition-opacity text-lg"
                onClick={startGame}
              >
                <Icon name="Play" size={24} className="mr-2" />
                Начать квиз
              </Button>
            </div>
          )}

          {gameActive && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-lg px-4 py-1">
                    {currentQuestion + 1} / {questions.length}
                  </Badge>
                  {streak > 1 && (
                    <Badge className="bg-accent animate-pulse">
                      🔥 Серия: {streak}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Clock" size={18} className="text-accent" />
                  <span className={`font-bold text-lg ${timeLeft <= 5 ? 'text-destructive animate-pulse' : 'text-accent'}`}>
                    {timeLeft}s
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Прогресс</span>
                  <span className="font-bold text-primary">Очки: {score}</span>
                </div>
              </div>

              <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-secondary/10">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="text-6xl">{questions[currentQuestion].emoji}</div>
                  <h3 className="text-xl font-bold">
                    {questions[currentQuestion].question}
                  </h3>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {questions[currentQuestion].answers.map((answer, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="lg"
                    className={`h-auto py-4 text-base hover-scale transition-all ${getAnswerColor(index)}`}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                  >
                    {answer}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {showResult && (
            <div className="text-center space-y-4 py-8">
              <div className="text-6xl mb-4">
                {getAccuracy() >= 75 ? '🏆' : getAccuracy() >= 50 ? '🎉' : '💪'}
              </div>
              <h3 className="text-2xl font-bold">
                {getAccuracy() >= 75 ? 'Отлично!' : getAccuracy() >= 50 ? 'Хорошо!' : 'Продолжай тренироваться!'}
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
                      <p className="text-sm text-muted-foreground mb-1">Точность</p>
                      <p className="text-3xl font-bold text-accent">{getAccuracy()}%</p>
                    </CardContent>
                  </Card>
                </div>
                <p className="text-sm text-muted-foreground">
                  Правильных ответов: {totalCorrect} из {questions.length}
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

export default QuizGame;
