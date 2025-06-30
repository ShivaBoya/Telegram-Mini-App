import React from 'react';
import "../../Styles/TaskComponent.css"

function Task({ taskId, task, status, handleStartTask }) {
  const handleButtonClick = () => {
    if (status === undefined) {
      handleStartTask(taskId, task.score || 0);
    }
  };

  return (
    <div className="task-item">
      <div className="task-info">
        <h3>{task.title || "Untitled Task"}</h3>
        <p>{task.description || "No description"}</p>
        <span className="task-xp">+{task.score || 0} XP</span>
      </div>
      <button className="start-task-btn" onClick={handleButtonClick}>
        {status === undefined ? "Start Task" : "Claim"}
      </button>
    </div>
  );
}

export default Task;
