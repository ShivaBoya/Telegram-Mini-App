import React, { useState, useEffect, useCallback } from 'react';
import { ref, push, set, update, onValue, remove } from 'firebase/database';
import { database } from "../services/FirebaseConfig";
import "../Styles/AdminTask.css"



const AdminTask = () => {
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    type: '',
    points: '',
    videoUrl: '',
  });
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [message, setMessage] = useState({ text: '', color: '' });

  useEffect(() => {
    const tasksRef = ref(database, 'tasks');
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTasks(Object.entries(data).map(([id, taskItem]) => ({ id, ...taskItem })));
      } else {
        setTasks([]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const showMessage = useCallback((msg, color) => {
    setMessage({ text: msg, color });
    setTimeout(() => {
      setMessage({ text: '', color: '' });
    }, 3000);
  }, []);

  const resetForm = () => {
    setTaskForm({ title: '', description: '', type: '', points: '', videoUrl: '' });
    setEditingTaskId(null);
  };

  const handleChange = (e) => {
    setTaskForm(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, description, type, points, videoUrl } = taskForm;
    if (title && type && points) {
      if (editingTaskId) {
        updateTask(editingTaskId, title, description, type, parseInt(points, 10), videoUrl);
      } else {
        createTask(title, description, type, parseInt(points, 10), videoUrl);
      }
    }
  };

  const createTask = (title, description, type, points, videoUrl) => {
    const tasksRef = ref(database, 'tasks');
    const newTaskRef = push(tasksRef);
    const taskData = {
      title,
      description,
      type,
      points,
      videoUrl,
      createdAt: new Date().toISOString(),
    };

    set(newTaskRef, taskData)
      .then(() => {
        showMessage(`Task "${title}" created successfully!`, 'green');
        resetForm();
      })
      .catch((error) => {
        showMessage(`Error creating task: ${error.message}`, 'red');
      });
  };

  const updateTask = (taskId, title, description, type, points, videoUrl) => {
    const taskRef = ref(database, 'tasks/' + taskId);

    update(taskRef, {
      title,
      description,
      type,
      points,
      videoUrl,
      updatedAt: new Date().toISOString(),
    })
      .then(() => {
        showMessage('Task updated successfully!', 'green');
        resetForm();
      })
      .catch((error) => {
        showMessage(`Error updating task: ${error.message}`, 'red');
      });
  };

  const handleEdit = (taskId) => {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
      setTaskForm({
        title: task.title,
        description: task.description || '',
        type: task.type,
        points: (task.points || task.score || 0).toString(),
        videoUrl: task.videoUrl || ''
      });
      setEditingTaskId(taskId);
    }
  };

  const handleDelete = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const taskRef = ref(database, 'tasks/' + taskId);
      remove(taskRef)
        .then(() => {
          showMessage('Task deleted successfully!', 'green');
        })
        .catch((error) => {
          showMessage(`Error deleting task: ${error.message}`, 'red');
        });
    }
  };

  return (
    <div className="task-container">
      <h1>Task Manager</h1>
      <form id="taskForm" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Enter task title"
          value={taskForm.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Enter task description (optional)"
          value={taskForm.description}
          onChange={handleChange}
        />
        <select
          name="type"
          value={taskForm.type}
          onChange={handleChange}
          required
        >
          <option value="">Select task type</option>
          <option value="watch">Watch</option>
          <option value="social">Social</option>
          <option value="partnership">Partnership</option>
          <option value="misc">Misc</option>
        </select>
        <input
          type="number"
          name="points"
          placeholder="Enter task points"
          value={taskForm.points}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="videoUrl"
          placeholder="Enter video URL (optional, for watch tasks)"
          value={taskForm.videoUrl}
          onChange={handleChange}
        />
        <button type="submit">
          {editingTaskId ? 'Update Task' : 'Add Task'}
        </button>
      </form>
      {message.text && (
        <div id="message" style={{ color: message.color }}>
          {message.text}
        </div>
      )}
      <div id="taskList">
        <h2>Existing Tasks</h2>
        <table id="tasksTable">
          <thead>
            <tr>
              <th>TaskId</th>
              <th>Title</th>
              <th>Type</th>
              <th>Points</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((taskItem, index) => (
              <tr key={taskItem.id}>
                <td>{index + 1}</td>
                <td>{taskItem.title}</td>
                <td>{taskItem.type}</td>
                <td>{taskItem.points || taskItem.score}</td>
                <td>{taskItem.description}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(taskItem.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(taskItem.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>
                  No tasks available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTask;
