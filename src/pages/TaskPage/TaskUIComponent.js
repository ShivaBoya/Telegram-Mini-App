// import { useState, useEffect } from "react"
// import { ChevronLeft, Award, Zap, Users, Wallet, CheckSquare, BookOpen, PlayCircle, Send, Twitter } from "lucide-react"
// import { Button } from "../../components/ui/button"
// import { Card, CardContent } from "../../components/ui/card"
// import { Badge } from "../../components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
// import { Progress } from "../../components/ui/progress.js"
// import { useTelegram } from "../../reactContext/TelegramContext"
// import { useNavigate } from "react-router-dom"
// import { database } from "../../services/FirebaseConfig"
// import { ref, onValue, set, update, get } from "firebase/database"
// import { addHistoryLog } from "../../services/addHistory.js";

// const BOT_TOKEN = process.env.REACT_APP_BOT_TOKEN;

// export default function TasksPage() {
//   const [points, setPoints] = useState(120)
//   const [activeTab, setActiveTab] = useState("daily")
//   const { user, scores } = useTelegram()
//   const [tasks, setTasks] = useState([]);
//   const [filterType, setFilterType] = useState("all");
//   const navigate = useNavigate()
//   const [clicked, setClick] = useState({ watch: {}, social: false })
//   const [verify, setVerify] = useState("")

//   const [buttonText, setButtonText] = useState([]);
//   const [membershipStatus, setMembershipStatus] = useState(null);

//   const [userTasks, setUserTasks] = useState({});
//   const [gameCompleted, setGameCompleted] = useState(false);
//   const [newsCount, setnewsCount] = useState(0)

//   //connetions ref
//   const userTasksRef = ref(database, `connections/${user.id}`);
//   const userScoreRef = ref(database, `users/${user.id}/Score`);
//   const userId = user.id

//   useEffect(() => {
//     const tasksRef = ref(database, "tasks");
//     const gameTaskRef = ref(database, `connections/${user.id}/tasks/daily/game`);
//     const newsRef = ref(database, `connections/${user.id}/tasks/daily/news`)

//     onValue(tasksRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         const tasksArray = Object.entries(data).map(([id, task]) => ({ ...task, id }));
//         setTasks(tasksArray);
//       } else {
//         setTasks([]);
//       }
//     });
//     onValue(gameTaskRef, (snapshot) => {
//       const value = snapshot.val();

//       setGameCompleted(value === true);
//     });
//     onValue(newsRef, (snapshot) => {
//       const value = snapshot.val();
//       if (value) {
//         const newsLength = Object.keys(value).length;
//         setnewsCount(newsLength)
//       } else {
//         setnewsCount(0)
//       }
//     });


//     const unsubscribe = onValue(userTasksRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         setUserTasks(data);
//       } else {
//         setUserTasks({});
//       }
//     });

//     // Cleanup the listener on unmount
//     return () => unsubscribe();



//   }, [user.id]);

//   // useEffect(() => {
//   //   const userTasksRef = ref(database, `connections/${user.id}`);
//   //   onValue(userTasksRef, (snapshot) => {
//   //     if (snapshot.exists()) {
//   //       const userTasksData = snapshot.val();
//   //       console.log(userTasksData)

//   //     }
//   //   });
//   // }, [user.id]);




//   const IconMap = {
//     Zap: <Zap className="h-5 w-5 text-indigo-300" />,
//     Award: <Award className="h-5 w-5 text-pink-300" />,
//     Users: <Users className="h-5 w-5 text-amber-300" />,
//     CheckSquare: <CheckSquare className="h-5 w-5 text-emerald-300" />,
//     Wallet: <Wallet className="h-5 w-5 text-blue-300" />,
//   };

//   const defaultTask = {
//     id: null,
//     title: "",
//     description: "",
//     completed: 0,
//     total: 1,
//     points: 100,
//     icon: <Zap className="h-5 w-5 text-indigo-300" />,
//     iconBg: "bg-indigo-500/30",
//   };

//   const newAchievement = tasks.map((each) => ({
//     ...defaultTask,
//     ...each,
//     points: each.score || each.points || 100,
//     icon: typeof each.icon === 'string' ? (IconMap[each.icon] || <Zap className="h-5 w-5 text-indigo-300" />) : each.icon,
//     iconBg: each.iconBg || "bg-indigo-500/30",
//   }));

//   // Mock tasks data (Commented out and replaced with dynamic data)
//   /*
//   const dailyTasks = [
//     {
//       id: 1,
//       title: "Read 5 news articles",
//       description: "Swipe through news articles to earn points",
//       completed: newsCount>5?5:newsCount,
//       type:"news",
//       total: 5,
//       points: 25,
//       icon: <Zap className="h-5 w-5 text-indigo-300" />,
//       iconBg: "bg-indigo-500/30",
//     },
//     ...
//   ]
//   */

//   const dailyTasks = newAchievement.filter(task => task.category === 'daily' || task.category === 'standard' || (!task.category && !['weekly', 'achievements'].includes(task.type)));

//   /*
//   const weeklyTasks = [
//     {
//       id: 4,
//       title: "Complete all daily tasks",
//       description: "Finish all daily tasks for 3 days",
//       completed: 1,
//       total: 3,
//       points: 100,
//       icon: <CheckSquare className="h-5 w-5 text-emerald-300" />,
//       iconBg: "bg-emerald-500/30",
//     },
//     ...
//   ]
//   */
//   const weeklyTasks = newAchievement.filter(task => task.category === 'weekly');

//   /*
//   const communityTasks = [ ... ]
//   */
//   // const communityTasks = newAchievement.filter(task => task.category === 'community');

//   /*
//   const achievements = [
//     {
//       id: 8,
//       title: "Early Adopter",
//       description: "Join during the beta phase",
//       completed: 1,
//       total: 1,
//       points: 100,
//       icon: <Award className="h-5 w-5 text-amber-300" />,
//       iconBg: "bg-amber-500/30",
//     },
//     ...
//   ]
//   */
//   const achievements = newAchievement.filter(task => task.category === 'achievements');


//   const fetchChatMember = async (chatId, userId) => {
//     try {
//       const response = await fetch(
//         `https://api.telegram.org/bot${BOT_TOKEN}/getChatMember?chat_id=${chatId}&user_id=${userId}`
//       );
//       const data = await response.json();
//       console.log(data)
//       return data.ok ? data.result : null;
//     } catch (err) {
//       console.error("API Request Failed:", err);
//       return null;
//     }
//   };

