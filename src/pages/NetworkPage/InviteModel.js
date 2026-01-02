// import React,{useState,useEffect} from 'react';
// import { database } from "../../services/FirebaseConfig.js";
// import { ref, set, update, get } from "firebase/database";
// import { useTelegram } from '../../reactContext/TelegramContext.js';
// import "../../Styles/NetworkComponent.css"

// const tg = window.Telegram.WebApp;
// tg.ready(); 

// const InviteModal = ({ isOpen, onClose}) => {
//   const {user} = useTelegram()
  
//   const [inviteLink, setInviteLink] = useState("");
//   const [hasReferred, setHasReferred] = useState(false);

//   useEffect(() => {
//     if (user?.id && !hasReferred) {
//       handleReferral();
//     }
  
//     generateInviteLink();
//   }, [user?.id]);
  
 
 

//   const updateScoreReferrerDisplay = async (amount, refId) => {
//     const scoreRef = ref(database, `users/${refId}/Score/network_score`);
//     const totalRef =ref(database, `users/${refId}/Score/total_score`);
//     const snapshot = await get(scoreRef);
//     const currentScore = snapshot.exists() ? snapshot.val() : 0;
//     await set(scoreRef, currentScore + amount);
//     const totalsnapshot = await get(totalRef);
//     const totalScore = totalsnapshot.exists() ? snapshot.val() : 0;
//     await update(totalRef,totalScore+amount)
//   };
//   const updateReferredScoreDisplay = async (amount, refId) => {
//     const scoreRef = ref(database, `users/${refId}/Score/network_score`);
//     const totalRef =ref(database, `users/${refId}/Score/total_score`); 
//     const snapshot = await get(scoreRef);
//     const currentScore = snapshot.exists() ? snapshot.val() : 0;
//     await set(scoreRef, currentScore + amount);
//     const totalsnapshot = await get(totalRef);
//     const totalScore = totalsnapshot.exists() ? snapshot.val() : 0;
//     await update(totalRef,totalScore+amount)
//   };

//   const addReferralRecord = async (referrerId, referredId) => {
//     const referralRef = ref(database, `users/${referrerId}/referrals`);
//     const snapshot = await get(referralRef);
//     let referrals = snapshot.exists() ? snapshot.val() : {};
  
//     // Check if the referred ID already exists in the referrer's referral list
//     if (Object.values(referrals).includes(referredId)) {
//       console.log("Referral already exists. No points added.");
//       return; // Stop execution if already referred
//     }
  

//     // Award referral points only once
//     const referrerScoreRef = ref(database, `users/${referrerId}/Score/network_score`);
//     const referrerScoreSnapshot = await get(referrerScoreRef);
//     const referrerPoints = 100;

//     await updateScoreReferrerDisplay(referrerPoints, referrerId);
  
//     // Award new user bonus points
//     const newUserScoreRef = ref(database, `users/${referredId}/Score/network_score`);
//     const newUserSnapshot = await get(newUserScoreRef);
//     const newUserPoints = 50;
//     await updateReferredScoreDisplay(newUserPoints, referredId);
  
//     // Update referral list
//     let nextIndex = Object.keys(referrals).length + 1;
//     await update(referralRef, { [nextIndex]: referredId });
  
//     console.log(`Referral recorded: ${referrerId} referred ${referredId}`);
//   };
  
//   const handleReferral = async () => {
//     if (hasReferred) return;
//     const referralLink = tg.initDataUnsafe.start_param;
//     if (referralLink) {
//       const referralParts = referralLink.split("_");
//       const referrerId = referralParts[2];
//       if (referrerId) {
//         // const userId = localStorage.getItem("firebaseid");
//         const referredId = window.Telegram.WebApp.initDataUnsafe.user?.id || null
//         await addReferralRecord(referrerId, referredId);
//         tg.showPopup({
//           title: "Referral Bonus!",
//           message: "You've earned 50 points for joining through a referral!!",
//           buttons: [{ type: "ok" }],
//         });
//         setHasReferred(true);
//       }
//     }
//   };

