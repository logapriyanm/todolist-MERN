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

    // Time states for 12h format
    const [hour, setHour] = useState(() => {
        if (initialTodo?.dueTime) {
            const h = parseInt(initialTodo.dueTime.split(':')[0]);
            return (h % 12 || 12).toString().padStart(2, '0');
        }
        return '12';
    });
    const [minute, setMinute] = useState(() => {
        if (initialTodo?.dueTime) {
            return initialTodo.dueTime.split(':')[1];
        }
        return '00';
    });
    const [ampm, setAmpm] = useState(() => {
        if (initialTodo?.dueTime) {
            const h = parseInt(initialTodo.dueTime.split(':')[0]);
            return h >= 12 ? 'PM' : 'AM';
        }
        return 'AM';
    });

    const { addTodo, updateTodo } = useTodos();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        // Convert back to 24h format for the backend
        let h = parseInt(hour);
        if (ampm === 'PM' && h < 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;
        const dueTime = `${h.toString().padStart(2, '0')}:${minute}`;

        try {
            if (initialTodo) {
                await updateTodo(initialTodo._id, { title, description, dueDate, dueTime, category: initialTodo.category });
            } else {
                await addTodo({ title, description, dueDate, dueTime, category: 'Work' });
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <RiTimeLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <div className="flex bg-slate-50 rounded-3xl items-center border-2 border-transparent focus-within:border-primary/20 transition-all overflow-hidden pl-10">
                                <input
                                    type="text"
                                    value={hour}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                                        if (parseInt(val) <= 12 || val === '') setHour(val);
                                    }}
                                    onBlur={() => {
                                        if (!hour || parseInt(hour) === 0) setHour('12');
                                        else setHour(hour.padStart(2, '0'));
                                    }}
                                    className="w-12 bg-transparent p-5 text-center font-bold text-slate-800 outline-none"
                                    placeholder="HH"
                                />
                                <span className="font-bold text-slate-400">:</span>
                                <input
                                    type="text"
                                    value={minute}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                                        if (parseInt(val) < 60 || val === '') setMinute(val);
                                    }}
                                    onBlur={() => {
                                        if (!minute) setMinute('00');
                                        else setMinute(minute.padStart(2, '0'));
                                    }}
                                    className="w-12 bg-transparent p-5 text-center font-bold text-slate-800 outline-none"
                                    placeholder="MM"
                                />
                            </div>
                        </div>
                        <div className="flex bg-slate-50 border-2 border-transparent rounded-2xl p-1 shrink-0">
                            {['AM', 'PM'].map((mode) => (
                                <button
                                    key={mode}
                                    type="button"
                                    onClick={() => setAmpm(mode)}
                                    className={cn(
                                        "px-4 py-2 rounded-xl text-xs font-black transition-all",
                                        ampm === mode
                                            ? "bg-white text-primary shadow-sm"
                                            : "text-slate-400 hover:text-slate-600"
                                    )}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>
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
