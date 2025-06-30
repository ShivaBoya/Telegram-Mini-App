import React, { useState, useEffect } from 'react';

import  useFarming  from './UseFarming';


import "../../Styles/FarmingComponent.css"

function FarmingButton() {

  const { farmingState, startFarming, claimPoints } = useFarming();
  const seconds = farmingState.remainingTime
  function formatTime(seconds) {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }


  return (
<div className="farming">
      <button id="farmingButton" className="farming-btn" onClick={() => {
        if (!farmingState.isFarming && !farmingState.canClaim) {
          startFarming();
        } else if (farmingState.canClaim) {
          claimPoints();
        }
      }}>
        <span className="farming-btn-text">
          {farmingState.isFarming ? `Farming... ${formatTime(farmingState.remainingTime)}` : farmingState.canClaim ? "Claim Points" : "Start Farming"}
        </span>
        {/* <span className="farming-btn-info">{farmingState.pointsEarned.toFixed(2)} points</span> */}
      </button>
    </div>
  );
}

export default FarmingButton;
