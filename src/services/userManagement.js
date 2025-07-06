// import { database } from "../services/FirebaseConfig";
// import { ref, get, set } from "firebase/database";

// export const initializeUser = async (user) => {

//   if (!user) {
//     console.error("User data not available");
//     return null;
//   }

//   const userId = user?.id.toString();
 

//   const userRef = ref(database, `users/${userId}`);

//   try {
//     const snapshot = await get(userRef);
//     if (!snapshot.exists()) {
//       await set(userRef, {
//         name: user.first_name || "Anonymous",
//         lastUpdated: Date.now(),
//         lastPlayed: Date.now(),
//         Score: {
//           farming_score: 0,
//           network_score: 0,
//           game_score: 0,
//           news_score: 0,
//           task_score: 0,
//           total_score: 0,
//           game_highest_score: 0,
//           no_of_tickets:3,
//         },
//       });
//       console.log("New user created:", userId);
//     } else {
//       console.log("User already exists:", userId);
//     }

//     return userId;
//   } catch (error) {
//     console.error("Error checking/creating user:", error);
//     return null;
//   }
// };
import { database } from "../services/FirebaseConfig";
import { ref, get, update, set } from "firebase/database";

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
      // New user: set all fields
      await set(userRef, {
        name: user.first_name || "Anonymous",
        lastUpdated: Date.now(),
        lastPlayed: Date.now(),
        lastReset: { daily: new Date().toISOString().split('T')[0] }, // Add lastReset
        Score: {
          farming_score: 0,
          network_score: 0,
          game_score: 0,
          news_score: 0,
          task_score: 0,
          total_score: 0,
          game_highest_score: 0,
          no_of_tickets: 3,
        },
        streak: {
          currentStreakCount: 1,
          lastStreakCheckDateUTC: new Date().toISOString().split('T')[0],
          longestStreakCount: 1
        },
      });
      console.log("New user created:", userId);
    } else {
      // Existing user: patch missing fields only (non-destructive)
      const userData = snapshot.val();
      const updates = {};

      if (!userData.lastReset) {
        updates.lastReset = { daily: new Date().toISOString().split('T')[0] };
      }
      if (!userData.streak) {
        updates.streak = {
          currentStreakCount: 1,
          lastStreakCheckDateUTC: new Date().toISOString().split('T')[0],
          longestStreakCount: 1
        };
      }
      // Optionally, patch Score fields if needed
      if (!userData.Score) {
        updates.Score = {
          farming_score: 0,
          network_score: 0,
          game_score: 0,
          news_score: 0,
          task_score: 0,
          total_score: 0,
          game_highest_score: 0,
          no_of_tickets: 3,
        };
      }

      if (Object.keys(updates).length > 0) {
        await update(userRef, updates);
        console.log("User patched with missing fields:", userId, updates);
      } else {
        console.log("User already exists and is up to date:", userId);
      }
    }

    return userId;
  } catch (error) {
    console.error("Error checking/creating user:", error);
    return null;
  }
};