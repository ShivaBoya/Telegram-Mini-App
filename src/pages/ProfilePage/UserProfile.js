import React, { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { database } from "../../services/FirebaseConfig";
import { useNavigate } from "react-router-dom";
import { useTelegram } from "../../reactContext/TelegramContext";
import {
  ChevronLeft
} from "lucide-react";
import { Button } from "../../components/ui/button";

const UserProfile = () => {
  const [userData, setUserData] = useState({
    name: "",
    photo: "/placeholder.svg",
    totalScore: 0,
    newsScore: 0,
    gameHighestScore: 0,
    totalGameScore: 0,
    networkScore: 0,
    referrals: 0,
  });
 
  
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useTelegram();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !user.id) {
        setLoading(false);
        return;
      }

      try {
        // Fetch user profile data
        const userRef = ref(database, `users/${user.id}`);
        const userSnapshot = await get(userRef);
        
        if (userSnapshot.exists()) {
          const userProfileData = userSnapshot.val();
          
          // Fetch score data
          const scoreRef = ref(database, `users/${user.id}/Score`);
          const scoreSnapshot = await get(scoreRef);
          
          // Fetch game data
          const gameRef = ref(database, `users/${user.id}/games`);
          const gameSnapshot = await get(gameRef);
          
          // Fetch referrals data
          const referralsRef = ref(database, `connections/${user.id}/referrals`);
          const referralsSnapshot = await get(referralsRef);
          
          // Process and combine data
          const scoreData = scoreSnapshot.exists() ? scoreSnapshot.val() : {};
          const gameData = gameSnapshot.exists() ? gameSnapshot.val() : {};
          const referralsData = referralsSnapshot.exists() ? Object.keys(referralsSnapshot.val() || {}).length : 0;
          
          // Calculate highest game score
          let highestGameScore = 0;
          if (gameData && typeof gameData === 'object') {
            Object.values(gameData).forEach(game => {
              if (game.score && game.score > highestGameScore) {
                highestGameScore = game.score;
              }
            });
          }
          
          setUserData({
            name: userProfileData.username || user.username || "User",
            photo: userProfileData.photo_url || user.photo_url || "/placeholder.svg",
            totalScore: scoreData.total_score || 0,
            newsScore: scoreData.task_score || 0,
            gameHighestScore: scoreData.game_highest_score || 0,
            totalGameScore: scoreData.game_score || 0,
            networkScore: scoreData.network_score || 0,
            referrals: referralsData
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleInviteFriends = () => {
    // Implement invite functionality using Telegram WebApp API
    navigate("/network")
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-900 via-violet-800 to-purple-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-600/90 via-purple-600/80 to-pink-600/90 z-0">
      {/* Background effects */}
{/* Replace the problematic line with a CSS gradient */}
<div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-indigo-800/20 to-pink-900/30 opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-transparent to-purple-900/80"></div>
      
      {/* Mobile frame overlay */}
      <div className="absolute inset-0 pointer-events-none z-50">
        <div className="absolute top-0 left-0 right-0 h-6"></div>
        <div className="absolute bottom-0 left-0 right-0 h-6  rounded-b-3xl"></div>
      </div>
      
      {/* Content container */}
      <div className="relative z-10 flex flex-col min-h-screen pb-16">
        {/* Header */}
        <div className="bg-black/30 backdrop-blur-md rounded-b-3xl shadow-lg z-20 flex ">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-white hover:bg-white/10 m-5"
            onClick={() => navigate("/")}>
          <ChevronLeft className="h-5 w-5" />               
          </Button>
          <div className="flex justify-between items-center h-16 w-full px-4">
                <h1 className="text-2xl font-bold text-white">Profile</h1>
                <button 
         
                  className="text-white bg-pink-500/30 hover:bg-pink-500/50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  onClick={() => navigate("/history")}

                >
                  History
                </button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {/* Profile section */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-pink-500/50 shadow-lg shadow-pink-500/30 mb-4">
              <img 
                src={userData.photo} 
                alt="Profile" 
                className="w-full h-full object-cover"
                onError={(e) => {e.target.src = "/placeholder.svg"}}
              />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">{userData.name}</h2>
            <div className="text-sm text-pink-300 font-medium">Member</div>
          </div>
          
          {/* Total score */}
          <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/10 shadow-lg shadow-purple-500/20">
            <div className="text-center">
              <div className="text-sm text-pink-300 uppercase tracking-wider mb-1">Total Score</div>
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
                {userData.totalScore.toLocaleString()}
              </div>
            </div>
          </div>
          
          {/* Score breakdown */}
          <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 mb-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 px-2">Score Breakdown</h3>
            <div className="space-y-4">
              {/* News score */}
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">News Score</div>
                    <div className="text-xs text-blue-300">Articles read</div>
                  </div>
                </div>
                <div className="text-xl font-bold text-blue-400">{userData.newsScore}</div>
              </div>
              
              {/* Game highest score */}
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Highest Game Score</div>
                    <div className="text-xs text-yellow-300">Best performance</div>
                  </div>
                </div>
                <div className="text-xl font-bold text-yellow-400">{userData.gameHighestScore}</div>
              </div>
              
              {/* Total game score */}
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Total Game Score</div>
                    <div className="text-xs text-green-300">All games combined</div>
                  </div>
                </div>
                <div className="text-xl font-bold text-green-400">{userData.totalGameScore}</div>
              </div>
              
              {/* Network score */}
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Network Score</div>
                    <div className="text-xs text-purple-300">Community engagement</div>
                  </div>
                </div>
                <div className="text-xl font-bold text-purple-400">{userData.networkScore}</div>
              </div>
            </div>
          </div>
          
          {/* Referrals */}
          <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 mb-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Referrals</h3>
                <p className="text-sm text-gray-300">Friends you've invited</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center">
                <span className="text-xl font-bold text-pink-400">{userData.referrals.length}</span>
              </div>
            </div>
            <button 
             
            className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all duration-300"
              onClick={handleInviteFriends}
            >
              Invite More Friends
            </button>
          </div>
        </div>
        
        {/* Navigation bar */}
      
      </div>
    </div>
  );
};

export default UserProfile;

