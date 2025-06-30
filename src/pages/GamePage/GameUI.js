// export default GameUI;
// import React, { useState } from "react";
// import "../../Styles/gameComponent.css";

// const GameUI = () => {
//   // Initialize the mute state from localStorage; default is false.
//   const initialMuted = localStorage.getItem("gameMuted") === "true";
//   const [muted, setMuted] = useState(initialMuted);

//   const handleSpeakerClick = () => {
//     const newMuted = !muted;
//     setMuted(newMuted);
//     localStorage.setItem("gameMuted", newMuted.toString());
//   };

//   return (
//     <div className="sticky top-0 z-50 bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-500 p-4 rounded-b-xl">
//   <div className="game-head flex justify-center items-center bg-white/10 backdrop-blur-sm rounded-lg p-3 shadow-md">
//     <h1 className="header text-white text-2xl font-semibold mr-3">Fruit Slasher</h1>
//     <div
//       className="speaker-icon text-white text-2xl cursor-pointer"
//       onClick={handleSpeakerClick}
//       style={{ fontSize: "30px" }}
//     >
//       {muted ? "🔇" : "🔊"}
//     </div>
//   </div>
//   <div id="gameUI" className="flex justify-around mt-4 text-white font-semibold text-lg">
//     <div id="score" className="bg-white/10 backdrop-blur-sm px-5 py-2 rounded-full shadow-sm">
//       Score: 0
//     </div>
//     <div id="high_score" className="bg-white/10 backdrop-blur-sm px-5 py-2 rounded-full shadow-sm">
//       High: 0
//     </div>
//     <div id="timer" className="bg-white/10 backdrop-blur-sm px-5 py-2 rounded-full shadow-sm">
//       Time: 45
//     </div>
//   </div>
// </div>

//   );
// };

// export default GameUI;
// import React, { useState } from "react";
// import "../../Styles/gameComponent.css";

// const GameUI = () => {
//   // Initialize the mute state from localStorage; default is false.
//   const initialMuted = localStorage.getItem("gameMuted") === "true";
//   const [muted, setMuted] = useState(initialMuted);

//   const handleSpeakerClick = () => {
//     const newMuted = !muted;
//     setMuted(newMuted);
//     localStorage.setItem("gameMuted", newMuted.toString());
//   };

//   return (
//     <div className="sticky top-0 z-50 bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-500 p-4 rounded-b-xl">
//       <div id="gameUI" className="flex justify-around items-center mt-4 text-white font-semibold text-lg">
//         <div id="score" className="bg-white/10 backdrop-blur-sm px-5 py-2 rounded-full shadow-sm">
//           Score: 0
//         </div>
//         <div id="high_score" className="bg-white/10 backdrop-blur-sm px-5 py-2 rounded-full shadow-sm">
//           High: 0
//         </div>
//         <div className="flex items-center gap-2">
//           <div id="timer" className="bg-white/10 backdrop-blur-sm px-5 py-2 rounded-full shadow-sm">
//             Time: 45
//           </div>
//           <div
//             className="speaker-icon text-white text-2xl cursor-pointer"
//             onClick={handleSpeakerClick}
//             style={{ fontSize: "30px" }}
//           >
//             {muted ? "🔇" : "🔊"}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GameUI;
import React, { useState } from "react";
import "../../Styles/gameComponent.css";

const GameUI = () => {
  // Initialize the mute state from localStorage; default is false.
  const initialMuted = localStorage.getItem("gameMuted") === "true";
  const [muted, setMuted] = useState(initialMuted);

  const handleSpeakerClick = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    localStorage.setItem("gameMuted", newMuted.toString());
  };

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-br from-blue-600 via-purple-700 to-pink-600 p-6 rounded-b-2xl shadow-xl">
      <div id="gameUI" className="flex justify-around items-center mt-4 text-white font-bold text-xl">
        <div id="score" className="bg-gradient-to-r from-emerald-500 to-green-600 backdrop-blur-md px-8 py-4 rounded-2xl shadow-lg border border-white/30 hover:from-emerald-400 hover:to-green-500 transition-all duration-300 hover:scale-105">
          Score: 0
        </div>
        <div id="high_score" className="bg-gradient-to-r from-amber-500 to-orange-600 backdrop-blur-md px-8 py-4 rounded-2xl shadow-lg border border-white/30 hover:from-amber-400 hover:to-orange-500 transition-all duration-300 hover:scale-105">
          High: 0
        </div>
        <div className="flex items-center gap-4">
          <div id="timer" className="bg-gradient-to-r from-rose-500 to-red-600 backdrop-blur-md px-8 py-4 rounded-2xl shadow-lg border border-white/30 hover:from-rose-400 hover:to-red-500 transition-all duration-300 hover:scale-105">
            Time: 45
          </div>
          <div
            className="speaker-icon text-white text-2xl cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95"
            onClick={handleSpeakerClick}
            style={{ fontSize: "32px" }}
          >
            {muted ? "🔇" : "🔊"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameUI;