// import React, { useState,useEffect } from 'react';
// import InviteModal from "./InviteModel"
// import "../../Styles/NetworkComponent.css"
// import { useNavigate } from 'react-router-dom';
// import Footer from '../../components/Footer';
// import { database } from "../../services/FirebaseConfig"
// import { ref, onValue } from "firebase/database";

// import { useTelegram } from "../../reactContext/TelegramContext.js";



// const NetworkComponent = () => {
//   const [userScore, setUserScore] = useState(0);
//   const [isModalOpen, setModalOpen] = useState(false);
//   const navigate = useNavigate()

//   const openModal = () => {
//     setModalOpen(true);
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//   };
//   const {user} = useTelegram()
//   const userId = user.id 

//   useEffect(() => {
//     if (!userId) return;

//     // Reference to the user's farming score in Firebase
//     const scoreRef = ref(database, `users/${userId}/Score/network_score`);

//     // Listen for real-time changes
//     const unsubscribe = onValue(scoreRef, (snapshot) => {
//       if (snapshot.exists()) {
//         setUserScore(snapshot.val()); // Update state with the latest score
//       } else {
//         setUserScore(0); 
//       }
//     });

   
//     return () => unsubscribe();
//   }, [userId]);

//   return (
//     <div className="main-networkcontainer">
//       <div className="network-content">
//         <div className="network-score">Score: {userScore}</div>
//         <div className="network-tabs">
//           <button className="network-tab active" data-tab="ton">TON</button>
//           <button className="network-tab" data-tab="points">Points</button>
//         </div>
//         <div class ="network-game-con" style={{ alignSelf: 'center' }}>
//           <button id="buttonid" className="network-game-button" onClick={()=>navigate("/game")}>Play game</button>
//         </div>
//         <div className="network-container">
//           <div className="network-invite-section">
//             <h2>Turn your friends into traders to earn TON!</h2>
//             <div className="network-rewards-info">
//               <div className="network-reward-card">
//                 <h3>Earn</h3>
//                 <div className="network-reward-value">20%</div>
//                 <div className="network-reward-text">of friends' trade commission</div>
//               </div>
//               <div className="network-reward-card">
//                 <h3>Earn</h3>
//                 <div className="network-reward-value">2.5%</div>
//                 <div className="network-reward-text">of their refs' trade commissions</div>
//               </div>
//             </div>
//             <button id="inviteButton" className="network-invite-button" onClick={openModal}>Invite a friend</button>
//           </div>
//         </div>
//         <InviteModal isOpen={isModalOpen} onClose={closeModal}  />
//       </div>
//       <Footer />
//     </div>
    
//   );
// };

// export default NetworkComponent;
// import React, { useState, useEffect } from 'react';
// import InviteModal from "./InviteModel";
// import "../../Styles/NetworkComponent.css";
// import { useNavigate } from 'react-router-dom';
// import Footer from '../../components/Footer';
// import { database } from "../../services/FirebaseConfig";
// import { ref, onValue } from "firebase/database";
// import { useTelegram } from "../../reactContext/TelegramContext.js";

// const NetworkComponent = () => {
//   const [userScore, setUserScore] = useState(0);
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [leaderboard, setLeaderboard] = useState([]);
//   const navigate = useNavigate();
//   const { user,scores } = useTelegram();
//   const userId = user.id;

//   // Fetch current user's network score
//   useEffect(() => {
//     if (!userId) return;
//     const scoreRef = ref(database, `users/${userId}/Score/network_score`);
//     const unsubscribe = onValue(scoreRef, (snapshot) => {
//       if (snapshot.exists()) {
//         setUserScore(snapshot.val());
//       } else {
//         setUserScore(0);
//       }
//     });
//     return () => unsubscribe();
//   }, [userId]);

//   // Fetch all users and build the leaderboard based on game high scores, filtering out unknown names
//   useEffect(() => {
//     const usersRef = ref(database, "users");
//     const unsubscribe = onValue(usersRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const usersData = snapshot.val();
//         const leaderboardData = Object.keys(usersData)
//           .map((uid) => ({
//             id: uid,
//             name: usersData[uid].name, // get name directly
//             score: usersData[uid].Score?.game_highest_score || 0,
//             score: usersData[uid].Score?.total_score || 0,
//           }))
//           .filter(player => player.name && player.name.trim() !== "" && player.name !== "Unknown");
          
