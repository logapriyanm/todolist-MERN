import React, { useState } from 'react';
import { useTodos } from '../context/TodoContext';
import { RiCalendarLine, RiAddLine, RiTimeLine, RiEditLine } from 'react-icons/ri';
import { cn } from '../utils/cn';

const AddTodo = ({ onComplete, initialDate, initialTodo }) => {
    const [title, setTitle] = useState(initialTodo?.title || '');
    const [description, setDescription] = useState(initialTodo?.description || '');
    const [dueDate, setDueDate] = useState(() => {
        if (initialTodo?.dueDate) {
            try {
                return new Date(initialTodo.dueDate).toISOString().split('T')[0];
            } catch (e) {
                return '';
            }
        }
        return initialDate || '';
    });
    const [dueTime, setDueTime] = useState(initialTodo?.dueTime || '');
    const [category, setCategory] = useState(initialTodo?.category || 'Work');
    const { addTodo, updateTodo } = useTodos();


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            if (initialTodo) {
                await updateTodo(initialTodo._id, { title, description, dueDate, dueTime, category });
            } else {
                await addTodo({ title, description, dueDate, dueTime, category });
            }
            setTitle('');
            onComplete();
        } catch (error) {
            console.error('Add/Update todo error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Task Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="What needs to be done?"
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 rounded-3xl p-5 font-bold text-slate-800 placeholder:text-slate-300 transition-all outline-none"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add more details..."
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 rounded-3xl p-5 font-medium text-slate-600 placeholder:text-slate-300 transition-all outline-none min-h-[120px] resize-none"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Due Date</label>
                    <div className="relative">
                        <RiCalendarLine className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 rounded-3xl p-5 pl-12 font-bold text-slate-800 transition-all outline-none"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Due Time</label>
                    <div className="relative">
                        <RiTimeLine className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="time"
                            value={dueTime}
                            onChange={(e) => setDueTime(e.target.value)}
                            className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 rounded-3xl p-5 pl-12 font-bold text-slate-800 transition-all outline-none"
                        />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={!title.trim()}
                className="w-full bg-primary text-white font-black h-16 rounded-[28px] shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-95 transition-all mt-8"
            >
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    {initialTodo ? <RiEditLine className="text-xl" /> : <RiAddLine className="text-xl" />}
                </div>
                <span>{initialTodo ? 'Update Activity' : 'Create Activity'}</span>
            </button>
        </form>
    );
};

export default AddTodo;