//   // const handleChatId = async () => {
//   //   try {
//   //     const response = await fetch(
//   //       `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`
//   //     );

//   //     const data = await response.json();
//   //     console.log(data)
//   //     if(data.ok){
//   //       return data.result[0].my_chat_member?.chat?.id|| null;

//   //     }


//   //   } catch (err) {
//   //     console.error("Error fetching chat ID:", err);
//   //     return null;
//   //   }
//   // };
//   const handleChatId = async () => {
//     try {
//       const response = await fetch(
//         `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`
//       );
//       const data = await response.json();
//       console.log(data)

//       if (data.ok) {
//         const chatUpdate = data.result.find(update => update.my_chat_member);
//         if (chatUpdate) {
//           const chat = chatUpdate.my_chat_member.chat;
//           return {
//             chatId: chat.id,
//             chatType: chat.type, // "channel" or "supergroup"
//           };
//         }
//       }

//       return { chatId: null, chatType: null };
//     } catch (err) {
//       console.error("Error fetching chat ID:", err);
//       return { chatId: null, chatType: null };
//     }
//   };

//   // const startMembershipCheck = async (taskId) => {
//   //   const clickBtn = document.getElementById(`clickBtn${taskId}`);
//   //   let checkCount = 0;

//   //   const checkInterval = setInterval(async () => {
//   //     checkCount += 1;
//   //    const { chatId, chatType } = await handleChatId();
//   //     const userId = user.id
//   //     console.log(chatId)

//   //     if (!chatId) {
//   //       setMembershipStatus("Unable to fetch chat ID");
//   //       setButtonText(prev => ({ ...prev, [taskId]: "Failed" }));
//   //       clearInterval(checkInterval);
//   //       return;
//   //     }


//   //     const chatMember = await fetchChatMember(chatId, userId);
//   //     console.log(chatMember)

//   //     if (!chatMember || !chatMember.status) {
//   //       setMembershipStatus("Unable to verify group status");
//   //       setButtonText(prev => ({ ...prev, [taskId]: "Failed" }));
//   //       clearInterval(checkInterval);
//   //       return;
//   //     }

//   //     const { status } = chatMember;
//   //     console.log("Telegram Status:", status);

//   //     if (["member", "administrator", "creator", "restricted","left", "kicked"].includes(status)) {
//   //       setMembershipStatus("Successfully joined the group!");

//   //       // Update Firebase to allow claim
//   //       await update(userTasksRef, { [taskId]: false });

//   //       // Set button text to 'Claim'
//   //       setButtonText(prev => ({ ...prev, [taskId]: "Claim" }));
//   //       clearInterval(checkInterval);
//   //     // }
//   //     //  else if (["left", "kicked"].includes(status)) {
//   //     //   setMembershipStatus("You left or were removed from the group.");
//   //     //   setButtonText(prev => ({ ...prev, [taskId]: "Join Again" }));
//   //     //   clearInterval(checkInterval);
//   //     } else {
//   //       setMembershipStatus("Unknown group status.");
//   //       setButtonText(prev => ({ ...prev, [taskId]: "Join Again" }));
//   //       clearInterval(checkInterval);
//   //     }

//   //     // Timeout after 5 minutes (max 100 tries @ 3s each)
//   //     if (checkCount >= 100) {
//   //       setButtonText(prev => ({ ...prev, [taskId]: "Failed" }));
//   //       clearInterval(checkInterval);
//   //     }
//   //   }, 3000);
//   // };
//   const startMembershipCheck = async (taskId, chatId, chatType) => {
//     const clickBtn = document.getElementById(`clickBtn${taskId}`);
//     let checkCount = 0;
//     console.log(chatId, chatType, taskId)

//     const checkInterval = setInterval(async () => {
//       checkCount += 1;

//       if (!chatId || !chatType) {
//         setMembershipStatus("Chat ID or type missing");
//         setButtonText(prev => ({ ...prev, [taskId]: "Failed" }));
//         clearInterval(checkInterval);
//         return;
//       }

//       // Fetch the chat member status from the Telegram API
//       const chatMember = await fetchChatMember(chatId, user.id);

//       if (!chatMember || !chatMember.status) {
//         setMembershipStatus("Unable to verify membership");
//         setButtonText(prev => ({ ...prev, [taskId]: "Failed" }));
//         clearInterval(checkInterval);
//         return;
//       }

//       const { status } = chatMember;
//       let isMember = false;

//       // Check membership status for groups and channels
//       if (chatType === "group" || chatType === "supergroup") {
//         // Group members could be "member", "administrator", "creator"
//         isMember = ["member", "administrator", "creator"].includes(status);
//       } else if (chatType === "channel") {
//         // For channels, a user is considered a "member" if they're subscribed
//         isMember = status === "member";
//       }

//       if (isMember) {
//         setMembershipStatus("Successfully joined the group/channel!");
//         await update(userTasksRef, { [taskId]: false }); // Mark task as claimable
//         setButtonText(prev => ({ ...prev, [taskId]: "Claim" }));
//         clearInterval(checkInterval);
//       } else if (["left", "kicked"].includes(status)) {
//         setMembershipStatus("You left or were removed.");
//         setButtonText(prev => ({ ...prev, [taskId]: "Join Again" }));
//         clearInterval(checkInterval);
//       } else {
//         setMembershipStatus("Not a valid member.");
//         setButtonText(prev => ({ ...prev, [taskId]: "Join Again" }));
//         clearInterval(checkInterval);
//       }

//       if (checkCount >= 100) {
//         setButtonText(prev => ({ ...prev, [taskId]: "Failed" }));
//         clearInterval(checkInterval);
//       }
//     }, 3000); // Repeat the check every 3 seconds
//   };


//   const handleTitle = async (task, taskId) => {
//     const clickBtn = document.getElementById(`clickBtn${taskId}`)
//     const updatedButtonTexts = { ...buttonText };

//     if (!updatedButtonTexts[taskId]) {
//       updatedButtonTexts[taskId] = "Start Task";
//     }

//     switch (task.type?.toLowerCase()) {

//       case "watch":
//         if (updatedButtonTexts[taskId] === "Start Task" || updatedButtonTexts[taskId] === "Join Again") {
//           window.open(task.url, "_blank");
//           clickBtn.style.display = "none"
//           setClick(prevState => ({
//             ...prevState,
//             watch: {
//               ...prevState.watch,
//               [taskId]: true
//             },
//           }));

