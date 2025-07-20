import { useState, useEffect } from "react";
import "./TaskManager.css";

function TaskManager() {
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    status: "To Do",
    completed: false,
  });

  const [taskList, setTaskList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Apply dark mode class to root HTML element
  useEffect(() => {
    const theme = darkMode ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [darkMode]);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const storedTasks = localStorage.getItem("taskList");
    if (storedTasks) {
      setTaskList(JSON.parse(storedTasks));
    }
  }, []);

  // Save tasks to localStorage on update
  useEffect(() => {
    localStorage.setItem("taskList", JSON.stringify(taskList));
  }, [taskList]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTask((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setTask({
      title: "",
      description: "",
      dueDate: "",
      priority: "Medium",
      status: "To Do",
      completed: false,
    });
    setIsEditing(false);
    setEditIndex(null);
  };

  const handleSubmit = () => {
    const { title, description, dueDate, priority, status } = task;
    if (!title || !description || !dueDate || !priority || !status) {
      alert("Please fill all fields.");
      return;
    }

    if (isEditing) {
      const updatedList = [...taskList];
      updatedList[editIndex] = { ...task };
      setTaskList(updatedList);
    } else {
      setTaskList([...taskList, { ...task }]);
    }

    resetForm();
  };

  const handleDelete = (index) => {
    const updatedList = taskList.filter((_, i) => i !== index);
    setTaskList(updatedList);
  };

  const handleEdit = (index) => {
    setTask(taskList[index]);
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleToggleComplete = (index) => {
    const updatedList = [...taskList];
    updatedList[index].completed = !updatedList[index].completed;
    setTaskList(updatedList);
  };

  const filteredTasks = taskList
    .filter((t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (sortBy === "priority") {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return 0;
    });

  return (
    <div className="task-container">
      <h2 className="title">📝 Task Manager</h2>

      <button
        className="theme-toggle"
        onClick={() => setDarkMode((prev) => !prev)}
        aria-label="Toggle theme"
        title="Toggle theme"
      >
        {darkMode ? "🌞" : "🌙"}
      </button>

      <div className="form">
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={task.title}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={task.description}
          onChange={handleChange}
        ></textarea>

        <input
          type="date"
          name="dueDate"
          value={task.dueDate}
          onChange={handleChange}
        />

        <select name="priority" value={task.priority} onChange={handleChange}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <select name="status" value={task.status} onChange={handleChange}>
          <option>To Do</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>

        <label>
          <input
            type="checkbox"
            name="completed"
            checked={task.completed}
            onChange={handleChange}
          />
          Completed
        </label>

        <button onClick={handleSubmit} className="add-button">
          {isEditing ? "Update Task" : "Add Task"}
        </button>
      </div>

      <div className="filter-controls">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="">Sort By</option>
          <option value="date">Due Date</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      <h3 className="subtitle">📋 Task List</h3>
      {filteredTasks.length === 0 && (
        <p className="empty">No matching tasks.</p>
      )}

      <ul className="task-list">
        {filteredTasks.map((t, index) => (
          <li key={index} className={`task-item ${t.completed ? "completed" : ""}`}>
            <div>
              <strong>{t.title}</strong>
              <p>{t.description}</p>
              <p><b>Due:</b> {t.dueDate}</p>
              <p><b>Priority:</b> {t.priority}</p>
              <p><b>Status:</b> {t.status}</p>
              <label>
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => handleToggleComplete(index)}
                />
                Completed
              </label>
            </div>
            <div className="action-buttons">
              <button onClick={() => handleEdit(index)} className="edit-button">
                Edit
              </button>
              <button onClick={() => handleDelete(index)} className="delete-button">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskManager;
