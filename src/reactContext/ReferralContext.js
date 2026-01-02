// // src/reactContext/ReferralContext.js
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useTelegram } from './TelegramContext.js';
// import { database } from '../services/FirebaseConfig.js';
// import { ref, get, update, set, onValue } from 'firebase/database';

// const ReferralContext = createContext();
// export const useReferral = () => useContext(ReferralContext);

// export const ReferralProvider = ({ children }) => {
//   const { user } = useTelegram();
//   const [hasReferred, setHasReferred] = useState(false);
//   const [inviteLink, setInviteLink] = useState('');
//   const [invitedFriends, setInvitedFriends] = useState([]);

//   // Parse referral param and award points once
//   useEffect(() => {
//     const tg = window.Telegram.WebApp;
//     const startParam = tg.initDataUnsafe?.start_param;
//     const referredId = tg.initDataUnsafe.user?.id;
//     if (startParam && referredId && !hasReferred) {
//       const parts = startParam.split('_');
//       const referrerId = parts[2];
//       if (referrerId && referrerId !== String(referredId)) {
//         // Ensure one-time by localStorage
//         const key = `referred_${referredId}`;
//         if (!localStorage.getItem(key)) {
//           addReferralRecord(referrerId, referredId);
//           localStorage.setItem(key, 'done');
//           setHasReferred(true);
//           tg.showPopup({ title: 'Referral Bonus!', message: "You've earned 100 XP for joining through a referral!", buttons: [{ type: 'ok' }] });
//         }
//       }
//     }
//   }, [user?.id]);

//   // Generate invite link
//   useEffect(() => {
//     if (user?.id) {
//       const code = btoa(`${user.id}_${Date.now()}`)
//         .replace(/[^a-zA-Z0-9]/g, '')
//         .substring(0, 12);
//       setInviteLink(`https://t.me/webs3new_bot/webs3new?startapp=ref_${code}_${user.id}`);
//     }
//   }, [user?.id]);

//   // Fetch invited friends list
//   useEffect(() => {
//     if (!user?.id) return;
//     const referralsRef = ref(database, `users/${user.id}/referrals`);
//     const unsub = onValue(referralsRef, async snapshot => {
//       const data = snapshot.val() || {};
//       const ids = Object.values(data);
//       const list = await Promise.all(
//         ids.map(async id => {
//           const snap = await get(ref(database, `users/${id}`));
//           const u = snap.val();
//           return { id, name: u.name || 'Unknown', points: u.Score?.network_score || 0, status: u.status || 'active' };
//         })
//       );
//       setInvitedFriends(list);
//     });
//     return () => unsub();
//   }, [user?.id]);

//   // DB updates
//   const updateScores = async (refId, amount) => {
//     const scoreRef = ref(database, `users/${refId}/Score/network_score`);
//     const totalRef = ref(database, `users/${refId}/Score/total_score`);
//     const snap = await get(scoreRef);
//     const curr = snap.exists() ? snap.val() : 0;
//     await set(scoreRef, curr + amount);
//     const totalSnap = await get(totalRef);
//     const tot = totalSnap.exists() ? totalSnap.val() : 0;
//     await update(totalRef, tot + amount);
//   };

//   const addReferralRecord = async (referrerId, referredId) => {
//     // Add to referrer list and award
//     const refRef = ref(database, `users/${referrerId}/referrals`);
//     const snap = await get(refRef);
//     const list = snap.val() || {};
//     const exists = Object.values(list).includes(referredId);
//     if (exists) return;
//     const idx = Object.keys(list).length + 1;
//     await update(refRef, { [idx]: referredId });
//     // Award: referrer 50, referred 100
//     await updateScores(referrerId, 50);
//     await updateScores(referredId, 100);
//   };

//   const shareToTelegram = () => window.open(`https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent('Join me and earn rewards!')}`, '_blank');
//   const shareToWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent(`Join me and earn rewards! ${inviteLink}`)}`, '_blank');
//   const shareToTwitter = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Join me and earn rewards! ${inviteLink}`)}`, '_blank');

//   return (
//     <ReferralContext.Provider value={{ inviteLink, invitedFriends, shareToTelegram, shareToWhatsApp, shareToTwitter }}>
//       {children}
//     </ReferralContext.Provider>
//   );
// };
// src/reactContext/ReferralContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTelegram } from './TelegramContext.js';
import { database } from '../services/FirebaseConfig.js';
import { ref, get, update, set, onValue } from 'firebase/database';

const ReferralContext = createContext();
export const useReferral = () => useContext(ReferralContext);

