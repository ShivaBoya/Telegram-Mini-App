// // src/components/StreakTracker.js
// import React, { useEffect, useState, createContext, useContext } from 'react';
// import {  ref, get, update, onValue } from 'firebase/database';
// import {database} from "../services/FirebaseConfig.js"
// import { useTelegram } from './TelegramContext';

// // ----------------------------------------------------
// // Create a Context for Streak Data
// // This allows any component to easily access the streak count
// // ----------------------------------------------------
// const StreakContext = createContext(null);

// export const useStreak = () => {
//     return useContext(StreakContext);
// };

// // ----------------------------------------------------
// // StreakTracker Component (Logic & Provider)
// // ----------------------------------------------------
// const StreakTracker = ({ children }) => {
//     const [currentStreak, setCurrentStreak] = useState(0);
//     const [longestStreak, setLongestStreak] = useState(0);
//     const [loadingStreak, setLoadingStreak] = useState(true);

//     const db = database;
//     const {user} = useTelegram()


//     // Helper function to get current UTC date string
//     const getUTCDateString = (timestamp = Date.now()) => {
//         const date = new Date(timestamp);
//         // format to YYYY-MM-DD in UTC
//         return date.toISOString().split('T')[0];
//     };

//     // This function runs the streak logic
//     // It should be called when a "streak-qualifying" action occurs
//     const updateStreak = async () => {
//         if (!user.id) {
//             console.warn("No user logged in for streak update.");
//             setLoadingStreak(false);
//             return;
//         }

//         const userId = user.id;
//         const userRef = ref(db, `users/${userId}`);

//         try {
//             // 1. Fetch current user data
//             const snapshot = await get(userRef);
//             const userData = snapshot.val();

//             if (!userData) {
//                 console.error("User data not found for streak update.");
//                 setLoadingStreak(false);
//                 return;
//             }

//             const currentTimestamp = Date.now(); // The exact time of this action (UTC milliseconds)

//             // Get existing streak data
//             const dbLastPlayed = userData.lastPlayed || 0;
//             const dbCurrentStreakCount = userData.streak?.currentStreakCount || 0;
//             const dbLastStreakCheckDateUTC = userData.streak?.lastStreakCheckDateUTC || '';
//             const dbLongestStreakCount = userData.streak?.longestStreakCount || 0;

//             // 2. Determine current UTC date
//             const currentDateUTCString = getUTCDateString(currentTimestamp);
//             const lastPlayedDateUTCString = getUTCDateString(dbLastPlayed);

//             let newCurrentStreakCount = dbCurrentStreakCount;
//             let newLastStreakCheckDateUTC = dbLastStreakCheckDateUTC;
//             let newLongestStreakCount = dbLongestStreakCount;
//             let streakBroken = false;
//             let didStreakChange = false; // Flag to track if streak count actually changed

//             // Determine yesterday's UTC date string for comparison
//             const yesterdayUTC = new Date(currentTimestamp);
//             yesterdayUTC.setUTCDate(yesterdayUTC.getUTCDate() - 1); // Subtract 1 day in UTC
//             const yesterdayUTCString = getUTCDateString(yesterdayUTC.getTime());


//             // 3. Apply Streak Logic
//             if (!dbLastStreakCheckDateUTC) {
//                 // Scenario 1: First activity ever or streak data initialized
//                 newCurrentStreakCount = 1;
//                 newLastStreakCheckDateUTC = currentDateUTCString;
//                 newLongestStreakCount = 1;
//                 didStreakChange = true;
//                 console.log("Streak started!");
//             } else if (currentDateUTCString === dbLastStreakCheckDateUTC) {
//                 // Scenario 2: Activity on the same UTC day
//                 // Streak count doesn't change, just update lastPlayed if needed
//                 console.log("Already active today. Streak unchanged.");
//             } else if (dbLastStreakCheckDateUTC === yesterdayUTCString) {
//                 // Scenario 3: Activity on the consecutive UTC day
//                 newCurrentStreakCount = dbCurrentStreakCount + 1;
//                 newLastStreakCheckDateUTC = currentDateUTCString;
//                 newLongestStreakCount = Math.max(newCurrentStreakCount, dbLongestStreakCount);
//                 didStreakChange = true;
//                 console.log("Streak continued!");
//             } else {
//                 // Scenario 4: Activity after a skipped UTC day(s)
//                 // Streak is broken
//                 streakBroken = true;
//                 newCurrentStreakCount = 1;
//                 newLastStreakCheckDateUTC = currentDateUTCString;
//                 didStreakChange = true; // Streak reset counts as a change
//                 console.log("Streak broken. New streak started.");
//             }