//   const generateReferralCode = () => {
//     if (!tg.initDataUnsafe?.user) return null;
//     const timestamp = Date.now();
//     const referralBase = `${tg.initDataUnsafe.user.id}_${timestamp}`;
//     return btoa(referralBase).replace(/[^a-zA-Z0-9]/g, "").substring(0, 12);
//   };

//   const generateInviteLink = () => {
//     const refCode = generateReferralCode();
//     if (!refCode) return;
//     const link = `https://t.me/webs3new_bot/webs3new?startapp=ref_${refCode}_${tg.initDataUnsafe.user.id}`;
//     setInviteLink(link);


//   };

//   const sendInvite = () => {
//     const shareUrl = inviteLink
//     const message = "Hey Click the Link!!"
//     const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(message)}`;
//     window.open(telegramUrl, "_blank");


//   };
  
//   const copyLink = () => {
//     navigator.clipboard.writeText(inviteLink).then(() => {
//       alert("Copied");
//       tg.showPopup({ title: "Success", message: "Invite link copied!", buttons: [{ type: "ok" }] });
//     });
//   };
  
//   if (!isOpen) return null;

//   return (
//     <div
//   id="inviteModal"
//   className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 "
// >
//   <div className="bg-gradient-to-br bg-white/10 backdrop-blur-sm px-5 py-5 rounded-lg shadow-lg max-w-md w-full">
//     <div className="flex justify-between items-center mb-6 ">
//       <div className="text-2xl font-semibold text-gray-100 ">Invite a friend</div>
//       <button
//         className="text-gray-100 hover:text-red-500 text-2xl font-bold"
//         onClick={onClose}
//       >
//         ×
//       </button>
//     </div>
//     <div className="flex justify-center mb-6">
//       <img
//         id="qrCode"
//         src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://t.me/tryauth_bot"
//         alt="QR Code"
//         className="w-60 h-60 sm:w-64 sm:h-64"
//       />
//     </div>
//     <div className="flex flex-col sm:flex-row gap-3">
//       <button
//         className="bg-pink-500/20 px-3  text-white py-2 h-12 font-bold rounded"
//         onClick={() => sendInvite()}
//       >
//         Send
//       </button>
//       <button
//         className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 h-12 font-bold rounded"
//         onClick={() => copyLink()}
//       >
//         Copy link
//       </button>
//       <button
//         className="w-full text-white border-white/20 bg-white/5 flex flex-col items-center py-3 hover:bg-gray-500 font-bold"
//         onClick={onClose}
//       >
//         Close
//       </button>
//     </div>
//   </div>
// </div>

//   );
// };

// export default InviteModal;
// src/components/InviteModel.js
// src/components/InviteModel.js


import { useEffect, useState } from "react"
import { useReferral } from "../../reactContext/ReferralContext"
import { useTelegram } from "../../reactContext/TelegramContext"

const InviteModal = ({ isOpen, onClose }) => {
  const { inviteLink, shareToTelegram, copyToClipboard } = useReferral()
  const { user } = useTelegram()
  const [copied, setCopied] = useState(false)

  const tg = window.Telegram.WebApp

  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleCopy = async () => {
    const success = await copyToClipboard()
    if (success) {
      setCopied(true)
      tg.showPopup({ title: "Success", message: "Invite link copied!", buttons: [{ type: "ok" }] })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleTelegramShare = () => {
    shareToTelegram()
    onClose()
  }

  return (
    <div id="inviteModal" className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-gradient-to-br bg-white/10 backdrop-blur-sm px-5 py-5 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl font-semibold text-gray-100">Invite a friend</div>
          <button className="text-gray-100 hover:text-red-500 text-2xl font-bold" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="flex justify-center mb-6">
          <img
            id="qrCode"
            src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://t.me/Web3today_bot"
            alt="QR Code"
            className="w-60 h-60 sm:w-64 sm:h-64"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="bg-pink-500/20 px-3 text-white py-2 h-12 font-bold rounded" onClick={handleTelegramShare}>
            Send
          </button>
          <button
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 h-12 font-bold rounded"
            onClick={handleCopy}
          >
            Copy link
          </button>
          <button
            className="w-full text-white border-white/20 bg-white/5 flex flex-col items-center py-3 hover:bg-gray-500 font-bold"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default InviteModal
