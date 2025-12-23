import React, { useState } from 'react';
import { useTodos } from '../context/TodoContext';
import { RiFlag2Line, RiCalendarLine, RiPriceTag3Line, RiAddLine, RiAttachment2 } from 'react-icons/ri';
import { cn } from '../utils/cn';

const AddTodo = ({ onComplete }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [attachments, setAttachments] = useState([]);
    const { addTodo } = useTodos();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            await addTodo({ title, description, dueDate, attachments });
            setTitle('');
            onComplete();
        } catch (error) { }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setAttachments(prev => [...prev, ...files]);
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

            {(dueDate || attachments.length > 0) && (
                <div className="flex flex-wrap gap-2">
                    {dueDate && (
                        <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                            <RiCalendarLine />
                            {new Date(dueDate).toLocaleDateString()}
                            <button type="button" onClick={() => setDueDate('')} className="hover:text-primary/70 ml-1">×</button>
                        </div>
                    )}
                    {attachments.map((file, i) => (
                        <div key={i} className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                            <RiAttachment2 className="text-sm" />
                            <span className="max-w-[100px] truncate">{file.name}</span>
                            <button type="button" onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))} className="hover:text-slate-400 ml-1">×</button>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center">
                    <input
                        type="date"
                        id="due-date"
                        className="hidden"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                    <label htmlFor="due-date" className="touch-target text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                        <RiCalendarLine className="text-2xl" />
                    </label>

                    <input
                        type="file"
                        id="attachments"
                        className="hidden"
                        multiple
                        onChange={handleFileChange}
                    />
                    <label htmlFor="attachments" className="touch-target text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                        <RiAttachment2 className="text-2xl" />
                    </label>
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
