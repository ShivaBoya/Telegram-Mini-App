import React, { useRef, useEffect, useState } from "react";
import { ref, get, update } from "firebase/database";
import { database } from "../../services/FirebaseConfig";
import { useTelegram } from "../../reactContext/TelegramContext.js";
import { addHistoryLog } from "../../services/addHistory.js"

// Define updateGameScoresWrapper as a function declaration so it’s hoisted.
async function updateGameScoresWrapper(currentGameScore, userId) {
  if (!userId) {
    console.warn("No userId provided. Skipping score update.");
    return;
  }

  try {
    const userRef = ref(database, `users/${userId}/Score`);
    const snapshot = await get(userRef);
    let updates = {};
    const userData = snapshot.val();
    if (snapshot.exists()) {
      updates.game_score = (userData.game_score || 0) + currentGameScore;
      updates.total_score = (userData.total_score || 0) + currentGameScore;
      const currentHighScore = userData.game_highest_score || 0;
      if (currentGameScore > currentHighScore) {
        updates.game_highest_score = currentGameScore;
      }
    } else {
      updates = {
        game_score: currentGameScore,
        game_highest_score: currentGameScore,
        total_score: userData?.total_score || 0
      };
    }
    await update(userRef, updates);
    const textData = {
      action: 'Game Points Added',
      points: currentGameScore,
      type: 'game',
    }

    addHistoryLog(userId, textData)
    console.log("Scores updated successfully in Firebase.");
  } catch (error) {
    console.error("Error updating scores in Firebase:", error);
  }
}

const Game = ({ onGameOver, startGame }) => {
  const { user } = useTelegram();
  const userId = user?.id;
  const canvasRef = useRef(null);
  const backgroundMusicRef = useRef(null);
  const sliceSoundRef = useRef(null);
  const bombSoundRef = useRef(null);
  const goldenCoinIntervalRef = useRef(null);
  // Initialize mute state from localStorage.
  //Mute state is initialized to false if not set in localStorage.
  const [isMuted, setIsMuted] = useState(() => localStorage.getItem("gameMuted") === "true");

  // Poll localStorage every 500ms.
  useEffect(() => {
    const interval = setInterval(() => {
      const storedMuted = localStorage.getItem("gameMuted") === "true";
      setIsMuted(storedMuted);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Other mutable refs for game state.
  const fruitsRef = useRef([]);
  const scoreRef = useRef(0);
  const gameOverRef = useRef(false);
  const gameLoopRef = useRef(null);
  const spawnIntervalRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const highScoreRef = useRef(0);
  // Game lasts 45 seconds.
  const timeRemainingRef = useRef(45);
  const isDraggingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const slashPointsRef = useRef([]);
  const shineParticlesRef = useRef([]);
  const slicedFruitParticlesRef = useRef([]);
  const floatingTextsRef = useRef([]);
  // New refs for bonus effect timers
  const bonusIntervalRef = useRef(null);
  const bonusTimeoutRef = useRef(null);

  // Helper function to pick a bonus fruit emoji (allowed fruits only).
  function getBonusEmoji() {
    const bonusFruits = [
      { emoji: "🍎", weight: 30 },
      { emoji: "🍊", weight: 25 },
      { emoji: "🍇", weight: 20 },
      { emoji: "🍓", weight: 15 },
      { emoji: "🥭", weight: 10 },
    ];
    const total = bonusFruits.reduce((sum, item) => sum + item.weight, 0);
    let rand = Math.random() * total;
    for (const item of bonusFruits) {
      if (rand < item.weight) return item.emoji;
      rand -= item.weight;
    }
    return "🍎";
  }

  // ─── CLASS DEFINITIONS ───────────────────────────────────────────
  class Fruit {
    // The second parameter isBonus defaults to false.
    constructor(isGolden = false, isBonus = false) {
      this.isGolden = isGolden;
      this.isBonus = isBonus;
      this.size = isGolden ? 150 : 200;
      this.sliceRadius = 30;
      this.resetPosition();
      if (isGolden) {
        this.emoji = "🪙";
        this.points = 0;
      } else if (isBonus) {
        // For bonus fruits, override emoji with one from allowed set.
        this.emoji = getBonusEmoji();
        const pointsMap = {
          "🍎": 1,
          "🍊": 2,
          "🍇": 4,
          "🍓": 5,
          "🥭": 3,
        };
        this.points = pointsMap[this.emoji] || 1;
      } else {
        this.emoji = this.getRandomEmoji();
        this.points = this.getPoints();
      }
      this.isSliced = false;
    }
    resetPosition() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      if (this.isBonus) {
        // Bonus fruits appear anywhere on the canvas.
        this.x = Math.random() * (canvas.width - this.size);
        this.y = Math.random() * (canvas.height - this.size);
        this.velocityX = 0;
        this.velocityY = 0;
      } else {
        // Regular fruit positioning.
        const headerHeight = 120;
        const vh = (window.innerHeight - headerHeight) / 120;
        const allowedTop = headerHeight + 10 * vh;
        const allowedBottom = window.innerHeight - 10 * vh;
        this.y = allowedTop + Math.random() * (allowedBottom - allowedTop - this.size);
        this.zone = Math.random() < 0.5 ? "left" : "right";
        if (this.zone === "left") {
          this.x = -this.size / 2;
          this.velocityX = Math.random() * 2 + 3;
          this.velocityY = -(Math.random() * 3 + 4);
        } else {
          this.x = canvas.width - this.size / 2;
          this.velocityX = -(Math.random() * 4 + 4);
          this.velocityY = -(Math.random() * 3 + 7);
        }
      }
    }
    getRandomEmoji() {
      const emojis = [
        { emoji: "🍎", weight: 30 },
        { emoji: "🍊", weight: 25 },
        { emoji: "🍇", weight: 20 },
        { emoji: "🍓", weight: 15 },
        { emoji: "💣", weight: 5 },
        { emoji: "❄️", weight: 5 },
        { emoji: "🥭", weight: 10 },
      ];
      const totalWeight = emojis.reduce((sum, item) => sum + item.weight, 0);
      let rand = Math.random() * totalWeight;
      for (const item of emojis) {
        if (rand < item.weight) return item.emoji;
        rand -= item.weight;
      }
      return "🍎";
    }
    getPoints() {
      const pointsMap = {
        "🍎": 1,
        "🍊": 2,
        "🍇": 4,
        "🍓": 5,
        "💣": -5,
        "❄️": 2,
        "🥭": 3,
      };
      return pointsMap[this.emoji] || 1;
    }
    update() {
      // If not sliced and not in bonus mode, update positions.
      if (!this.isSliced && !this.isBonus) {
        this.velocityY += 0.2;
        this.x += this.velocityX;
        this.y += this.velocityY;
      }
      // Remove fruit if it goes off-screen.
      if (
        !canvasRef.current ||
        this.x > canvasRef.current.width ||
        this.x + this.size < 0 ||
        this.y > canvasRef.current.height
      ) {
        return true;
      }
      return false;
    }
    draw(ctx) {
      if (this.isSliced) return;
      ctx.font = "80px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(this.emoji, this.x + this.size / 2, this.y + this.size / 2);
    }
    checkSlice(x1, y1, x2, y2) {
      if (this.isSliced) return false;
      const centerX = this.x + this.size / 2;
      const centerY = this.y + this.size / 2;
      const dist = this.pointToLineDistance(centerX, centerY, x1, y1, x2, y2);
      return dist < this.sliceRadius;
    }
    pointToLineDistance(px, py, x1, y1, x2, y2) {
      const A = px - x1;
      const B = py - y1;
      const C = x2 - x1;
      const D = y2 - y1;
      const dot = A * C + B * D;
      const len_sq = C * C + D * D;
      let param = -1;
      if (len_sq !== 0) param = dot / len_sq;
      let xx, yy;
      if (param < 0) {
        xx = x1;
        yy = y1;
      } else if (param > 1) {
        xx = x2;
        yy = y2;
      } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
      }
      const dx = px - xx;
      const dy = py - yy;
      return Math.sqrt(dx * dx + dy * dy);
    }
  }

  class ShineParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 10 + 5;
      this.speedX = Math.random() * 3 - 1.5;
      this.speedY = Math.random() * 3 - 1.5;
      this.life = 30;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life--;
    }
    draw(ctx) {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.life / 30})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  class SlicedFruitParticle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 5 + 2;
      this.speedX = Math.random() * 6 - 3;
      this.speedY = -Math.random() * 15;
      this.gravity = 0.5;
      this.color = color;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.speedY += this.gravity;
    }
    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  class FloatingText {
    constructor(x, y, text, color) {
      this.x = x;
      this.y = y;
      this.text = text;
      this.color = color;
      this.life = 60;
      this.opacity = 1;
    }
    update() {
      this.y -= 0.5;
      this.life--;
      this.opacity = this.life / 60;
    }
    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.font = "30px Arial";
      ctx.textAlign = "center";
      ctx.fillText(this.text, this.x, this.y);
      ctx.restore();
    }
  }

  // ─── GAME FUNCTIONS ───────────────────────────────────────────────
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  };

  // When a golden coin is sliced, trigger bonus mode:
  // Spawn bonus fruits (only allowed fruits) across the screen,
  // and display a countdown timer that decrements every second.
  const bonusEffect = () => {
    // Pause normal fruit spawning.
    clearInterval(spawnIntervalRef.current);
    const count = Math.floor(Math.random() * 11) + 40; // 20 to 30 bonus fruits.
    for (let i = 0; i < count; i++) {
      let bonusFruit = new Fruit(false, true);
      // Override emoji with bonus fruit emoji.
      bonusFruit.emoji = getBonusEmoji();
      const pointsMap = {
        "🍎": 1,
        "🍊": 2,
        "🍇": 4,
        "🍓": 5,
        "🥭": 3,
      };
      bonusFruit.points = pointsMap[bonusFruit.emoji] || 1;
      fruitsRef.current.push(bonusFruit);
    }

    // Create and display the countdown timer
    let timeLeft = 5;
    const timerElement = document.createElement("div");
    timerElement.textContent = `${timeLeft}`;
    timerElement.style.position = "fixed";
    timerElement.style.top = "50%";
    timerElement.opacity = 0.1;
    timerElement.style.left = "50%";
    timerElement.style.transform = "translate(-50%, -50%)";
    timerElement.style.fontSize = "80px";
    timerElement.style.fontWeight = "bold";
    timerElement.style.color = "red";
    timerElement.style.textShadow = "0 0 10px rgba(237, 140, 98, 0.8)";
    timerElement.style.zIndex = "1000";
    timerElement.style.pointerEvents = "none";
    document.body.appendChild(timerElement);

    // Update the timer every second
    bonusIntervalRef.current = setInterval(() => {
      timeLeft--;
      if (timerElement) timerElement.textContent = `${timeLeft}`;

      // Add a pulse animation effect
      timerElement.style.animation = "none";
      void timerElement.offsetWidth; // Trigger reflow
      timerElement.style.animation = "pulse 1s";
    }, 1000);

    // After 5 seconds, remove bonus fruits, timer element, and resume normal spawn.
    bonusTimeoutRef.current = setTimeout(() => {
      clearInterval(bonusIntervalRef.current);
      if (document.body.contains(timerElement)) {
        document.body.removeChild(timerElement);
      }
      fruitsRef.current = fruitsRef.current.filter((fruit) => !fruit.isBonus);
      spawnIntervalRef.current = setInterval(spawnFruit, 1500);
    }, 5000);
  };

  // endGame is defined as an async function.
  async function endGame() {
    gameOverRef.current = true;
    clearInterval(gameLoopRef.current);
    clearInterval(spawnIntervalRef.current);
    clearInterval(timerIntervalRef.current);
    clearInterval(goldenCoinIntervalRef.current);
    clearInterval(bonusIntervalRef.current);
    clearTimeout(bonusTimeoutRef.current);
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current.currentTime = 0;
    }
    await updateGameScoresWrapper(scoreRef.current, userId);
    if (onGameOver) onGameOver(scoreRef.current, highScoreRef.current);
  }

  const startTimer = () => {
    clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => {
      if (!gameOverRef.current) {
        timeRemainingRef.current--;
        const timerEl = document.getElementById("timer");
        if (timerEl) timerEl.textContent = `Time: ${timeRemainingRef.current}`;
        if (timeRemainingRef.current <= 0) {
          clearInterval(timerIntervalRef.current);
          endGame();
        }
      }
    }, 1000);
  };

  const updateGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update shine particles.
    for (let i = shineParticlesRef.current.length - 1; i >= 0; i--) {
      shineParticlesRef.current[i].update();
      shineParticlesRef.current[i].draw(ctx);
      if (shineParticlesRef.current[i].life <= 0) {
        shineParticlesRef.current.splice(i, 1);
      }
    }
    // Update sliced fruit particles.
    for (let i = slicedFruitParticlesRef.current.length - 1; i >= 0; i--) {
      slicedFruitParticlesRef.current[i].update();
      slicedFruitParticlesRef.current[i].draw(ctx);
      if (slicedFruitParticlesRef.current[i].y > canvas.height) {
        slicedFruitParticlesRef.current.splice(i, 1);
      }
    }
    // Update floating texts.
    for (let i = floatingTextsRef.current.length - 1; i >= 0; i--) {
      floatingTextsRef.current[i].update();
      floatingTextsRef.current[i].draw(ctx);
      if (floatingTextsRef.current[i].life <= 0) {
        floatingTextsRef.current.splice(i, 1);
      }
    }
    // Update fruits.
    for (let i = fruitsRef.current.length - 1; i >= 0; i--) {
      const fruit = fruitsRef.current[i];
      // During bonus mode (when bonus fruits are on screen), bonus fruits are static.
      if (fruit.isBonus) {
        fruit.draw(ctx);
      } else {
        if (fruit.update()) {
          fruitsRef.current.splice(i, 1);
        } else {
          fruit.draw(ctx);
        }
      }
    }
    // Draw slash line.
    if (slashPointsRef.current.length > 1) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(slashPointsRef.current[0].x, slashPointsRef.current[0].y);
      for (let i = 1; i < slashPointsRef.current.length; i++) {
        ctx.lineTo(slashPointsRef.current[i].x, slashPointsRef.current[i].y);
      }
      ctx.stroke();
    }
  };

  const fetchHighScoreWrapper = async () => {
    const userRef = ref(database, `users/${userId}/Score`);
    try {
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        highScoreRef.current = userData.game_highest_score || 0;
        const hsEl = document.getElementById("high_score");
        if (hsEl) hsEl.textContent = `High: ${highScoreRef.current}`;
      } else {
        highScoreRef.current = 0;
        const hsEl = document.getElementById("high_score");
        if (hsEl) hsEl.textContent = `High: 0`;
      }
    } catch (error) {
      console.error("Error fetching high score from Firebase:", error);
      highScoreRef.current = 0;
      const hsEl = document.getElementById("high_score");
      if (hsEl) hsEl.textContent = `High: 0`;
    }
  };

  const spawnFruit = () => {
    if (!gameOverRef.current && canvasRef.current) {
      const fruitCounts = [4, 4, 4, 3];
      const count = fruitCounts[Math.floor(Math.random() * fruitCounts.length)];
      for (let i = 0; i < count; i++) {
        fruitsRef.current.push(new Fruit());
      }
    }
  };

  const spawnGoldenCoin = () => {
    if (!gameOverRef.current) {
      // Only add a golden coin if one isn't already onscreen.
      const coinExists = fruitsRef.current.some(
        (fruit) => fruit.emoji === "🪙" && !fruit.isSliced
      );
      if (!coinExists) {
        fruitsRef.current.push(new Fruit(true));
      }
    }
  };

  // When slicing occurs, check each fruit.
  function handleSlice(points) {
    if (gameOverRef.current || points.length < 2) return;
    const x1 = points[points.length - 2].x;
    const y1 = points[points.length - 2].y;
    const x2 = points[points.length - 1].x;
    const y2 = points[points.length - 1].y;
    let sliceHappened = false;
    fruitsRef.current.forEach((fruit) => {
      if (!fruit.isSliced && fruit.checkSlice(x1, y1, x2, y2)) {
        fruit.isSliced = true;
        // If it's a golden coin, trigger bonus mode.
        if (fruit.emoji === "🪙") {
          bonusEffect();
        } else {
          // For regular (non-golden) fruits, update score and show effects.
          scoreRef.current += fruit.points;
          const scoreEl = document.getElementById("score");
          if (scoreEl) scoreEl.textContent = `Score: ${scoreRef.current}`;
          for (let i = 0; i < 5; i++) {
            shineParticlesRef.current.push(
              new ShineParticle(fruit.x + fruit.size / 2, fruit.y + fruit.size / 2)
            );
          }
          const fruitColors = {
            "🍎": "#ff0000",
            "🍊": "#ffa500",
            "🍇": "#800080",
            "🍓": "#ff0000",
            "💣": "#000000",
            "❄️": "#ffffff",
            "🥭": "#ffa500",
          };
          const color = fruitColors[fruit.emoji] || "#ffffff";
          for (let i = 0; i < 10; i++) {
            slicedFruitParticlesRef.current.push(
              new SlicedFruitParticle(
                fruit.x + fruit.size / 2,
                fruit.y + fruit.size / 2,
                color
              )
            );
          }
          floatingTextsRef.current.push(
            new FloatingText(
              fruit.x + fruit.size / 2,
              fruit.y + fruit.size / 2,
              (fruit.points > 0 ? "+" : "") + fruit.points,
              color
            )
          );
          if (fruit.emoji === "💣") {
            bombEffect();
          } else if (fruit.emoji === "❄️") {
            iceEffect();
          }
        }
        sliceHappened = true;
      }
    });
    if (sliceHappened) {
      if (sliceSoundRef.current) {
        sliceSoundRef.current.currentTime = 0;
        sliceSoundRef.current.play().catch((err) => console.error(err));
      }
    } else {
      slashPointsRef.current = [points[points.length - 1]];
    }
  }

  function iceEffect() {
    clearInterval(timerIntervalRef.current);
    const scoreEl = document.getElementById("score");
    const highScoreEl = document.getElementById("high_score");
    scoreEl.style.transition = "box-shadow 0.5s ease";
    highScoreEl.style.transition = "box-shadow 0.5s ease";
    scoreEl.style.boxShadow = "0 0 20px 10px rgba(0, 191, 255, 0.8)";
    highScoreEl.style.boxShadow = "0 0 20px 10px rgba(0, 191, 255, 0.8)";
    document.documentElement.style.setProperty("--background-color", "#b3e5fc");

    let iceText = document.createElement("div");
    iceText.textContent = "❄️ Time Frozen! 🥶";
    iceText.style.position = "fixed";
    iceText.style.top = "30%";
    iceText.style.left = "50%";
    iceText.style.transform = "translate(-50%, -50%)";
    iceText.style.fontSize = "15px";
    iceText.style.color = "#fff";
    iceText.style.padding = "10px 20px";
    iceText.style.backgroundColor = "rgba(0, 191, 255, 0.8)";
    iceText.style.borderRadius = "8px";
    iceText.style.zIndex = "1000";
    iceText.style.pointerEvents = "none";
    iceText.style.animation = "floatUp 2s ease-out forwards";
    document.body.appendChild(iceText);

    setTimeout(() => {
      if (document.body.contains(iceText)) {
        document.body.removeChild(iceText);
      }
    }, 2000);

    setTimeout(() => {
      document.documentElement.style.setProperty("--background-color", "#ecf0f1");
      scoreEl.style.boxShadow = "none";
      highScoreEl.style.boxShadow = "none";
      startTimer();
    }, 5000);
  }

  function bombEffect() {
    document.documentElement.style.setProperty("--background-color", "rgba(255, 0, 0, 0.3)");
    if (bombSoundRef.current) {
      bombSoundRef.current.currentTime = 0;
      bombSoundRef.current.play().catch((err) => console.error(err));
    }

    let bombText = document.createElement("div");
    bombText.textContent = "💣 Ohh, you lost 5 points! 😢";
    bombText.style.position = "fixed";
    bombText.style.top = "30%";
    bombText.style.left = "50%";
    bombText.style.transform = "translate(-50%, -50%)";
    bombText.style.fontSize = "17px";
    bombText.style.color = "#fff";
    bombText.style.padding = "10px 20px";
    bombText.style.backgroundColor = "rgba(255, 0, 0, 0.8)";
    bombText.style.borderRadius = "8px";
    bombText.style.zIndex = "1000";
    bombText.style.pointerEvents = "none";
    bombText.style.animation = "floatUp 2s ease-out forwards";
    document.body.appendChild(bombText);

    if (!canvasRef.current.classList.contains("bomb-shake")) {
      canvasRef.current.classList.add("bomb-shake");
      setTimeout(() => {
        canvasRef.current.classList.remove("bomb-shake");
      }, 2000);
    }

    setTimeout(() => {
      document.documentElement.style.setProperty("--background-color", "#ecf0f1");
      if (document.body.contains(bombText)) {
        document.body.removeChild(bombText);
      }
    }, 1000);
  }

  // ─── EVENT LISTENERS & SOUND PRELOADING ─────────────────────────
  useEffect(() => {
    backgroundMusicRef.current = new Audio("/backgroundmusic.mp3");
    backgroundMusicRef.current.loop = true;
    sliceSoundRef.current = new Audio("/slicesound.mp3");
    bombSoundRef.current = new Audio("/slicesoundbomb.mp3");

    backgroundMusicRef.current.muted = isMuted;
    sliceSoundRef.current.muted = isMuted;
    bombSoundRef.current.muted = isMuted;

    const canvas = canvasRef.current;
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      const rect = canvas.getBoundingClientRect();
      lastPosRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      slashPointsRef.current = [lastPosRef.current];
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const currentPos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      slashPointsRef.current.push(currentPos);
      handleSlice(slashPointsRef.current);
      lastPosRef.current = currentPos;
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      slashPointsRef.current = [];
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);

    const handleTouchStart = (e) => {
      e.preventDefault();
      isDraggingRef.current = true;
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      lastPosRef.current = { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
      slashPointsRef.current = [lastPosRef.current];
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      if (!isDraggingRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const currentPos = { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
      slashPointsRef.current.push(currentPos);
      handleSlice(slashPointsRef.current);
      lastPosRef.current = currentPos;
    };

    const handleTouchEnd = (e) => {
      e.preventDefault();
      isDraggingRef.current = false;
      slashPointsRef.current = [];
    };

    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });

    document.body.addEventListener(
      "touchstart",
      (e) => {
        if (e.target === canvas) e.preventDefault();
      },
      { passive: false }
    );
    document.body.addEventListener(
      "touchmove",
      (e) => {
        if (e.target === canvas) e.preventDefault();
      },
      { passive: false }
    );
    document.body.addEventListener(
      "touchend",
      (e) => {
        if (e.target === canvas) e.preventDefault();
      },
      { passive: false }
    );

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current.currentTime = 0;
      }
      clearInterval(gameLoopRef.current);
      clearInterval(spawnIntervalRef.current);
      clearInterval(timerIntervalRef.current);
      clearInterval(goldenCoinIntervalRef.current);
      clearInterval(bonusIntervalRef.current);
      clearTimeout(bonusTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.muted = isMuted;
      if (isMuted) {
        backgroundMusicRef.current.pause();
      } else {
        backgroundMusicRef.current.play().catch((err) => console.error(err));
      }
    }
    if (sliceSoundRef.current) {
      sliceSoundRef.current.muted = isMuted;
    }
    if (bombSoundRef.current) {
      bombSoundRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    if (startGame) {
      initGame();
    }
  }, [startGame]);

  const initGame = async () => {
    await fetchHighScoreWrapper();
    fruitsRef.current = [];
    scoreRef.current = 0;
    timeRemainingRef.current = 45;
    gameOverRef.current = false;
    const scoreEl = document.getElementById("score");
    if (scoreEl) scoreEl.textContent = `Score: ${scoreRef.current}`;
    const timerEl = document.getElementById("timer");
    if (timerEl) timerEl.textContent = `Time: ${timeRemainingRef.current}`;
    clearInterval(gameLoopRef.current);
    clearInterval(spawnIntervalRef.current);
    clearInterval(timerIntervalRef.current);
    clearInterval(goldenCoinIntervalRef.current);

    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.muted = isMuted;
      backgroundMusicRef.current.currentTime = 0;
      if (!isMuted) {
        backgroundMusicRef.current.play().catch((err) => console.error(err));
      }
    }

    gameLoopRef.current = setInterval(updateGame, 1000 / 60);
    spawnIntervalRef.current = setInterval(spawnFruit, 1500);
    goldenCoinIntervalRef.current = setInterval(spawnGoldenCoin, 25000);
    startTimer();
  };

  // Inject pulse animation CSS.
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes pulse {
        0% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(1.2); }
        100% { transform: translate(-50%, -50%) scale(1); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return <canvas id="gameCanvas" ref={canvasRef} />;
};

export default Game;
