import { useState, useEffect } from "react";
import {
  Award,
  Zap,
  ThumbsUp,
  ThumbsDown,
  Menu,
  Bell,
  Users,
  CheckSquare,
  ChevronLeft,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { motion, useAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ref, query, orderByChild, onValue,update,get } from "firebase/database";
import { database } from "../../services/FirebaseConfig";
import { useTelegram } from "../../reactContext/TelegramContext";

export default function NewsComponent() {
  // State for dynamic news data
  const [newsItems, setNewsItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [newsScore, setNewsScore] = useState(75);
  const [direction, setDirection] = useState(null);
  const [isFeedComplete, setIsFeedComplete] = useState(false);
  const controls = useAnimation();

  const navigate = useNavigate();
  const {user,scores} = useTelegram()
  // Load news data from Firebase in realtime
  
  // useEffect(() => {
  //   const newsRef = query(ref(database, "news"), orderByChild("createdAt"));
  //   const unsubscribe = onValue(
  //     newsRef,
  //     (snapshot) => {
  //       const data = snapshot.val();
  //       if (data) {
  //         const newsArray = Object.entries(data)
  //           .map(([id, item]) => ({ id, ...item }))
  //           .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  //         setNewsItems(newsArray);
  //         // Reset index if new data is available and previous index is invalid
  //         setCurrentNewsIndex(0);
  //       } else {
  //         setNewsItems([]);
  //       }
  //       setIsLoading(false);
  //     },
  //     (error) => {
  //       console.error("Error loading news: ", error);
  //       setIsLoading(false);
  //     }
  //   );
  //   return () => unsubscribe();
  // }, []);
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

      const allNews = Object.entries(data).map(([id, item]) => ({ id, ...item }));

      // ✅ Fetch user's completed news
      const userNewsRef = ref(database, `connections/${user.id}/tasks/daily/news`);
      const userSnapshot = await get(userNewsRef);
      const completedNews = userSnapshot.exists() ? userSnapshot.val() : {};

      // ✅ Filter out news the user already interacted with
      const unreadNews = allNews
        .filter((news) => !completedNews[news.id])
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setNewsItems(unreadNews);
        if(unreadNews.length === 0){
          setIsFeedComplete(true);
        }
      
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
      // Swiped right - like
      handleSwipe("right");
    } else if (info.offset.x < -threshold) {
      // Swiped left - dislike
      handleSwipe("left");
    } else {
      // Reset position if not swiped far enough
      controls.start({ x: 0, opacity: 1 });
    }
  };

  

  const handleSwipe = async (dir, newsId) => {

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
        setNewsScore((prev) => prev + 5);
      }
  
      // Animate based on swipe direction
      const directionOffset = dir === "right" ? 300 : -300;
      await controls.start({ x: directionOffset, opacity: 0 });
  
      // Update news completion status
      await update(taskRef, { [newsId]: dir === "right" });
  
      console.log("news updated", newsId);
    } catch (err) {
      console.log("news component Error:", err);
    }
  
    // Move to next news item, or show completion message if done
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

  // Helper function to open the ReadMore link in a new tab
  const handleReadMore = () => {
    const currentNews = newsItems[currentNewsIndex];
    if (currentNews && currentNews.readMoreLink) {
      window.open(currentNews.readMoreLink, "_blank");
    }
  };


  return (
    <div className="">
      {/* Main Container for News Content */}
      <div className="">
        {/* Screen Content */}
        <div className="w-full flex flex-col">
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
            <div className="absolute top-[10%] left-[20%] w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 opacity-20 blur-xl animate-float"></div>
            <div className="absolute top-[60%] right-[15%] w-24 h-24 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 blur-xl animate-float-delayed"></div>
            <div className="absolute bottom-[20%] left-[30%] w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 opacity-20 blur-xl animate-float-slow"></div>

            {/* Glowing Lines */}
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
          <div className="flex-1 flex flex-col overflow-hidden z-10">
            <main className="flex-1 overflow-auto ">
              {/* News Score Section */}
              <Card className=" overflow-hidden border-none shadow-lg bg-white/10 backdrop-blur-sm ">
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
                      {scores?.news_score ||0}
                      <Zap className="h-4 w-4 text-amber-300 fill-amber-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Swipe Instructions */}
              {/* <div className="flex justify-between items-center px-2 mt-10">
                <div className="flex items-center text-white/70">
                  <ThumbsDown className="h-4 w-4 mr-1" />
                  <span className="text-xs">Swipe left to skip</span>
                </div>
                <div className="flex items-center text-white/70">
                  <span className="text-xs">Swipe right to like</span>
                  <ThumbsUp className="h-4 w-4 ml-1" />
                </div>
              </div> */}

              {/* News Swipe Card */}
              <div className="relative flex justify-center items-center mb-5 mt-8 h-[500px]">
                {/* Left swipe indicator */}
                <div
                  className={`absolute left-0 top-1/2 -translate-y-1/2 bg-red-500/20 h-full w-12 rounded-l-lg flex items-center justify-center transition-opacity duration-300 ${
                    direction === "left" ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <ThumbsDown className="text-white h-8 w-8" />
                </div>

                {/* Right swipe indicator */}
                <div
                  className={`absolute right-0 top-1/2 -translate-y-1/2 bg-green-500/20 h-full w-12 rounded-r-lg flex items-center justify-center transition-opacity duration-300 ${
                    direction === "right" ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <ThumbsUp className="text-white h-8 w-8" />
                </div>
                {!isFeedComplete  ?
                (<motion.div
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={handleDragEnd}
                  animate={controls}
                  className="w-full"
                >
                  <Card className="overflow-hidden border-none shadow-lg bg-white/10 backdrop-blur-md m-2 mt-6">
                    <div className="relative">
                      <img
                        src={
                          isLoading ||
                          !newsItems[currentNewsIndex] ||
                          !newsItems[currentNewsIndex].imageUrl
                            ? "/placeholder.svg"
                            : newsItems[currentNewsIndex].imageUrl
                        }
                        alt={
                          newsItems[currentNewsIndex]
                            ? newsItems[currentNewsIndex].title
                            : "News"
                        }
                        className="w-full h-72 object-cover "
                      />
                      <Badge className="absolute top-3 left-3 bg-indigo-600 text-white pl-2 pr-2 pb-1 rounded-md">
                        {newsItems[currentNewsIndex] && newsItems[currentNewsIndex].category}
                      </Badge>
                      
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-bold mb-4 text-white">
                        {newsItems[currentNewsIndex] && newsItems[currentNewsIndex].title}
                      </h3>
                      <p className="text-white/80 text-sm mb-6">
                        {newsItems[currentNewsIndex] && newsItems[currentNewsIndex].summary}
                        {newsItems[currentNewsIndex] && newsItems[currentNewsIndex].readMoreLink && (
                          <span
                            onClick={handleReadMore}
                            className="text-blue-400 text-sm ml-2 cursor-pointer font-bold"
                          >
                             ...ReadMore
                          </span>
                        )}
                      </p>
                      <div className="flex items-center mt-4">
                        <Button
                          onClick={() => handleSwipe("left",newsItems[currentNewsIndex].id)}
                          className="flex-1 mr-2 bg-white/10 hover:bg-red-500/20 text-white flex items-center justify-center p-3 rounded-lg"
                        >
                          <ThumbsDown className="h-5 w-5 mr-2" />
                          <span>Skip</span>
                        </Button>
                        <Button
                          onClick={() => handleSwipe("right",newsItems[currentNewsIndex].id)}
                          className="flex-1 ml-2 bg-white/10 hover:bg-green-500/20 text-white flex items-center justify-center p-3 rounded-lg"
                        >
                          <ThumbsUp className="h-5 w-5 mr-2" />
                          <span>Interesting</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>):(
                <div className="flex justify-center items-center mt-10">
                  <h3 className="text-xl font-bold text-white">You've reached the end of the news feed!</h3>
                </div>
              )}


              </div>

              {/* News Progress */}
              <div className="flex justify-center items-center mb-6 mt-14">
                <div className="flex gap-1">
                  {newsItems.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 rounded-full ${
                        index === currentNewsIndex ? "w-6 bg-indigo-400" : "w-2 bg-white/30"
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