//           updatedButtonTexts[taskId] = "Claim";
//         } else if (updatedButtonTexts[taskId] === "Claim") {
//           updatedButtonTexts[taskId] = "Processing...";
//           try {
//             const snapshot = await get(userScoreRef);
//             const currentData = snapshot.val() || {};
//             const currentPoints = currentData.points || 0;
//             const newPoints = currentPoints + task.points;

//             await update(userTasksRef, { [taskId]: true });
//             await update(userScoreRef, {
//               points: newPoints
//             });
//             const textData = {
//               action: 'Task Points Successfully Added',
//               points: task.points,
//               type: 'task',
//             }

//             addHistoryLog(userId, textData)

//             clickBtn.style.display = "none"
//           } catch (error) {
//             updatedButtonTexts[taskId] = "Failed";
//             setTimeout(() => {
//               setButtonText(prevTexts => ({
//                 ...prevTexts,
//                 [taskId]: "Try Again"
//               }));
//             }, 2000);
//           }
//         }
//         break;

//       case "social":
//         setClick(prevState => ({
//           ...prevState,
//           [task.title]: true,
//         }));
//         if (updatedButtonTexts[taskId] === "Start Task" || updatedButtonTexts[taskId] === "Join Again" || updatedButtonTexts[taskId] === "Failed") {
//           updatedButtonTexts[taskId] = "Checking...";
//           window.open(task.url, "_blank");

//           const { chatId, chatType } = await handleChatId(task);
//           // Assume startMembershipCheck logic
//           await startMembershipCheck(taskId, chatId, chatType)


//         } else if (updatedButtonTexts[taskId] === "Claim" && userTasks[taskId] === false) {
//           updatedButtonTexts[taskId] = "Processing...";

//           try {
//             const snapshot = await get(userScoreRef);
//             const currentData = snapshot.val() || {};
//             const currentPoints = currentData.points || 0;
//             const newPoints = currentPoints + task.points;

//             await update(userTasksRef, { [taskId]: true });
//             await update(userScoreRef, {
//               points: newPoints
//             });
//             clickBtn.style.display = "none"
//           } catch (error) {
//             updatedButtonTexts[taskId] = "Failed";
//             setTimeout(() => {
//               setButtonText(prevTexts => ({
//                 ...prevTexts,
//                 [taskId]: "Try Again"
//               }));
//             }, 2000);
//           }
//         }
//         break;
//       case "partnership":
//         navigate("/network")


//         break
//       case "misc":
//         window.open(task.url, "_blank")
//         break;

//       default:
//         setClick({ "watch": {}, "social": false })
//     }
//     setButtonText(updatedButtonTexts);
//   }




//   const handleVerification = (task, taskId) => {
//     const verifycode = `1234${taskId}`
//     const verifyBlock = document.getElementById(`verifyblock-${taskId}`)
//     const clickBtn = document.getElementById(`clickBtn${taskId}`)


//     if (verifycode === verify + `${taskId}` && verify !== "") {
//       verifyBlock.style.display = "none"
//       clickBtn.style.display = "block"
//       update(userTasksRef, { [taskId]: false });


//     }




//   }

//   const filterTasks = filterType === "all" ? newAchievement : newAchievement.filter((task) => task.type === filterType);



//   // Handle task completion
//   const completeTask = (taskId) => {
//     // In a real app, this would update the task status in the backend
//     // For now, we'll just add points

//     setPoints((prev) => prev + 25)
//   }
//   const handleRoute = (path) => {
//     if (path === "referral") {
//       navigate(`/network`)
//     } else {
//       navigate(`/${path}`)
//     }

//   }

//   return (
//     <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-indigo-600/90 via-purple-600/80 to-pink-600/90">
//       {/* Animated Background Elements */}

//       {/* floating curved lines */}
//       <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 via-purple-600/80 to-pink-600/90 z-0">
//         <div className="absolute inset-0 opacity-20">
//           <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
//             <defs>
//               <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
//                 <path
//                   d="M 20 0 L 0 0 0 20"
//                   fill="none"
//                   stroke="white"
//                   strokeWidth="0.5"
//                   opacity="0.5"
//                 />
//               </pattern>
//               <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
//                 <rect width="80" height="80" fill="url(#smallGrid)" />
//                 <path
//                   d="M 80 0 L 0 0 0 80"
//                   fill="none"
//                   stroke="white"
//                   strokeWidth="1"
//                   opacity="0.8"
//                 />
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

//       {/* App Content */}
//       <div className="flex-1 flex flex-col overflow-hidden z-10">
//         {/* Header */}
//         <header className="sticky top-0 z-10 bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/10" onClick={() => navigate("/")}>
//                 <ChevronLeft className="h-5 w-5" />
//               </Button>
//               <h1 className="text-xl font-bold text-white">Tasks</h1>
//             </div>
//             <div className="flex items-center gap-1">
//               <span className="font-medium text-sm text-white">{scores?.points || 0}</span>
//               <Zap className="h-4 w-4 text-amber-300 fill-amber-300" />
//             </div>
//           </div>
//         </header>

//         <main className="flex-1 p-4 overflow-auto">
//           {/* Task Score */}
//           <div className="mb-6 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h3 className="text-sm font-medium text-white/80">Your Task Score</h3>
//                 <p className="text-2xl font-bold text-white">
//                   {scores?.points || 0} <span className="text-amber-300">XP</span>
//                 </p>
//               </div>
//               <div className="bg-white/10 rounded-full p-3">
//                 <CheckSquare className="h-6 w-6 text-amber-300" />
//               </div>
//             </div>
//           </div>

