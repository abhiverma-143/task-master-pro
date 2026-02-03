import React, { useState, useEffect } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Confetti from "react-confetti"; // 🎉 Import kiya
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [showConfetti, setShowConfetti] = useState(false); // 🎉 State banayi

  const columns = {
    Todo: "📝 To Do",
    InProgress: "⚡ In Progress",
    Done: "✅ Completed",
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios
      .get("http://localhost:8081/api/tasks")
      .then((res) => setTasks(res.data))
      .catch((err) => console.error(err));
  };

  const addTask = () => {
    if (!newTask) return;
    axios
      .post("http://localhost:8081/api/tasks", {
        title: newTask,
        status: "Todo",
      })
      .then((res) => {
        setTasks([...tasks, res.data]);
        setNewTask("");
      });
  };

  const deleteTask = (id) => {
    axios
      .delete(`http://localhost:8081/api/tasks/${id}`)
      .then(() => setTasks(tasks.filter((t) => t.id !== id)))
      .catch((err) => console.error(err));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;

    // 🎉 AGAR 'DONE' MEIN GAYA TOH CONFETTI CHALAO
    if (newStatus === "Done") {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000); // 5 second baad band kar do
    }

    const updatedTasks = tasks.map((t) =>
      t.id.toString() === draggableId ? { ...t, status: newStatus } : t
    );
    setTasks(updatedTasks);

    axios.put(`http://localhost:8081/api/tasks/${draggableId}`, {
      status: newStatus,
    });
  };

  return (
    <div className="App">
      {/* 🎉 Jab zaroorat ho tabhi dikhao */}
      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}

      <h1>🚀 Task Master</h1>

      <div className="input-container">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button className="add-btn" onClick={addTask}>
          + ADD TASK
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="columns-container">
          {Object.keys(columns).map((statusKey) => (
            <Droppable key={statusKey} droppableId={statusKey}>
              {(provided) => (
                <div
                  className={`column column-${statusKey}`} // <-- Ye magic line hai!
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h3>{columns[statusKey]}</h3>
                  {tasks
                    .filter((t) => t.status === statusKey)
                    .map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className="task-card"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{ ...provided.draggableProps.style }}
                          >
                            <span>{task.title}</span>
                            <button
                              className="delete-btn"
                              onClick={() => deleteTask(task.id)}
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;
