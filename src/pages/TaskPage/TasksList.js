import React from 'react';
import Task from './Task';
import "../../Styles/TaskComponent.css"

function TaskList({ tasks, completedTasks, currentTab }) {
  const handleStartTask = async (taskId, score) => {
    try {
      console.log(`Task with ID: ${taskId} and score: ${score} started.`);
      // Here, you will handle marking the task as completed
      // You may need to re-fetch data or update the state based on your logic
    } catch (error) {
      console.error("Error handling start task:", error);
    }
  };

  return (
    <div className="tasks-list">
      {Object.entries(tasks).map(([taskId, task]) => {
        const taskstatus = completedTasks[taskId];
        
        if (taskstatus === true) return null;

        if (currentTab === 'all' || task.type.toLowerCase() === currentTab.toLowerCase()) {
          return (
            <Task
              key={taskId}
              taskId={taskId}
              task={task}
              status={taskstatus}
              handleStartTask={handleStartTask}
            />
          );
        }
        return null;
      })}
      {Object.keys(tasks).length === 0 && <p className="no-tasks">No tasks available for this category.</p>}
    </div>
  );
}

export default TaskList;
