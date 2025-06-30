import React from 'react'
import { Button } from "./ui/button.js";
import { useNavigate,useLocation } from 'react-router-dom';
import {Users,Award,Wallet,GamepadIcon,ClipboardList,SquareCheckBig,Newspaper  } from "lucide-react";

const Navbar = () => {
    const navigate = useNavigate()
    const goHome = () => navigate("/");
    const goGame = () => navigate("/tasks");
    const goWallet = () => navigate("/wallet");
    const goNetwork = () => navigate("/network");
    const goNews = () => navigate("/news");

    const location = useLocation();

  const getActiveClass = (path) =>
    location.pathname === path ? "text-indigo-400" : "text-white/60";
  return (
    <nav className="absolute w-full bottom-0 bg-black/30 backdrop-blur-md border-t z-50 border-white/20 grid grid-cols-5 p-0.5">
    <Button
      variant="ghost"
      onClick={goHome}
      className="flex flex-col items-center justify-center py-1.5 rounded-none text-white hover:bg-white/10"
    >
      <Award className={`h-5 w-5 ${getActiveClass("/")}`}/>
      <span className="text-[10px] mt-0.5">Home</span>
    </Button>
    <Button
      variant="ghost"
      onClick={goNews}
      className="flex flex-col items-center justify-center py-1.5 rounded-none text-white hover:bg-white/10"
    >
      <Newspaper className={`h-5 w-5 ${getActiveClass("/news")}`}/>
      <span className="text-[10px] mt-0.5">News</span>
    </Button>    
    <Button
      variant="ghost"
      onClick={goGame}
      className="flex flex-col items-center justify-center py-1.5 rounded-none text-white hover:bg-white/10"
    >
      <SquareCheckBig className={`h-5 w-5 ${getActiveClass("/tasks")}`} />
      <span className="text-[10px] mt-0.5">Tasks</span>
    </Button>
    <Button
      variant="ghost"
      onClick={goWallet}
      className="flex flex-col items-center justify-center py-1.5 rounded-none text-white hover:bg-white/10"
    >
      <Wallet className={`h-5 w-5 ${getActiveClass("/wallet")}`} />
      <span className="text-[10px] mt-0.5">Wallet</span>
    </Button>
    <Button
      variant="ghost"
      onClick={goNetwork}
      className="flex flex-col items-center justify-center py-1.5 rounded-none text-white hover:bg-white/10"
    >
      <Users className={`h-5 w-5 ${getActiveClass("/network")}`} />
      <span className="text-[10px] mt-0.5">Invite</span>
    </Button>
  </nav>
  )
}

export default Navbar