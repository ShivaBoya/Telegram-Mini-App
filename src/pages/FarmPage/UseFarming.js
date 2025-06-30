import { useState, useEffect } from "react";

import { get, update, ref } from "firebase/database";
import { database } from "../../services/FirebaseConfig"; 
import { useTelegram } from "../../reactContext/TelegramContext.js";
import {addHistoryLog} from "../../services/addHistory.js"
const FARMING_CONFIG = {
  duration: 43200, // Total farming time in seconds
  pointsPerSecond:  100 / 3600, // Points earned per second
  // duration: 5, // Total farming time in seconds
  // pointsPerSecond:  100 / 5, // Points earned per second
};

const useFarming = () => {
  const [farmingState, setFarmingState] = useState({
    isFarming: false,
    canClaim: false,
    remainingTime: FARMING_CONFIG.duration,
    pointsEarned: 0,
  });

  useEffect(() => {
    const storedStart = localStorage.getItem("farmingStartTime");
    const storedCompleted = localStorage.getItem("farmingCompleted");
    
    if (storedStart) {
      resumeTimer(parseInt(storedStart, 10));
    } else if (storedCompleted) {
      const completedData = JSON.parse(storedCompleted);
      setFarmingState({
        isFarming: false,
        canClaim: true,
        remainingTime: 0,
        pointsEarned: completedData.pointsEarned,
      });
    }
  }, []);

  const updateUI = (newState) => {
    setFarmingState((prevState) => ({ ...prevState, ...newState }));
  };

  const resumeTimer = (startTime) => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    if (elapsed < FARMING_CONFIG.duration) {
      const remainingTime = FARMING_CONFIG.duration - elapsed;
      const pointsEarned = elapsed * FARMING_CONFIG.pointsPerSecond;
      updateUI({ isFarming: true, remainingTime, pointsEarned });

      const interval = setInterval(() => {
        setFarmingState((prev) => {
          if (prev.remainingTime <= 0) {
            clearInterval(interval);
            localStorage.removeItem("farmingStartTime");
            localStorage.setItem("farmingCompleted", JSON.stringify({
              pointsEarned: prev.pointsEarned,
              duration: FARMING_CONFIG.duration,
              pointsPerSecond: FARMING_CONFIG.pointsPerSecond,
            }));
            return { ...prev, isFarming: false, canClaim: true };
          }
          return {
            ...prev,
            remainingTime: prev.remainingTime - 1,
            pointsEarned: prev.pointsEarned + FARMING_CONFIG.pointsPerSecond,
          };
        });
      }, 1000);
    } else {
      updateUI({
        isFarming: false,
        canClaim: true,
        remainingTime: 0,
        pointsEarned: FARMING_CONFIG.duration * FARMING_CONFIG.pointsPerSecond,
      });
    }
  };

  const startFarming = () => {
    localStorage.removeItem("farmingCompleted");
    localStorage.setItem("farmingStartTime", Date.now().toString());
    updateUI({ isFarming: true, canClaim: false, remainingTime: FARMING_CONFIG.duration, pointsEarned: 0 });

    const interval = setInterval(() => {
      setFarmingState((prev) => {
        if (prev.remainingTime <= 0) {
          clearInterval(interval);
          localStorage.removeItem("farmingStartTime");
          localStorage.setItem("farmingCompleted", JSON.stringify({
            pointsEarned: prev.pointsEarned,
            duration: FARMING_CONFIG.duration,
            pointsPerSecond: FARMING_CONFIG.pointsPerSecond,
          }));
          return { ...prev, isFarming: false, canClaim: true };
        }
        return {
          ...prev,
          remainingTime: prev.remainingTime - 1,
          pointsEarned: prev.pointsEarned + FARMING_CONFIG.pointsPerSecond,
        };
      });
    }, 1000);
  };
  const {user} = useTelegram()
  const claimPoints = async () => {
    
    if (!farmingState.canClaim) return;
    try {
      const scoreRef = ref(database, `users/${user.id}/Score`);
      const snapshot = await get(scoreRef);
      const scoreData = snapshot.val() || {};
      const newFarmingScore = (scoreData.farming_score || 0) + farmingState.pointsEarned;
      const newTotalScore = (scoreData.total_score || 0) + farmingState.pointsEarned;

      await update(scoreRef, {
        farming_score: newFarmingScore,
        total_score: newTotalScore,
      });
      const textData ={
              action: 'Farming Claimed',
              points: 1200,
              type: 'Farming',
            }
      
      addHistoryLog(user.id,textData)
      resetFarming();
    } catch (error) {
      console.error("Error claiming points:", error);
    }
  };

  const resetFarming = () => {
    localStorage.removeItem("farmingStartTime");
    localStorage.removeItem("farmingCompleted");
    updateUI({ isFarming: false, canClaim: false, remainingTime: FARMING_CONFIG.duration, pointsEarned: 0 });
  };

  return { farmingState, startFarming, claimPoints };
};

export default useFarming;
