// // src/App.js
// import React, { useState } from "react";
// import GameUI from "./GameUI";
// import Game from "./Game";
// import InstructionsPopup from "./InstructionsPopup";
// import GameOverPopup from "./GameOverPopup";
// import "../../Styles/gameComponent.css";

// function GameComponent() {
//   const [gameStarted, setGameStarted] = useState(false);
//   const [gameOver, setGameOver] = useState(false);
//   const [finalScore, setFinalScore] = useState(0);
//   const [highScore, setHighScore] = useState(0);
//   const [gameKey, setGameKey] = useState(0); // for remounting on restart

//   const handleStartGame = () => {
//     setGameStarted(true);
//     setGameOver(false);
//   };

//   const handleGameOver = (score, high) => {
//     setFinalScore(score);
//     setHighScore(high);
//     setGameOver(true);
//   };

//   const handleRestart = () => {
//     setGameKey(prev => prev + 1); // force remount
//     setGameOver(false);
//     // For try-again, you might automatically start the game,
//     // so no need to set gameStarted to false.
//   };

//   return (
//     <div id="app-container">
//       <GameUI />
//       <Game key={gameKey} startGame={gameStarted} onGameOver={handleGameOver} />
//       {!gameStarted && (
//         <InstructionsPopup show={true} onStart={handleStartGame} />
//       )}
//       <GameOverPopup
//         show={gameOver}
//         finalScore={finalScore}
//         highScore={highScore}
//         onRestart={handleRestart}
//       />

      
//     </div>
//   );
// }

// export default GameComponent;
import React, { useState } from "react";
import GameUI from "./GameUI";
import Game from "./Game";
import InstructionsPopup from "./InstructionsPopup";
import GameOverPopup from "./GameOverPopup";
import { useTelegram } from "../../reactContext/TelegramContext.js";
import { database } from "../../services/FirebaseConfig.js";
import { ref, get, update } from "firebase/database";

import "../../Styles/gameComponent.css";


function GameComponent() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameKey, setGameKey] = useState(0); // used for remounting on restart
  const { user } = useTelegram();

  
  const decreaseTicketCount = async (userId) => {
    if (!userId) return;
  
    const ticketRef = ref(database, `users/${userId}/Score/no_of_tickets`);
  
    try {
      const snapshot = await get(ticketRef);
      
      if (snapshot.exists()) {
        let currentTickets = snapshot.val();
        
        if (currentTickets > 0) {
          await update(ref(database, `users/${userId}/Score`), {
            no_of_tickets: currentTickets - 1,
          });
          console.log("Ticket count decreased successfully.");
        } else {
          console.log("No more tickets left.");
        }
      } else {
        console.log("No tickets found.");
      }
    } catch (error) {
      console.error("Error updating ticket count:", error);
    }
  }

  const handleStartGame = () => {
    setGameStarted(true);
    setGameOver(false);
    

    let userId = user.id
    decreaseTicketCount(userId)

  };

  const handleGameOver = (score, high) => {
    setFinalScore(score);
    setHighScore(high);
    setGameOver(true);
  };

  const handleRestart = () => {
    setGameKey((prev) => prev + 1); 
    setGameStarted(false);
    setGameOver(false);
    const taskRef = ref(database, `connections/${user.id}/tasks/daily`);

    try {
       update(taskRef, { game: true }); // or set to false depending on logic
      console.log("Game task updated in Firebase ✅");
    } catch (error) {
      console.error("Error updating game task in Firebase:", error);
    }
  };

  // When the Back button is clicked, we set gameStarted to false.
  // That unmounts the Game component so its cleanup stops the music.
  const handleBack = () => {
    setGameStarted(false);
  };

  return (
    <div id="app-container">
      <GameUI />
      <Game key={gameKey} startGame={gameStarted} onGameOver={handleGameOver} />
      {!gameStarted && (
        <InstructionsPopup show={true} onStart={handleStartGame} onBack={handleBack} />
      )}
      <GameOverPopup
        show={gameOver}
        finalScore={finalScore}
        highScore={highScore}
        onRestart={handleRestart}
        onBack={handleBack}
      />

    </div>
    
  );
}

export default GameComponent;
