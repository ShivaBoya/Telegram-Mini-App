import React, { useState } from 'react';

const WelcomePopup = () => {
  const [isOpen, setIsOpen] = useState(true);

  const closePopup = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        .popup-overlay {
          position: fixed;
          inset: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }
        .popup-container {
          background: #fff;
          padding: 24px;
          border-radius: 16px;
          width: 320px;
          text-align: center;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          position: relative;
          animation: fadeInScale 0.3s ease;
        }
        .close-button {
          position: absolute;
          top: 8px;
          right: 12px;
          background: transparent;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
        }
        .close-button:hover {
          color: #000;
        }
        .points-text {
          font-weight: bold;
          color: #16a34a;
        }
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

      <div className="popup-overlay">
        <div className="popup-container">
          <button onClick={closePopup} className="close-button">×</button>
          <h2>Welcome to Web3Today News</h2>
          <p>You got <span className="points-text">50 points</span> 🎉</p>
        </div>
      </div>
    </>
  );
};

export default WelcomePopup;
