// src/services/FirebaseService.js
import { database } from "../../services/FirebaseConfig";
import { ref, update, get } from "firebase/database";
import { useTelegram } from "../../reactContext/TelegramContext.js";
import {addHistoryLog} from "../../services/addHistory.js"

export async function fetchHighScore() {
  const {user} = useTelegram()
  const userId = user.id
  const userRef = ref(database, `users/${userId}/Score`);
  try {
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const userData = snapshot.val();
      return userData.game_highest_score || 0;
    } else {
      return 0;
    }
  } catch (error) {
    console.error("Error fetching high score from Firebase:", error);
    return 0;
  }
}

export async function updateGameScores(currentGameScore) {
  const userRef = ref(database, `users/${userId}/Score`);
  try {
    const snapshot = await get(userRef);
    let updates = {};
    if (snapshot.exists()) {
      const userData = snapshot.val();
      // Accumulate all games' scores
      updates.game_score = (userData.game_score || 0) + currentGameScore;
      // Update highest score if current is higher
      const currentHighScore = userData.game_highest_score || 0;
      if (currentGameScore > currentHighScore) {
        updates.game_highest_score = currentGameScore;
      }
    } else {
      updates = {
        game_score: currentGameScore,
        game_highest_score: currentGameScore
      };
    }
    await update(userRef, updates);

          const textData ={
            action: 'Game Points Successfully Added',
            points: currentGameScore,
            type: 'game',
          }
    
          addHistoryLog(userId,textData)
    console.log("Scores updated successfully in Firebase.");
  } catch (error) {
    console.error("Error updating scores in Firebase:", error);
  }
}
