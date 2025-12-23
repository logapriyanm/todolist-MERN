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

    const filteredTodos = todos.filter(todo => {
        if (search && !todo.title.toLowerCase().includes(search.toLowerCase())) return false;
        if (filter === 'active') return todo.status !== 'Done' && !todo.isDeleted;
        if (filter === 'completed') return todo.status === 'Done' && !todo.isDeleted;
        if (filter === 'priority') return todo.priority === 'High' || todo.priority === 'Critical';
        if (filter === 'trash') return todo.isDeleted === true;
        return !todo.isDeleted;
    });

    const activeTodosCount = todos.filter(t => !t.isDeleted).length;
    const completionRate = activeTodosCount > 0
        ? (todos.filter(t => t.status === 'Done' && !t.isDeleted).length / activeTodosCount) * 100
        : 0;

    const filterOptions = [
        { id: 'all', label: 'All' },
        { id: 'active', label: 'Active' },
        { id: 'completed', label: 'Done' },
        { id: 'priority', label: 'High' },
        { id: 'trash', label: 'Trash' },
    ];

    return (
        <Layout
            currentFilter={filter}
            setFilter={setFilter}
            onAddClick={() => setIsAddOpen(true)}
        >
            <header className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-muted-foreground font-medium text-[10px] uppercase tracking-wider">Good morning, {user?.name.split(' ')[0]} ☀️</h2>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {filter === 'stats' ? 'Analytics' : filter === 'profile' ? 'Settings' : 'Your Today'}
                        </h1>
                    </div>
                    <div className="scale-90 origin-right">
                        <ProgressRing progress={completionRate} />
                    </div>
                </div>

                <div className="flex gap-4 items-center">
                    <div className="relative flex-1">
                        <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg" />
                        <input
                            type="text"
                            placeholder="Find a task..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white border border-border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm h-12"
                        />
                    </div>
                </div>
            </header>

            <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar mb-4 no-scrollbar">
                {filterOptions.map(opt => (
                    <button
                        key={opt.id}
                        onClick={() => setFilter(opt.id)}
                        className={cn(
                            "px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all border",
                            filter === opt.id
                                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                : "bg-white text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                        )}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            <div className="space-y-2 pb-24">
                {filter === 'stats' ? (
                    <div className="space-y-6">
                        <div className="bg-primary/5 border border-primary/10 p-6 rounded-3xl text-center">
                            <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Completion Rate</h3>
                            <div className="flex justify-center my-4 scale-90">
                                <ProgressRing progress={completionRate} />
                            </div>
                            <p className="text-muted-foreground text-xs font-medium">You've completed {todos.filter(t => t.status === 'Done' && !t.isDeleted).length} out of {activeTodosCount} tasks today.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-card border border-border p-5 rounded-2xl">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Total</p>
                                <p className="text-xl font-black">{activeTodosCount}</p>
                            </div>
                            <div className="bg-card border border-border p-5 rounded-2xl">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Done</p>
                                <p className="text-xl font-black text-primary">{todos.filter(t => t.status === 'Done' && !t.isDeleted).length}</p>
                            </div>
                        </div>
                    </div>
                ) : filter === 'profile' ? (
                    <div className="space-y-6">
                        <div className="bg-white border border-border p-6 rounded-3xl flex flex-col items-center shadow-xl shadow-black/5">
                            <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center text-white text-3xl font-black mb-4 shadow-2xl shadow-primary/20 rotate-3">
                                {user?.name.charAt(0)}
                            </div>
                            <h2 className="text-xl font-black tracking-tight">{user?.name}</h2>
                            <p className="text-muted-foreground text-sm font-medium mb-6">{user?.email}</p>

                            <button
                                onClick={logout}
                                className="w-full bg-slate-50 border border-border text-destructive font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-destructive/5 transition-colors text-sm"
                            >
                                <RiLogoutBoxLine className="text-lg" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                ) : loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-card rounded-3xl animate-pulse border border-border" />
                    ))
                ) : filteredTodos.length > 0 ? (
                    filteredTodos.map((todo) => (
                        <TodoItem key={todo._id} todo={todo} isTrash={filter === 'trash'} />
                    ))
                ) : (
                    <div className="text-center py-16 bg-card rounded-3xl border border-dashed border-border flex flex-col items-center justify-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-border">
                            {search ? <RiSearchLine className="text-2xl text-muted-foreground/30" /> : <RiFileList2Line className="text-2xl text-muted-foreground/30" />}
                        </div>
                        <div className="space-y-1">
                            <p className="text-muted-foreground text-sm font-medium">
                                {search ? `No results for "${search}"` : 'No tasks found'}
                            </p>
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    className="text-primary text-sm font-bold hover:underline"
                                >
                                    Clear search
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <BottomSheet
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title="Create New Task"
            >
                <AddTodo onComplete={() => setIsAddOpen(false)} />
            </BottomSheet>
        </Layout>
    );
};

export default Dashboard;
