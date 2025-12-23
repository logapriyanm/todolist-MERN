import React, { useState } from 'react';
import { useTodos } from '../context/TodoContext';
import { RiFlag2Line, RiCalendarLine, RiPriceTag3Line, RiAddLine, RiTimeLine, RiFileList2Line } from 'react-icons/ri';
import { cn } from '../utils/cn';

const AddTodo = ({ onComplete }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('');
    const [category, setCategory] = useState('Work');
    const { addTodo } = useTodos();

    const activityCategories = [
        { id: 'Idea', icon: RiPriceTag3Line, color: 'text-blue-600', bg: 'bg-blue-50' },
        { id: 'Food', icon: RiPriceTag3Line, color: 'text-orange-500', bg: 'bg-orange-50' },
        { id: 'Work', icon: RiFileList2Line, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { id: 'Sport', icon: RiFlag2Line, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { id: 'Music', icon: RiFlag2Line, color: 'text-purple-500', bg: 'bg-purple-50' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            await addTodo({ title, description, dueDate, dueTime, category });
            setTitle('');
            onComplete();
        } catch (error) { }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar px-1 no-scrollbar">
                {[5, 6, 7, 8, 9].map(d => (
                    <div
                        key={d}
                        className={cn(
                            "flex flex-col items-center justify-center min-w-[64px] h-20 rounded-2xl transition-all border shrink-0",
                            d === 5 ? "bg-primary text-white border-primary shadow-xl" : "bg-white text-slate-400 border-slate-100"
                        )}
                    >
                        <span className="text-xl font-black">{d}</span>
                        <span className="text-[10px] font-bold uppercase opacity-60">Mon</span>
                    </div>
                ))}
            </div>

            <div className="space-y-6">
                <h3 className="text-lg font-black text-slate-800">Chose activity</h3>
                <div className="space-y-3">
                    {activityCategories.map((cat) => (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                                setCategory(cat.id);
                                setTitle(cat.id); // Default title to category for demo
                            }}
                            className={cn(
                                "w-full flex items-center justify-between p-5 rounded-3xl border transition-all group",
                                category === cat.id
                                    ? "bg-primary/5 border-primary/20"
                                    : "bg-slate-50 border-transparent hover:border-slate-200"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm", cat.bg)}>
                                    <cat.icon className={cn("text-xl", cat.color)} />
                                </div>
                                <div className="text-left">
                                    <p className="font-black text-slate-800">{cat.id}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">3 on this week</p>
                                </div>
                            </div>
                            <RiAddLine className={cn("text-xl transition-transform group-hover:scale-110", category === cat.id ? "text-primary" : "text-slate-300")} />
                        </button>
                    ))}
                </div>
            </div>

            <button
                type="submit"
                disabled={!title.trim()}
                className="w-full bg-primary text-white font-black h-16 rounded-[28px] shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-95 transition-all fixed bottom-8 left-6 right-6 max-w-xl mx-auto"
            >
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    <RiAddLine className="text-xl" />
                </div>
                <span>Create Activity</span>
            </button>
            <div className="h-24" /> {/* Spacer for fixed button */}
        </form>
    );
};

export default AddTodo;
