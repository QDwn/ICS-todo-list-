"use client";

import { useState, useEffect } from "react";


interface Todo {
  id: number;
  title: string;
  completed: boolean;
  icon?: string;
  note?: string;
  startDate?: string;
  endDate?: string; 
}

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [icon, setIcon] = useState("✏️");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");


  const fetchTodos = async () => {
    try {
      const res = await fetch(`${API_URL}/todo`);
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error("Failed to fetch todos", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);


  const formatDateTimeForInput = (isoString?: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - offset).toISOString().slice(0, 16);
    return localISOTime;
  };

  const toggleTodo = async (id: number) => {
    await fetch(`${API_URL}/todo/${id}/toggle`, {
      method: "PATCH",
    });
    fetchTodos();
  };

  const deleteTodo = async (id: number) => {
    await fetch(`${API_URL}/todo/${id}`, {
      method: "DELETE",
    });
    if (selectedTodo?.id === id) {
      setSelectedTodo(null);
    }
    fetchTodos();
  };

  const addTodo = async () => {
    if (!title.trim()) return;

    await fetch(`${API_URL}/todo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        title, 
        note, 
        icon,
        startDate: startDate ? new Date(startDate).toISOString() : null,
        endDate: endDate ? new Date(endDate).toISOString() : null, 
      }),
    });

    resetForm();
    fetchTodos();
  };

  const saveTodo = async () => {
    if (!selectedTodo) return;

    await fetch(`${API_URL}/todo/${selectedTodo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        title, 
        note, 
        icon,
        startDate: startDate ? new Date(startDate).toISOString() : null,
        endDate: endDate ? new Date(endDate).toISOString() : null,
      }),
    });

    fetchTodos();
  };

  const resetForm = () => {
    setTitle("");
    setNote("");
    setIcon("✏️");
    setStartDate("");
    setEndDate("");
    setSelectedTodo(null);
  };

  const getTodoColor = (icon?: string) => {
  switch (icon) {
    case "💰":
      return "#1dd1a1"; 
    case "✈️":
      return "#54a0ff"; 
    case "🛒":
      return "#feca57"; 
    case "🦾":
      return "#ff6b6b"; 
    case "✏️":
    default:
      return "#5f27cd"; 
  }
};
const getTimeProgress = (start?: string, end?: string) => {
  if (!start || !end) return 0;

  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  const now = Date.now();

  if (now <= startTime) return 0;
  if (now >= endTime) return 100;

  return Math.round(((now - startTime) / (endTime - startTime)) * 100);
};


  return (
    <div className="page">
      <h1>Todo List</h1>

      <div className="layout">
        <div className="todo-list">
          <button
            className="add"
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
          >
            + Add Task
          </button>

          <ul>
            {todos.map((todo) => (
              <li
                key={todo.id}
                className={`todo-item ${todo.completed ? "done" : ""}`}
                style={{
                  borderLeft: `6px solid ${getTodoColor(todo.icon)}`,
                  borderTop: `4px solid ${getTodoColor(todo.icon)}`,
                  backgroundColor: "#fff"
                }}
                onClick={() => {
                  setSelectedTodo(todo);
                  setTitle(todo.title);
                  setNote(todo.note || "");
                  setIcon(todo.icon || "✏️");
                  setStartDate(formatDateTimeForInput(todo.startDate));
                  setEndDate(formatDateTimeForInput(todo.endDate));
                }}
              >
                <input
                  className="check"
                  type="checkbox"
                  checked={todo.completed}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => toggleTodo(todo.id)}
                />

                {/* CONTENT */}
                <div className="todo-content">
                  <div className="todo-header" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="todo-icon">{todo.icon || "✏️"}</div>
                    <div className="todo-title">{todo.title}</div>
                  </div>
                  
                  <div className="todo-meta" style={{  fontSize: '25px', color: '#666', marginLeft: '28px', marginTop: '45px' }}>
                    {todo.startDate && todo.endDate && (
                      <span className="time" style={{ fontSize: '20px',marginLeft: '50px', color: '#e67e22' }}>
                        📅 {new Date(todo.startDate).toLocaleString('vi-VN', { hour: '2-digit', minute:'2-digit', day: '2-digit', month: '2-digit' })}
                      </span>
                    )}
                    <span className="todo-note-preview" style={{marginLeft: '50px'}}>
                        {todo.note ? (todo.note.length > 30 ? todo.note.substring(0, 30) + "..." : todo.note) : ""}
                    </span>
                  </div>
                </div>

                <span
                  className="delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTodo(todo.id);
                  }}
                >
                  Xóa
                </span>
              </li>
            ))}
          </ul>
        </div>

  
        <div className="todo-detail">
          {!selectedTodo ? (
            <div className="empty">
              Chọn một task để xem chi tiết hoặc bấm Add
            </div>
          ) : (
            <>
              <h2>Chi tiết task</h2>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Tiêu đề"
              />

              <label style={{ fontSize: '30px', color: 'black', marginTop: '10px', display: 'block' }}>Ngày tháng:</label>
              <input 
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid black', borderRadius: '4px' }}
              />

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ghi chú"
                rows={4}
              />

              <div className="icon-list">
                {["✏️", "✈️", "💰", "🛒", "🦾"].map((i) => (
                  <div
                    key={i}
                    className={`icon-item ${icon === i ? "active" : ""}`}
                    onClick={() => setIcon(i)}
                  >
                    {i}
                  </div>
                ))}
              </div>

              {selectedTodo.startDate && selectedTodo.endDate && (
                <div style={{ fontSize: 25, marginTop: 16 }}>
                  <strong>Thời gian trôi qua:</strong>

                  <progress
                    value={getTimeProgress(selectedTodo.startDate, selectedTodo.endDate)}
                    max={100}
                    style={{ width: "100%" }}
                  />

                  <div>
                    {getTimeProgress(selectedTodo.startDate, selectedTodo.endDate)}%
                  </div>
                </div>
              )}

              <div style={{ marginTop: 20 }}>
                <button className="save" onClick={saveTodo}>Lưu thay đổi</button>
              </div>
            </>
          )}
        </div>
      </div>

    
      {showAddModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Thêm task mới</h2>

            <input
              placeholder="Tiêu đề"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

             
            <label>Ngày bắt đầu:</label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            <label>Ngày kết thúc:</label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />


            <textarea
              placeholder="Ghi chú"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            <div className="icon-list">
              {["✏️", "✈️", "💰", "🛒", "🦾"].map((i) => (
                <div
                  key={i}
                  className={`icon-item ${icon === i ? "active" : ""}`}
                  onClick={() => setIcon(i)}
                >
                  {i}
                </div>
              ))}
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowAddModal(false)}>
                Hủy
              </button>

              <button
                onClick={async () => {
                  await addTodo();
                  setShowAddModal(false);
                }}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}