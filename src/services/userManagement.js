import { database } from "../services/FirebaseConfig";
import { ref, get, set } from "firebase/database";

export const initializeUser = async (user) => {

  if (!user) {
    console.error("User data not available");
    return null;
  }

  const userId = user?.id.toString();
 

  const userRef = ref(database, `users/${userId}`);

  try {
    const snapshot = await get(userRef);
    if (!snapshot.exists()) {
      await set(userRef, {
        name: user.first_name || "Anonymous",
        lastUpdated: Date.now(),
        lastPlayed: Date.now(),
        Score: {
          farming_score: 0,
          network_score: 0,
          game_score: 0,
          news_score: 0,
          task_score: 0,
          total_score: 0,
          game_highest_score: 0,
          no_of_tickets:3,
        },
      });
      console.log("New user created:", userId);
    } else {
      console.log("User already exists:", userId);
    }

    return userId;
  } catch (error) {
    console.error("Error checking/creating user:", error);
    return null;
  }
};
