import React, { useState } from 'react';
import { useTodos } from '../context/TodoContext';
import { RiFlag2Line, RiCalendarLine, RiPriceTag3Line, RiAddLine, RiTimeLine } from 'react-icons/ri';
import { cn } from '../utils/cn';

const AddTodo = ({ onComplete }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('');
    const { addTodo } = useTodos();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            await addTodo({ title, description, dueDate, dueTime });
            setTitle('');
            onComplete();
        } catch (error) { }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
                <input
                    autoFocus
                    type="text"
                    placeholder="Task name"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 text-xl font-bold placeholder:text-muted-foreground/30 px-0 outline-none"
                />
                <textarea
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 text-sm text-muted-foreground placeholder:text-muted-foreground/30 px-0 min-h-[80px] resize-none outline-none"
                />
            </div>

            {(dueDate || dueTime) && (
                <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                    {dueDate && (
                        <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-full flex items-center gap-1.5">
                            <RiCalendarLine />
                            {new Date(dueDate).toLocaleDateString()}
                            <button type="button" onClick={() => setDueDate('')} className="hover:text-primary/70 ml-1 text-xs">×</button>
                        </div>
                    )}
                    {dueTime && (
                        <div className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                            <RiTimeLine className="text-sm" />
                            {dueTime}
                            <button type="button" onClick={() => setDueTime('')} className="hover:text-blue-400 ml-1 text-xs">×</button>
                        </div>
                    )}
                </div>
            )}

            <div className="flex items-center gap-4 pt-4 border-t border-border mt-auto">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <input
                            type="date"
                            id="due-date"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                        <button type="button" className="touch-target text-muted-foreground hover:text-primary transition-colors">
                            <RiCalendarLine className="text-xl" />
                        </button>
                    </div>

                    <div className="relative">
                        <input
                            type="time"
                            id="due-time"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            value={dueTime}
                            onChange={(e) => setDueTime(e.target.value)}
                        />
                        <button type="button" className="touch-target text-muted-foreground hover:text-primary transition-colors">
                            <RiTimeLine className="text-xl" />
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={!title.trim()}
                    className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold h-12 rounded-xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 text-sm"
                >
                    <RiAddLine className="text-xl" />
                    Create Task
                </button>
            </div>
        </form>
    );
};

export default AddTodo;