//         leaderboardData.sort((a, b) => b.score - a.score);
//         setLeaderboard(leaderboardData);
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   return (
//     <div className="main-networkcontainer">
//       <div className="network-content">
//         <div className="network-score">Score: {userScore}</div>
        
//         <button className="network-game-button" disabled={scores?.no_of_tickets === 0} onClick={() => navigate("/game")}>
//             Play game  🎟️{scores?.no_of_tickets ?? 3}
//           </button>
//         <div className="network-container">
//           <div className="network-invite-section">
//             <h2>Turn your friends into traders to earn TON!</h2>
//             <div className="network-rewards-info">
//               <div className="network-reward-card">
//                 <h3>Earn</h3>
//                 <div className="network-reward-value">20%</div>
//                 <div className="network-reward-text">of friends' trade commission</div>
//               </div>
//               <div className="network-reward-card">
//                 <h3>Earn</h3>
//                 <div className="network-reward-value">2.5%</div>
//                 <div className="network-reward-text">of their refs' trade commissions</div>
//               </div>
//             </div>
//             <button id="inviteButton" className="network-invite-button" onClick={() => setModalOpen(true)}>
//               Invite a friend
//             </button>
//           </div>
//         </div>

//         {/* Leaderboard Section as a Table */}
//         <div className="leaderboard-container">
//           <h2>Leaderboard</h2>
//           <table className="leaderboard-table">
//             <thead>
//               <tr>
//                 <th>Rank</th>
//                 <th>Name</th>
//                 <th>Score</th>
//               </tr>
//             </thead>
//             <tbody>
//               {leaderboard.map((player, index) => (
//                 <tr key={player.id}>
//                   <td>{index + 1}</td>
//                   <td>{player.name}</td>
//                   <td>{player.score}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
        
//         <div className="network-game-con">
          
//         </div>
        
//         <InviteModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default NetworkComponent;
// import React, { useState, useEffect } from 'react';
// import InviteModal from "./InviteModel";
// import "../../Styles/NetworkComponent.css";
// import { useNavigate } from 'react-router-dom';
// import Footer from '../../components/Footer';
// import { database } from "../../services/FirebaseConfig";
// import { ref, onValue } from "firebase/database";
// import { useTelegram } from "../../reactContext/TelegramContext.js";

// const NetworkComponent = () => {
//   const [userScore, setUserScore] = useState(0);
//   const [isModalOpen, setModalOpen] = useState(false);
//   // States for two separate leaderboards:
//   const [leaderboardHighest, setLeaderboardHighest] = useState([]);
//   const [leaderboardTotal, setLeaderboardTotal] = useState([]);
//   // States to handle collapse/expand
//   const [isHighestExpanded, setHighestExpanded] = useState(false);
//   const [isTotalExpanded, setTotalExpanded] = useState(false);
  
//   const navigate = useNavigate();
//   const { user, scores } = useTelegram();
//   const userId = user.id;

//   // Fetch current user's network score
//   useEffect(() => {
//     if (!userId) return;
//     const scoreRef = ref(database, `users/${userId}/Score/network_score`);
//     const unsubscribe = onValue(scoreRef, (snapshot) => {
//       if (snapshot.exists()) {
//         setUserScore(snapshot.val());
//       } else {
//         setUserScore(0);
//       }
//     });
//     return () => unsubscribe();
//   }, [userId]);

//   // Fetch all users and build two leaderboards for highest and total scores
//   useEffect(() => {
//     const usersRef = ref(database, "users");
//     const unsubscribe = onValue(usersRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const usersData = snapshot.val();
//         const leaderboardData = Object.keys(usersData)
//           .map((uid) => ({
//             id: uid,
//             name: usersData[uid].name,
//             highest: usersData[uid].Score?.game_highest_score || 0,
//             total: usersData[uid].Score?.total_score || 0,
//           }))
//           .filter(player => player.name && player.name.trim() !== "" && player.name !== "Unknown");
          
//         // Sort by highest score and total score
//         const sortedHighest = [...leaderboardData].sort((a, b) => b.highest - a.highest);
//         const sortedTotal = [...leaderboardData].sort((a, b) => b.total - a.total);
//         setLeaderboardHighest(sortedHighest);
//         setLeaderboardTotal(sortedTotal);
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   return (
//     <div className="main-networkcontainer">
//       <div className="network-content">
//         <div className="network-score">Score: {userScore}</div>
        
//         <button 
//           className="network-game-button" 
//           disabled={scores?.no_of_tickets === 0} 
//           onClick={() => navigate("/game")}
//         >
//           Play game 🎟️{scores?.no_of_tickets ?? 3}
//         </button>
//         <div className="network-container">
//           <div className="network-invite-section">
//             <h2>Turn your friends into traders to earn TON!</h2>
//             <div className="network-rewards-info">
//               <div className="network-reward-card">
//                 <h3>Earn</h3>
//                 <div className="network-reward-value">20%</div>
//                 <div className="network-reward-text">of friends' trade commission</div>
//               </div>
//               <div className="network-reward-card">
//                 <h3>Earn</h3>
//                 <div className="network-reward-value">2.5%</div>
//                 <div className="network-reward-text">of their refs' trade commissions</div>
//               </div>
//             </div>
//             <button 
//               id="inviteButton" 
//               className="network-invite-button" 
//               onClick={() => setModalOpen(true)}
//             >
//               Invite a friend
//             </button>
//           </div>
//         </div>

//         {/* Game Highest Score Leaderboard */}
//         <div className="leaderboard-container">
//           <div className="table-header">
//             <h4>Game: Highest-Score</h4>
            
//           </div>
//           <table className="leaderboard-table">
//             <thead>
//               <tr>
//                 <th>Rank</th>
//                 <th>Name</th>
//                 <th>Score <span 
//               className="dropdown-icon" 
//               onClick={() => setHighestExpanded(!isHighestExpanded)}
//             >
//               {isHighestExpanded ? "▲" : "▼"}
//             </span></th>
//               </tr>
//             </thead>
//             <tbody>
//               {isHighestExpanded 
//                 ? leaderboardHighest.map((player, index) => (
//                     <tr key={player.id}>
//                       <td>{index + 1}</td>
//                       <td>{player.name}</td>
//                       <td>{player.highest}</td>
//                     </tr>
//                   ))
//                 : leaderboardHighest[0] && (
//                     <tr>
//                       <td>1</td>
//                       <td>{leaderboardHighest[0].name}</td>
//                       <td>{leaderboardHighest[0].highest}</td>
//                     </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Game Total Score Leaderboard */}
//         <div className="leaderboard-container">
//           <div className="table-header">
//             <h4>Game: Total-Score</h4>
            
//           </div>
//           <table className="leaderboard-table">
//             <thead>
//               <tr>
//                 <th>Rank</th>
//                 <th>Name</th>
//                 <th>Score <span 
//               className="dropdown-icon" 
//               onClick={() => setTotalExpanded(!isTotalExpanded)}
//             >
//               {isTotalExpanded ? "▲" : "▼"}
//             </span></th>
//               </tr>
//             </thead>
//             <tbody>
//               {isTotalExpanded 
//                 ? leaderboardTotal.map((player, index) => (
//                     <tr key={player.id}>
//                       <td>{index + 1}</td>
//                       <td>{player.name}</td>
//                       <td>{player.total}</td>
//                     </tr>
//                   ))
//                 : leaderboardTotal[0] && (
//                     <tr>
//                       <td>1</td>
//                       <td>{leaderboardTotal[0].name}</td>
//                       <td>{leaderboardTotal[0].total}</td>
//                     </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
        
//         <div className="network-game-con">
//           {/* Additional game container if needed */}
//         </div>
        
//         <InviteModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
//       </div>
//       {/* The Footer is rendered here; its fixed positioning is handled via CSS */}

//     </div>
//   );
// };

// export default NetworkComponent;



// import { useState, useEffect } from "react"
// import {  useNavigate } from "react-router-dom"
// import { Zap, CheckSquare,  Bell,ChevronLeft, Users, Share2, Copy, Gift, Trophy, UserPlus } from "lucide-react"
// import { ref, onValue ,get} from "firebase/database"
// import { database } from "../../services/FirebaseConfig"
//  import InviteModal from "./InviteModel";
//  import { useTelegram } from "../../reactContext/TelegramContext"


// // Custom Button component
// const Button = ({ children, className = "", variant = "default", size = "default", onClick = () => {}, ...props }) => {
//   const baseStyles =
//     "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"
//   const variants = {
//     default: "bg-primary text-primary-foreground hover:bg-primary/90",
//     destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
//     outline: "border border-input hover:bg-accent hover:text-accent-foreground",
//     secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
//     ghost: "hover:bg-accent hover:text-accent-foreground",
//     link: "underline-offset-4 hover:underline text-primary",
//   }
//   const sizes = {
//     default: "h-10 py-2 px-4",
//     sm: "h-9 px-3 rounded-md",
//     lg: "h-11 px-8 rounded-md",
//     icon: "h-10 w-10",
//   }
//   return (
//     <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} onClick={onClick} {...props}>
//       {children}
//     </button>
//   )
// }

// // Custom Card components
// const Card = ({ children, className = "", ...props }) => (
//   <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props}>
//     {children}
//   </div>
// )

// const CardHeader = ({ children, className = "", ...props }) => (
//   <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
//     {children}
//   </div>
// )

// const CardTitle = ({ children, className = "", ...props }) => (
//   <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props}>
//     {children}
//   </h3>
// )

// const CardContent = ({ children, className = "", ...props }) => (
//   <div className={`p-6 pt-0 ${className}`} {...props}>
//     {children}
//   </div>
// )

// const CardFooter = ({ children, className = "", ...props }) => (
//   <div className={`flex items-center p-6 pt-0 ${className}`} {...props}>
//     {children}
//   </div>
// )

// // Custom Avatar components
// const Avatar = ({ children, className = "", ...props }) => (
//   <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`} {...props}>
//     {children}
//   </div>
// )

// const AvatarImage = ({ src, alt = "", className = "", ...props }) => (
//   <img src={src || "/placeholder.svg"} alt={alt} className={`aspect-square h-full w-full ${className}`} {...props} />
// )

// const AvatarFallback = ({ children, className = "", ...props }) => (
//   <div className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`} {...props}>
//     {children}
//   </div>
// )

// // Custom Badge component
// const Badge = ({ children, className = "", ...props }) => (
//   <div
//     className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}
//     {...props}
//   >
//     {children}
//   </div>
// )

// // Custom Progress component
// const Progress = ({ value = 0, className = "", indicatorClassName = "", ...props }) => (
//   <div className={`relative h-4 w-full overflow-hidden rounded-full bg-secondary ${className}`} {...props}>
//     <div
//       className={`h-full w-full flex-1 bg-primary transition-all ${indicatorClassName}`}
//       style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
//     />
//   </div>
// )

// // Custom Input component
// const Input = ({ className = "", ...props }) => (
//   <input
//     className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
//     {...props}
//   />
// )


// export default function NetworkComponent() {
//   const [copiedCode, setCopiedCode] = useState(false);
//   const [showShareOptions, setShowShareOptions] = useState(false);
//   const [activeTab, setActiveTab] = useState("leaderboard");
//   const [userId, setUserId] = useState(null);
//   const [userScore, setUserScore] = useState(0);
//   const [leaderboardTotal, setLeaderboardTotal] = useState([]);
//   const [leaderboardHighest, setLeaderboardHighest] = useState([]);
//   const [isModalOpen, setModalOpen] = useState(false);
//   // Initially no static invites; will load from database referrals.
//   const [invitedFriends, setInvitedFriends] = useState([]);
//   const [invite, setInvite] = useState("");
//   // New state variables for controlling expanded leaderboard views
//   const [globalExpanded, setGlobalExpanded] = useState(false);
//   const [gameExpanded, setGameExpanded] = useState(false);
  
//   const { user, scores } = useTelegram();
//   const navigate = useNavigate();

//   // Set current user id from Telegram user data
//   useEffect(() => {
//     if (user && user.id) {
//       setUserId(user.id);
//     }
//   }, [user]);

//   // Fetch user score
//   useEffect(() => {
//     if (!userId) return;
//     const scoreRef = ref(database, `users/${userId}/Score/network_score`);
//     const unsubscribe = onValue(scoreRef, (snapshot) => {
//       if (snapshot.exists()) {
//         setUserScore(snapshot.val());
//       } else {
//         setUserScore(0);
//       }
//     });
//     return () => unsubscribe();
//   }, [userId]);

//   // Fetch all users and build two leaderboards for highest and total scores
//   useEffect(() => {
//     const usersRef = ref(database, "users");
//     const unsubscribe = onValue(usersRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const usersData = snapshot.val();
//         const leaderboardData = Object.keys(usersData)
//           .map((uid) => ({
//             id: uid,
//             name: usersData[uid].name,
//             highest: usersData[uid].Score?.game_highest_score || 0,
//             total: usersData[uid].Score?.total_score || 0,
//           }))
//           .filter((player) => player.name && player.name.trim() !== "" && player.name !== "Unknown");

//         // Sort by highest score and total score
//         const sortedHighest = [...leaderboardData].sort((a, b) => b.highest - a.highest);
//         const sortedTotal = [...leaderboardData].sort((a, b) => b.total - a.total);
//         setLeaderboardHighest(sortedHighest);
//         setLeaderboardTotal(sortedTotal);
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   // New Effect: Fetch referral data for invited friends from current user's referrals.
//   useEffect(() => {
//     if (!user || !user.id) return;
//     const referralsRef = ref(database, `users/${user.id}/referrals`);
//     const unsubscribe = onValue(referralsRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const referralsObj = snapshot.val(); // e.g., { "1": referredId1, "2": referredId2, ... }
//         const referralIds = Object.values(referralsObj);
//         const invites = [];
//         // Function to fetch each referred user's details.
//         const fetchReferredUsers = async () => {
//           for (const referredId of referralIds) {
//             const userRef = ref(database, `users/${referredId}`);
//             const userSnapshot = await get(userRef);
//             if (userSnapshot.exists()) {
//               const userData = userSnapshot.val();
//               invites.push({
//                 id: referredId,
//                 name: userData.name || "Unknown",
//                 status: userData.status || "active",
//                 points: userData.Score?.network_score || 0,
                
//               });
//             }
//           }
//           setInvitedFriends(invites);
//         };
//         fetchReferredUsers();
//       } else {
//         setInvitedFriends([]);
//       }
//     });
//     return () => unsubscribe();
//   }, [user]);

//   const shareInvite = () => {
//     setShowShareOptions(!showShareOptions);
//     generateInviteLink();
//   };

//   const handleGameOpen = () => {
//     navigate("/game");
//   };

//   const generateReferralCode = () => {
//     if (!user) return null;
//     const timestamp = Date.now();
//     const referralBase = `${user.id}_${timestamp}`;
//     return btoa(referralBase).replace(/[^a-zA-Z0-9]/g, "").substring(0, 12);
//   };

//   const generateInviteLink = () => {
//     const refCode = generateReferralCode();
//     if (!refCode) return;
//     const link = `https://t.me/webs3new_bot/webs3new?startapp=ref_${refCode}_${user.id}`;
//     setInvite(link);
//   };

//   const openWhatsApp = () => {
//     const message = `Join me on this awesome platform and earn rewards!-${invite}`;
//     const encodedMessage = encodeURIComponent(message);
//     const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
//     console.log(invite);
//     window.open(whatsappUrl, '_blank');
//   };

//   const shareToTwitter = async () => {
//     const message = `Join me on this awesome platform and earn rewards! ${invite}`;
//     const encodedMessage = encodeURIComponent(message);
//     const twitterUrl = `https://twitter.com/messages/compose?text=${encodedMessage}`;
//     window.open(twitterUrl, '_blank');
//   };

//   // Format leaderboard data with ranks – removed the slicing limit and let the view code decide.
//   const formatLeaderboardData = (data) => {
//     return data.map((player, index) => ({
//       ...player,
//       rank: index + 1,
//       isCurrentUser: player.id === userId,
//       points: player.total,
//     }));
//   };

//   return (
//     <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex flex-col">
      
//       <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 via-purple-600/80 to-pink-600/90 z-0">
//         <div className="absolute inset-0 opacity-20">
//           <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
//             <defs>
//               <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
//                 <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" opacity="0.5" />
//               </pattern>
//               <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
//                 <rect width="80" height="80" fill="url(#smallGrid)" />
//                 <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="1" opacity="0.8" />
//               </pattern>
//             </defs>
//             <rect width="100%" height="100%" fill="url(#grid)" />
//           </svg>
//         </div>

//         {/* Floating Shapes */}
//         <div className="absolute top-[10%] left-[20%] w-20 h-20 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-20 blur-xl animate-float"></div>
//         <div className="absolute top-[60%] right-[15%] w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 blur-xl animate-float-delayed"></div>
//         <div className="absolute bottom-[20%] left-[30%] w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-400 opacity-20 blur-xl animate-float-slow"></div>
//         <div className="absolute inset-0 opacity-30">
//           <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
//             <path d="M0,100 C150,50 250,150 400,100" stroke="white" strokeWidth="0.5" fill="none" />
//             <path d="M0,200 C150,150 250,250 400,200" stroke="white" strokeWidth="0.5" fill="none" />
//             <path d="M0,300 C150,250 250,350 400,300" stroke="white" strokeWidth="0.5" fill="none" />
//             <path d="M0,400 C150,350 250,450 400,400" stroke="white" strokeWidth="0.5" fill="none" />
//             <path d="M0,500 C150,450 250,550 400,500" stroke="white" strokeWidth="0.5" fill="none" />
//             <path d="M0,600 C150,550 250,650 400,600" stroke="white" strokeWidth="0.5" fill="none" />
//             <path d="M0,700 C150,650 250,750 400,700" stroke="white" strokeWidth="0.5" fill="none" />
//             <path d="M0,800 C150,750 250,850 400,800" stroke="white" strokeWidth="0.5" fill="none" />
//           </svg>
//         </div>
//       </div>

//       <div className="flex-1 flex flex-col relative z-10">
//         <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 via-purple-600/80 to-pink-600/90 z-0">
//           <div className="absolute inset-0 opacity-20">
//             <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
//               <defs>
//                 <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
//                   <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" opacity="0.5" />
//                 </pattern>
//                 <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
//                   <rect width="80" height="80" fill="url(#smallGrid)" />
//                   <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="1" opacity="0.8" />
//                 </pattern>
//               </defs>
//               <rect width="100%" height="100%" fill="url(#grid)" />
//             </svg>
//           </div>
//           <div className="absolute top-[10%] left-[20%] w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 opacity-20 blur-xl animate-float"></div>
//           <div className="absolute top-[60%] right-[15%] w-24 h-24 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 blur-xl animate-float-delayed"></div>
//           <div className="absolute bottom-[20%] left-[30%] w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 opacity-20 blur-xl animate-float-slow"></div>
//           <div className="absolute inset-0 opacity-30">
//             <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
//               <path d="M0,100 C150,50 250,150 400,100" stroke="white" strokeWidth="0.5" fill="none" />
//               <path d="M0,200 C150,150 250,250 400,200" stroke="white" strokeWidth="0.5" fill="none" />
//               <path d="M0,300 C150,250 250,350 400,300" stroke="white" strokeWidth="0.5" fill="none" />
//               <path d="M0,400 C150,350 250,450 400,400" stroke="white" strokeWidth="0.5" fill="none" />
//               <path d="M0,500 C150,450 250,550 400,500" stroke="white" strokeWidth="0.5" fill="none" />
//               <path d="M0,600 C150,550 250,650 400,600" stroke="white" strokeWidth="0.5" fill="none" />
//               <path d="M0,700 C150,650 250,750 400,700" stroke="white" strokeWidth="0.5" fill="none" />
//               <path d="M0,800 C150,750 250,850 400,800" stroke="white" strokeWidth="0.5" fill="none" />
//             </svg>
//           </div>
//         </div>

//         <header className="sticky top-0 z-20 bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
//           <div className="flex items-center justify-between max-w-md mx-auto">
//             <div className="flex items-center gap-2">
//               <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/10" onClick={() => navigate("/")}>
//                 <ChevronLeft className="h-5 w-5" />
//               </Button>
//               <span className="font-bold text-base text-white">Network</span>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="flex items-center ">
//                 <span className="text-white font-medium mr-1">{scores?.network_score || 0}</span>
//                 <Zap className="h-4 w-4 text-amber-300 fill-amber-300 mr-3" />
//               </div>
//             </div>
//           </div>
//         </header>

//         <main className="flex-1 p-4 overflow-auto">
//           <div className="max-w-md mx-auto">
//             <Card className="mb-6 overflow-hidden border-none shadow-lg bg-white/10 backdrop-blur-sm">
//               <CardContent className="p-4">
//                 <h2 className="text-xl font-bold text-white mb-2 flex items-center">
//                   <UserPlus className="h-5 w-5 mr-2 text-indigo-300" />
//                   Invite Friends
//                 </h2>
//                 <p className="text-sm text-white/80 mb-4">Invite friends and both earn rewards!</p>
//                 <div className="flex items-center justify-center gap-6 mb-6 text-center">
//                   <div className="flex flex-col items-center">
//                     <Avatar className="h-14 w-14 border-2 border-indigo-300 mb-2">
//                       <AvatarFallback className="bg-indigo-600/30 text-white">You</AvatarFallback>
//                     </Avatar>
//                     <div className="bg-indigo-500/20 px-3 py-1 rounded-full text-white flex items-center">
//                       <Zap className="h-4 w-4 text-amber-300 fill-amber-300 mr-1" />
//                       <span className="font-bold">+100 XP</span>
//                     </div>
//                   </div>
//                   <div className="text-white opacity-70">
//                     <Gift className="h-7 w-7" />
//                   </div>
//                   <div className="flex flex-col items-center">
//                     <Avatar className="h-14 w-14 border-2 border-pink-300 mb-2">
//                       <AvatarFallback className="bg-pink-600/30 text-white">Friend</AvatarFallback>
//                     </Avatar>
//                     <div className="bg-pink-500/20 px-3 py-1 rounded-full text-white flex items-center">
//                       <Zap className="h-4 w-4 text-amber-300 fill-amber-300 mr-1" />
//                       <span className="font-bold">+50 XP</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="relative mb-4">
//                   {/* You can add additional content here if needed */}
//                 </div>
//                 <Button
//                   onClick={shareInvite}
//                   className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 h-12 font-bold"
//                 >
//                   <Share2 className="h-5 w-5 mr-2" />
//                   Share Invite Link
//                 </Button>
//                 {showShareOptions && (
//                   <div className="mt-4 grid grid-cols-3 gap-2">
//                     <Button
//                       variant="outline"
//                       className="text-white border-white/20 bg-white/5 flex flex-col items-center py-3"
//                       onClick={openWhatsApp}
//                     >
//                       <svg className="h-6 w-6 mb-1" viewBox="0 0 24 24" fill="#25D366">
//                         <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
//                       </svg>
//                       WhatsApp
//                     </Button>

//                     <Button
//                       id="inviteButton"
//                       onClick={() => setModalOpen(true)}
//                       variant="outline"
//                       className="text-white border-white/20 bg-white/5 flex flex-col items-center py-3"
//                     >
//                       <svg className="h-6 w-6 mb-1" viewBox="0 0 24 24" fill="#0088cc">
//                         <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.495 7.735l-2.309 11.688c-.153.755-.514.946-.982.601l-2.892-2.158-1.348 1.308c-.172.172-.343.343-.686.343l.229-3.215 5.778-5.205c.258-.229-.057-.343-.401-.115l-7.12 4.52-3.043-.969c-.743-.229-.743-.743.171-1.115l11.688-4.52c.63-.229 1.172.171.915.858z" />
//                       </svg>
//                       Telegram
//                     </Button>
//                     <Button
//                       variant="outline"
//                       className="text-white border-white/20 bg-white/5 flex flex-col items-center py-3"
//                       onClick={shareToTwitter}
//                     >
//                       <svg className="h-6 w-6 mb-1" viewBox="0 0 24 24" fill="#1DA1F2">
//                         <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
//                       </svg>
//                       Twitter
//                     </Button>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Tabs for My Invites and Leaderboard */}
//             <div className="relative z-10">
//               <div className="grid grid-cols-2 bg-white/10 p-0.5 rounded-md mb-4">
//                 <button
//                   onClick={() => setActiveTab("invites")}
//                   className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium text-white transition-all ${activeTab === "invites" ? "bg-white/20" : "hover:bg-white/10"}`}
//                 >
//                   <Users className="h-4 w-4 mr-1" />
//                   <span className="text-xs">My Invites</span>
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("leaderboard")}
//                   className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium text-white transition-all ${activeTab === "leaderboard" ? "bg-white/20" : "hover:bg-white/10"}`}
//                 >
//                   <Trophy className="h-4 w-4 mr-1" />
//                   <span className="text-xs">Leaderboard</span>
//                 </button>
//               </div>
//             </div>

//             {/* My Invites Tab */}
//             {activeTab === "invites" && (
//               <Card className="border-none shadow-lg bg-white/10 backdrop-blur-md">
//                 <CardHeader className="p-4 pb-2">
//                   <div className="flex justify-between items-center">
//                     <CardTitle className="text-lg text-white flex items-center">
//                       <Users className="h-5 w-5 mr-2 text-pink-300" />
//                       Invited Friends
//                     </CardTitle>
//                     <Badge className="bg-pink-600 text-white">
//                       {invitedFriends.filter((f) => f.status === "active").length}/{invitedFriends.length}
//                     </Badge>
//                   </div>
//                   <Progress
//                     value={(invitedFriends.filter((f) => f.status === "active").length / (invitedFriends.length || 1)) * 100}
//                     className="h-1 bg-white/20 mt-2"
//                     indicatorClassName="bg-pink-400"
//                   />

//                 </CardHeader>
//                 <CardContent className="p-4 pt-2">
//                   <div className="space-y-3 mt-2">
//                     {invitedFriends.map((friend) => (
//                       <div
//                         key={friend.id}
//                         className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
//                       >
//                         <div className="flex items-center gap-3">
//                           <Avatar className="h-10 w-10 border border-white/20">
//                             <AvatarFallback className="bg-white/10 text-white">
//                               {friend.name.charAt(0)}
//                             </AvatarFallback>
//                           </Avatar>
//                           <div>
//                             <p className="text-sm font-medium text-white">{friend.name}</p>
//                             <p className="text-xs flex items-center">
//                               {friend.status === "active" ? (
//                                 <span className="text-green-400 flex items-center gap-1">
//                                   <span className="h-2 w-2 bg-green-400 rounded-full"></span> Active
//                                 </span>
//                               ) : (
//                                 <span className="text-amber-400 flex items-center gap-1">
//                                   <span className="h-2 w-2 bg-amber-400 rounded-full"></span> Pending
//                                 </span>
//                               )}
//                             </p>
//                           </div>
//                         </div>
//                         {friend.status === "active" && (
//                           <Badge className="bg-indigo-600/80 flex items-center text-gray-100">
//                             <Zap className="h-3 w-3 mr-1 text-amber-300 fill-amber-300 " />
//                             {friend.points} XP
//                           </Badge>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//                 <CardFooter className="p-4 pt-0">
//                   <div className="w-full flex flex-col gap-2">
//                     <div className="text-white text-sm p-3 bg-white/5 rounded-lg">
//                       <div className="flex justify-between items-center mb-2">
//                         <span className="font-medium">Total Invites Sent</span>
//                         <span className="font-bold">{invitedFriends.length}</span>
//                       </div>
//                       <div className="flex justify-between items-center mb-2">
//                         <span className="font-medium">Active Friends</span>
//                         <span className="font-bold">
//                           {invitedFriends.filter((f) => f.status === "active").length}
//                         </span>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <span className="font-medium">Points Earned</span>
//                         <span className="font-bold flex items-center">
//                           <Zap className="h-4 w-4 mr-1 text-amber-300 fill-amber-300" />
//                           {invitedFriends.filter((f) => f.status === "active").length * 100}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </CardFooter>
//               </Card>
//             )}

//             {/* Leaderboard Tab */}
//             {activeTab === "leaderboard" && (
//               <Card className="border-none shadow-lg bg-white/10 backdrop-blur-md">
//                 <CardHeader className="p-4 pb-2">
//                   <div className="flex justify-between items-center">
//                     <CardTitle className="text-lg text-white flex items-center">
//                       <Trophy className="h-5 w-5 mr-2 text-amber-300" />
//                       Global Score
//                     </CardTitle>
//                     <Badge className="bg-amber-600 text-gray-100">Top Players</Badge>
//                   </div>
//                 </CardHeader>
//                 <CardContent className="p-4 pt-2">
//                   {(() => {
//                     const globalList = formatLeaderboardData(leaderboardTotal);
//                     const displayedList = globalExpanded ? globalList : globalList.slice(0, 3);
//                     return (
//                       <>
//                         <div className="space-y-2 mt-2">
//                           {displayedList.map((player) => (
//                             <div
//                               key={player.id}
//                               className={`flex items-center justify-between p-3 rounded-lg border ${
//                                 player.isCurrentUser
//                                   ? "bg-indigo-500/20 border-indigo-400/50"
//                                   : "bg-white/5 border-white/10"
//                               }`}
//                             >
//                               <div className="flex items-center gap-3">
//                                 <div className="w-7 flex justify-center">
//                                   {player.rank <= 3 ? (
//                                     <div
//                                       className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
//                                         player.rank === 1
//                                           ? "bg-amber-500/80"
//                                           : player.rank === 2
//                                             ? "bg-gray-300/80"
//                                             : "bg-amber-700/80"
//                                       }`}
//                                     >
//                                       {player.rank}
//                                     </div>
//                                   ) : (
//                                     <span className="text-white/70 font-medium">{player.rank}</span>
//                                   )}
//                                 </div>
//                                 <Avatar className="h-8 w-8 border border-white/20">
//                                   <AvatarFallback className="bg-white/10 text-white">
//                                     {player.name.charAt(0)}
//                                   </AvatarFallback>
//                                 </Avatar>
//                                 <div>
//                                   <p
//                                     className={`text-sm font-medium ${
//                                       player.isCurrentUser ? "text-indigo-200" : "text-white"
//                                     }`}
//                                   >
//                                     {player.name} {player.isCurrentUser && <span className="text-xs">(You)</span>}
//                                   </p>
//                                 </div>
//                               </div>
//                               <Badge
//                                 className={`${
//                                   player.rank === 1
//                                     ? "bg-amber-500"
//                                     : player.rank === 2
//                                       ? "bg-gray-400"
//                                       : player.rank === 3
//                                         ? "bg-amber-700"
//                                         : "bg-indigo-600/80"
//                                 } flex items-center text-gray-100`}
//                               >
//                                 <Zap className="h-3 w-3 mr-1 text-white fill-white" />
//                                 {player.points} XP
//                               </Badge>
//                             </div>
//                           ))}
//                         </div>
//                         {globalList.length > 3 && (
//                           <div className="mt-2">
//                             <Button
//                               variant="outline"
//                               className="w-full border-white/20 text-white hover:bg-white/10"
//                               onClick={() => setGlobalExpanded(!globalExpanded)}
//                             >
//                               {globalExpanded ? "Collapse" : "View Leaderboard"}
//                             </Button>
//                           </div>
//                         )}
//                       </>
//                     );
//                   })()}
//                 </CardContent>
//               </Card>
//             )}

//             <Card className="mb-6 mt-3 overflow-hidden border-none shadow-lg bg-white/10 backdrop-blur-sm">
//               <CardHeader className="p-4 pb-2">
//                 <CardTitle className="text-lg text-white flex items-center justify-between">
//                   <div className="flex items-center">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       className="h-5 w-5 mr-2 text-rose-300"
//                     >
//                       <path d="M12 2L15.09 8.41 22 9.27 17 14.15 18.18 21.02 12 17.77 5.82 21.02 7 14.15 2 9.27 8.91 8.41 12 2z" />
//                     </svg>
//                     Game Highest Score
//                   </div>
//                   <Badge className="bg-rose-600">Fruit Ninja</Badge>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="p-4 pt-2">
//                 {(() => {
//                   const gameList = leaderboardHighest;
//                   const displayedGameList = gameExpanded ? gameList : gameList.slice(0, 3);
//                   return (
//                     <>
//                       <div className="space-y-2 mt-2">
//                         {displayedGameList.map((player, index) => (
//                           <div
//                             key={player.id}
//                             className={`flex items-center justify-between p-3 ${
//                               index === 0
//                                 ? "bg-rose-500/20 border border-rose-400/30"
//                                 : index === 1
//                                   ? "bg-white/5 border border-white/10"
//                                   : "bg-indigo-500/20 border border-indigo-400/30"
//                             } rounded-lg`}
//                           >
//                             <div className="flex items-center gap-3">
//                               <div className="w-7 flex justify-center">
//                                 <div
//                                   className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
//                                     index === 0 ? "bg-amber-500/80" : index === 1 ? "bg-gray-300/80" : "bg-transparent"
//                                   }`}
//                                 >
//                                   {index === 2 ? <span className="text-white/70 font-medium">3</span> : index + 1}
//                                 </div>
//                               </div>
//                               <Avatar className="h-8 w-8 border border-white/20">
//                                 <AvatarFallback className="bg-white/10 text-white">
//                                   {player.name.charAt(0)}
//                                 </AvatarFallback>
//                               </Avatar>
//                               <div>
//                                 <p className={`text-sm font-medium ${index === 2 ? "text-indigo-200" : "text-white"}`}>
//                                   {player.name} {player.id === userId && <span className="text-xs">(You)</span>}
//                                 </p>
//                               </div>
//                             </div>
//                             <Badge
//                               className={`${
//                                 index === 0 ? "bg-rose-500" : index === 1 ? "bg-gray-500" : "bg-indigo-600"
//                               } flex items-center text-gray-100`}
//                             >
//                               {player.highest} pts
//                             </Badge>
//                           </div>
//                         ))}
//                       </div>
//                       {gameList.length > 3 && (
//                         <div className="mt-2">
//                           <Button
//                             variant="outline"
//                             className="w-full border-white/20 text-white hover:bg-white/10"
//                             onClick={() => setGameExpanded(!gameExpanded)}
//                           >
//                             {gameExpanded ? "Collapse" : "View Leaderboard"}
//                           </Button>
//                         </div>
//                       )}
//                     </>
//                   );
//                 })()}
//               </CardContent>
//               <CardFooter className="p-4 pt-0">
//                 <div className="w-full flex flex-col items-center gap-4">
//                   <div className="text-white/80 text-sm text-center">
//                     Complete more tasks and invite friends to climb the leaderboard!
//                   </div>
//                   <Button
//                     className="w-full max-w-xs bg-gradient-to-r from-rose-500 to-pink-600 text-white py-2 h-10 font-bold shadow-md hover:brightness-110 transition-all"
//                     onClick={handleGameOpen}
//                   >
//                     Play Again
//                   </Button>
//                 </div>
//               </CardFooter>
//             </Card>
//           </div>
//           <InviteModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
//         </main>
//       </div>
//     </div>
//   );
// 






import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Zap, ChevronLeft, Users, Share2, Gift, Trophy, UserPlus } from "lucide-react"
import { ref, onValue } from "firebase/database"
import { database } from "../../services/FirebaseConfig"
import InviteModal from "./InviteModel"
import { useTelegram } from "../../reactContext/TelegramContext"
import { useReferral } from "../../reactContext/ReferralContext"