//           {/* Task Categories */}
//           <Tabs defaultValue="daily" className="mb-6 ">
//             <TabsList className="flex gap-4 bg-white/10 p-0.5  overflow-auto scroll-hidden ">
//               <TabsTrigger
//                 value="daily"
//                 className="data-[state=active]:bg-white/20 text-white ml-2"
//                 onClick={() => setActiveTab("daily")}
//               >
//                 Daily
//               </TabsTrigger>
//               <TabsTrigger
//                 value="weekly"
//                 className="data-[state=active]:bg-white/20 text-white"
//                 onClick={() => setActiveTab("weekly")}
//               >
//                 Weekly
//               </TabsTrigger>
//               {/* <TabsTrigger
//                 value="community"
//                 className="data-[state=active]:bg-white/20 text-white"
//                 onClick={() => setActiveTab("community")}
//               >
//                 Community
//               </TabsTrigger> */}
//               <TabsTrigger
//                 value="achievements"
//                 className="data-[state=active]:bg-white/20 text-white"
//                 onClick={() => setActiveTab("achievements")}
//               >
//                 Achievements
//               </TabsTrigger>
//               <TabsTrigger
//                 value="all"
//                 className="data-[state=active]:bg-white/20 text-white"
//                 onClick={() => setFilterType("all")}
//               >
//                 All
//               </TabsTrigger>
//               <TabsTrigger
//                 value="watch"
//                 className="data-[state=active]:bg-white/20 text-white"
//                 onClick={() => setFilterType("watch")}
//               >
//                 Watch
//               </TabsTrigger>
//               <TabsTrigger
//                 value="social"
//                 className="data-[state=active]:bg-white/20 text-white"
//                 onClick={() => setFilterType("social")}
//               >
//                 social
//               </TabsTrigger>
//               <TabsTrigger
//                 value="partnership"
//                 className="data-[state=active]:bg-white/20 text-white"
//                 onClick={() => setFilterType("partnership")}
//               >
//                 Partnership
//               </TabsTrigger>
//               <TabsTrigger
//                 value="misc"
//                 className="data-[state=active]:bg-white/20 text-white  mr-2"
//                 onClick={() => setFilterType("misc")}
//               >
//                 Misc
//               </TabsTrigger>

//             </TabsList>
//             <TabsContent value="daily" className="mt-4 space-y-3">
//               {dailyTasks.map((task) => (
//                 <Card key={task.id} className="border-none shadow-md bg-white/10 backdrop-blur-md" onClick={() => handleRoute(task.type)}>
//                   <CardContent className="p-4">
//                     <div className="flex items-start gap-3">
//                       <div className={`${task.iconBg} p-2 rounded-full mt-1`}>{task.icon}</div>
//                       <div className="flex-1">
//                         <div className="flex justify-between items-start">
//                           <div>
//                             <h3 className="font-semibold text-white">{task.title}</h3>
//                             <p className="text-xs text-white/70 mt-1">{task.description}</p>
//                           </div>
//                           <Badge className="bg-amber-500/90">+{task.points} XP</Badge>
//                         </div>
//                         <div className="mt-3">
//                           <div className="flex justify-between text-xs text-white/70 mb-1">
//                             <span>Progress</span>
//                             <span>
//                               {task.type === "game" && gameCompleted ? 1 : task.completed}/{task.total}
//                             </span>
//                           </div>
//                           <Progress value={(task.type === "game" && gameCompleted ? 100 : (task.completed / task.total) * 100)} className="h-1.5 bg-white/10" />
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </TabsContent>
//             <TabsContent value="weekly" className="mt-4 space-y-3">
//               {weeklyTasks.map((task) => (
//                 <Card key={task.id} className="border-none shadow-md bg-white/10 backdrop-blur-md">
//                   <CardContent className="p-4">
//                     <div className="flex items-start gap-3">
//                       <div className={`${task.iconBg} p-2 rounded-full mt-1`}>{task.icon}</div>
//                       <div className="flex-1">
//                         <div className="flex justify-between items-start">
//                           <div>
//                             <h3 className="font-semibold text-white">{task.title}</h3>
//                             <p className="text-xs text-white/70 mt-1">{task.description}</p>
//                           </div>
//                           <Badge className="bg-amber-500/90">+{task.points} XP</Badge>
//                         </div>
//                         <div className="mt-3">
//                           <div className="flex justify-between text-xs text-white/70 mb-1">
//                             <span>Progress</span>
//                             <span>
//                               {task.completed}/{task.total}
//                             </span>
//                           </div>
//                           <Progress value={(task.completed / task.total) * 100} className="h-1.5 bg-white/10" />
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </TabsContent>
//             {/* <TabsContent value="community" className="mt-4 space-y-3">
//               {communityTasks.map((task) => (
//                 <Card key={task.id} className="border-none shadow-md bg-white/10 backdrop-blur-md">
//                   <CardContent className="p-4">
//                     <div className="flex items-start gap-3">
//                       <div className={`${task.iconBg} p-2 rounded-full mt-1`}>{task.icon}</div>
//                       <div className="flex-1">
//                         <div className="flex justify-between items-start">
//                           <div>
//                             <h3 className="font-semibold text-white">{task.title}</h3>
//                             <p className="text-xs text-white/70 mt-1">{task.description}</p>
//                           </div>
//                           <Badge className="bg-amber-500/90">+{task.points} XP</Badge>
//                         </div>
//                         <div className="mt-3">
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             className="border-white/20 text-white hover:bg-white/10"
//                             onClick={() => completeTask(task.id)}
//                           >
//                             Complete Task
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </TabsContent> */}
//             <TabsContent value="achievements" className="mt-4 space-y-3">
//               {achievements.map((task) => (
//                 <Card key={task.id} className="border-none shadow-md bg-white/10 backdrop-blur-md">
//                   <CardContent className="p-4">
//                     <div className="flex items-start gap-3">
//                       <div className={`${task.iconBg} p-2 rounded-full mt-1`}>{task.icon}</div>
//                       <div className="flex-1">
//                         <div className="flex justify-between items-start">
//                           <div>
//                             <h3 className="font-semibold text-white">{task.title}</h3>
//                             <p className="text-xs text-white/70 mt-1">{task.description}</p>
//                           </div>
//                           <Badge className="bg-amber-500/90">+{task.points} XP</Badge>
//                         </div>
//                         <div className="mt-3">
//                           <div className="flex justify-between text-xs text-white/70 mb-1">
//                             <span>Progress</span>
//                             <span>
//                               {task.completed}/{task.total}
//                             </span>
//                           </div>
//                           <Progress value={(task.completed / task.total) * 100} className="h-1.5 bg-white/10" />
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </TabsContent>
//             <TabsContent value={filterType} className="mt-4 space-y-3">
//               {filterTasks.map((task) => {
//                 const taskId = task.id;
//                 return (
//                   <Card key={task.id} className="border-none shadow-md bg-white/10 backdrop-blur-md">
//                     <CardContent className="p-4">
//                       <div className="flex items-start gap-3">
//                         <div className={`${task.iconBg} p-2 rounded-full mt-1`}>{task.icon}</div>
//                         <div className="flex-1">
//                           <div className="flex justify-between items-start">
//                             <div>
//                               <h3 className="font-semibold text-white">{task.title}</h3>
//                               <p className="text-xs text-white/70 mt-1">{task.description}{userTasks[taskId] === true ? <span id={`verified-${taskId}`} className=" text-white bg-green-500 p-1 ml-1 rounded">Verified✅</span> : <> </>}</p>
//                               {clicked.watch[taskId] ? <div className="flex " id={`verifyblock-${taskId}`}>
//                                 <input type="text" value={verify} placeholder="Verify Code" onChange={(e) => setVerify(e.target.value)} className=" bg-gray-200 h-5  p-1 rounded bg-gray-200 text-black w-20 text-sm" />
//                                 <button className="ml-2 text-sm h-5 w-10 bg-violet-500 text-white rounded" onClick={() => handleVerification(task, taskId)}> Verify</button></div> : <></>}
//                             </div>
//                             <div className="flex flex-col gap-1">
//                               <Badge className="bg-amber-500/90">+{task.points} XP</Badge>
//                               {userTasks[taskId] ? <></> : <button className="rounded bg-violet-500 hover:bg-violet-700 text-white text-sm px-2 py-1 " id={`clickBtn${taskId}`} onClick={() => handleTitle(task, taskId)}>{userTasks[taskId] === false ? "Claim" : buttonText[taskId] || "Start Task"}</button>}


