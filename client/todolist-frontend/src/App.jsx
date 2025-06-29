import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit } from 'react-icons/fa';

const API = 'http://localhost:3000/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Get all todos
  const getTodos = async () => {
    const res = await axios.get(`${API}/getall`);
    setTodos(res.data.todos);
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingId) {
      await axios.put(`${API}/update/${editingId}`, { title });
      setEditingId(null);
    } else {
      await axios.post(`${API}/add`, { title });
    }

    setTitle('');
    getTodos();
  };

  // Delete
  const handleDelete = async (id) => {
    await axios.delete(`${API}/delete/${id}`);
    getTodos();
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">📝 Todo List</h1>

        {/* ✅ FORM Submission */}
        <form onSubmit={handleSubmit} className="flex mb-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 px-3 py-2 text-black rounded-l-md"
            placeholder="Enter todo"
          />
          <button
            type="submit"
            className="bg-blue-600 px-4 py-2 rounded-r-md"
          >
            {editingId ? 'Update' : 'Add'}
          </button>
        </form>

        {/* Todo List */}
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo._id}
              className="bg-gray-800 px-4 py-2 rounded flex justify-between items-center"
            >
              <span>{todo.title}</span>
              <div className="space-x-2">
                <button
                  onClick={() => {
                    setTitle(todo.title);
                    setEditingId(todo._id);
                  }}
                  className="text-yellow-400"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(todo._id)}
                  className="text-red-500"
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