// Custom Button component
const Button = ({ children, className = "", variant = "default", size = "default", onClick = () => {}, ...props }) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "underline-offset-4 hover:underline text-primary",
  }
  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
    icon: "h-10 w-10",
  }
  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} onClick={onClick} {...props}>
      {children}
    </button>
  )
}

// Custom Card components
const Card = ({ children, className = "", ...props }) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props}>
    {children}
  </div>
)

const CardHeader = ({ children, className = "", ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
    {children}
  </div>
)

const CardTitle = ({ children, className = "", ...props }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h3>
)

const CardContent = ({ children, className = "", ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
)

const CardFooter = ({ children, className = "", ...props }) => (
  <div className={`flex items-center p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
)

// Custom Avatar components
const Avatar = ({ children, className = "", ...props }) => (
  <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`} {...props}>
    {children}
  </div>
)

const AvatarImage = ({ src, alt = "", className = "", ...props }) => (
  <img src={src || "/placeholder.svg"} alt={alt} className={`aspect-square h-full w-full ${className}`} {...props} />
)

const AvatarFallback = ({ children, className = "", ...props }) => (
  <div className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`} {...props}>
    {children}
  </div>
)

// Custom Badge component
const Badge = ({ children, className = "", ...props }) => (
  <div
    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}
    {...props}
  >
    {children}
  </div>
)

// Custom Progress component
const Progress = ({ value = 0, className = "", indicatorClassName = "", ...props }) => (
  <div className={`relative h-4 w-full overflow-hidden rounded-full bg-secondary ${className}`} {...props}>
    <div
      className={`h-full w-full flex-1 bg-primary transition-all ${indicatorClassName}`}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </div>
)

// Custom Input component
const Input = ({ className = "", ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
)

export default function NetworkComponent() {
  const [copiedCode, setCopiedCode] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [activeTab, setActiveTab] = useState("leaderboard")
  const [userId, setUserId] = useState(null)
  const [userScore, setUserScore] = useState(0)
  const [leaderboardTotal, setLeaderboardTotal] = useState([])
  const [leaderboardHighest, setLeaderboardHighest] = useState([])
  const [isModalOpen, setModalOpen] = useState(false)
  // Initially no static invites; will load from database referrals.
  const { inviteLink, invitedFriends, shareToTelegram, shareToWhatsApp, shareToTwitter, copyToClipboard } =
    useReferral()
  // New state variables for controlling expanded leaderboard views
  const [globalExpanded, setGlobalExpanded] = useState(false)
  const [gameExpanded, setGameExpanded] = useState(false)

  const { user, scores } = useTelegram()
  const navigate = useNavigate()

  // Set current user id from Telegram user data
  useEffect(() => {
    if (user && user.id) {
      setUserId(user.id)
    }
  }, [user])

  // Fetch user score
  useEffect(() => {
    if (!userId) return
    const scoreRef = ref(database, `users/${userId}/Score/network_score`)
    const unsubscribe = onValue(scoreRef, (snapshot) => {
      if (snapshot.exists()) {
        setUserScore(snapshot.val())
      } else {
        setUserScore(0)
      }
    })
    return () => unsubscribe()
  }, [userId])

  // Fetch all users and build two leaderboards for highest and total scores
  useEffect(() => {
    const usersRef = ref(database, "users")
    const unsubscribe = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const usersData = snapshot.val()
        const leaderboardData = Object.keys(usersData)
          .map((uid) => ({
            id: uid,
            name: usersData[uid].name,
            highest: usersData[uid].Score?.game_highest_score || 0,
            total: usersData[uid].Score?.total_score || 0,
          }))
          .filter((player) => player.name && player.name.trim() !== "" && player.name !== "Unknown")

        // Sort by highest score and total score
        const sortedHighest = [...leaderboardData].sort((a, b) => b.highest - a.highest)
        const sortedTotal = [...leaderboardData].sort((a, b) => b.total - a.total)
        setLeaderboardHighest(sortedHighest)
        setLeaderboardTotal(sortedTotal)
      }
    })
    return () => unsubscribe()
  }, [])

  const shareInvite = () => {
    setShowShareOptions(!showShareOptions)
  }

  const handleGameOpen = () => {
    navigate("/game")
  }

  const handleWhatsAppShare = () => {
    shareToWhatsApp()
  }

  const handleTwitterShare = () => {
    shareToTwitter()
  }

  // Add a function to handle copying to clipboard:
  const handleCopy = async () => {
    const success = await copyToClipboard()
    if (success) {
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  // Format leaderboard data with ranks – removed the slicing limit and let the view code decide.
  const formatLeaderboardData = (data) => {
    return data.map((player, index) => ({
      ...player,
      rank: index + 1,
      isCurrentUser: player.id === userId,
      points: player.total,
    }))
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 via-purple-600/80 to-pink-600/90 z-0">
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" opacity="0.5" />
              </pattern>
              <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <rect width="80" height="80" fill="url(#smallGrid)" />
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="1" opacity="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating Shapes */}
        <div className="absolute top-[10%] left-[20%] w-20 h-20 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-20 blur-xl animate-float"></div>
        <div className="absolute top-[60%] right-[15%] w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 blur-xl animate-float-delayed"></div>
        <div className="absolute bottom-[20%] left-[30%] w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-400 opacity-20 blur-xl animate-float-slow"></div>
        <div className="absolute inset-0 opacity-30">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,100 C150,50 250,150 400,100" stroke="white" strokeWidth="0.5" fill="none" />
            <path d="M0,200 C150,150 250,250 400,200" stroke="white" strokeWidth="0.5" fill="none" />
            <path d="M0,300 C150,250 250,350 400,300" stroke="white" strokeWidth="0.5" fill="none" />
            <path d="M0,400 C150,350 250,450 400,400" stroke="white" strokeWidth="0.5" fill="none" />
            <path d="M0,500 C150,450 250,550 400,500" stroke="white" strokeWidth="0.5" fill="none" />
            <path d="M0,600 C150,550 250,650 400,600" stroke="white" strokeWidth="0.5" fill="none" />
            <path d="M0,700 C150,650 250,750 400,700" stroke="white" strokeWidth="0.5" fill="none" />
            <path d="M0,800 C150,750 250,850 400,800" stroke="white" strokeWidth="0.5" fill="none" />
          </svg>
        </div>
      </div>

      <div className="flex-1 flex flex-col relative z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 via-purple-600/80 to-pink-600/90 z-0">
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" opacity="0.5" />
                </pattern>
                <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                  <rect width="80" height="80" fill="url(#smallGrid)" />
                  <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="1" opacity="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          <div className="absolute top-[10%] left-[20%] w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 opacity-20 blur-xl animate-float"></div>
          <div className="absolute top-[60%] right-[15%] w-24 h-24 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 blur-xl animate-float-delayed"></div>
          <div className="absolute bottom-[20%] left-[30%] w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 opacity-20 blur-xl animate-float-slow"></div>
          <div className="absolute inset-0 opacity-30">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,100 C150,50 250,150 400,100" stroke="white" strokeWidth="0.5" fill="none" />
              <path d="M0,200 C150,150 250,250 400,200" stroke="white" strokeWidth="0.5" fill="none" />
              <path d="M0,300 C150,250 250,350 400,300" stroke="white" strokeWidth="0.5" fill="none" />
              <path d="M0,400 C150,350 250,450 400,400" stroke="white" strokeWidth="0.5" fill="none" />
              <path d="M0,500 C150,450 250,550 400,500" stroke="white" strokeWidth="0.5" fill="none" />
              <path d="M0,600 C150,550 250,650 400,600" stroke="white" strokeWidth="0.5" fill="none" />
              <path d="M0,700 C150,650 250,750 400,700" stroke="white" strokeWidth="0.5" fill="none" />
              <path d="M0,800 C150,750 250,850 400,800" stroke="white" strokeWidth="0.5" fill="none" />
            </svg>
          </div>
        </div>

        <header className="sticky top-0 z-20 bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-white hover:bg-white/10"
                onClick={() => navigate("/")}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <span className="font-bold text-base text-white">Network</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center ">
                <span className="text-white font-medium mr-1">{scores?.network_score || 0}</span>
                <Zap className="h-4 w-4 text-amber-300 fill-amber-300 mr-3" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 overflow-auto">
          <div className="max-w-md mx-auto">
            <Card className="mb-6 overflow-hidden border-none shadow-lg bg-white/10 backdrop-blur-sm">
              <CardContent className="p-4">
                <h2 className="text-xl font-bold text-white mb-2 flex items-center">
                  <UserPlus className="h-5 w-5 mr-2 text-indigo-300" />
                  Invite Friends
                </h2>
                <p className="text-sm text-white/80 mb-4">Invite friends and both earn rewards!</p>
                <div className="flex items-center justify-center gap-6 mb-6 text-center">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-14 w-14 border-2 border-indigo-300 mb-2">
                      <AvatarFallback className="bg-indigo-600/30 text-white">You</AvatarFallback>
                    </Avatar>
                    <div className="bg-indigo-500/20 px-3 py-1 rounded-full text-white flex items-center">
                      <Zap className="h-4 w-4 text-amber-300 fill-amber-300 mr-1" />
                      <span className="font-bold">+100 XP</span>
                    </div>
                  </div>
                  <div className="text-white opacity-70">
                    <Gift className="h-7 w-7" />
                  </div>
                  <div className="flex flex-col items-center">
                    <Avatar className="h-14 w-14 border-2 border-pink-300 mb-2">
                      <AvatarFallback className="bg-pink-600/30 text-white">Friend</AvatarFallback>
                    </Avatar>
                    <div className="bg-pink-500/20 px-3 py-1 rounded-full text-white flex items-center">
                      <Zap className="h-4 w-4 text-amber-300 fill-amber-300 mr-1" />
                      <span className="font-bold">+50 XP</span>
                    </div>
                  </div>
                </div>
                <div className="relative mb-4">{/* You can add additional content here if needed */}</div>
                <Button
                  onClick={shareInvite}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 h-12 font-bold"
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  Share Invite Link
                </Button>
                {showShareOptions && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      className="text-white border-white/20 bg-white/5 flex flex-col items-center py-3"
                      onClick={handleWhatsAppShare}
                    >
                      <svg className="h-6 w-6 mb-1" viewBox="0 0 24 24" fill="#25D366">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      WhatsApp
                    </Button>

                    <Button
                      id="inviteButton"
                      onClick={() => setModalOpen(true)}
                      variant="outline"
                      className="text-white border-white/20 bg-white/5 flex flex-col items-center py-3"
                    >
                      <svg className="h-6 w-6 mb-1" viewBox="0 0 24 24" fill="#0088cc">
                        <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.495 7.735l-2.309 11.688c-.153.755-.514.946-.982.601l-2.892-2.158-1.348 1.308c-.172.172-.343.343-.686.343l.229-3.215 5.778-5.205c.258-.229-.057-.343-.401-.115l-7.12 4.52-3.043-.969c-.743-.229-.743-.743.171-1.115l11.688-4.52c.63-.229 1.172.171.915.858z" />
                      </svg>
                      Telegram
                    </Button>
                    <Button
                      variant="outline"
                      className="text-white border-white/20 bg-white/5 flex flex-col items-center py-3"
                      onClick={handleTwitterShare}
                    >
                      <svg className="h-6 w-6 mb-1" viewBox="0 0 24 24" fill="#1DA1F2">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                      Twitter
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tabs for My Invites and Leaderboard */}
            <div className="relative z-10">
              <div className="grid grid-cols-2 bg-white/10 p-0.5 rounded-md mb-4">
                <button
                  onClick={() => setActiveTab("invites")}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium text-white transition-all ${activeTab === "invites" ? "bg-white/20" : "hover:bg-white/10"}`}
                >
                  <Users className="h-4 w-4 mr-1" />
                  <span className="text-xs">My Invites</span>
                </button>
                <button
                  onClick={() => setActiveTab("leaderboard")}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium text-white transition-all ${activeTab === "leaderboard" ? "bg-white/20" : "hover:bg-white/10"}`}
                >
                  <Trophy className="h-4 w-4 mr-1" />
                  <span className="text-xs">Leaderboard</span>
                </button>
              </div>
            </div>

            {/* My Invites Tab */}
            {activeTab === "invites" && (
              <Card className="border-none shadow-lg bg-white/10 backdrop-blur-md">
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg text-white flex items-center">
                      <Users className="h-5 w-5 mr-2 text-pink-300" />
                      Invited Friends
                    </CardTitle>
                    <Badge className="bg-pink-600 text-white">
                      {invitedFriends.filter((f) => f.status === "active").length}/{invitedFriends.length}
                    </Badge>
                  </div>
                  <Progress
                    value={
                      (invitedFriends.filter((f) => f.status === "active").length / (invitedFriends.length || 1)) * 100
                    }
                    className="h-1 bg-white/20 mt-2"
                    indicatorClassName="bg-pink-400"
                  />
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="space-y-3 mt-2">
                    {invitedFriends.map((friend) => (
                      <div
                        key={friend.id}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-white/20">
                            <AvatarFallback className="bg-white/10 text-white">{friend.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-white">{friend.name}</p>
                            <p className="text-xs flex items-center">
                              {friend.status === "active" ? (
                                <span className="text-green-400 flex items-center gap-1">
                                  <span className="h-2 w-2 bg-green-400 rounded-full"></span> Active
                                </span>
                              ) : (
                                <span className="text-amber-400 flex items-center gap-1">
                                  <span className="h-2 w-2 bg-amber-400 rounded-full"></span> Pending
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        {friend.status === "active" && (
                          <Badge className="bg-indigo-600/80 flex items-center text-gray-100">
                            <Zap className="h-3 w-3 mr-1 text-amber-300 fill-amber-300 " />
                            {/* {friend.points} XP */}
                            100 XP
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <div className="w-full flex flex-col gap-2">
                    <div className="text-white text-sm p-3 bg-white/5 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Total Invites Sent</span>
                        <span className="font-bold">{invitedFriends.length}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Active Friends</span>
                        <span className="font-bold">{invitedFriends.filter((f) => f.status === "active").length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Points Earned</span>
                        <span className="font-bold flex items-center">
                          <Zap className="h-4 w-4 mr-1 text-amber-300 fill-amber-300" />
                          {invitedFriends.filter((f) => f.status === "active").length * 100}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            )}

            {/* Leaderboard Tab */}
            {activeTab === "leaderboard" && (
              <Card className="border-none shadow-lg bg-white/10 backdrop-blur-md">
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg text-white flex items-center">
                      <Trophy className="h-5 w-5 mr-2 text-amber-300" />
                      Global Score
                    </CardTitle>
                    <Badge className="bg-amber-600 text-gray-100">Top Players</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  {(() => {
                    const globalList = formatLeaderboardData(leaderboardTotal)
                    const displayedList = globalExpanded ? globalList : globalList.slice(0, 3)
                    return (
                      <>
                        <div className="space-y-2 mt-2">
                          {displayedList.map((player) => (
                            <div
                              key={player.id}
                              className={`flex items-center justify-between p-3 rounded-lg border ${
                                player.isCurrentUser
                                  ? "bg-indigo-500/20 border-indigo-400/50"
                                  : "bg-white/5 border-white/10"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-7 flex justify-center">
                                  {player.rank <= 3 ? (
                                    <div
                                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                                        player.rank === 1
                                          ? "bg-amber-500/80"
                                          : player.rank === 2
                                            ? "bg-gray-300/80"
                                            : "bg-amber-700/80"
                                      }`}
                                    >
                                      {player.rank}
                                    </div>
                                  ) : (
                                    <span className="text-white/70 font-medium">{player.rank}</span>
                                  )}
                                </div>
                                <Avatar className="h-8 w-8 border border-white/20">
                                  <AvatarFallback className="bg-white/10 text-white">
                                    {player.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p
                                    className={`text-sm font-medium ${
                                      player.isCurrentUser ? "text-indigo-200" : "text-white"
                                    }`}
                                  >
                                    {player.name} {player.isCurrentUser && <span className="text-xs">(You)</span>}
                                  </p>
                                </div>
                              </div>
                              <Badge
                                className={`${
                                  player.rank === 1
                                    ? "bg-amber-500"
                                    : player.rank === 2
                                      ? "bg-gray-400"
                                      : player.rank === 3
                                        ? "bg-amber-700"
                                        : "bg-indigo-600/80"
                                } flex items-center text-gray-100`}
                              >
                                <Zap className="h-3 w-3 mr-1 text-white fill-white" />
                                {player.points} XP
                              </Badge>
                            </div>
                          ))}
                        </div>
                        {globalList.length > 3 && (
                          <div className="mt-2">
                            <Button
                              variant="outline"
                              className="w-full border-white/20 text-white hover:bg-white/10"
                              onClick={() => setGlobalExpanded(!globalExpanded)}
                            >
                              {globalExpanded ? "Collapse" : "View Leaderboard"}
                            </Button>
                          </div>
                        )}
                      </>
                    )
                  })()}
                </CardContent>
              </Card>
            )}

            <Card className="mb-6 mt-3 overflow-hidden border-none shadow-lg bg-white/10 backdrop-blur-sm">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 mr-2 text-rose-300"
                    >
                      <path d="M12 2L15.09 8.41 22 9.27 17 14.15 18.18 21.02 12 17.77 5.82 21.02 7 14.15 2 9.27 8.91 8.41 12 2z" />
                    </svg>
                    Game Highest Score
                  </div>
                  <Badge className="bg-rose-600">Fruit Ninja</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                {(() => {
                  const gameList = leaderboardHighest
                  const displayedGameList = gameExpanded ? gameList : gameList.slice(0, 3)
                  return (
                    <>
                      <div className="space-y-2 mt-2">
                        {displayedGameList.map((player, index) => (
                          <div
                            key={player.id}
                            className={`flex items-center justify-between p-3 ${
                              index === 0
                                ? "bg-rose-500/20 border border-rose-400/30"
                                : index === 1
                                  ? "bg-white/5 border border-white/10"
                                  : "bg-indigo-500/20 border border-indigo-400/30"
                            } rounded-lg`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-7 flex justify-center">
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                                    index === 0 ? "bg-amber-500/80" : index === 1 ? "bg-gray-300/80" : "bg-transparent"
                                  }`}
                                >
                                  {index === 2 ? <span className="text-white/70 font-medium">3</span> : index + 1}
                                </div>
                              </div>
                              <Avatar className="h-8 w-8 border border-white/20">
                                <AvatarFallback className="bg-white/10 text-white">
                                  {player.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className={`text-sm font-medium ${index === 2 ? "text-indigo-200" : "text-white"}`}>
                                  {player.name} {player.id === userId && <span className="text-xs">(You)</span>}
                                </p>
                              </div>
                            </div>
                            <Badge
                              className={`${
                                index === 0 ? "bg-rose-500" : index === 1 ? "bg-gray-500" : "bg-indigo-600"
                              } flex items-center text-gray-100`}
                            >
                              {player.highest} pts
                            </Badge>
                          </div>
                        ))}
                      </div>
                      {gameList.length > 3 && (
                        <div className="mt-2">
                          <Button
                            variant="outline"
                            className="w-full border-white/20 text-white hover:bg-white/10"
                            onClick={() => setGameExpanded(!gameExpanded)}
                          >
                            {gameExpanded ? "Collapse" : "View Leaderboard"}
                          </Button>
                        </div>
                      )}
                    </>
                  )
                })()}
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <div className="w-full flex flex-col items-center gap-4">
                  <div className="text-white/80 text-sm text-center">
                    Complete more tasks and invite friends to climb the leaderboard!
                  </div>
                  <Button
                    className="w-full max-w-xs bg-gradient-to-r from-rose-500 to-pink-600 text-white py-2 h-10 font-bold shadow-md hover:brightness-110 transition-all"
                    onClick={handleGameOpen}
                  >
                    Play Again
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
          <InviteModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
        </main>
      </div>
    </div>
  )
}