export const ReferralProvider = ({ children }) => {
  const { user } = useTelegram();
  const [hasReferred, setHasReferred] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [invitedFriends, setInvitedFriends] = useState([]);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

  // Parse referral param and award points once
  // useEffect(() => {
  //   const tg = window.Telegram.WebApp;
  //   tg.ready();
  //   const startParam = tg.initDataUnsafe?.start_param;
  //   const referredId = tg.initDataUnsafe.user?.id;
  //   if (startParam && referredId && !hasReferred) {
  //     const parts = startParam.split('_');
  //     const referrerId = parts[2];
  //     console.log(referredId,"referr:",referrerId)
  //     if (referrerId && referrerId !== String(referredId)) {
  //       // Ensure one-time by localStorage
  //       const key = `referred_${referredId}`;
  //       if (!localStorage.getItem(key)) {


  //         addReferralRecord(referrerId, referredId);
  //         localStorage.setItem(key, 'done');
  //         setHasReferred(true);
  //         tg.showPopup({ title: 'Referral Bonus!', message: "You've earned 50 XP for joining through a referral!", buttons: [{ type: 'ok' }] });
  //       }
  //     }
  //   }
  // }, [user?.id]);

  // ---------------
  //   useEffect(() => {
  //   const tg = window.Telegram.WebApp;
  //   tg.ready();

  //   const startParam = tg.initDataUnsafe?.start_param;
  //   const referredId = tg.initDataUnsafe?.user?.id;

  //   if (!startParam || !referredId) return;        // opened without payload

  //   // you will get the payload only the first time – that’s expected
  //   const [ , , referrerId ] = startParam.split(/_(?=[^_]+$)/);

  //   if (!referrerId || referrerId === String(referredId)) return;

  //   // make sure it is executed only once on this device
  //   const key = `referred_${referredId}`;
  //   if (localStorage.getItem(key)) return;

  //   addReferralRecord(referrerId, referredId)
  //     .then(() => {
  //       localStorage.setItem(key, 'done');
  //       tg.showPopup({
  //         title: 'Referral Bonus!',
  //         message: 'You have earned 50 XP for joining through a referral!',
  //         buttons: [{ type: 'ok' }]
  //       });
  //     });
  // }, []);
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) {
      console.log('[Referral] Telegram object not found');
      return;
    }

    tg.ready();
    console.log('[Referral] tg.ready() was called');

    const startParam = tg.initDataUnsafe?.start_param;
    const referredId = tg.initDataUnsafe?.user?.id;
    // console.log('[Referral] startParam:', startParam);
    // console.log('[Referral] referredId:', referredId);

    if (!startParam || !referredId) {
      // console.log('[Referral] Missing startParam OR referredId → abort');
      return;
    }

    /* last "_" split */
    // const [ , , referrerId ] = startParam.split(/_(?=[^_]+$)/);
    const parts = startParam.split('_');
    const referrerId = parts[2];
    console.log('[Referral] referrerId:', referrerId);

    if (!referrerId || referrerId === String(referredId)) {
      // console.log('[Referral] No referrerId OR self-referral → abort');
      return;
    }

    const key = `referred_${referredId}`;
    if (localStorage.getItem(key)) {
      console.log('[Referral] LocalStorage flag already set → abort');
      return;
    }

    console.log('[Referral] All guards passed – calling addReferralRecord');
    addReferralRecord(referrerId, referredId)
      .then(() => {
        console.log('[Referral] addReferralRecord resolved – show popup');
        localStorage.setItem(key, 'done');
        setShowWelcomePopup(true)
        // tg.showPopup({
        //   title: 'Referral Bonus!',
        //   message: 'You have earned 50 XP for joining through a referral!',
        //   buttons: [{ type: 'ok' }]
        // });
      })
      .catch(err => {
        console.error('[Referral] addReferralRecord rejected:', err);
        tg.showAlert('Could not save referral, please try again later.');
      });

  }, [user.id]);



  // Generate invite link
  useEffect(() => {
    if (user?.id) {
      const code = btoa(`${user.id}_${Date.now()}`)
        .replace(/[^a-zA-Z0-9]/g, '')
        .substring(0, 12);
      setInviteLink(`https://t.me/Web3today_bot?startapp=ref_${code}_${user.id}`);
    }
  }, [user?.id]);


  // Fetch invited friends list
  useEffect(() => {
    if (!user?.id) return;
    const referralsRef = ref(database, `users/${user.id}/referrals`);
    const unsub = onValue(referralsRef, async snapshot => {
      const data = snapshot.val() || {};
      const ids = Object.values(data);
      const list = await Promise.all(
        ids.map(async id => {
          const snap = await get(ref(database, `users/${id}`));
          const u = snap.val();
          return { id, name: u.name || 'Unknown', points: u.Score?.network_score || 0, status: u.status || 'active' };
        })
      );
      setInvitedFriends(list);
    });
    return () => unsub();
  }, [user?.id]);

  // DB updates
  const updateScores = async (refId, amount) => {
    // Update network_score
    const scoreRef = ref(database, `users/${refId}/Score/network_score`);
    const snap = await get(scoreRef);
    const curr = snap.exists() ? snap.val() : 0;
    await set(scoreRef, curr + amount);

    // Update total_score
    const totalRef = ref(database, `users/${refId}/Score/total_score`);
    const totalSnap = await get(totalRef);
    const tot = totalSnap.exists() ? totalSnap.val() : 0;
    await set(totalRef, tot + amount);
  };

  const addReferralRecord = async (referrerId, referredId) => {
    const referrerUserRef = ref(database, `users/${referrerId}`);
    const userSnap = await get(referrerUserRef);

    if (!userSnap.exists()) {
      // Optionally create the user if this is a bug
      await set(referrerUserRef, {
        referrals: {}
      });
    }
    // Add to referrer list and award
    const refRef = ref(database, `users/${referrerId}/referrals`);
    const snap = await get(refRef);
    const list = snap.val() || {};
    const exists = Object.values(list).includes(referredId);
    if (exists) return;
    const idx = Object.keys(list).length + 1;
    await update(refRef, { [idx]: referredId });

    // Award: referrer 100, referred 50
    await updateScores(referrerId, 100);
    await updateScores(referredId, 50);
  };

  const shareToTelegram = () => window.open(`https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent('Join me and earn rewards!')}`, '_blank');
  const shareToWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent(`Join me and earn rewards! ${inviteLink}`)}`, '_blank');
  const shareToTwitter = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Join me and earn rewards! ${inviteLink}`)}`, '_blank');
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      return true;
    } catch (err) {
      console.error('Failed to copy: ', err);
      return false;
    }
  };

  return (
    <ReferralContext.Provider value={{
      inviteLink,
      invitedFriends,
      shareToTelegram,
      shareToWhatsApp,
      shareToTwitter,
      copyToClipboard,
      showWelcomePopup,
      setShowWelcomePopup
    }}>
      {children}
    </ReferralContext.Provider>
  );
};
