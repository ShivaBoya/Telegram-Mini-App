import { useState, useEffect } from "react";
import {
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

  const [isFeedComplete, setIsFeedComplete] = useState(false);
  const controls = useAnimation();

  const navigate = useNavigate();
  const { user, scores } = useTelegram();

  // Load news data from Firebase in realtime
  useEffect(() => {
    // Safety check if user isn't loaded yet
    if (!user?.id) return;

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
  }, [user?.id]); // ✅ Fixed dependency

  const handleSwipe = async (dir) => {
    if (newsItems.length === 0 || !user?.id) return;

    const currentNews = newsItems[currentNewsIndex];
    if (!currentNews) return;



    const taskRef = ref(database, `connections/${user.id}/tasks/daily/news`);
    const scoreRef = ref(database, `users/${user.id}/Score`);

    try {
      // Update score in Firebase
      const snapshot = await get(scoreRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        await update(scoreRef, {
          news_score: (userData?.news_score || 0) + 5,
          total_score: (userData?.total_score || 0) + 5,
        });
      }

      // Animate swipe
      const directionOffset = dir === "right" ? 300 : -300;
      await controls.start({ x: directionOffset, opacity: 0 });

      // Mark news as completed
      await update(taskRef, { [currentNews.id]: dir === "right" });

      // Move to next card
      setTimeout(() => {
        if (currentNewsIndex < newsItems.length - 1) {
          setCurrentNewsIndex((prev) => prev + 1);
        } else {
          setIsFeedComplete(true);
        }
        controls.set({ x: 0, opacity: 1 });

      }, 300);

    } catch (err) {
      console.error("News swipe error:", err);
    }
  };

  // Handle swipe on news card (Drag end)
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

  const handleReadMore = () => {
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
              <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="1" opacity="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="flex-1 flex flex-col p-4">
          {/* Header Card */}
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
                    <p className="text-sm text-white/70">Swipe to earn rewards</p>
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
                <Button onClick={() => navigate("/")} className="mt-6 bg-indigo-600 text-white">
                  Back to Home
                </Button>
              </div>
            ) : (
              <>
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
                        alt="News"
                        className="w-full h-60 md:h-72 object-cover"
                      />
                      <Badge className="absolute top-3 left-3 bg-indigo-600 text-white pl-2 pr-2 pb-1">
                        {currentNews?.category || "News"}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-3 text-white line-clamp-2">
                        {currentNews?.title || "No title"}
                      </h3>
                      <p className="text-white/90 text-sm mb-4 line-clamp-3">
                        {currentNews?.summary || "No summary available."}
                      </p>

                      <Button
                        onClick={handleReadMore}
                        variant="outline"
                        className="w-full mb-5 border-indigo-500 text-indigo-300"
                      >
                        Read More →
                      </Button>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleSwipe("left")}
                          className="flex-1 bg-white/10 hover:bg-red-500/20 text-white"
                        >
                          <ThumbsDown className="h-5 w-5 mr-2" /> Skip
                        </Button>
                        <Button
                          onClick={() => handleSwipe("right")}
                          className="flex-1 bg-white/10 hover:bg-green-500/20 text-white"
                        >
                          <ThumbsUp className="h-5 w-5 mr-2" /> Like
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
                      className={`h-1.5 rounded-full transition-all ${index === currentNewsIndex ? "w-8 bg-indigo-400" : "w-2 bg-white/50"
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