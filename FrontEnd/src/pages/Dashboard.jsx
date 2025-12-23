import React, { useState } from 'react';
import { useTodos } from '../context/TodoContext';
import Layout from '../components/Layout';
import AddTodo from '../components/AddTodo';
import TodoItem from '../components/TodoItem';
import ProgressRing from '../components/ProgressRing';
import BottomSheet from '../components/BottomSheet';
import { useAuth } from '../context/AuthContext';
import { RiSearchLine, RiFileList2Line, RiLogoutBoxLine } from 'react-icons/ri';
import { cn } from '../utils/cn';

const Dashboard = () => {
    const { todos, loading } = useTodos();
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const { user, logout } = useAuth();
    const [selectedDate, setSelectedDate] = useState(new Date().getDate());

    const filteredTodos = todos.filter(todo => {
        if (search && !todo.title.toLowerCase().includes(search.toLowerCase())) return false;
        if (filter === 'active') return todo.status !== 'Done' && !todo.isDeleted;
        if (filter === 'completed') return todo.status === 'Done' && !todo.isDeleted;
        if (filter === 'trash') return todo.isDeleted === true;
        return !todo.isDeleted;
    });

    const activeTodosCount = filteredTodos.length;

    const days = [
        { day: 5, label: 'Mon' },
        { day: 6, label: 'Tue' },
        { day: 7, label: 'Wed' },
        { day: 8, label: 'Thur' },
        { day: 9, label: 'Fri' },
        { day: 10, label: 'Sat' },
        { day: 11, label: 'Sun' },
    ];

    return (
        <Layout
            currentFilter={filter}
            setFilter={setFilter}
            onAddClick={() => setIsAddOpen(true)}
        >
            <div className="-mx-4 -mt-6 mb-8 bg-primary p-6 pt-12 rounded-b-[40px] shadow-2xl shadow-primary/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-24 -mb-24 blur-2xl pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                        <div className="w-10 h-10 flex flex-wrap gap-1 items-center justify-center py-2">
                            {[1, 2, 3, 4].map(i => <div key={i} className="w-1.5 h-1.5 bg-white rounded-full opacity-60" />)}
                        </div>
                        <h2 className="text-white font-bold text-lg">5 May</h2>
                        <button className="text-white/80 hover:text-white transition-colors">
                            <RiLogoutBoxLine className="text-xl" onClick={logout} />
                        </button>
                    </div>

                    <div className="flex items-end justify-between">
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tight leading-tight">Today</h1>
                            <p className="text-white/60 text-xs font-bold uppercase tracking-widest">{activeTodosCount} tasks</p>
                        </div>
                        <button
                            onClick={() => setIsAddOpen(true)}
                            className="bg-white text-primary font-bold px-6 py-3 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all text-sm"
                        >
                            Add New
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar px-1 no-scrollbar mb-4">
                {days.map(d => (
                    <button
                        key={d.day}
                        onClick={() => setSelectedDate(d.day)}
                        className={cn(
                            "flex flex-col items-center justify-center min-w-[64px] h-20 rounded-2xl transition-all border shrink-0",
                            selectedDate === d.day
                                ? "bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-110 z-10"
                                : "bg-white text-muted-foreground border-transparent shadow-sm hover:border-slate-200"
                        )}
                    >
                        <span className="text-xl font-black">{d.day}</span>
                        <span className="text-[10px] font-bold uppercase tracking-tighter opacity-70">{d.label}</span>
                    </button>
                ))}
            </div>

            <div className="relative pl-8 mt-8 space-y-4 pb-24">
                {/* Timeline Line */}
                <div className="absolute left-[7px] top-2 bottom-24 w-0.5 bg-slate-100" />

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
                        />
                    ))
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center gap-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                            <RiFileList2Line className="text-3xl text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-bold text-sm">No tasks for this day</p>
                    </div>
                )}
            </div>

            <BottomSheet
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title="Create Task"
            >
                <AddTodo onComplete={() => setIsAddOpen(false)} />
            </BottomSheet>
        </Layout>
    );
};

export default Dashboard;
