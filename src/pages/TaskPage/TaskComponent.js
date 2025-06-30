import React, { useState, useEffect } from 'react';
import TasksList from './TasksList';
import Tabs from "./Tabs"
import Footer from "../../components/Footer.js"
import "../../Styles/TaskComponent.css"


// Import Firebase methods
import { ref, get } from "firebase/database";
import { database } from '../../services/FirebaseConfig';

function TaskComponent() {
  const [tasks, setTasks] = useState({});
  const [completedTasks, setCompletedTasks] = useState({});
  const [currentTab, setCurrentTab] = useState('all');
  const [userScore, setUserScore] = useState(0);

  const userId = localStorage.getItem("firebaseid");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksRef = ref(database, "tasks");
        const connectionsRef = ref(database, `connections/${userId}`);
        
        const tasksSnapshot = await get(tasksRef);
        const connectionsSnapshot = await get(connectionsRef);

        setTasks(tasksSnapshot.val() || {});
        setCompletedTasks(connectionsSnapshot.val() || {});
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    const fetchUserScore = async () => {
      const userScoreRef = ref(database, `users/${userId}/Score`);
      const scoreSnapshot = await get(userScoreRef);
      setUserScore(scoreSnapshot.val()?.task_score || 0);
    };

    fetchTasks();
    fetchUserScore();
  }, []);

  const changeTab = (newTab) => setCurrentTab(newTab);

  return (
    <>
      <div className="task-container">
        <header>
          <h2>Tasks <span id="user-xp" className="points">{userScore}</span></h2>
        </header>
        <Tabs currentTab={currentTab} changeTab={changeTab} />
        <TasksList tasks={tasks} completedTasks={completedTasks} currentTab={currentTab} />
        
      </div>    
      <Footer />
    </>

  );
}

export default TaskComponent;


