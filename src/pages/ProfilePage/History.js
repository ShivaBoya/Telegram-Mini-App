import React, { useState, useEffect, useMemo } from "react";
import { ref, get } from "firebase/database";
import { database } from "../../services/FirebaseConfig";
import { useNavigate } from "react-router-dom";
import { useTelegram } from "../../reactContext/TelegramContext";
import { ChevronLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useHistory } from "../../reactContext/HistoryContext";
import { format } from "date-fns";

/* ------------------------------------------------------------------ */
/*  component                                                         */
/* ------------------------------------------------------------------ */
const History = () => {
  /* -------------------------------------------------------------- */
  /* state & context                                                */
  /* -------------------------------------------------------------- */
  const [totalScore, setTotalScore] = useState(0);
  const [loading, setLoading]       = useState(true);

  const navigate     = useNavigate();
  const { user }     = useTelegram();
  const { history }  = useHistory();               // can be object or array

  /* -------------------------------------------------------------- */
  /* 1. convert ANY history shape → array → newest first            */
  /* -------------------------------------------------------------- */
  const historyArray = useMemo(() => {
    if (!history) return [];

    const arr = Array.isArray(history) ? history : Object.values(history);

    // newest first
    return arr.sort((a, b) => b.timestamp - a.timestamp);
  }, [history]);

  /* -------------------------------------------------------------- */
  /* 2. group by calendar-day                                       */
  /* -------------------------------------------------------------- */
  const groupedHistory = useMemo(() => {
    const byDate = {};

    historyArray.forEach(item => {
      const key = format(new Date(item.timestamp), "EEE dd MMM yyyy"); // Mon 19 Apr 2025
      if (!byDate[key]) byDate[key] = [];
      byDate[key].push(item);
    });

    // object → array (newest day first)
    return Object.entries(byDate)
      .map(([date, activities]) => ({ date, activities }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [historyArray]);

  /* total score from Firebase                                      */

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const snap = await get(
          ref(database, `users/${user.id}/Score/total_score`)
        );
        if (snap.exists()) setTotalScore(snap.val() ?? 0);
      } catch (e) {
        console.error("Error fetching total score", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  /* -------------------------------------------------------------- */
  /* loader                                                         */
  /* -------------------------------------------------------------- */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-900 via-violet-800 to-purple-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  /* -------------------------------------------------------------- */
  /* JSX                                                             */
  /* -------------------------------------------------------------- */
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-600/90 via-purple-600/80 to-pink-600/90 z-0">
      {/* background layers … (unchanged) */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-indigo-800/20 to-pink-900/30 opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-transparent to-purple-900/80"></div>
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-pink-500/20 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-blue-500/20 rounded-full filter blur-3xl"></div>
      <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-purple-500/20 rounded-full filter blur-2xl"></div>
      <div className="absolute inset-0 pointer-events-none z-50">
        <div className="absolute top-0 left-0 right-0 h-6"></div>
        <div className="absolute bottom-0 left-0 right-0 h-6 rounded-b-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen pb-16">
        {/* ----------------------- header ----------------------- */}
        <div className="bg-black/30 backdrop-blur-md rounded-b-3xl shadow-lg z-20 flex">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-white hover:bg-white/10 m-5"
            onClick={() => navigate("/profile")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex justify-center items-center h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
              Points History
            </h1>
          </div>
        </div>

        {/* ----------------------- body ------------------------- */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {/* total score */}
          <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 mb-5 border border-white/10 shadow-lg shadow-purple-500/20">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs text-pink-300 uppercase tracking-wider">
                  Total Earned
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
                  {totalScore} XP
                </div>
              </div>
              {/* <div className="flex gap-2">
                <div className="text-center">
                  <div className="text-xs text-blue-300">This Week</div>
                  <div className="text-lg font-bold text-blue-400">+215</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-green-300">This Month</div>
                  <div className="text-lg font-bold text-green-400">+405</div>
                </div>
              </div> */}
            </div>
          </div>

          {/* ----------------------- history list ---------------- */}
          <div className="space-y-6">
            {groupedHistory.map(group => (
              <div key={group.date}>
                {/* day header */}
                <div className="sticky top-0 bg-gradient-to-r from-purple-900/90 to-violet-900/90 backdrop-blur-md py-2 px-2 rounded-lg mb-2 z-10">
                  <h3 className="text-sm font-medium text-gray-300">
                    {group.date}
                  </h3>
                </div>

                {/* activities for that day */}
                <div className="space-y-2">
                  {group.activities.map(activity => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-3 bg-black/20 backdrop-blur-sm rounded-xl border border-white/5"
                    >
                      {/* icon + text */}
                      <div className="flex items-center gap-3">
                        {/* ---------- icon switch ----------- */}
                        {activity.type === "Home" && (
                          <IconWrapper color="pink">
                            <HomeIcon />
                          </IconWrapper>
                        )}
                        {activity.type === "game" && (
                          <IconWrapper color="blue">
                            <GameIcon />
                          </IconWrapper>
                        )}
                        {activity.type === "news" && (
                          <IconWrapper color="purple">
                            <NewsIcon />
                          </IconWrapper>
                        )}
                        {activity.type === "network" && (
                          <IconWrapper color="green">
                            <NetworkIcon />
                          </IconWrapper>
                        )}
                        {activity.type === "Farming" && (
                          <IconWrapper color="yellow">
                            <FarmingIcon />
                          </IconWrapper>
                        )}
                        {activity.type === "task" && (
                          <IconWrapper color="violet">
                            <TaskIcon />
                          </IconWrapper>
                        )}
                        {activity.type === "wallet" && (
                          <IconWrapper color="sky">
                            <TaskIcon />
                          </IconWrapper>
                        )}                        


                        <div>
                          <div className="text-sm font-medium text-white">
                            {activity.action}
                          </div>
                          <div className="text-xs text-gray-400">
                            {activity.type} Activity
                          </div>
                        </div>
                      </div>

                      {/* points */}
                      <div
                        className={`text-base font-bold ${
                          activity.points >= 0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {activity.points >= 0 ? "+" : ""}
                        {activity.points} XP
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* --------------------------------------------------- */}
        </div>
      </div>
    </div>
  );
};

export default History;

/* helpers */

const IconWrapper = ({ color, children }) => (
  <div
    className={`w-9 h-9 rounded-lg bg-${color}-500/20 flex items-center justify-center`}
  >
    {children}
  </div>
);

/* ---------------- icons ---------------- */

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-400" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2a1 1 0 011 1v3a1 1 0 01-1 1v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a1 1 0 01-1-1V8a1 1 0 011-1V5zm3 4a1 1 0 000 2h.01a1 1 0 000-2H5zm3 0a1 1 0 000 2h.01a1 1 0 000-2H8zm3 0a1 1 0 000 2h.01a1 1 0 000-2H11zm3 0a1 1 0 000 2h.01a1 1 0 000-2H14z"
      clipRule="evenodd"
    />
  </svg>
);

const GameIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
    <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
  </svg>
);

const NewsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z"
      clipRule="evenodd"
    />
    <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
  </svg>
);

const NetworkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
  </svg>
);

const FarmingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 2a1 1 0 00-1 1v3.382l-2.447 2.236A4 4 0 005 13h5v5h6v-5h1a1 1 0 000-2h-1.126A6.002 6.002 0 0011 4.126V3a1 1 0 00-1-1z" />
  </svg>
);

const TaskIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-400" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
  </svg>
);

const WalletIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-400" viewBox="0 0 20 20" fill="currentColor">
    <path d="M4 4a2 2 0 012-2h10a2 2 0 012 2v2H4V4zm0 4h14v8a2 2 0 01-2 2H6a2 2 0 01-2-2V8zm10 4a1 1 0 100-2 1 1 0 000 2z" />
  </svg>
);