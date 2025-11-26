// Todo.jsx
import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaClipboardList } from "react-icons/fa";

const apiUrl =  "https://todolist-mern-backend-bur5.onrender.com";

const Todo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(-1);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    getItems();
  }, []);

  const getItems = async () => {
    try {
      const res = await fetch(`${apiUrl}/todos`);
      if (!res.ok) throw new Error("Failed to fetch todos");
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error(err);
      setError("❌ Unable to fetch tasks");
    }
  };

  const handleSubmit = async () => {
    setError("");
    if (title.trim() === "" || description.trim() === "") {
      setError("⚠️ Please fill in both fields");
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      if (!res.ok) throw new Error("Failed to create");
      const newTodo = await res.json();
      // prepend to show newest first (optional)
      setTodos(prev => [newTodo, ...prev]);
      setTitle("");
      setDescription("");
      setMessage("✅ Task added successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setError("❌ Unable to create your task");
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  const handleUpdate = async () => {
    setError("");
    if (editTitle.trim() === "" || editDescription.trim() === "") {
      setError("⚠️ Please fill in both fields");
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/todos/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      });
      if (!res.ok) throw new Error("Update failed");
      const updated = await res.json();
      setTodos(prev => prev.map(i => (i._id === editId ? updated : i)));
      setEditId(-1);
      setEditTitle("");
      setEditDescription("");
      setMessage("✏️ Task updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setError("❌ Unable to update your task");
    }
  };

  const handleEditCancel = () => {
    setEditId(-1);
    setEditTitle("");
    setEditDescription("");
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this task?");
    if (!ok) return;
    try {
      const res = await fetch(`${apiUrl}/todos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      // you can read response JSON if server returns message
      setTodos(prev => prev.filter(item => item._id !== id));
      setMessage("🗑️ Task deleted successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setError("❌ Unable to delete task");
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg">
              <FaClipboardList className="text-white text-2xl" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Task Manager
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Stay organized and productive</p>
        </div>

        {/* Main Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Add Task */}
          <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600">
            <h2 className="text-2xl font-semibold text-white mb-4">Add New Task</h2>

            {message && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg animate-pulse">
                {message}
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  placeholder="Task title..."
                  onChange={(e) => setTitle(e.target.value)}
                  type="text"
                  value={title}
                  className="w-full px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white bg-white/20 placeholder-white/70 text-white backdrop-blur-sm"
                />
                <input
                  placeholder="Task description..."
                  onChange={(e) => setDescription(e.target.value)}
                  type="text"
                  value={description}
                  className="w-full px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white bg-white/20 placeholder-white/70 text-white backdrop-blur-sm"
                />
              </div>
              <button
                className="w-full md:w-auto px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                onClick={handleSubmit}
              >
                <FaPlus />
                Add Task
              </button>
            </div>
          </div>

          {/* Tasks List */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Your Tasks</h2>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                {todos.length} {todos.length === 1 ? "task" : "tasks"}
              </span>
            </div>

            {todos.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No tasks yet</h3>
                <p className="text-gray-500">Add your first task to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todos.map((item) => (
                  <div key={item._id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-md">
                    {editId === item._id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            placeholder="Task title..."
                            onChange={(e) => setEditTitle(e.target.value)}
                            type="text"
                            value={editTitle}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <input
                            placeholder="Task description..."
                            onChange={(e) => setEditDescription(e.target.value)}
                            type="text"
                            value={editDescription}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2" onClick={handleUpdate}>
                            <FaSave /> Update
                          </button>
                          <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2" onClick={handleEditCancel}>
                            <FaTimes /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.title}</h3>
                          <p className="text-gray-600">{item.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors transform hover:scale-105" onClick={() => handleEdit(item)} title="Edit task">
                            <FaEdit />
                          </button>
                          <button className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors transform hover:scale-105" onClick={() => handleDelete(item._id)} title="Delete task">
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Built with React & MERN Stack • {new Date().getFullYear()}</p>
        </div>
      </div>
    </section>
  );
};

export default Todo;
