import { useNavigate } from "react-router-dom";
import { database } from "../../services/FirebaseConfig.js";
import { ref, update } from "firebase/database";
import { useTelegram } from "../../reactContext/TelegramContext.js";
import React from "react";

const GameOverPopup = ({ show, finalScore, highScore, onRestart, onBack }) => {
  const navigate = useNavigate();
  const {user} = useTelegram()
  if (!show) return null;

  let headerMsg = "";
  let bodyMsg = null;

  if (finalScore < highScore * 0.5) {
    headerMsg = "Keep trying!";
    bodyMsg = (
      <p className="text-white">
        You scored <strong>{finalScore}</strong> points. Your high score is{" "}
        <strong>{highScore}</strong>. Practice makes perfect!
      </p>
    );
  } else if (finalScore < highScore) {
    headerMsg = "Almost there!";
    bodyMsg = (
      <p className="text-white">
        You scored <strong>{finalScore}</strong> points, but your high score is{" "}
        <strong>{highScore}</strong>. You're close—keep pushing!
      </p>
    );
  } else if (finalScore === highScore) {
    headerMsg = "Well done!";
    bodyMsg = (
      <p className="text-white">
        You scored <strong>{finalScore}</strong> points and matched your high score!
      </p>
    );
  } else {
    headerMsg = "New High Score!";
    bodyMsg = (
      <p className="text-white">
        You scored <strong>{finalScore}</strong> points, beating your previous high score of{" "}
        <strong>{highScore}</strong>! Outstanding performance!
      </p>
    );
  }
  const handleTask = ()=>{
    const taskRef = ref(database, `connections/${user.id}/tasks/daily`);

    try {
       update(taskRef, { game: true }); // or set to false depending on logic
      console.log("Game task updated in Firebase ✅");
    } catch (error) {
      console.error("Error updating game task in Firebase:", error);
    }
  }

  return (
    <div id="game-over-popup" className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <button
        onClick={() => {
          if (onBack){
            onBack();
            handleTask();
          }
          navigate("/network");
          
          
        }}
        className="absolute top-4 left-4 px-4 py-2 text-white rounded bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-500 hover:opacity-90"
      >
        Back
      </button>

      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-500 text-white rounded-xl shadow-lg p-6 max-w-md w-full text-center">
        <h2 className="text-gray-100 font-bold mb-4">{headerMsg}</h2>
        <div className="mb-6 text-lg">{bodyMsg}</div>
        <button
          onClick={onRestart}
          className=" text-white font-semibold px-6 py-2 rounded transition hover:bg-transparent border hover:border-white hover:text-white"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default GameOverPopup;
