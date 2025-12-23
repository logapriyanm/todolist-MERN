import React from 'react';
import { useTodos } from '../context/TodoContext';
import { RiCheckLine, RiLoader2Line, RiFireLine } from 'react-icons/ri';

const Stats = () => {
    const { todos } = useTodos();

    const completedToday = todos.filter(t => t.status === 'Done' && !t.isDeleted).length;
    const activeTasks = todos.filter(t => t.status !== 'Done' && !t.isDeleted).length;
    const productivity = todos.length > 0 ? Math.round((completedToday / todos.length) * 100) : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center gap-5">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center">
                    <RiCheckLine className="text-2xl" />
                </div>
                <div>
                    <p className="text-slate-500 text-sm font-medium">Completed</p>
                    <h4 className="text-2xl font-bold text-white">{completedToday}</h4>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center gap-5">
                <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center">
                    <RiLoader2Line className="text-2xl animate-spin-slow" />
                </div>
                <div>
                    <p className="text-slate-500 text-sm font-medium">Active Tasks</p>
                    <h4 className="text-2xl font-bold text-white">{activeTasks}</h4>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center gap-5">
                <div className="w-12 h-12 bg-orange-500/20 text-orange-400 rounded-2xl flex items-center justify-center">
                    <RiFireLine className="text-2xl" />
                </div>
                <div>
                    <p className="text-slate-500 text-sm font-medium">Productivity</p>
                    <h4 className="text-2xl font-bold text-white">{productivity}%</h4>
                </div>
            </div>
        </div>
    );
};

export default Stats;