//             // 4. Update Firebase Realtime Database
//             const updates = {
//                 lastPlayed: currentTimestamp,
//                 lastUpdated: currentTimestamp,
//                 'streak/currentStreakCount': newCurrentStreakCount,
//                 'streak/lastStreakCheckDateUTC': newLastStreakCheckDateUTC,
//                 'streak/longestStreakCount': newLongestStreakCount
//             };

//             await update(userRef, updates);

//             // 5. Trigger Telegram Bot Message (CLIENT-SIDE DANGER!)
//             // --- SECURITY WARNING: Exposing BOT_TOKEN directly in client-side code is DANGEROUS! ---
//             // --- This is for demonstration purposes ONLY. Use a serverless function proxy! ---
//             // const telegramChatId = userData.telegramChatId;
//             // if (didStreakChange && telegramChatId) {
//             //     let botMessage = '';
//             //     if (streakBroken) {
//             //         botMessage = `🚨 Your ${dbCurrentStreakCount}-day streak was broken. But you've started a new one at 1 day! 💪`;
//             //     } else if (newCurrentStreakCount === 1) {
//             //         botMessage = `🎉 Welcome! Your streak has started at 1 day! Keep it going!`;
//             //     } else {
//             //         botMessage = `🔥 Your streak is now ${newCurrentStreakCount} days! Keep up the great work!`;
//             //         if (newCurrentStreakCount % 7 === 0) {
//             //             botMessage += ` You've hit a ${newCurrentStreakCount}-day milestone!`;
//             //         }
//             //     }

//             //     if (botMessage) {
//             //         const BOT_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN'; // <<< REPLACE THIS!
//             //         const apiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

//             //         fetch(apiUrl, {
//             //             method: 'POST',
//             //             headers: { 'Content-Type': 'application/json' },
//             //             body: JSON.stringify({
//             //                 chat_id: telegramChatId,
//             //                 text: botMessage,
//             //                 parse_mode: 'Markdown'
//             //             })
//             //         }).then(res => res.json())
//             //           .then(data => console.log("Telegram API response:", data))
//             //           .catch(error => console.error("Error sending Telegram message:", error));
//             //     }
//             // }

//         } catch (error) {
//             console.error("Error updating streak:", error);
//         } finally {
//             setLoadingStreak(false);
//         }
//     };

//     useEffect(() => {
//         // This effect listens for real-time updates to the streak data
//         // and keeps the component state (and thus UI) in sync.
//         if (user.id) {
//             setLoadingStreak(false);
//             return;
//         }

//         const userId = user.id;
//         const streakRef = ref(db, `users/${userId}/streak`);

//         const unsubscribe = onValue(streakRef, (snapshot) => {
//             const streakData = snapshot.val();
//             if (streakData) {
//                 setCurrentStreak(streakData.currentStreakCount || 0);
//                 setLongestStreak(streakData.longestStreakCount || 0);
//             } else {
//                 setCurrentStreak(0);
//                 setLongestStreak(0);
//             }
//             setLoadingStreak(false);
//         }, (error) => {
//             console.error("Error fetching real-time streak data:", error);
//             setLoadingStreak(false);
//         });

//         // Cleanup listener on unmount
//         return () => unsubscribe();
//     }, [user.id, db]);

//     // This effect runs the streak update logic once on initial load (login)
//     // You might also call `updateStreak()` from specific buttons/actions
//     useEffect(() => {
//         if (user.id) {
//             // It's good to delay this slightly to ensure all initial user data is loaded
//             // or trigger it after initializeUser completes.
//             // For now, let's call it on mount.
//             updateStreak();
//         }
//     }, [user.id]); // Re-run when currentUser object changes (e.g., login/logout)

//     // The context value provides the streak data and the update function
//     const streakContextValue = {
//         currentStreak,
//         longestStreak,
//         loadingStreak,
//         updateStreak // Expose this function if other components need to trigger a streak check
//     };

//     return (
//         <StreakContext.Provider value={streakContextValue}>
//             {children}
//         </StreakContext.Provider>
//     );
// };

// export default StreakTracker;
// src/components/StreakTracker.js

import React, { useEffect, useState, createContext, useContext } from 'react';
import { ref, get, update, onValue } from 'firebase/database';
import { database } from "../services/FirebaseConfig.js"
import { useTelegram } from '../reactContext/TelegramContext.js'; // Correct path assumed

