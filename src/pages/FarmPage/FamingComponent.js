import React from 'react';
import Profile from '../FarmPage/Profile';
import FarmingButton from '../FarmPage/FarmingButton';
import Footer from '../../components/Footer';


import "../../Styles/FarmingComponent.css"


const FamingComponent = () => {
  // useEffect(() => {
  //   const tg = window.Telegram.WebApp;
  //   tg.ready();
  //   tg.expand();
  //   const user = tg.initDataUnsafe.user;

  //   const fetchData = async () => {
  //     if (user) {
  //       await initializeUser(user);
  //     } else {
  //       console.error("User data not available");
  //     }
  //   };

  //   fetchData();
  // }, []);


  return (
    <div className="main-container">
      <div className="farming-content">
        <Profile />
        <FarmingButton />
        <Footer />
      </div>
    </div>
  );
};

export default FamingComponent;
