// Main application component with routing, context providers, and daily/weekly task resets
// import React, {useEffect} from 'react';
// import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
// import './App.css';
// import AdminTask from './pages/AdminTask';
// import AdminNews from './pages/AdminNews';
// import FarmingComponent from "./pages/FarmPage/FamingComponent";
// import NetworkComponent from './pages/NetworkPage/NetworkComponent';
// import GameComponent from './pages/GamePage/GameComponent';
// import NewsComponent from "./pages/NewsPage/NewsComponent"
// import WalletComponent from './pages/WalletPage/WalletComponent';
// import TaskComponent from './pages/TaskPage/TaskComponent';
// import HomeComponent from './pages/HomePage/HomeComponent';
// import {useTelegram} from "./reactContext/TelegramContext.js"
// import { initializeUser } from "./services/userManagement.js";
// import Navbar from './components/Navbar.js';
// import TaskUIComponent from "./pages/TaskPage/TaskUIComponent.js"
// import UserProfile from "./pages/ProfilePage/UserProfile.js"
// // Import the WalletProvider
// import { WalletProvider } from './reactContext/WalletContext.js';
// import { ref, get, update,remove } from "firebase/database";
// import { database } from "./services/FirebaseConfig.js"
// import { format } from 'date-fns'; // optional, for date formatting



// // AdminNavbar component remains unchanged
// function AdminNavbar() {
//   const location = useLocation();
//   const showNavbar = location.pathname === "/admintask" || location.pathname === "/adminNews";
//   if (!showNavbar) return null;
//   return (
//     <nav className="navbar-admin">
//       <ul className="nav-admin-links">
//         <li className='nav-li-items-admin'>
//           <Link to="/admintask">Admin Task</Link>
//           <Link to="/adminNews">Admin News</Link>
//         </li>
//       </ul>
//     </nav>
//   );
// }

// function App() {
//   const {user}=useTelegram()

//   useEffect(() => {
//         const tg = window.Telegram.WebApp;
//         tg.ready();
//         tg.expand();
//         const user = tg.initDataUnsafe.user;

//         const fetchData = async () => {
//           if (user) {
//             await initializeUser(user);
//           } else {
//             console.error("User data not available");
//           }
//         };
//         fetchData();


//   }, []);
//   useEffect(()=>{

//     resetTasksIfNeeded(user.id)
//   },[user.id])

//   const resetTasksIfNeeded = async (userId) => {
//     if (!userId) return;

//     const today = format(new Date(), "yyyy-MM-dd");

//     // Reference to the user's connection data
//     const connectionRef = ref(database, `users/${userId}`);
//     const snapshot = await get(connectionRef);
//     const data = snapshot.val();

//     if (!data) return;

//     const updates = {};

//     // Daily Reset
//     if (data.lastReset?.daily !== today) {
//       // Remove daily tasks

//       await update(ref(database, `connections/${userId}/tasks`), {daily:{}});

//       // Update lastReset/daily under connections
//       updates[`users/${userId}/lastReset/daily`] = today;

//       // Set no_of_tickets to 3 under users
//       updates[`users/${userId}/Score/no_of_tickets`] = 3;
//     }

//     // Weekly Reset (only on Monday)
//     const weekDay = new Date().getDay(); // 0 = Sunday, 1 = Monday, ...
//     if (data.lastReset?.weekly !== today && weekDay === 1) {
//       await remove(ref(database, `connections/${userId}/tasks/weekly`));
//       // updates[`connections/${userId}/lastReset/weekly`] = today;
//     }

//     // Apply updates only if there are changes
//     if (Object.keys(updates).length > 0) {
//       await update(ref(database), updates); // Must update from root
//     }
//   };

//   return (
//     <WalletProvider>
//       <Router>
//         <div className="App mb-3 flex flex-col min-h-screen">
//           <AdminNavbar />
//           <div className="content flex-1">
//             <Routes>
//               <Route path="/" element={<HomeComponent />} />
//               <Route path="/profile" element={<UserProfile/>} />
//               <Route path="/game" element={<GameComponent />} />
//               <Route path="/network" element={<NetworkComponent />} />
//               <Route path="/news" element={<NewsComponent />} />
//               <Route path="/tasks" element={<TaskUIComponent />} />
//               <Route path="/wallet" element={<WalletComponent />} />
//               <Route path="/admintask" element={<AdminTask />} />
//               <Route path="/adminNews" element={<AdminNews />} />
//             </Routes>
//           </div>
//           <Navbar/>
//         </div>
//       </Router>
//     </WalletProvider>
//   );
// }

// export default App;


