// pushTasks.js
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, set, remove } = require("firebase/database");

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

// ==========================================
// 📅 DAILY TASKS (Recurring every day)
// ==========================================
const dailyTasks = [
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
    updatedAt: new Date().toISOString(),
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
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Complete Daily Quiz",
    description: "Educational quiz to test your knowledge",
    completed: 0,
    type: "misc",
    category: "daily",
    total: 1,
    points: 75,
    score: 75,
    iconBg: "bg-indigo-500/30",
    updatedAt: new Date().toISOString(),
  },
];

// ==========================================
// 🗓️ WEEKLY TASKS (Reset weekly)
// ==========================================
const weeklyTasks = [
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
    updatedAt: new Date().toISOString(),
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
    updatedAt: new Date().toISOString(),
  },
];

// ==========================================
// 🏆 ACHIEVEMENTS (One-time milestones)
// ==========================================
const achievements = [
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
    updatedAt: new Date().toISOString(),
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
    updatedAt: new Date().toISOString(),
  },
];

// ==========================================
// 📌 NORMAL / STANDARD TASKS (One-off, Social, Etc.)
// ==========================================
const normalTasks = [
  {
    id: 1,
    title: "Watch Introduction Video",
    description: "Introductory video to get started",
    completed: 0,
    type: "watch",
    category: "standard",
    total: 1,
    points: 100,
    score: 400,
    iconBg: "bg-indigo-500/30",
    updatedAt: new Date().toISOString(),
    url: "https://www.youtube.com/watch?v=E2JQrC6yO1U",
    videoUrl: "https://www.youtube.com/watch?v=E2JQrC6yO1U",
  },
  {
    id: 2,
    title: "Refer a Friend",
    description: "Referral bonus for inviting friends",
    completed: 0,
    type: "partnership",
    category: "standard",
    total: 1,
    points: 300,
    score: 200,
    iconBg: "bg-indigo-500/30",
    updatedAt: new Date().toISOString(),
    url: "https://t.me/+vv1QtTdqBlkYzlI",
  },
  {
    id: 4,
    title: "Watch Product Demo",
    description: "Demonstrative walkthrough of features",
    completed: 0,
    type: "watch",
    category: "standard",
    total: 1,
    points: 300,
    score: 300,
    iconBg: "bg-indigo-500/30",
    updatedAt: new Date().toISOString(),
    url: "https://www.youtube.com/watch?v=E2JQrC6yO1U",
    videoUrl: "https://www.youtube.com/watch?v=E2JQrC6yO1U",
  },
  {
    id: 5,
    title: "Join Channel",
    description: "Network by joining our official channel",
    completed: 0,
    type: "social",
    category: "standard",
    total: 1,
    points: 50,
    score: 50,
    iconBg: "bg-indigo-500/30",
    updatedAt: new Date().toISOString(),
    url: "https://t.me/+vv1QtTdqBlkYzlI",
  },
];

// 🔄 Pushing categorized tasks to Firebase
console.log("🚀 Pushing nested tasks to Firebase Realtime Database...\n");

const pushData = async () => {
  try {
    // Clear existing tasks to avoid flat/nested mix - CRITICAL for clean structure
    await remove(ref(database, 'tasks'));
    console.log("🗑️  Cleared existing tasks.");

    // Helper to push a category
    const pushCategory = async (categoryName, tasks) => {
      for (const task of tasks) {
        // Ensure category is set correctly in the object too
        const taskWithCategory = { ...task, category: categoryName };
        await set(ref(database, `tasks/${categoryName}/${task.id}`), taskWithCategory);
        console.log(`✅ [${categoryName.toUpperCase()}] Task ${task.id} pushed.`);
      }
    };

    await pushCategory('daily', dailyTasks);
    await pushCategory('weekly', weeklyTasks);
    await pushCategory('achievements', achievements);
    await pushCategory('standard', normalTasks);

    console.log("\n✨ Done! Database is now strictly nested: tasks/daily, tasks/weekly, etc.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

pushData();
