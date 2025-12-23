import { useState, useEffect } from "react";
import {
  Award,
  Zap,
  ThumbsUp,
  ThumbsDown,
  ChevronLeft,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { motion, useAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ref, query, orderByChild, onValue, update, get } from "firebase/database";
import { database } from "../../services/FirebaseConfig";
import { useTelegram } from "../../reactContext/TelegramContext";

export default function NewsComponent() {
  const [newsItems, setNewsItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [direction, setDirection] = useState(null);
  const [isFeedComplete, setIsFeedComplete] = useState(false);
  const controls = useAnimation();

  const navigate = useNavigate();
  const { user, scores } = useTelegram();

  // Load news data from Firebase in realtime
  useEffect(() => {
    const newsRef = query(ref(database, "news"), orderByChild("createdAt"));

    const unsubscribe = onValue(
      newsRef,
      async (snapshot) => {
        const data = snapshot.val();
        if (!data) {
          setNewsItems([]);
          setIsLoading(false);
          return;
        }

        const allNews = Object.entries(data).map(([id, item]) => ({
          id,
          ...item,
        }));

        // Fetch user's completed news
        const userNewsRef = ref(database, `connections/${user.id}/tasks/daily/news`);
        const userSnapshot = await get(userNewsRef);
        const completedNews = userSnapshot.exists() ? userSnapshot.val() : {};

        // Filter unread news
        const unreadNews = allNews
          .filter((news) => !completedNews[news.id])
          .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

        setNewsItems(unreadNews);
        setIsFeedComplete(unreadNews.length === 0);
        setCurrentNewsIndex(0);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error loading news: ", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user.id]);

  // Handle swipe on news card
  const handleDragEnd = (event, info) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      handleSwipe("right");
    } else if (info.offset.x < -threshold) {
      handleSwipe("left");
    } else {
      controls.start({ x: 0, opacity: 1 });
    }
  };

  const handleSwipe = async (dir) => {
    if (newsItems.length === 0) return;

    const currentNews = newsItems[currentNewsIndex];
    if (!currentNews) return;

    setDirection(dir);

    const taskRef = ref(database, `connections/${user.id}/tasks/daily/news`);
    const userRef = ref(database, `users/${user.id}/Score`);

    try {
      const snapshot = await get(userRef);
      let updates = {};

      if (snapshot.exists()) {
        const userData = snapshot.val();
        updates.news_score = (userData?.news_score || 0) + 5;
        updates.total_score = (userData?.total_score || 0) + 5;
        await update(userRef, updates);
      }

      // Animate swipe
      const directionOffset = dir === "right" ? 300 : -300;
      await controls.start({ x: directionOffset, opacity: 0 });

      // Mark news as completed
      await update(taskRef, { [currentNews.id]: dir === "right" });

      console.log("News updated:", currentNews.id);
    } catch (err) {
      console.error("News component Error:", err);
    }

    // Move to next or complete
    setTimeout(() => {
      if (currentNewsIndex < newsItems.length - 1) {
        setCurrentNewsIndex((prev) => prev + 1);
      } else {
        setIsFeedComplete(true);
      }
      controls.set({ x: 0, opacity: 1 });
      setDirection(null);
    }, 300);
  };

  useEffect(() => {
    controls.set({ x: 0, opacity: 1 });
  }, [currentNewsIndex, controls]);

  // ✅ NEW: Handle "Read More" click → opens blog
  const handleReadMore = () => {
    // Open the fixed blog URL — not per-news readMoreLink
    window.open("https://web3today-website.vercel.app/blog", "_blank", "noopener,noreferrer");
  };

  const currentNews = newsItems[currentNewsIndex] || null;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 via-purple-600/80 to-pink-600/90 z-0">
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" opacity="0.5" />
              </pattern>
              <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <rect width="80" height="80" fill="url(#smallGrid)" />
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="1" opacity="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="absolute top-[10%] left-[20%] w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 opacity-20 blur-xl animate-float"></div>
        <div className="absolute top-[60%] right-[15%] w-24 h-24 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 blur-xl animate-float-delayed"></div>
        <div className="absolute bottom-[20%] left-[30%] w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 opacity-20 blur-xl animate-float-slow"></div>

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

      {/* App Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="flex-1 flex flex-col p-4">
          {/* News Score Section */}
          <Card className="overflow-hidden border-none shadow-lg bg-white/10 backdrop-blur-sm mb-4">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full text-white hover:bg-white/10"
                    onClick={() => navigate("/")}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <div>
                    <h3 className="text-base font-semibold text-white">News Score</h3>
                    <p className="text-sm text-white/70">Based on your interactions</p>
                  </div>
                </div>
                <div className="text-small flex items-center gap-1 text-gray-100">
                  {scores?.news_score || 0}
                  <Zap className="h-4 w-4 text-amber-300 fill-amber-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* News Feed */}
          <div className="flex-1 flex flex-col items-center justify-start">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-white">Loading news...</div>
              </div>
            ) : isFeedComplete ? (
              <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-xl font-bold text-white mb-2">All caught up!</h3>
                <p className="text-white/80">You’ve read all the latest news.</p>
                <Button
                  onClick={() => navigate("/")}
                  className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Back to Home
                </Button>
              </div>
            ) : newsItems.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-center">
                <p className="text-white/80">No news available at the moment.</p>
              </div>
            ) : (
              <>
                {/* Swipe Indicators */}
                <div
                  className={`absolute left-4 top-1/2 -translate-y-1/2 bg-red-500/20 h-32 w-12 rounded-l-lg flex items-center justify-center transition-opacity duration-300 ${direction === "left" ? "opacity-100" : "opacity-0"
                    }`}
                >
                  <ThumbsDown className="text-white h-6 w-6" />
                </div>

                <div
                  className={`absolute right-4 top-1/2 -translate-y-1/2 bg-green-500/20 h-32 w-12 rounded-r-lg flex items-center justify-center transition-opacity duration-300 ${direction === "right" ? "opacity-100" : "opacity-0"
                    }`}
                >
                  <ThumbsUp className="text-white h-6 w-6" />
                </div>

                {/* News Card */}
                <motion.div
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={handleDragEnd}
                  animate={controls}
                  className="w-full max-w-md"
                >
                  <Card className="overflow-hidden border-none shadow-lg bg-white/10 backdrop-blur-md">
                    <div className="relative">
                      <img
                        src={currentNews?.imageUrl || "/placeholder.svg"}
                        alt={currentNews?.title || "News"}
                        className="w-full h-60 md:h-72 object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/placeholder.svg";
                        }}
                      />
                      <Badge className="absolute top-3 left-3 bg-indigo-600 text-white pl-2 pr-2 pb-1 rounded-md">
                        {currentNews?.category || "News"}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl md:text-2xl font-bold mb-3 text-white line-clamp-2">
                        {currentNews?.title || "No title"}
                      </h3>
                      <p className="text-white/90 text-sm mb-4 line-clamp-3">
                        {currentNews?.summary || "No summary available."}
                      </p>

                      {/* ✅ READ MORE BUTTON — IDENTICAL TO EXISTING UI */}
                      <Button
                        onClick={handleReadMore}
                        variant="outline"
                        className="w-full mb-5 border-indigo-500 text-indigo-300 hover:bg-indigo-500/20 hover:text-white"
                      >
                        Read More →
                      </Button>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleSwipe("left")}
                          className="flex-1 bg-white/10 hover:bg-red-500/20 text-white flex items-center justify-center gap-2 py-3 rounded-lg"
                        >
                          <ThumbsDown className="h-5 w-5" />
                          <span className="hidden sm:inline">Skip</span>
                        </Button>
                        <Button
                          onClick={() => handleSwipe("right")}
                          className="flex-1 bg-white/10 hover:bg-green-500/20 text-white flex items-center justify-center gap-2 py-3 rounded-lg"
                        >
                          <ThumbsUp className="h-5 w-5" />
                          <span className="hidden sm:inline">Like</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Progress Dots */}
                <div className="flex justify-center gap-1 mt-6">
                  {newsItems.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 rounded-full transition-all ${index === currentNewsIndex
                        ? "w-8 bg-indigo-400"
                        : "w-2 bg-white/50"
                        }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}