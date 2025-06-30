import React from 'react';

import { useTelegram } from "../../reactContext/TelegramContext.js";

import "../../Styles/FarmingComponent.css"




const Profile = () => {
  const {user,scores} = useTelegram()
  // console.log(user)
  //   useEffect(() => {
  //     // const tg = window.Telegram.WebApp;
  //     // tg.ready();
  //     // tg.expand();
  //     // const user = tg.initDataUnsafe.user;
      
  
  //     const fetchData = async () => {
  //       if (user) {
  //         await initializeUser(user);
  //       } else {
  //         console.error("User data not available");
  //       }
  //     };
  //     fetchData();


   
  //   }, []);



  return (
    <div className="profile">
      <img src={user.photo_url} className="avatar" id="userAvatar" alt="profile_pic"/>
      <h2 id="user">{user.username}</h2>
      <div className="balance">₿ <span id="score">{scores?.farming_score || 0}</span></div> 
      <p className='text-600'>🎟️ {scores?.no_of_tickets || 3}</p>
    </div>
  );
};

export default Profile;
