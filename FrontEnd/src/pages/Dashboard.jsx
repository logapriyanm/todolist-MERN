import React, { useState } from 'react';
import { useTodos } from '../context/TodoContext';
import Layout from '../components/Layout';
import AddTodo from '../components/AddTodo';
import TodoItem from '../components/TodoItem';
import ProgressRing from '../components/ProgressRing';
import BottomSheet from '../components/BottomSheet';
import { useAuth } from '../context/AuthContext';
import { RiSearchLine, RiFileListLine, RiLogoutBoxLine } from 'react-icons/ri';
import { cn } from '../utils/cn';

const Dashboard = () => {
    const { todos, loading } = useTodos();
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);
    const { user, logout } = useAuth();
    const [selectedDate, setSelectedDate] = useState(new Date());

    const isToday = selectedDate.toDateString() === new Date().toDateString();
    const dateLabel = isToday ? 'Today' : selectedDate.toLocaleDateString('en-US', { weekday: 'long' });

    const days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return date;
    });

    const filteredTodos = todos.filter(todo => {
        if (search && !todo.title.toLowerCase().includes(search.toLowerCase())) return false;

        // If in trash, show all deleted items
        if (filter === 'trash') return todo.isDeleted === true;

        // Otherwise, hide deleted items
        if (todo.isDeleted) return false;

        // Filter by date for all other views
        const todoDate = todo.dueDate ? new Date(todo.dueDate) : null;
        if (todoDate) {
            if (todoDate.toDateString() !== selectedDate.toDateString()) return false;
        } else if (!isToday) {
            // Unscheduled tasks only show on "Today"
            return false;
        }

        if (filter === 'active') return todo.status !== 'Done';
        if (filter === 'completed') return todo.status === 'Done';
        return true;
    });

    const activeTodosCount = filteredTodos.length;


    return (
        <Layout
            currentFilter={filter}
            setFilter={setFilter}
            onAddClick={() => setIsAddOpen(true)}
        >
            <div className="-mx-4 -mt-6   bg-primary p-4 shadow-2xl mb-3 shadow-primary/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-24 -mb-24 blur-2xl pointer-events-none" />

                <div className="relative z-10">
                  

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-black text-white tracking-tight leading-tight">{dateLabel}</h1>
                            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
                                {selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                        <button
                            onClick={() => setIsAddOpen(true)}
                            className="bg-white text-primary font-bold px-6 py-3 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all text-sm"
                        >
                            Add New
                        </button>
                        <button className="text-white/80 hover:text-white transition-colors">
                            <RiLogoutBoxLine className="text-xl" onClick={logout} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar px-1 no-scrollbar mb-4">
                {days.map(d => (
                    <button
                        key={d.toISOString()}
                        onClick={() => setSelectedDate(d)}
                        className={cn(
                            "flex flex-col items-center justify-center p-2 rounded-l transition-all ",
                            selectedDate.toDateString() === d.toDateString()
                                ? "bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-110 z-10"
                                : "bg-white text-muted-foreground border-transparent shadow-sm hover:border-slate-200"
                        )}
                    >
                        <span className="text-xl font-black">{d.getDate()}</span>
                        <span className="text-[10px] font-bold uppercase tracking-tighter opacity-70">
                            {d.toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                    </button>
                ))}
            </div>

            <div className="relative  space-y-4 ">
                {/* Timeline Line */}
                {/* <div className="absolute left-[7px] top-2 bottom-24 w-0.5 bg-slate-100" /> */}

                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-border" />
                    ))
                ) : filteredTodos.length > 0 ? (
                    filteredTodos.map((todo, idx) => (
                        <TodoItem
                            key={todo._id}
                            todo={todo}
                            isTrash={filter === 'trash'}
                            isActive={idx === 1} // Purely for visual demo of the design
                            onEdit={(t) => {
                                setEditingTodo(t);
                                setIsAddOpen(true);
                            }}
                        />
                    ))
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center gap-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                            <RiFileListLine className="text-3xl text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-bold text-sm">No tasks for this day</p>
                    </div>
                )}
            </div>

            <BottomSheet
                isOpen={isAddOpen}
                onClose={() => {
                    setIsAddOpen(false);
                    setEditingTodo(null);
                }}
                title={editingTodo ? "Update Task" : "Create Task"}
            >
                <AddTodo
                    onComplete={() => {
                        setIsAddOpen(false);
                        setEditingTodo(null);
                    }}
                    initialDate={selectedDate.toISOString().split('T')[0]}
                    initialTodo={editingTodo}
                />
            </BottomSheet>
        </Layout>
    );
};

export default Dashboard;
