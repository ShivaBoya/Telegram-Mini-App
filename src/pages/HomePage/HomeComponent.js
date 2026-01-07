import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTelegram } from "../../reactContext/TelegramContext.js";
import { ref, onValue } from "firebase/database";
import { database } from "../../services/FirebaseConfig";
import {
  ChevronRight,
  Award,
  Zap,
  Users,
  Wallet,
  CheckSquare,
  Menu,
  Bell,
  GamepadIcon,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { motion } from "framer-motion";
import { Progress } from "../../components/ui/progress";
import FarmingButton from "../FarmPage/FarmingButton.js";
import useFarming from '../FarmPage/UseFarming.js';
import { useStreak } from "../../reactContext/StreakTracker.js";
import WelcomePopup from "../NetworkPage/WelcomePopup";
import { useReferral } from "../../reactContext/ReferralContext";

export default function HomeComponent() {
  const navigate = useNavigate();
  const { user, scores } = useTelegram();
  const { showWelcomePopup, setShowWelcomePopup } = useReferral();

  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [isFarming, setIsFarming] = useState(false);
  const [points, setPoints] = useState(120);
  const [farmingProgress, setFarmingProgress] = useState(0);
  // const { farmingState } = useFarming();
  const { currentStreak, loadingStreak } = useStreak();

  // Tasks Fetching
  const [tasks, setTasks] = useState([]);
  const [userTasks, setUserTasks] = useState({});
  const [newsCount, setNewsCount] = useState(0);

  useEffect(() => {
    const tasksRef = ref(database, "tasks");
    const userTasksRef = ref(database, `connections/${user.id}`);
    const newsRef = ref(database, `connections/${user.id}/tasks/daily/news`);

    const unsubscribeTasks = onValue(tasksRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const tasksArray = Object.entries(data).map(([key, task]) => ({
          ...task,
          id: task.id || key,
        }));
        setTasks(tasksArray);
      } else {
        setTasks([]);
      }
    });

    const unsubscribeUserTasks = onValue(userTasksRef, (snapshot) => {
      setUserTasks(snapshot.exists() ? snapshot.val() : {});
    });

    const unsubscribeNews = onValue(newsRef, (snapshot) => {
      setNewsCount(snapshot.exists() ? Object.keys(snapshot.val() || {}).length : 0);
    });

    return () => {
      unsubscribeTasks();
      unsubscribeUserTasks();
      unsubscribeNews();
    };
  }, [user.id]);

  // Mock news data
  const newsItems = [
    {
      id: 1,
      title: "TON Blockchain Adoption Surges Among Developers",
      summary:
        "The Open Network (TON) is seeing unprecedented growth in developer activity as more applications are being built on the blockchain.",
      category: "Development",
      imageUrl: "https://i.postimg.cc/sDzjfdS0/Ton-Image.jpg",
      readTime: "4 min",
    },
    {
      id: 2,
      title: "Ethereum Layer 2 Solutions See Record Growth",
      summary:
        "Layer 2 scaling solutions on Ethereum have reached an all-time high in total value locked, with Arbitrum and Optimism leading the charge.",
      category: "Blockchain",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/StockCake-Ethereum%27s%20Digital%20Glow_1742209026.jpg-5LEdYRUDNMmXP3kO8VQLYl4bo7nnTL.jpeg",
      readTime: "3 min",
    },
    {
      id: 3,
      title: "New NFT Collection Raises $10M for Charity",
      summary:
        "A new NFT collection featuring digital art from renowned artists has raised over $10 million for environmental conservation efforts.",
      category: "NFTs",
      imageUrl: "https://i.postimg.cc/59XXZV1c/NFT-Image.jpg",
      readTime: "2 min",
    },

    {
      id: 4,
      title: "Bitcoin Mining Becomes More Sustainable",
      summary:
        "Major Bitcoin mining operations are transitioning to renewable energy sources, addressing environmental concerns about cryptocurrency mining.",
      category: "Sustainability",
      imageUrl: "https://i.postimg.cc/DyGXHThj/Bit-Coin-Image.jpg",
      readTime: "5 min",
    },
    {
      id: 5,
      title: "DeFi Protocol Launches Cross-Chain Bridge",
      summary:
        "A popular DeFi protocol has launched a new cross-chain bridge allowing users to transfer assets between multiple blockchains with minimal fees.",
      category: "DeFi",
      imageUrl: "https://i.postimg.cc/kM0shCzG/Defi-Image.jpg",
      readTime: "3 min",
    },
  ]

  // Simulate farming progress
  useEffect(() => {
    if (isFarming) {
      const interval = setInterval(() => {
        setFarmingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 0.4;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isFarming]);

  // Handle swipe on news card
  const handleSwipe = (direction) => {
    // Add points for engagement if swiped "Interesting"
    if (direction === "right") {
      setPoints((prev) => prev + 5);
    }
    // Move to next news item
    setCurrentNewsIndex((prev) => (prev + 1) % newsItems.length);
  };

  // Handle farming button click
  const handleFarmingClick = () => {
    if (farmingProgress === 100) {
      // Claim points
      setPoints((prev) => prev + 50);
      setFarmingProgress(0);
      setIsFarming(false);
    } else {
      // Start farming
      setIsFarming(true);
    }
  };

  const isToday = (timestamp) => {
    if (!timestamp) return false;
    const date = new Date(timestamp);
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isTaskDone = (task) => {
    const { id, type } = task;
    const status = userTasks[id];
    if (status === undefined || status === null || status === false) return false;

    const RESET_TYPES = ['game', 'news', 'partnership'];
    if (RESET_TYPES.includes(type)) {
      if (task.category === 'achievements') return true;
      if (status === true) return false;
      if (typeof status === 'object' && status.lastClaimed) {
        return isToday(status.lastClaimed);
      }
      return false;
    }
    return true;
  };

  // Navigate to /game on "Play Game" button click
  const handlePlayGame = () => {
    navigate("/game");
  };

  return (
    <div className="flex justify-center items-center min-h-screen  bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating circles */}
        <div className="absolute top-[10%] left-[15%] w-32 h-32 rounded-full bg-blue-500/10 blur-xl animate-pulse"></div>
        <div
          className="absolute top-[40%] right-[10%] w-40 h-40 rounded-full bg-purple-500/10 blur-xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-[20%] left-[25%] w-36 h-36 rounded-full bg-pink-500/10 blur-xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Glowing lines */}
        <div className="absolute top-0 left-0 w-full h-full">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#EC4899" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <path
              d="M0,100 Q250,50 500,100 T1000,100"
              stroke="url(#grad1)"
              strokeWidth="2"
              fill="none"
              opacity="0.5"
            />
            <path
              d="M0,200 Q250,150 500,200 T1000,200"
              stroke="url(#grad1)"
              strokeWidth="2"
              fill="none"
              opacity="0.3"
            />
            <path
              d="M0,300 Q250,250 500,300 T1000,300"
              stroke="url(#grad1)"
              strokeWidth="2"
              fill="none"
              opacity="0.2"
            />
          </svg>
        </div>

        {/* Particle effect */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/30"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                opacity: Math.random() * 0.5 + 0.3,
                animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Mobile width container */}
      <div className="w-full max-w-md">
        <div className="w-full h-full overflow-hidden flex flex-col relative">
          {/* Beautiful Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 via-purple-600/80 to-pink-600/90 z-0">
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path
                      d="M 20 0 L 0 0 0 20"
                      fill="none"
                      stroke="white"
                      strokeWidth="0.5"
                      opacity="0.5"
                    />
                  </pattern>
                  <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                    <rect width="80" height="80" fill="url(#smallGrid)" />
                    <path
                      d="M 80 0 L 0 0 0 80"
                      fill="none"
                      stroke="white"
                      strokeWidth="1"
                      opacity="0.8"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Floating Shapes */}
            <div className="absolute top-[10%] left-[20%] w-20 h-20 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-20 blur-xl animate-float"></div>
            <div className="absolute top-[60%] right-[15%] w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 blur-xl animate-float-delayed"></div>
            <div className="absolute bottom-[20%] left-[30%] w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-400 opacity-20 blur-xl animate-float-slow"></div>
            <div className="absolute inset-0 opacity-30">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,100 C150,50 250,150 400,100" stroke="white" strokeWidth="0.5" fill="none" />
                <path d="M0,200 C150,150 250,250 400,200" stroke="white" strokeWidth="0.5" fill="none" />
                <path d="M0,300 C150,250 250,350 400,300" stroke="white" strokeWidth="0.5" fill="none" />
                <path d="M0,400 C150,350 250,450 400,400" stroke="white" strokeWidth="0.5" fill="none" />
                <path d="M0,500 C150,450 250,550 400,500" stroke="white" strokeWidth="0.5" fill="none" />
                <path d="M0,600 C150,550 250,650 400,600" stroke="white" strokeWidth="0.5" fill="none" />
                <path d="M0,700 C150,650 250,750 400,700" stroke="white" strokeWidth="0.5" fill="none" />
                <path d="M0,800 C150,750 250,850 400,800" stroke="white" strokeWidth="0.5" fill="none" />
              </svg>
            </div>
          </div>

          {/* Header: only profile related card */}
          <header className="sticky top-0 z-10 bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/profile")}>
                <Avatar className="h-12 w-12 border-2 border-white/30">
                  <AvatarImage src={user.photo_url} alt="User" />
                  <AvatarFallback className="text-lg"></AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-bold text-base text-white">{user.username}</span>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-sm text-amber-300">{scores?.total_score || 0} XP</span>
                    <Zap className="h-4 w-4 text-amber-300 fill-amber-300" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white text-md">🔥{currentStreak}</span>

                <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/10">
                  <Bell className="h-5 w-5" />
                </Button>

                {/* <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/10">
                  <Menu className="h-5 w-5" />
                </Button> */}
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 overflow-auto ">
            {/* Points and Farming Section */}
            <Card className="mb-6 rounded-none overflow-hidden border-none shadow-lg bg-white/10 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="text-base font-semibold text-white">Your Points</h3>
                    <div className="text-2xl font-bold flex items-center gap-1 text-amber-300">
                      {/* {scores?.farming_score || 0}      {farmingState.pointsEarned.toFixed(2)} */}
                      {scores?.farming_score || 0}

                      <Zap className="h-5 w-5 text-amber-300 fill-amber-300" />
                    </div>
                  </div>
                  <FarmingButton />
                </div>
                {isFarming && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-white/90">
                      <span>Farming Progress</span>
                      <span>{Math.floor(farmingProgress)}%</span>
                    </div>
                    <Progress
                      value={farmingProgress}
                      className="h-1.5 bg-white/20"
                      indicatorClassName="bg-amber-400"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Fruit Ninja Game Card */}
            <Card className="mb-8 rounded-none overflow-hidden border-none shadow-lg bg-white/10 backdrop-blur-md ">
              <div className="relative rounded">
                <img
                  src="https://i.postimg.cc/W109Bc3N/Fruit-Ninja-2.jpg"
                  alt="Fruit Ninja Game"
                  className="w-full h-60  rounded"
                />
                <Badge className="absolute top-3 left-3 bg-rose-600 text-gray-100 rounded px-1 py-1">Game</Badge>
                <Badge className="absolute top-3 right-3 bg-amber-500/90 text-gray-100 rounded px-1 py-1">+50 XP</Badge>
              </div>
              <CardContent className="p-4 ">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                  <Button
                    onClick={handlePlayGame}
                    className="w-full py-3 text-base font-bold bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white rounded-lg shadow-lg flex items-center justify-center"
                  >
                    <GamepadIcon className="mr-2 h-5 w-5" />
                    Play Game
                  </Button>
                </motion.div>
              </CardContent>
            </Card>

            {/* Scrollable Content Below */}
            <div className="mt-6">
              {/* News Swipe Card */}
              <h2 className="text-white-visible text-xl font-bold mb-3 text-white drop-shadow-lg">Today's Top Stories</h2>
              <motion.div
                key={currentNewsIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="mb-6 cursor-pointer"
                onClick={() => navigate("/news")}

              >
                <Card className="rounded-none overflow-hidden border-none shadow-lg bg-white/10 backdrop-blur-md">
                  <div className="relative">
                    <img
                      src={newsItems[currentNewsIndex].imageUrl || "/placeholder.svg"}
                      alt={newsItems[currentNewsIndex].title}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-3 left-3 bg-indigo-600 text-gray-100 rounded px-1 py-1">
                      {newsItems[currentNewsIndex].category}
                    </Badge>
                    <Badge className="absolute top-3 right-3 bg-gray-700/70 text-gray-100 rounded px-1 py-1">
                      {newsItems[currentNewsIndex].readTime}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold mb-2 text-white">
                      {newsItems[currentNewsIndex].title}
                    </h3>
                    <p className="text-white/80 text-sm mb-4">
                      {newsItems[currentNewsIndex].summary}
                    </p>
                    <div className="flex justify-between items-center">
                      {/* <span className="text-xs text-white/60">Swipe to interact</span> */}
                      {/* <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-300/50 text-black-300 hover:bg-red-500/20"
                          onClick={() => handleSwipe("left")}
                        >
                          Skip
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-300/50 text-black-300 hover:bg-green-500/20"
                          onClick={() => handleSwipe("right")}
                        >
                          Interesting
                        </Button>
                      </div> */}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Access Sections */}
              <h2 className="text-xl font-bold mb-3 text-white drop-shadow-lg">Quick Access</h2>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <Card
                  onClick={() => navigate("/tasks")}
                  className="rounded-none border-none shadow-md bg-gradient-to-br from-emerald-500/80 to-teal-600/80 backdrop-blur-sm cursor-pointer"
                >
                  <CardContent className="p-4 flex items-center justify-between ">
                    <div>
                      <h3 className="font-semibold text-white">Tasks</h3>
                      <p className="text-xs text-white/80">{tasks.filter(t => t.category === 'daily').length || 0} available</p>
                    </div>
                    <div className="bg-white/20 p-2 rounded-full">
                      <CheckSquare className="h-6 w-6 text-white" />
                    </div>
                  </CardContent>
                </Card>
                <Card
                  onClick={() => navigate("/wallet")}
                  className="rounded-none border-none shadow-md bg-gradient-to-br from-blue-500/80 to-indigo-600/80 backdrop-blur-sm cursor-pointer"
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white">Wallet</h3>
                      <p className="text-xs text-white/80">TON Space</p>
                    </div>
                    <div className="bg-white/20 p-2 rounded-full">
                      <Wallet className="h-6 w-6 text-white" />
                    </div>
                  </CardContent>
                </Card>
                <Card
                  onClick={() => navigate("/network")}
                  className="rounded-none border-none shadow-md bg-gradient-to-br from-purple-500/80 to-pink-600/80 backdrop-blur-sm cursor-pointer"
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white">Invite</h3>
                      <p className="text-xs text-white/80">Earn 50 points</p>
                    </div>
                    <div className="bg-white/20 p-2 rounded-full">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                  </CardContent>
                </Card>
                <Card
                  onClick={() => navigate("/network")}
                  className="rounded-none border-none shadow-md bg-gradient-to-br from-amber-500/80 to-orange-600/80 backdrop-blur-sm cursor-pointer"
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white">Stats</h3>
                      <p className="text-xs text-white/80">View progress</p>
                    </div>
                    <div className="bg-white/20 p-2 rounded-full">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tasks Preview */}
              <Card className="mb-6 rounded-none border-none shadow-md bg-white/10 backdrop-blur-md">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-white">Daily Tasks</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-indigo-200 font-medium hover:bg-indigo-500/20 flex justify-between items-center"
                      onClick={() => navigate("/tasks")}
                    >
                      View All
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {tasks
                      .filter(task => {
                        const title = task.title.toLowerCase();
                        return title.includes('read 5 news') || title.includes('invite') || title.includes('refer');
                      })
                      .map(task => {
                        const done = isTaskDone(task);
                        const progress = task.title.toLowerCase().includes('news') ? newsCount : (task.completed || 0);
                        const displayProgress = done ? task.total : (progress > task.total ? task.total : progress);

                        return (
                          <div key={task.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10 cursor-pointer" onClick={() => navigate('/tasks')}>
                            <div className="flex items-center gap-3">
                              <div className={`${task.iconBg || 'bg-indigo-500/30'} p-2 rounded-full`}>
                                {task.icon === 'Users' ? <Users className="h-4 w-4 text-amber-200" /> : <Zap className="h-4 w-4 text-indigo-200" />}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white">{task.title}</p>
                                <p className="text-xs text-white/60">
                                  {done ? 'Completed' : `${displayProgress}/${task.total} completed`}
                                </p>
                              </div>
                            </div>
                            <Badge className={`${done ? 'bg-green-600/80' : 'bg-indigo-600/80'} text-white`}>
                              {done ? 'Done' : `+${task.points} XP`}
                            </Badge>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
      {showWelcomePopup && (
        <WelcomePopup onClose={() => setShowWelcomePopup(false)} />
      )}
    </div>
  );
}