//                             </div>

//                           </div>
//                           <div className="mt-3">
//                             <div className="flex justify-between text-xs text-white/70 mb-1">
//                               <span>Progress</span>
//                               <span>
//                                 {task.completed}/{task.total}
//                               </span>
//                             </div>
//                             <Progress value={(userTasks[taskId] === true ? 1 : task.completed / task.total) * 100} className="h-1.5 bg-white/10" />
//                           </div>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 )
//               })}
//             </TabsContent>




//           </Tabs>
//         </main>
//       </div>
//     </div>
//   )
// }




import { useState, useEffect } from "react";
import { ChevronLeft, Award, Zap, Users, Wallet, CheckSquare, BookOpen, PlayCircle, Send, Twitter } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Progress } from "../../components/ui/progress.js";
import { useTelegram } from "../../reactContext/TelegramContext";
import { useNavigate } from "react-router-dom";
import { database } from "../../services/FirebaseConfig";
import { ref, onValue, update, get } from "firebase/database";
import { addHistoryLog } from "../../services/addHistory.js";

const BOT_TOKEN = process.env.REACT_APP_BOT_TOKEN;

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState("daily");
  const { user, scores } = useTelegram();
  const [tasks, setTasks] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const navigate = useNavigate();
  const [clicked, setClick] = useState({ watch: {}, social: false });
  const [verify, setVerify] = useState("");
  const [buttonText, setButtonText] = useState({});
  const [membershipStatus, setMembershipStatus] = useState(null);
  const [userTasks, setUserTasks] = useState({});
  const [gameCompleted, setGameCompleted] = useState(false);
  const [newsCount, setnewsCount] = useState(0);

  const userTasksRef = ref(database, `connections/${user.id}`);
  const userScoreRef = ref(database, `users/${user.id}/Score`);
  const userId = user.id;

  useEffect(() => {
    const tasksRef = ref(database, "tasks");
    const gameTaskRef = ref(database, `connections/${user.id}/tasks/daily/game`);
    const newsRef = ref(database, `connections/${user.id}/tasks/daily/news`);

    const unsubscribeTasks = onValue(tasksRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("Fetched Tasks from Firebase:", data);
        const tasksArray = Object.entries(data).map(([key, task]) => ({
          ...task,
          id: task.id || key,
        }));
        setTasks(tasksArray);
      } else {
        setTasks([]);
      }
    });

    const unsubscribeGame = onValue(gameTaskRef, (snapshot) => {
      setGameCompleted(snapshot.val() === true);
    });

    const unsubscribeNews = onValue(newsRef, (snapshot) => {
      setnewsCount(snapshot.exists() ? Object.keys(snapshot.val() || {}).length : 0);
    });

    const unsubscribeUserTasks = onValue(userTasksRef, (snapshot) => {
      setUserTasks(snapshot.exists() ? snapshot.val() : {});
    });

    return () => {
      unsubscribeTasks();
      unsubscribeGame();
      unsubscribeNews();
      unsubscribeUserTasks();
    };
  }, [user.id]);

  const IconMap = {
    Zap: <Zap className="h-5 w-5 text-indigo-300" />,
    Award: <Award className="h-5 w-5 text-pink-300" />,
    Users: <Users className="h-5 w-5 text-amber-300" />,
    CheckSquare: <CheckSquare className="h-5 w-5 text-emerald-300" />,
    Wallet: <Wallet className="h-5 w-5 text-blue-300" />,
    BookOpen: <BookOpen className="h-5 w-5 text-blue-300" />,
    PlayCircle: <PlayCircle className="h-5 w-5 text-purple-300" />,
    Send: <Send className="h-5 w-5 text-blue-400" />,
    Twitter: <Twitter className="h-5 w-5 text-sky-400" />,
  };

  // ✅ Use `points` as primary reward — fallback to `score`, then 100
  const mapTask = (task) => {
    // Check points, then score, then default to 100
    // Ensure it's treated as a number
    const rawReward = task.points !== undefined ? task.points : (task.score !== undefined ? task.score : 100);
    const reward = Number(rawReward) || 0;

    // Normalize icon key to handle case sensitivity (e.g., "users" -> "Users")
    const iconKey = typeof task.icon === 'string'
      ? Object.keys(IconMap).find(k => k.toLowerCase() === task.icon.toLowerCase())
      : null;

    return {
      ...task,
      points: reward, // Normalize to `points` for consistency
      icon: iconKey ? IconMap[iconKey] : (IconMap['Zap'] || <Zap className="h-5 w-5 text-indigo-300" />),
      iconBg: task.iconBg || "bg-indigo-500/30",
    };
  };

  const processedTasks = tasks.map(mapTask);

  const dailyTasks = processedTasks.filter(
    (task) => task.category === 'daily' || task.category === 'standard' || (!task.category && !['weekly', 'achievements'].includes(task.type))
  );
  const weeklyTasks = processedTasks.filter(task => task.category === 'weekly');
  const achievements = processedTasks.filter(task => task.category === 'achievements');

  const fetchChatMember = async (chatId, userId) => {
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/getChatMember?chat_id=${chatId}&user_id=${userId}`
      );
      const data = await response.json();
      return data.ok ? data.result : null;
    } catch (err) {
      console.error("API Request Failed:", err);
      return null;
    }
  };

  const handleChatId = async () => {
    try {
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`);
      const data = await response.json();
      if (data.ok) {
        const chatUpdate = data.result.find(update => update.my_chat_member);
        if (chatUpdate) {
          const chat = chatUpdate.my_chat_member.chat;
          return { chatId: chat.id, chatType: chat.type };
        }
      }
      return { chatId: null, chatType: null };
    } catch (err) {
      console.error("Error fetching chat ID:", err);
      return { chatId: null, chatType: null };
    }
  };

  const startMembershipCheck = async (taskId, chatId, chatType) => {
    let checkCount = 0;
    const interval = setInterval(async () => {
      checkCount += 1;
      if (!chatId || !chatType) {
        setButtonText(prev => ({ ...prev, [taskId]: "Failed" }));
        clearInterval(interval);
        return;
      }

      const chatMember = await fetchChatMember(chatId, user.id);
      if (!chatMember || !chatMember.status) {
        setButtonText(prev => ({ ...prev, [taskId]: "Failed" }));
        clearInterval(interval);
        return;
      }

      let isMember = false;
      const { status } = chatMember;
      if (["group", "supergroup"].includes(chatType)) {
        isMember = ["member", "administrator", "creator"].includes(status);
      } else if (chatType === "channel") {
        isMember = status === "member";
      }

      if (isMember) {
        await update(userTasksRef, { [taskId]: false });
        setButtonText(prev => ({ ...prev, [taskId]: "Claim" }));
        clearInterval(interval);
      } else {
        setButtonText(prev => ({ ...prev, [taskId]: "Join Again" }));
        clearInterval(interval);
      }

      if (checkCount >= 100) {
        setButtonText(prev => ({ ...prev, [taskId]: "Failed" }));
        clearInterval(interval);
      }
    }, 3000);
  };

  const handleTitle = async (task, taskId) => {
    const clickBtn = document.getElementById(`clickBtn${taskId}`);
    const currentText = buttonText[taskId] || "Start Task";
    const updatedButtonTexts = { ...buttonText };

    switch (task.type?.toLowerCase()) {
      case "watch":
      case "watch":
        if (["Start Task", "Join Again"].includes(currentText) && userTasks[taskId] !== false) {
          window.open(task.url, "_blank");
          setClick(prev => ({ ...prev, watch: { ...prev.watch, [taskId]: true } }));
          updatedButtonTexts[taskId] = "Claim";
        } else if (userTasks[taskId] === false || currentText === "Claim") {
          updatedButtonTexts[taskId] = "Processing...";
          setButtonText(updatedButtonTexts);
          try {
            const snapshot = await get(userScoreRef);
            const currentData = snapshot.val() || {};

            // Calculate new task_score with strict Number parsing
            const currentTaskScore = Number(currentData.task_score) || 0;
            const taskPoints = Number(task.points) || 0;
            const newTaskScore = currentTaskScore + taskPoints;

            // Calculate new total_score
            const newTotalScore = (
              (Number(currentData.farming_score) || 0) +
              (Number(currentData.game_score) || 0) +
              (Number(currentData.network_score) || 0) +
              (Number(currentData.news_score) || 0) +
              newTaskScore
            );

            await update(userTasksRef, { [taskId]: true });

            // Update both task_score and total_score
            await update(userScoreRef, {
              task_score: newTaskScore,
              total_score: newTotalScore
            });

            addHistoryLog(userId, {
              action: 'Task Points Successfully Added',
              points: taskPoints,
              type: 'task',
            });
            clickBtn.style.display = "none";
          } catch (error) {
            updatedButtonTexts[taskId] = "Failed";
            setButtonText(updatedButtonTexts);
            setTimeout(() => setButtonText(prev => ({ ...prev, [taskId]: "Try Again" })), 2000);
          }
        }
        break;

      case "social":
        setClick(prev => ({ ...prev, [task.title]: true }));
        if (["Start Task", "Join Again", "Failed"].includes(currentText)) {
          updatedButtonTexts[taskId] = "Checking...";
          setButtonText(updatedButtonTexts);
          window.open(task.url, "_blank");
          const { chatId, chatType } = await handleChatId();
          startMembershipCheck(taskId, chatId, chatType);
        } else if (currentText === "Claim" && userTasks[taskId] === false) {
          updatedButtonTexts[taskId] = "Processing...";
          setButtonText(updatedButtonTexts);
          try {
            const snapshot = await get(userScoreRef);
            const currentData = snapshot.val() || {};

            // Calculate new task_score
            const currentTaskScore = currentData.task_score || 0;
            const newTaskScore = currentTaskScore + task.points;

            // Calculate new total_score
            const newTotalScore = (
              (currentData.farming_score || 0) +
              (currentData.game_score || 0) +
              (currentData.network_score || 0) +
              (currentData.news_score || 0) +
              newTaskScore
            );

            await update(userTasksRef, { [taskId]: true });

            // Update both task_score and total_score
            await update(userScoreRef, {
              task_score: newTaskScore,
              total_score: newTotalScore
            });

            clickBtn.style.display = "none";
          } catch (error) {
            updatedButtonTexts[taskId] = "Failed";
            setButtonText(updatedButtonTexts);
            setTimeout(() => setButtonText(prev => ({ ...prev, [taskId]: "Try Again" })), 2000);
          }
        }
        break;

      case "partnership":
        navigate("/network");
        break;

      case "misc":
        window.open(task.url, "_blank");
        break;

      case "game":
        if (userTasks[taskId] === false || currentText === "Claim") {
          updatedButtonTexts[taskId] = "Processing...";
          setButtonText(updatedButtonTexts);
          try {
            const snapshot = await get(userScoreRef);
            const currentData = snapshot.val() || {};

            // Strict Number parsing to prevent string concatenation
            const currentTaskScore = Number(currentData.task_score) || 0;
            const taskPoints = Number(task.points) || 0;
            const newTaskScore = currentTaskScore + taskPoints;

            const newTotalScore = (
              (Number(currentData.farming_score) || 0) +
              (Number(currentData.game_score) || 0) +
              (Number(currentData.network_score) || 0) +
              (Number(currentData.news_score) || 0) +
              newTaskScore
            );

            await update(userTasksRef, { [taskId]: true });
            await update(userScoreRef, {
              task_score: newTaskScore,
              total_score: newTotalScore
            });

            addHistoryLog(userId, {
              action: 'Game Task Reward',
              points: taskPoints,
              type: 'game',
            });
            clickBtn.style.display = "none";
          } catch (error) {
            updatedButtonTexts[taskId] = "Failed";
            setButtonText(updatedButtonTexts);
            setTimeout(() => setButtonText(prev => ({ ...prev, [taskId]: "Try Again" })), 2000);
          }
        } else if (["Start Task", "Play Again"].includes(currentText)) {
          navigate("/game");
          if (gameCompleted) {
            update(userTasksRef, { [taskId]: false });
            updatedButtonTexts[taskId] = "Claim";
          } else {
            updatedButtonTexts[taskId] = "Play Again";
          }
          setButtonText(updatedButtonTexts);
        }
        break;

      case "news":
        if (currentText === "Start Task") {
          navigate("/news");
          if (newsCount >= 5) {
            update(userTasksRef, { [taskId]: false });
            updatedButtonTexts[taskId] = "Claim";
          }
          setButtonText(updatedButtonTexts);
        } else if (currentText === "Claim") {
          updatedButtonTexts[taskId] = "Processing...";
          setButtonText(updatedButtonTexts);
          try {
            const snapshot = await get(userScoreRef);
            const currentData = snapshot.val() || {};

            // Calculate new task_score
            const currentTaskScore = currentData.task_score || 0;
            const newTaskScore = currentTaskScore + task.points;

            // Calculate new total_score
            const newTotalScore = (
              (currentData.farming_score || 0) +
              (currentData.game_score || 0) +
              (currentData.network_score || 0) +
              (currentData.news_score || 0) +
              newTaskScore
            );

            await update(userTasksRef, { [taskId]: true });
            await update(userScoreRef, {
              task_score: newTaskScore,
              total_score: newTotalScore
            });

            addHistoryLog(userId, {
              action: 'News Task Reward',
              points: task.points,
              type: 'news',
            });
            clickBtn.style.display = "none";
          } catch (error) {
            updatedButtonTexts[taskId] = "Failed";
            setButtonText(updatedButtonTexts);
            setTimeout(() => setButtonText(prev => ({ ...prev, [taskId]: "Try Again" })), 2000);
          }
        }
        break;

      case "news":
        if (userTasks[taskId] !== false && ["Start Task", "Join Again"].includes(currentText)) {
          navigate("/news");
          // Check if news requirement is met
          if (newsCount >= 5) {
            update(userTasksRef, { [taskId]: false }); // Mark as claimable
            updatedButtonTexts[taskId] = "Claim";
          }
          setButtonText(updatedButtonTexts);
        } else if (userTasks[taskId] === false || currentText === "Claim") {
          updatedButtonTexts[taskId] = "Processing...";
          setButtonText(updatedButtonTexts);
          try {
            const snapshot = await get(userScoreRef);
            const currentData = snapshot.val() || {};

            // Calculate new task_score with strict Number parsing
            const currentTaskScore = Number(currentData.task_score) || 0;
            const taskPoints = Number(task.points) || 0;
            const newTaskScore = currentTaskScore + taskPoints;

            // Calculate new total_score
            const newTotalScore = (
              (Number(currentData.farming_score) || 0) +
              (Number(currentData.game_score) || 0) +
              (Number(currentData.network_score) || 0) +
              (Number(currentData.news_score) || 0) +
              newTaskScore
            );

            await update(userTasksRef, { [taskId]: true });
            await update(userScoreRef, {
              task_score: newTaskScore,
              total_score: newTotalScore
            });

            addHistoryLog(userId, {
              action: 'News Task Reward',
              points: taskPoints,
              type: 'news',
            });
            clickBtn.style.display = "none";
          } catch (error) {
            updatedButtonTexts[taskId] = "Failed";
            setButtonText(updatedButtonTexts);
            setTimeout(() => setButtonText(prev => ({ ...prev, [taskId]: "Try Again" })), 2000);
          }
        }
        break;

      default:
        setClick({ watch: {}, social: false });
    }
  };

  const handleVerification = (task, taskId) => {
    const verifycode = `1234${taskId}`;
    const verifyBlock = document.getElementById(`verifyblock-${taskId}`);
    const clickBtn = document.getElementById(`clickBtn${taskId}`);
    if (verifycode === verify + `${taskId}` && verify !== "") {
      verifyBlock.style.display = "none";
      clickBtn.style.display = "block";
      update(userTasksRef, { [taskId]: false });
    }
  };

  const filterTasks = filterType === "all"
    ? processedTasks
    : processedTasks.filter(task => task.type === filterType);

  const handleRoute = (path) => {
    if (path === "referral") {
      navigate(`/network`);
    } else {
      navigate(`/${path}`);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-indigo-600/90 via-purple-600/80 to-pink-600/90">
      {/* Background SVGs unchanged */}
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
        {/* Floating shapes (unchanged) */}
        <div className="absolute top-[10%] left-[20%] w-20 h-20 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-20 blur-xl animate-float"></div>
        <div className="absolute top-[60%] right-[15%] w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 blur-xl animate-float-delayed"></div>
        <div className="absolute bottom-[20%] left-[30%] w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-400 opacity-20 blur-xl animate-float-slow"></div>
        <div className="absolute inset-0 opacity-30">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            {[...Array(8)].map((_, i) => (
              <path key={i} d={`M0,${100 + i * 100} C150,${50 + i * 100} 250,${150 + i * 100} 400,${100 + i * 100}`} stroke="white" strokeWidth="0.5" fill="none" />
            ))}
          </svg>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden z-10">
        <header className="sticky top-0 z-10 bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/10" onClick={() => navigate("/")}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold text-white">Tasks</h1>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium text-sm text-white">{scores?.task_score || 0}</span>
              <Zap className="h-4 w-4 text-amber-300 fill-amber-300" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 overflow-auto">
          <div className="mb-6 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-white/80">Your Task Score</h3>
                <p className="text-2xl font-bold text-white">
                  {scores?.task_score || 0} <span className="text-amber-300">XP</span>
                </p>
              </div>
              <div className="bg-white/10 rounded-full p-3">
                <CheckSquare className="h-6 w-6 text-amber-300" />
              </div>
            </div>
          </div>

          <Tabs defaultValue="daily" className="mb-6">
            <TabsList className="flex gap-4 bg-white/10 p-0.5 overflow-auto scroll-hidden">
              {["daily", "weekly", "achievements", "all", "watch", "social", "partnership", "misc"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="data-[state=active]:bg-white/20 text-white"
                  onClick={() => {
                    if (["all", "watch", "social", "partnership", "misc"].includes(tab)) {
                      setFilterType(tab);
                    } else {
                      setActiveTab(tab);
                    }
                  }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="daily" className="mt-4 space-y-3">
              {dailyTasks.map((task) => (
                <Card key={task.id} className="border-none shadow-md bg-white/10 backdrop-blur-md">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`${task.iconBg} p-2 rounded-full mt-1`}>{task.icon}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-white">{task.title}</h3>
                            <div className="flex flex-col">
                              <p className="text-xs text-white/70 mt-1">
                                {task.description}
                                {userTasks[task.id] === true && (
                                  <span className="text-white bg-green-500 p-1 ml-1 rounded text-[10px]">Verified✅</span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1 items-end">
                            <Badge className="bg-amber-500/90 whitespace-nowrap">+{task.points} XP</Badge>
                            <button
                              className={`rounded text-white text-sm px-2 py-1 mt-1 whitespace-nowrap ${userTasks[task.id] === true && task.type !== 'partnership' && task.type !== 'social' ? 'bg-gray-500 cursor-not-allowed' : 'bg-violet-500 hover:bg-violet-700'}`}
                              id={`clickBtn${task.id}`}
                              disabled={userTasks[task.id] === true && task.type !== 'partnership' && task.type !== 'social'}
                              onClick={() => handleTitle(task, task.id)}
                            >
                              {userTasks[task.id] === true
                                ? (task.type === 'partnership' || task.type === 'social' ? "Open" : "Done")
                                : (userTasks[task.id] === false ? "Claim" : buttonText[task.id] || "Start Task")
                              }
                            </button>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-white/70 mb-1">
                            <span>Progress</span>
                            <span>{(task.type === "game" && gameCompleted ? 1 : task.completed)}/{task.total}</span>
                          </div>
                          <Progress value={(task.type === "game" && gameCompleted ? 100 : (userTasks[task.id] === true ? 100 : (task.completed / task.total) * 100))} className="h-1.5 bg-white/10" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="weekly" className="mt-4 space-y-3">
              {weeklyTasks.map((task) => (
                <Card key={task.id} className="border-none shadow-md bg-white/10 backdrop-blur-md">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`${task.iconBg} p-2 rounded-full mt-1`}>{task.icon}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-white">{task.title}</h3>
                            <p className="text-xs text-white/70 mt-1">{task.description}</p>
                          </div>
                          <Badge className="bg-amber-500/90">+{task.points} XP</Badge>
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-white/70 mb-1">
                            <span>Progress</span>
                            <span>{task.completed}/{task.total}</span>
                          </div>
                          <Progress value={(task.completed / task.total) * 100} className="h-1.5 bg-white/10" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="achievements" className="mt-4 space-y-3">
              {achievements.map((task) => (
                <Card key={task.id} className="border-none shadow-md bg-white/10 backdrop-blur-md">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`${task.iconBg} p-2 rounded-full mt-1`}>{task.icon}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-white">{task.title}</h3>
                            <p className="text-xs text-white/70 mt-1">{task.description}</p>
                          </div>
                          <Badge className="bg-amber-500/90">+{task.points} XP</Badge>
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-white/70 mb-1">
                            <span>Progress</span>
                            <span>{task.completed}/{task.total}</span>
                          </div>
                          <Progress value={(task.completed / task.total) * 100} className="h-1.5 bg-white/10" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value={filterType} className="mt-4 space-y-3">
              {filterTasks.map((task) => {
                const taskId = task.id;
                return (
                  <Card key={task.id} className="border-none shadow-md bg-white/10 backdrop-blur-md">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`${task.iconBg} p-2 rounded-full mt-1`}>{task.icon}</div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-white">{task.title}</h3>
                              <div className="flex flex-col">
                                <p className="text-xs text-white/70 mt-1">
                                  {task.description}
                                  {userTasks[taskId] === true && (
                                    <span className="text-white bg-green-500 p-1 ml-1 rounded text-[10px]">Verified✅</span>
                                  )}
                                </p>
                                {clicked.watch[taskId] && (
                                  <div className="flex mt-2" id={`verifyblock-${taskId}`}>
                                    <input
                                      type="text"
                                      value={verify}
                                      placeholder="Code"
                                      onChange={(e) => setVerify(e.target.value)}
                                      className="bg-gray-200 h-6 p-1 rounded text-black w-20 text-xs"
                                    />
                                    <button
                                      className="ml-2 text-xs h-6 px-2 bg-violet-500 text-white rounded"
                                      onClick={() => handleVerification(task, taskId)}
                                    >
                                      Verify
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col gap-1 items-end">
                              <Badge className="bg-amber-500/90 whitespace-nowrap">+{task.points} XP</Badge>
                              <button
                                className={`rounded text-white text-sm px-2 py-1 mt-1 whitespace-nowrap ${userTasks[taskId] === true && task.type !== 'partnership' && task.type !== 'social' ? 'bg-gray-500 cursor-not-allowed' : 'bg-violet-500 hover:bg-violet-700'}`}
                                id={`clickBtn${taskId}`}
                                disabled={userTasks[taskId] === true && task.type !== 'partnership' && task.type !== 'social'}
                                onClick={() => handleTitle(task, taskId)}
                              >
                                {userTasks[taskId] === true
                                  ? (task.type === 'partnership' || task.type === 'social' ? "Open" : "Done")
                                  : (userTasks[taskId] === false ? "Claim" : buttonText[taskId] || "Start Task")
                                }
                              </button>
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-white/70 mb-1">
                              <span>Progress</span>
                              <span>{task.completed}/{task.total}</span>
                            </div>
                            <Progress
                              value={userTasks[taskId] === true ? 100 : (task.completed / task.total) * 100}
                              className="h-1.5 bg-white/10"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div >
  );
}