// ----------------------------------------------------
// Create a Context for Streak Data and Popup State
// ----------------------------------------------------
const StreakContext = createContext(null);

export const useStreak = () => {
    return useContext(StreakContext);
};

// ----------------------------------------------------
// StreakTracker Component (Logic & Provider)
// ----------------------------------------------------
const StreakTracker = ({ children }) => {
    const [currentStreak, setCurrentStreak] = useState(0);
    const [longestStreak, setLongestStreak] = useState(0);
    const [loadingStreak, setLoadingStreak] = useState(true);

    // --- States for Popup ---
    const [showStreakPopup, setShowStreakPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupCurrentStreak, setPopupCurrentStreak] = useState(0); // Streak count for popup display

    const db = database; // Directly use your initialized Firebase database instance
    const { user } = useTelegram(); // Get user from your TelegramContext


    // Helper function to get current UTC date string (YYYY-MM-DD)
    const getUTCDateString = (timestamp = Date.now()) => {
        const date = new Date(timestamp);
        return date.toISOString().split('T')[0]; // Extracts "YYYY-MM-DD" in UTC
    };

    // This function runs the core streak logic
    // It should be called when a "streak-qualifying" action occurs (e.g., app load)
    const updateStreak = async () => {
        if (!user || !user.id) { // Check if user object and ID are available
            console.warn("No user ID available for streak update.");
            setLoadingStreak(false);
            return;
        }

        const userId = user.id;
        const userRef = ref(db, `users/${userId}`);

        try {
            // 1. Fetch current user data from Firebase
            const snapshot = await get(userRef);
            const userData = snapshot.val();

            // If user data doesn't exist, initialize it with default streak values
            if (!userData) {
                console.log("No user data found. Initializing new user and streak.");
                // const initialUserData = {
                //     name: user.first_name || "New User", // Using Telegram user info for name
                //     lastPlayed: Date.now(),
                //     lastUpdated: Date.now(),
                //     lastReset: { daily: getUTCDateString() }, // Initial daily reset for consistency
                //     Score: { /* ... default score values ... */ },
                //     streak: {
                //         currentStreakCount: 1,
                //         lastStreakCheckDateUTC: getUTCDateString(),
                //         longestStreakCount: 1
                //     },
                // };
                // await update(userRef, initialUserData); // Use update to merge, not set to avoid overwriting existing data
                // setCurrentStreak(1);
                // setLongestStreak(1);
                // setPopupMessage("🎉 Welcome! Your streak has started: 1 day!");
                // setPopupCurrentStreak(1);
                // setShowStreakPopup(true);
                // setLoadingStreak(false);
                setLoadingStreak(false)
                return; // Exit as we've initialized and set the first streak
            }

            const currentTimestamp = Date.now(); // The exact time of this action (UTC milliseconds)

            // Get existing streak and activity data
            const dbLastPlayed = userData.lastPlayed || 0;
            const dbCurrentStreakCount = userData.streak?.currentStreakCount || 0;
            const dbLastStreakCheckDateUTC = userData.streak?.lastStreakCheckDateUTC || '';
            const dbLongestStreakCount = userData.streak?.longestStreakCount || 0;

            // 2. Determine current UTC date and yesterday's UTC date
            const currentDateUTCString = getUTCDateString(currentTimestamp);
            const lastPlayedDateUTCString = getUTCDateString(dbLastPlayed);

            let newCurrentStreakCount = dbCurrentStreakCount;
            let newLastStreakCheckDateUTC = dbLastStreakCheckDateUTC;
            let newLongestStreakCount = dbLongestStreakCount;
            let streakMessageToDisplay = '';
            let didStreakChange = false;
            let streakBroken = false;

            const yesterdayUTC = new Date(currentTimestamp);
            yesterdayUTC.setUTCDate(yesterdayUTC.getUTCDate() - 1); // Subtract 1 day in UTC
            const yesterdayUTCString = getUTCDateString(yesterdayUTC.getTime());


            // 3. Apply Streak Logic based on UTC dates
            if (!dbLastStreakCheckDateUTC) {
                // Should ideally be caught by initial user data check above, but as a fallback
                newCurrentStreakCount = 1;
                newLastStreakCheckDateUTC = currentDateUTCString;
                newLongestStreakCount = 1;
                didStreakChange = true;
                streakMessageToDisplay = "🎉 Streak started! Keep it going!";
            } else if (currentDateUTCString === dbLastStreakCheckDateUTC) {
                // Scenario 2: Activity on the same UTC day
                // No streak change, no popup for this specific event
                console.log("Already active today in UTC. Streak unchanged.");
                // We still update lastPlayed/lastUpdated to reflect most recent activity
                await update(userRef, { lastPlayed: currentTimestamp, lastUpdated: currentTimestamp });
                setLoadingStreak(false); // Make sure loading state is cleared
                return; // Exit as no new streak event occurred for popup/bot
            } else if (dbLastStreakCheckDateUTC === yesterdayUTCString) {
                // Scenario 3: Activity on the consecutive UTC day
                newCurrentStreakCount = dbCurrentStreakCount + 1;
                newLastStreakCheckDateUTC = currentDateUTCString;
                newLongestStreakCount = Math.max(newCurrentStreakCount, dbLongestStreakCount);
                didStreakChange = true;
                streakMessageToDisplay = `🔥 Your streak continues! You're on a ${newCurrentStreakCount}-day streak!`;
                if (newCurrentStreakCount % 7 === 0) { // Example for milestones
                    streakMessageToDisplay += ` Milestone!`;
                }
            } else {
                // Scenario 4: Activity after a skipped UTC day(s) - Streak is broken
                streakBroken = true;
                streakMessageToDisplay = `💔 Oh no! Your ${dbCurrentStreakCount}-day streak was broken. New streak starts at 1 day.`;
                newCurrentStreakCount = 1;
                newLastStreakCheckDateUTC = currentDateUTCString;
                // Longest streak doesn't reset if it was higher than the broken streak
                newLongestStreakCount = Math.max(dbLongestStreakCount, dbCurrentStreakCount);
                didStreakChange = true;
            }

            // 4. Update Firebase Realtime Database with new streak values
            const updates = {
                lastPlayed: currentTimestamp,
                lastUpdated: currentTimestamp,
                'streak/currentStreakCount': newCurrentStreakCount,
                'streak/lastStreakCheckDateUTC': newLastStreakCheckDateUTC,
                'streak/longestStreakCount': newLongestStreakCount
            };

            await update(userRef, updates);

            // 5. Set Popup State (if streak changed)
            if (didStreakChange) {
                setPopupMessage(streakMessageToDisplay);
                setPopupCurrentStreak(newCurrentStreakCount);
                setShowStreakPopup(true); // Show the popup
            }

            // Telegram Bot Message Logic (removed as per your request for now)
            // If you decide to add it later, the code would go here.

        } catch (error) {
            console.error("Error updating streak:", error);
        } finally {
            setLoadingStreak(false);
        }
    };

    // Listen for real-time updates to display current streak in Navbar etc.
    useEffect(() => {
        if (!user || !user.id) { // Ensure user object and ID are available
            setLoadingStreak(false);
            return;
        }
        const userId = user.id;
        const streakRef = ref(db, `users/${userId}/streak`);

        const unsubscribe = onValue(streakRef, (snapshot) => {
            const streakData = snapshot.val();
            if (streakData) {
                setCurrentStreak(streakData.currentStreakCount || 0);
                setLongestStreak(streakData.longestStreakCount || 0);
            } else {
                setCurrentStreak(0);
                setLongestStreak(0);
            }
            setLoadingStreak(false);
        }, (error) => {
            console.error("Error fetching real-time streak data:", error);
            setLoadingStreak(false);
        });

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, [user.id, db]); // Depend on user.id and db instance

    // Initial streak update on app load/user available from Telegram
    useEffect(() => {
        if (user && user.id) {
            // Delay `updateStreak` slightly to ensure `initializeUser` might have run
            // and initial user data is ready in DB.
            const timeoutId = setTimeout(() => {
                updateStreak(); // Call the streak logic
            }, 500); // Small delay

            return () => clearTimeout(timeoutId); // Cleanup timeout
        }
    }, [user.id]); // Trigger when user object's ID becomes available

    // Function to close the popup, exposed via context
    const closeStreakPopup = () => {
        setShowStreakPopup(false);
        setPopupMessage('');
        setPopupCurrentStreak(0);
    };

    const streakContextValue = {
        currentStreak,
        longestStreak,
        loadingStreak,
        updateStreak, // Expose this function if other components need to trigger a streak check
        // --- Expose popup states for StreakPopup component ---
        showStreakPopup,
        popupMessage,
        popupCurrentStreak,
        closeStreakPopup
    };

    return (
        <StreakContext.Provider value={streakContextValue}>
            {children}
        </StreakContext.Provider>
    );
};

export default StreakTracker;