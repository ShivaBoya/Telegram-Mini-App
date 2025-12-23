// // src/components/InstructionsPopup.js
// import React from "react";
// import { useNavigate } from "react-router-dom";

// const InstructionsPopup = ({ show, onStart,onBack }) => {
//   const navigate = useNavigate()
//   if (!show) return null;
//   return (
//     <div id="instructions" className="popup-overlay">
//        <button
//         onClick={() => {
//           if (onBack) onBack(); // Stop music (or perform any cleanup) before leaving
//           navigate("/network");
//         }}
//         className="back-btn"
//       >
//         Back
//       </button>
//       <div className="popup-content">
//         <div className="popup-header">
//           <h2>Fruit Ninja Instructions</h2>
//         </div>
//         <div className="popup-body">
//           <div className="instruction-main">
//             <div className="swipe-icon">👉</div>
//             <p>Slice fruits by swiping across them!</p>
//           </div>
//           <div className="scoring-section">
//             <h3>Scoring:</h3>
//             <div className="score-grid">
//               <div className="score-item">🍎 <span>+1 point</span></div>
//               <div className="score-item">🍊 <span>+3 points</span></div>
//               <div className="score-item">🍇 <span>+5 points</span></div>
//               <div className="score-item">🍓 <span>+5 points</span></div>
//               <div className="score-item">💣 <span>-5 points</span></div>
//               <div className="score-item">❄️ <span>+2 points &amp; timer paused for 5s</span></div>
//             </div>
//           </div>
//         </div>
//         <div className="popup-footer">
//           <button className="game-button" onClick={onStart}>
//             OK, Let's Play!
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InstructionsPopup;
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTelegram } from "../../reactContext/TelegramContext.js";


const InstructionsPopup = ({ show, onStart, onBack }) => {
  const { scores } = useTelegram();
  const navigate = useNavigate();
  if (!show) return null;
  return (
    <div id="instructions" className="popup-overlay p-5 ">
      <button
        onClick={() => {
          if (onBack) onBack(); // Stop music (or perform cleanup) before navigating.
          navigate("/network");
        }}
        className="back-btn bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-500"
      >
        Back
      </button>
      <div className=" bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-500 rounded-md p-3 mt-5">
        <div className="popup-header">
          <h2 className="ninja-heading text-gray-100 font-bold">Fruit Slasher Instructions</h2>
        </div>
        <div className="popup-body">
          <div className="instruction-main">
            <div className="swipe-icon">👉</div>
            <p className="ninja-heading">Slice fruits by swiping across them!</p>
          </div>
          <div className="scoring-section">
            {/* <h3 className="ninja-heading">Scoring:</h3> */}
            <div className="score-grid">
              <div className="score-item">🍎 <span className="ninja-heading">+1 point</span></div>
              <div className="score-item">🍊 <span className="ninja-heading">+3 points</span></div>
              <div className="score-item">🍇 <span className="ninja-heading">+5 points</span></div>
              <div className="score-item">🍓 <span className="ninja-heading">+5 points</span></div>
              <div className="score-item">💣 <span className="ninja-heading">-5 points</span></div>
              <div className="score-item">❄️ <span className="ninja-heading ml-3">+2 points &amp; timer paused for 5s</span></div>
            </div>
          </div>
        </div>
        <div className="popup-footer flex justify-center items-center">

          <button className=" bg-via-purple-500  px-6 py-2 rounded transition hover:bg-transparent border hover:border-white hover:text-white mt-4 text-gray-100 font-bold" onClick={onStart} disabled={scores && scores.no_of_tickets === 0}>
            {scores ? `OK, Let's Play! 🎟️${scores.no_of_tickets}` : "OK, Let's Play! (Free Play)"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructionsPopup;
