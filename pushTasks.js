// // pushTasks.js
// import { initializeApp } from "firebase/app";
// import { getDatabase, ref, set } from "firebase/database";

// // 🔑 Your Firebase Config (from your project)
// const firebaseConfig = {
//     apiKey: "AIzaSyD03YRikMYZnnncwJWyjDf2wVFer-vukqU",
//     authDomain: "telegram-e84b9.firebaseapp.com",
//     databaseURL: "https://telegram-e84b9-default-rtdb.asia-southeast1.firebasedatabase.app",
//     projectId: "telegram-e84b9",
//     storageBucket: "telegram-e84b9.firebasestorage.app",
//     messagingSenderId: "18200002246",
//     appId: "1:18200002246:web:df225386da8cf6d53861c7",
//     measurementId: "G-90BTGM8R0N"
// };

// // 🚀 Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);

// // 📋 Define weekly tasks
// const dailyTasks = [
//     {
//         id: 10,
//         title: "Read 5 news articles",
//         description: "Swipe through news articles to earn points",
//         completed: 0,
//         type: "news",
//         total: 5,
//         points: 25,
//         score: 25,
//         icon: "Zap", // Converted from JSX to string for DB
//         iconBg: "bg-indigo-500/30",
//         updatedAt: new Date().toISOString(),
//     },
//     {
//         id: 11,
//         title: "Play Fruit Ninja",
//         description: "Play the game at least once today",
//         completed: 0,
//         type: "game",
//         total: 1,
//         points: 15,
//         score: 15,
//         icon: "Award", // Converted from JSX to string for DB
//         iconBg: "bg-pink-500/30",
//         updatedAt: new Date().toISOString(),
//     },
// ];

// const weeklyTasks = [
//     {
//         id: 6,
//         title: "Complete all daily tasks",
//         description: "Finish all daily tasks for 3 days",
//         completed: 0,
//         total: 3,
//         points: 100,
//         score: 100,
//         type: "weekly",
//         category: "weekly",
//         iconBg: "bg-emerald-500/30",
//         updatedAt: new Date().toISOString(),
//     },
//     {
//         id: 7,
//         title: "Earn 500 points",
//         description: "Accumulate 500 points this week",
//         completed: 0,
//         total: 500,
//         points: 200,
//         score: 200,
//         type: "weekly",
//         category: "weekly",
//         iconBg: "bg-amber-500/30",
//         updatedAt: new Date().toISOString(),
//     },
// ];

// // 🏆 Define achievements
// const achievements = [
//     {
//         id: 8,
//         title: "Early Adopter",
//         description: "Join during the beta phase",
//         completed: 0,
//         total: 1,
//         points: 100,
//         score: 100,
//         type: "achievement",
//         category: "achievements",
//         icon: "Users",
//         iconBg: "bg-amber-500/30",
//         updatedAt: new Date().toISOString(),
//     },
//     {
//         id: 9,
//         title: "News Junkie",
//         description: "Read 100 news articles",
//         completed: 0,
//         total: 100,
//         points: 500,
//         score: 500,
//         type: "achievement",
//         category: "achievements",
//         icon: "Zap",
//         iconBg: "bg-indigo-500/30",
//         updatedAt: new Date().toISOString(),
//     },
// ];

// // 🔄 Combine and push
// const allTasks = [...dailyTasks, ...weeklyTasks, ...achievements];

// console.log("🚀 Pushing tasks to Firebase Realtime Database...\n");

// allTasks.forEach(async (task) => {
//     const taskRef = ref(database, `tasks/${task.id}`);
//     try {
//         await set(taskRef, task);
//         console.log(`✅ Task ${task.id} — "${task.title}" pushed successfully.`);
//     } catch (err) {
//         console.error(`❌ Failed to push task ${task.id}:`, err.message || err);
//     }
// });

// console.log("\n✨ Done!");

// pushTasks.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

// 🔑 Your Firebase Config (from your project)
const firebaseConfig = {
  apiKey: "AIzaSyD03YRikMYZnnncwJWyjDf2wVFer-vukqU",
  authDomain: "telegram-e84b9.firebaseapp.com",
  databaseURL:
    "https://telegram-e84b9-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "telegram-e84b9",
  storageBucket: "telegram-e84b9.firebasestorage.app",
  messagingSenderId: "18200002246",
  appId: "1:18200002246:web:df225386da8cf6d53861c7",
  measurementId: "G-90BTGM8R0N",
};

