import { initializeApp } from 'firebase/app';
import {
    getDatabase
    } from 'firebase/database';

const firebaseConfig = {
  //--hemangi ma'am sdk
  // apiKey: "AIzaSyCTLpeeHVcg5Up2OPUDSN0JB1hQXqJBhGU",
  // authDomain: "telminiapp.firebaseapp.com",
  // databaseURL: "https://telminiapp-default-rtdb.asia-southeast1.firebasedatabase.app",
  // projectId: "telminiapp",
  // storageBucket: "telminiapp.firebasestorage.app",
  // messagingSenderId: "81981730812",
  // appId: "1:81981730812:web:ca51c184228b15b5090c79",
  // measurementId: "G-HG607WCGC2",

  //Bhanu SDK - (banukarthik****@gmail.com)
  // apiKey: "AIzaSyBElOx48Lzc6AQaf4CdexsOgaEPEkgTIMI",
  // authDomain: "fruitswipe-01.firebaseapp.com",
  // databaseURL: "https://fruitswipe-01-default-rtdb.firebaseio.com",
  // projectId: "fruitswipe-01",
  // storageBucket: "fruitswipe-01.firebasestorage.app",
  // messagingSenderId: "861482168289",
  // appId: "1:861482168289:web:9da3b3cbc93a455f5faca0",
  // measurementId: "G-KGYC5JJ7Y0"

  //Basvaraju SDk -(****amvadde0393@gmail.com)
  // apiKey: "AIzaSyAEZMcO5Gaq6FKEo_Za2tNHHvfKsDlGTzA",
  // authDomain: "web3news-dca1f.firebaseapp.com",
  // databaseURL: "https://web3news-dca1f-default-rtdb.firebaseio.com",
  // projectId: "web3news-dca1f",
  // storageBucket: "web3news-dca1f.firebasestorage.app",
  // messagingSenderId: "501919675960",
  // appId: "1:501919675960:web:85868df5ee8ef1a77858cd",
  // measurementId: "G-NFVZBFX2QE"

  // Shiva SDK - (*****siddu142@gmail.com)
  apiKey: "AIzaSyBMuFb65LlplogJ5148FF_at86PiNZF54w",
  authDomain: "telegram-mini-web-app.firebaseapp.com",
  projectId: "telegram-mini-web-app",
  storageBucket: "telegram-mini-web-app.firebasestorage.app",
  messagingSenderId: "689935323364",
  appId: "1:689935323364:web:5d5cf083b50357778a5cf1",
  measurementId: "G-YBBKWDCB0V"
  
}


const app = initializeApp(firebaseConfig)
const database = getDatabase(app)



export{app,database}