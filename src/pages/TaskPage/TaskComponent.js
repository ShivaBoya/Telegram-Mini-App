import React, { useState, useEffect } from 'react';
import TasksList from './TasksList';
import Tabs from "./Tabs";
import Footer from "../../components/Footer.js";
import "../../Styles/TaskComponent.css";

import { ref, get } from "firebase/database";
import { database } from '../../services/FirebaseConfig';

function TaskComponent() {
  const [tasks, setTasks] = useState({});
  const [completedTasks, setCompletedTasks] = useState({});
  const [currentTab, setCurrentTab] = useState('all');
  const [userScore, setUserScore] = useState(0);

  // Getting userId from localStorage
  const userId = localStorage.getItem("firebaseid");

  // Using useCallback or defining inside useEffect prevents 
  // "missing dependency" warnings for the functions themselves.
  useEffect(() => {
    if (!userId) return;

    const fetchTasks = async () => {
      try {
        const tasksRef = ref(database, "tasks");
        const connectionsRef = ref(database, `connections/${userId}`);

        const [tasksSnapshot, connectionsSnapshot] = await Promise.all([
          get(tasksRef),
          get(connectionsRef)
        ]);

        setTasks(tasksSnapshot.val() || {});
        setCompletedTasks(connectionsSnapshot.val() || {});
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    const fetchUserScore = async () => {
      try {
        const userScoreRef = ref(database, `users/${userId}/Score`);
        const scoreSnapshot = await get(userScoreRef);
        // Using optional chaining to safely get the score
        setUserScore(scoreSnapshot.val()?.task_score || 0);
      } catch (err) {
        console.error("Error fetching score:", err);
      }
    };

    fetchTasks();
    fetchUserScore();
  }, [userId]); // ✅ Fixed: Dependency array is now complete

  const changeTab = (newTab) => setCurrentTab(newTab);

  return (
    <>
      <div className="task-container">
        <header>
          <h2>
            Tasks <span id="user-xp" className="points">{userScore}</span>
          </h2>
        </header>

        <Tabs currentTab={currentTab} changeTab={changeTab} />
        <TasksList
          tasks={tasks}
          completedTasks={completedTasks}
          currentTab={currentTab}
        />
      </div>

      <Footer />
    </>
  );
}

export default TaskComponent;