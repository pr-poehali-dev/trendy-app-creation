import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import CoinClickerGame from '@/components/CoinClickerGame';
import QuizGame from '@/components/QuizGame';
import MemoryGame from '@/components/MemoryGame';
import SpaceRaidGame from '@/components/SpaceRaidGame';
import { useToast } from '@/hooks/use-toast';

type Screen = 'home' | 'profile' | 'games' | 'shop' | 'achievements' | 'leaderboard' | 'settings';

const Index = () => {
  const { toast } = useToast();
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [coins, setCoins] = useState(1250);
  const [gems, setGems] = useState(48);
  const [level, setLevel] = useState(12);
  const [xp, setXp] = useState(750);
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [showCoinClicker, setShowCoinClicker] = useState(false);
  const [showQuizGame, setShowQuizGame] = useState(false);
  const [showMemoryGame, setShowMemoryGame] = useState(false);
  const [showSpaceRaid, setShowSpaceRaid] = useState(false);

  const games = [
    { id: 1, name: 'Кликер монет', icon: 'Coins', color: 'accent', players: 3542, prize: 200, isPlayable: true },
    { id: 2, name: 'Космический рейд', icon: 'Rocket', color: 'primary', players: 1248, prize: 500, isPlayable: true },
    { id: 3, name: 'Быстрый квиз', icon: 'Zap', color: 'secondary', players: 2103, prize: 250, isPlayable: true },
    { id: 4, name: 'Мемори', icon: 'Brain', color: 'primary', players: 1876, prize: 300, isPlayable: true },
  ];

  const achievements = [
    { id: 1, name: 'Первая победа', desc: 'Выиграй первую игру', progress: 100, icon: 'Award', color: 'primary' },
    { id: 2, name: 'Коллекционер', desc: 'Собери 50 монет', progress: 100, icon: 'Coins', color: 'accent' },
    { id: 3, name: 'Легенда', desc: 'Достигни 10 уровня', progress: 100, icon: 'Crown', color: 'secondary' },
    { id: 4, name: 'Марафонец', desc: 'Сыграй 100 игр', progress: 65, icon: 'Target', color: 'primary' },
    { id: 5, name: 'Социал', desc: 'Добавь 10 друзей', progress: 30, icon: 'Users', color: 'secondary' },
  ];

  const shopItems = [
    { id: 1, name: 'Аватар "Космонавт"', price: 500, type: 'coins', icon: 'Sparkles', rarity: 'epic' },
    { id: 2, name: 'Бустер XP x2', price: 10, type: 'gems', icon: 'Zap', rarity: 'rare' },
    { id: 3, name: 'Рамка "Золото"', price: 750, type: 'coins', icon: 'Frame', rarity: 'legendary' },
    { id: 4, name: 'Эмоция "Победа"', price: 5, type: 'gems', icon: 'Heart', rarity: 'common' },
  ];

  const leaderboard = [
    { rank: 1, name: 'ProGamer_X', level: 45, score: 15420, avatar: '🏆' },
    { rank: 2, name: 'NinjaKiller', level: 42, score: 14890, avatar: '⚔️' },
    { rank: 3, name: 'SpeedRunner', level: 40, score: 13750, avatar: '⚡' },
    { rank: 4, name: 'CyberWolf', level: 38, score: 12900, avatar: '🐺' },
    { rank: 5, name: 'Вы', level: 12, score: 3250, avatar: '🚀', isUser: true },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-muted text-muted-foreground';
      case 'rare': return 'bg-primary text-primary-foreground';
      case 'epic': return 'bg-secondary text-secondary-foreground';
      case 'legendary': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted';
    }
  };

  const handlePlayGame = (gameId: number) => {
    const game = games.find(g => g.id === gameId);
    if (game?.isPlayable) {
      switch (gameId) {
        case 1:
          setShowCoinClicker(true);
          break;
        case 2:
          setShowSpaceRaid(true);
          break;
        case 3:
          setShowQuizGame(true);
          break;
        case 4:
          setShowMemoryGame(true);
          break;
        default:
          toast({
            title: 'Скоро!',
            description: 'Эта игра пока в разработке 🎮',
          });
      }
    } else {
      toast({
        title: 'Скоро!',
        description: 'Эта игра пока в разработке 🎮',
      });
    }
  };

  const handleEarnCoins = (amount: number) => {
    setCoins(prev => prev + amount);
    setXp(prev => prev + Math.floor(amount / 2));
    toast({
      title: '🎉 Награда получена!',
      description: `Вы заработали ${amount} монет и ${Math.floor(amount / 2)} XP!`,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🎮</div>
            <h1 className="text-2xl font-bold gradient-purple-pink bg-clip-text text-transparent">GameHub</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">
              <Icon name="Coins" size={18} className="text-accent" />
              <span className="font-bold text-sm">{coins}</span>
            </div>
            <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">
              <Icon name="Gem" size={18} className="text-primary" />
              <span className="font-bold text-sm">{gems}</span>
            </div>
            <Avatar className="h-9 w-9 border-2 border-primary">
              <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                {level}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6">
        {currentScreen === 'home' && (
          <div className="space-y-6 animate-fade-in">
            <Card className="border-primary/50 bg-gradient-to-br from-primary/20 to-secondary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl mb-2">Добро пожаловать! 🚀</CardTitle>
                    <CardDescription className="text-base">Уровень {level} • {xp}/1000 XP</CardDescription>
                  </div>
                  <div className="text-5xl">🎯</div>
                </div>
              </CardHeader>
              <CardContent>
                <Progress value={(xp / 1000) * 100} className="h-3" />
              </CardContent>
            </Card>

            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Icon name="Gamepad2" size={28} className="text-primary" />
                Популярные игры
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {games.map((game, index) => (
                  <Card key={game.id} className="hover-scale cursor-pointer border-border hover:border-primary/50 transition-all" style={{ animationDelay: `${index * 100}ms` }}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl bg-${game.color} flex items-center justify-center`}>
                            <Icon name={game.icon as any} size={24} className="text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{game.name}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <Icon name="Users" size={14} />
                              {game.players} игроков
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-accent/20 text-accent border-accent/50">
                          <Icon name="Trophy" size={12} className="mr-1" />
                          {game.prize}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className="w-full gradient-purple-pink hover:opacity-90 transition-opacity" 
                        size="lg"
                        onClick={() => handlePlayGame(game.id)}
                      >
                        <Icon name="Play" size={18} className="mr-2" />
                        Играть
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="TrendingUp" size={24} className="text-secondary" />
                  Ежедневные задания
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Icon name="Target" size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Выиграй 3 игры</p>
                      <p className="text-sm text-muted-foreground">1/3 выполнено</p>
                    </div>
                  </div>
                  <Badge className="bg-accent">+100 XP</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                      <Icon name="Handshake" size={20} className="text-secondary" />
                    </div>
                    <div>
                      <p className="font-semibold">Пригласи друга</p>
                      <p className="text-sm text-muted-foreground">0/1 выполнено</p>
                    </div>
                  </div>
                  <Badge className="bg-accent">+50 💎</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentScreen === 'profile' && (
          <div className="space-y-6 animate-fade-in">
            <Card className="border-primary/50">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-24 w-24 border-4 border-primary animate-pulse-glow">
                    <AvatarFallback className="bg-gradient-purple-pink text-white text-3xl font-bold">
                      {level}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">ProPlayer</h2>
                    <p className="text-muted-foreground">Уровень {level}</p>
                  </div>
                  <div className="w-full max-w-md">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Прогресс</span>
                      <span className="font-bold">{xp}/1000 XP</span>
                    </div>
                    <Progress value={(xp / 1000) * 100} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-primary/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Icon name="Trophy" size={20} className="text-accent" />
                    Побед
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold gradient-orange-pink bg-clip-text text-transparent">147</p>
                </CardContent>
              </Card>

              <Card className="border-secondary/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Icon name="Gamepad2" size={20} className="text-secondary" />
                    Игр сыграно
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-secondary">312</p>
                </CardContent>
              </Card>

              <Card className="border-primary/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Icon name="Users" size={20} className="text-primary" />
                    Друзья
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">23</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Последние достижения</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {achievements.slice(0, 3).map((ach) => (
                  <div key={ach.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className={`w-12 h-12 rounded-lg bg-${ach.color} flex items-center justify-center`}>
                      <Icon name={ach.icon as any} size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{ach.name}</p>
                      <p className="text-sm text-muted-foreground">{ach.desc}</p>
                    </div>
                    {ach.progress === 100 && (
                      <Icon name="CheckCircle2" size={24} className="text-primary" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {currentScreen === 'games' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <Icon name="Gamepad2" size={32} className="text-primary" />
                Все игры
              </h2>
              <Button variant="outline" size="sm">
                <Icon name="Filter" size={16} className="mr-2" />
                Фильтр
              </Button>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="all">Все</TabsTrigger>
                <TabsTrigger value="action">Экшен</TabsTrigger>
                <TabsTrigger value="strategy">Стратегия</TabsTrigger>
                <TabsTrigger value="casual">Казуальные</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {games.map((game, index) => (
                  <Card key={game.id} className="hover-scale cursor-pointer transition-all hover:border-primary/50" style={{ animationDelay: `${index * 100}ms` }}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-2xl bg-${game.color} flex items-center justify-center flex-shrink-0`}>
                          <Icon name={game.icon as any} size={32} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-1">{game.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Icon name="Users" size={14} />
                              {game.players} онлайн
                            </span>
                            <span className="flex items-center gap-1">
                              <Icon name="Trophy" size={14} />
                              Приз: {game.prize} монет
                            </span>
                          </div>
                        </div>
                        <Button 
                          size="lg" 
                          className="gradient-purple-pink hover:opacity-90 transition-opacity"
                          onClick={() => handlePlayGame(game.id)}
                        >
                          <Icon name="Play" size={20} className="mr-2" />
                          Играть
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        )}

        {currentScreen === 'shop' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <Icon name="ShoppingBag" size={32} className="text-accent" />
                Магазин
              </h2>
              <div className="flex gap-3">
                <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border border-border">
                  <Icon name="Coins" size={20} className="text-accent" />
                  <span className="font-bold">{coins}</span>
                </div>
                <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border border-border">
                  <Icon name="Gem" size={20} className="text-primary" />
                  <span className="font-bold">{gems}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shopItems.map((item, index) => (
                <Card key={item.id} className="hover-scale cursor-pointer overflow-hidden" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className={`h-2 ${item.rarity === 'legendary' ? 'gradient-orange-pink' : item.rarity === 'epic' ? 'gradient-purple-pink' : `bg-${item.rarity === 'rare' ? 'primary' : 'muted'}`}`}></div>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="w-14 h-14 rounded-xl bg-gradient-purple-pink flex items-center justify-center mb-3">
                        <Icon name={item.icon as any} size={28} className="text-white" />
                      </div>
                      <Badge className={getRarityColor(item.rarity)}>
                        {item.rarity}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      <Icon name={item.type === 'gems' ? 'Gem' : 'Coins'} size={16} className="mr-2" />
                      {item.price} {item.type === 'gems' ? 'кристаллов' : 'монет'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-primary/50 bg-gradient-to-r from-primary/10 to-secondary/10">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="text-4xl">💎</div>
                  <div>
                    <CardTitle>Нужно больше кристаллов?</CardTitle>
                    <CardDescription>Купи пакет со скидкой 30%</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button variant="outline" className="h-auto py-4 flex flex-col gap-1">
                    <Icon name="Gem" size={24} className="text-primary mb-1" />
                    <span className="font-bold">100 💎</span>
                    <span className="text-xs text-muted-foreground">$4.99</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col gap-1 border-primary">
                    <Badge className="mb-1 bg-accent">-30%</Badge>
                    <Icon name="Gem" size={24} className="text-primary mb-1" />
                    <span className="font-bold">500 💎</span>
                    <span className="text-xs text-muted-foreground">$19.99</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col gap-1">
                    <Icon name="Gem" size={24} className="text-primary mb-1" />
                    <span className="font-bold">1000 💎</span>
                    <span className="text-xs text-muted-foreground">$39.99</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentScreen === 'achievements' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <Icon name="Award" size={32} className="text-secondary" />
                Достижения
              </h2>
              <Badge variant="outline" className="text-lg px-4 py-1">
                {achievements.filter(a => a.progress === 100).length}/{achievements.length}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((ach, index) => (
                <Card key={ach.id} className={`hover-scale transition-all ${ach.progress === 100 ? 'border-primary/50 bg-primary/5' : ''}`} style={{ animationDelay: `${index * 100}ms` }}>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-${ach.color} flex items-center justify-center flex-shrink-0 ${ach.progress === 100 ? 'animate-pulse-glow' : ''}`}>
                        <Icon name={ach.icon as any} size={28} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <CardTitle className="text-lg">{ach.name}</CardTitle>
                            <CardDescription>{ach.desc}</CardDescription>
                          </div>
                          {ach.progress === 100 && (
                            <Icon name="CheckCircle2" size={24} className="text-primary" />
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Прогресс</span>
                            <span className="font-bold">{ach.progress}%</span>
                          </div>
                          <Progress value={ach.progress} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentScreen === 'leaderboard' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <Icon name="BarChart3" size={32} className="text-primary" />
                Рейтинг
              </h2>
              <Button variant="outline" size="sm">
                <Icon name="Calendar" size={16} className="mr-2" />
                Эта неделя
              </Button>
            </div>

            <Card className="border-primary/50">
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {leaderboard.map((player, index) => (
                    <div
                      key={player.rank}
                      className={`flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors ${player.isUser ? 'bg-primary/10 border-l-4 border-primary' : ''}`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${player.rank === 1 ? 'bg-accent text-white' : player.rank === 2 ? 'bg-secondary text-white' : player.rank === 3 ? 'bg-primary text-white' : 'bg-muted'}`}>
                        {player.rank}
                      </div>
                      <div className="text-3xl">{player.avatar}</div>
                      <div className="flex-1">
                        <p className="font-bold text-lg">{player.name}</p>
                        <p className="text-sm text-muted-foreground">Уровень {player.level}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl gradient-purple-pink bg-clip-text text-transparent">{player.score}</p>
                        <p className="text-xs text-muted-foreground">очков</p>
                      </div>
                      {player.rank <= 3 && (
                        <Icon name="Trophy" size={24} className={player.rank === 1 ? 'text-accent' : player.rank === 2 ? 'text-secondary' : 'text-primary'} />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="TrendingUp" size={24} className="text-accent" />
                  Ваша статистика
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-primary">+125</p>
                    <p className="text-sm text-muted-foreground mt-1">За эту неделю</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-secondary">↑ 15</p>
                    <p className="text-sm text-muted-foreground mt-1">Позиций вверх</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentScreen === 'settings' && (
          <div className="space-y-6 animate-fade-in max-w-2xl">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Icon name="Settings" size={32} className="text-muted-foreground" />
              Настройки
            </h2>

            <Card>
              <CardHeader>
                <CardTitle>Профиль</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Имя пользователя</Label>
                  <Input id="username" defaultValue="ProPlayer" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="player@gamehub.com" />
                </div>
                <Button className="w-full">Сохранить изменения</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Уведомления</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications" className="text-base">Уведомления</Label>
                    <p className="text-sm text-muted-foreground">Получать уведомления о событиях</p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sound" className="text-base">Звук</Label>
                    <p className="text-sm text-muted-foreground">Включить звуковые эффекты</p>
                  </div>
                  <Switch
                    id="sound"
                    checked={sound}
                    onCheckedChange={setSound}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Приватность</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Профиль виден всем</Label>
                    <p className="text-sm text-muted-foreground">Другие игроки могут видеть ваш профиль</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Показывать онлайн-статус</Label>
                    <p className="text-sm text-muted-foreground">Друзья видят когда вы в сети</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">Опасная зона</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full">Сбросить прогресс</Button>
                <Button variant="destructive" className="w-full">Удалить аккаунт</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
        <div className="container px-4">
          <div className="flex items-center justify-around h-16">
            {[
              { screen: 'home' as Screen, icon: 'Home', label: 'Главная' },
              { screen: 'games' as Screen, icon: 'Gamepad2', label: 'Игры' },
              { screen: 'shop' as Screen, icon: 'ShoppingBag', label: 'Магазин' },
              { screen: 'achievements' as Screen, icon: 'Award', label: 'Награды' },
              { screen: 'leaderboard' as Screen, icon: 'BarChart3', label: 'Рейтинг' },
              { screen: 'profile' as Screen, icon: 'User', label: 'Профиль' },
              { screen: 'settings' as Screen, icon: 'Settings', label: 'Настройки' },
            ].map((item) => (
              <button
                key={item.screen}
                onClick={() => setCurrentScreen(item.screen)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all hover-scale ${
                  currentScreen === item.screen
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={item.icon as any} size={24} />
                <span className="text-xs font-medium hidden sm:block">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {showCoinClicker && (
        <CoinClickerGame
          onEarnCoins={handleEarnCoins}
          onClose={() => setShowCoinClicker(false)}
        />
      )}

      {showQuizGame && (
        <QuizGame
          onEarnCoins={handleEarnCoins}
          onClose={() => setShowQuizGame(false)}
        />
      )}

      {showMemoryGame && (
        <MemoryGame
          onEarnCoins={handleEarnCoins}
          onClose={() => setShowMemoryGame(false)}
        />
      )}

      {showSpaceRaid && (
        <SpaceRaidGame
          onEarnCoins={handleEarnCoins}
          onClose={() => setShowSpaceRaid(false)}
        />
      )}
    </div>
  );
};

export default Index;