import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import './App.css';
import AdminTask from './pages/AdminTask';
import AdminNews from './pages/AdminNews';
import FarmingComponent from "./pages/FarmPage/FamingComponent";
import NetworkComponent from './pages/NetworkPage/NetworkComponent';
import GameComponent from './pages/GamePage/GameComponent';
import NewsComponent from "./pages/NewsPage/NewsComponent"
import WalletComponent from './pages/WalletPage/WalletComponent';
import TaskComponent from './pages/TaskPage/TaskComponent';
import HomeComponent from './pages/HomePage/HomeComponent';
import { useTelegram } from "./reactContext/TelegramContext.js"
import { initializeUser } from "./services/userManagement.js";
import Navbar from './components/Navbar.js';
import TaskUIComponent from "./pages/TaskPage/TaskUIComponent.js"
import UserProfile from "./pages/ProfilePage/UserProfile.js"
import History from "./pages/ProfilePage/History.js";
// Import the WalletProvider
import { WalletProvider } from './reactContext/WalletContext.js';
import { ReferralProvider } from "./reactContext/ReferralContext.js"
import { ref, get, update, remove } from "firebase/database";
import { database } from "./services/FirebaseConfig.js"
import { format } from 'date-fns'; // optional, for date formatting
import { addHistoryLog } from "./services/addHistory.js"
import { HistoryProvider } from "./reactContext/HistoryContext.js"
import StreakTracker, { useStreak } from './reactContext/StreakTracker.js';
import StreakPopup from "./pages/streakPopup.js";



// AdminNavbar component remains unchanged
function AdminNavbar() {
  const location = useLocation();
  const showNavbar = location.pathname === "/admintask" || location.pathname === "/adminNews";
  if (!showNavbar) return null;
  return (
    <nav className="navbar-admin">
      <ul className="nav-admin-links">

        <li className='nav-li-items-admin'>
          <Link to="/admintask">Admin Task</Link>
          <Link to="/adminNews">Admin News</Link>
        </li>
      </ul>
    </nav>
  );
}

function App() {
  const { user } = useTelegram()
  const location = useLocation();
  const { showStreakPopup, popupMessage, popupCurrentStreak, closeStreakPopup } = useStreak() || {};


  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    const user = tg.initDataUnsafe.user;


    const fetchData = async () => {
      if (user) {
        await initializeUser(user);
      } else {
        console.info("Dev mode: User data not available");
      }
    };
    fetchData();


  }, []);
  useEffect(() => {

    resetTasksIfNeeded(user.id)
  }, [user.id])

  const resetTasksIfNeeded = async (userId) => {
    if (!userId) return;

    const today = format(new Date(), "yyyy-MM-dd");

    // Reference to the user's connection data
    const connectionRef = ref(database, `users/${userId}`);
    const snapshot = await get(connectionRef);
    const data = snapshot.val();

    if (!data) return;

    const updates = {};

    // Daily Reset
    if (data.lastReset?.daily !== today) {
      // Remove daily tasks

      await update(ref(database, `connections/${userId}/tasks`), { daily: {} });

      // Update lastReset/daily under connections
      updates[`users/${userId}/lastReset/daily`] = today;

      const userRef = ref(database, `users/${user.id}/Score`);

      const snapshot = await get(userRef)

      console.log(snapshot.val())

      // Set no_of_tickets to 3 under users
      updates[`users/${userId}/Score/no_of_tickets`] = 3;
      const textData = {
        action: 'Daily login reward',
        points: 10,
        type: 'Home',
      }

      addHistoryLog(userId, textData)
    }

    // Weekly Reset (only on Monday)
    const weekDay = new Date().getDay(); // 0 = Sunday, 1 = Monday, ...
    if (data.lastReset?.weekly !== today && weekDay === 1) {
      await remove(ref(database, `connections/${userId}/tasks/weekly`));
      await update(ref(database, `history/${userId}`), {});
      // updates[`connections/${userId}/lastReset/weekly`] = today;
    }

    // Apply updates only if there are changes
    if (Object.keys(updates).length > 0) {
      await update(ref(database), updates); // Must update from root
    }
  };

  const hideNavbarRoutes = ['/game'];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <WalletProvider>
      <ReferralProvider>
        <HistoryProvider>
          <StreakTracker>
            <>
              <div className="App mb-3 flex flex-col min-h-screen">
                <AdminNavbar />
                <div className="content flex-1">
                  <Routes>
                    <Route path="/" element={<HomeComponent />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/game" element={<GameComponent />} />
                    <Route path="/network" element={<NetworkComponent />} />
                    <Route path="/news" element={<NewsComponent />} />
                    <Route path="/tasks" element={<TaskUIComponent />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/wallet" element={<WalletComponent />} />
                    <Route path="/admintask" element={<AdminTask />} />
                    <Route path="/adminNews" element={<AdminNews />} />
                  </Routes>
                </div>
                {shouldShowNavbar && <Navbar />}
              </div>
              <StreakPopup
                show={showStreakPopup}
                message={popupMessage}
                currentStreak={popupCurrentStreak}
                onClose={closeStreakPopup}
              />
            </>

          </StreakTracker>
        </HistoryProvider>
      </ReferralProvider>
    </WalletProvider>
  );
}

export default App;