// 🚀 Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// 📋 Full task list (IDs 0 to 11)
const allTasks = [
  {
    id: 0,
    title: "Watch Introduction Video",
    description: "Introductory video to get started",
    completed: 0,
    type: "watch",
    category: "daily",
    total: 1,
    points: 100,
    score: 400,
    iconBg: "bg-indigo-500/30",
    updatedAt: "2026-01-02T00:00:00.000Z",
    url: "https://www.youtube.com/watch?v=E2JQrC6yO1U",
    videoUrl: "https://www.youtube.com/watch?v=E2JQrC6yO1U",
  },
  {
    id: 1,
    title: "Watch Introduction Video",
    description: "Introductory video to get started",
    completed: 0,
    type: "watch",
    category: "daily",
    total: 1,
    points: 50,
    score: 400,
    iconBg: "bg-indigo-500/30",
    updatedAt: "2026-01-02T00:00:00.000Z",
    url: "https://t.me/+vv1QtTdqBlkYzlI",
    videoUrl: "https://www.youtube.com/watch?v=E2JQrC6yO1U",
  },
  {
    id: 2,
    title: "Refer a Friend",
    description: "Referral bonus for inviting friends",
    completed: 0,
    type: "partnership",
    category: "daily", // ← Updated to appear on daily task page
    total: 1,
    points: 300,
    score: 200,
    iconBg: "bg-indigo-500/30",
    updatedAt: "2026-01-02T00:00:00.000Z",
    url: "https://t.me/+vv1QtTdqBlkYzlI",
  },
  {
    id: 3,
    title: "Complete Daily Quiz",
    description: "Educational quiz to test your knowledge",
    completed: 0,
    type: "misc",
    category: "educational",
    total: 1,
    points: 75,
    score: 75,
    iconBg: "bg-indigo-500/30",
    updatedAt: "2026-01-02T00:00:00.000Z",
  },
  {
    id: 4,
    title: "Watch Product Demo",
    description: "Demonstrative walkthrough of features",
    completed: 0,
    type: "watch",
    category: "daily",
    total: 1,
    points: 300,
    score: 300,
    iconBg: "bg-indigo-500/30",
    updatedAt: "2026-01-02T00:00:00.000Z",
    url: "https://www.youtube.com/watch?v=E2JQrC6yO1U",
  },
  {
    id: 5,
    title: "Join Channel",
    description: "Network by joining our official channel",
    completed: 0,
    type: "social",
    category: "network",
    total: 1,
    points: 50,
    score: 50,
    iconBg: "bg-indigo-500/30",
    updatedAt: "2026-01-02T00:00:00.000Z",
    url: "https://t.me/+vv1QtTdqBlkYzlI",
  },
  {
    id: 6,
    title: "Read 5 News Articles",
    description: "Swipe through news articles to earn points",
    completed: 0,
    type: "news",
    category: "daily",
    total: 5,
    points: 25,
    score: 25,
    icon: "Zap",
    iconBg: "bg-indigo-500/30",
    updatedAt: "2026-01-02T00:00:00.000Z",
  },
  {
    id: 7,
    title: "Play Fruit Ninja",
    description: "Play the game at least once today",
    completed: 0,
    type: "game",
    category: "daily",
    total: 1,
    points: 15,
    score: 15,
    icon: "Award",
    iconBg: "bg-pink-500/30",
    updatedAt: "2026-01-02T00:00:00.000Z",
  },
  {
    id: 8,
    title: "Complete All Daily Tasks",
    description: "Finish all daily tasks for 3 days",
    completed: 0,
    type: "weekly",
    category: "weekly",
    total: 3,
    points: 100,
    score: 100,
    iconBg: "bg-emerald-500/30",
    updatedAt: "2026-01-02T00:00:00.000Z",
  },
  {
    id: 9,
    title: "Earn 500 Points",
    description: "Accumulate 500 points this week",
    completed: 0,
    type: "weekly",
    category: "weekly",
    total: 500,
    points: 200,
    score: 200,
    iconBg: "bg-amber-500/30",
    updatedAt: "2026-01-02T00:00:00.000Z",
  },
  {
    id: 10,
    title: "Early Adopter",
    description: "Join during the beta phase",
    completed: 0,
    type: "achievement",
    category: "achievements",
    total: 1,
    points: 100,
    score: 100,
    icon: "Users",
    iconBg: "bg-amber-500/30",
    updatedAt: "2026-01-02T00:00:00.000Z",
  },
  {
    id: 11,
    title: "News Junkie",
    description: "Read 100 news articles",
    completed: 0,
    type: "achievement",
    category: "achievements",
    total: 100,
    points: 500,
    score: 500,
    icon: "Zap",
    iconBg: "bg-indigo-500/30",
    updatedAt: "2026-01-02T00:00:00.000Z",
  },
];

// 🔄 Push all tasks to Firebase
console.log("🚀 Pushing tasks to Firebase Realtime Database...\n");

allTasks.forEach(async (task) => {
  const taskRef = ref(database, `tasks/${task.id}`);
  try {
    await set(taskRef, task);
    console.log(`✅ Task ${task.id} — "${task.title}" pushed successfully.`);
  } catch (err) {
    console.error(`❌ Failed to push task ${task.id}:`, err.message || err);
  }
});

console.log("\n✨ Done!");
