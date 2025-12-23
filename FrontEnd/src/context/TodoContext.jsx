import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);

    const fetchTodos = async (filters = {}) => {
        setLoading(true);
        try {
            const { data } = await api.get('/todos', { params: filters });
            setTodos(data);
        } catch (error) {
            toast.error('Failed to fetch todos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchTodos();
            const socketUrl = import.meta.env.VITE_BACKEND_URL;
            const newSocket = io(socketUrl);
            setSocket(newSocket);

            newSocket.on('todo_created', (newTodo) => {
                setTodos((prev) => [newTodo, ...prev]);
            });

            newSocket.on('todo_updated', (updatedTodo) => {
                setTodos((prev) => prev.map((t) => (t._id === updatedTodo._id ? updatedTodo : t)));
            });

            newSocket.on('todo_deleted', (id) => {
                setTodos((prev) => prev.filter((t) => t._id !== id));
            });

            newSocket.on('todo_restored', (restoredTodo) => {
                setTodos((prev) => [restoredTodo, ...prev.filter(t => t._id !== restoredTodo._id)]);
            });

            newSocket.on('todo_permanently_deleted', (id) => {
                setTodos((prev) => prev.filter((t) => t._id !== id));
            });

            return () => newSocket.close();
        }
    }, [user]);

    const addTodo = async (todoData) => {
        try {
            const { data } = await api.post('/todos', todoData);
            return data;
        } catch (error) {
            toast.error('Failed to add todo');
            throw error;
        }
    };

    const updateTodo = async (id, updateData) => {
        try {
            const { data } = await api.put(`/todos/${id}`, updateData);
            return data;
        } catch (error) {
            toast.error('Failed to update todo');
            throw error;
        }
    };

    const deleteTodo = async (id) => {
        try {
            await api.delete(`/todos/${id}`);
            toast.success('Todo moved to trash');
        } catch (error) {
            toast.error('Failed to delete todo');
        }
    };

    const restoreTodo = async (id) => {
        try {
            await api.put(`/todos/${id}/restore`);
            toast.success('Todo restored');
        } catch (error) {
            toast.error('Failed to restore todo');
        }
    };

    const permanentlyDeleteTodo = async (id) => {
        try {
            await api.delete(`/todos/${id}/permanent`);
            toast.success('Todo permanently deleted');
        } catch (error) {
            toast.error('Failed to permanently delete todo');
        }
    };

    const reorderTodos = async (newOrder) => {
        try {
            // Optimistic update
            setTodos(prev => {
                const updated = [...prev];
                newOrder.forEach(item => {
                    const index = updated.findIndex(t => t._id === item.id);
                    if (index !== -1) updated[index].order = item.order;
                });
                return updated.sort((a, b) => a.order - b.order);
            });
            await api.put('/todos/reorder', { newOrder });
        } catch (error) {
            toast.error('Failed to save order');
            fetchTodos(); // Revert on failure
        }
    }

    return (
        <TodoContext.Provider value={{
            todos,
            loading,
            fetchTodos,
            addTodo,
            updateTodo,
            deleteTodo,
            restoreTodo,
            permanentlyDeleteTodo,
            reorderTodos
        }}>
            {children}
        </TodoContext.Provider>
    );
};

export const useTodos = () => useContext(TodoContext);
