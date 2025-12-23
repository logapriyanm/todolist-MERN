import React, { useRef } from 'react';
import { useTodos } from '../context/TodoContext';
import {
    RiCheckboxCircleFill,
    RiCheckboxBlankCircleLine,
    RiDeleteBinLine,
    RiTimeLine,
    RiRefreshLine,
    RiCheckLine,
    RiGoogleFill,
    RiFileList2Line,
    RiPriceTag3Line,
    RiFlag2Line
} from 'react-icons/ri';
import { motion, useAnimation } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { gsap } from 'gsap';
import { cn } from '../utils/cn';

const TodoItem = ({ todo, isTrash, isActive }) => {
    const { updateTodo, deleteTodo, restoreTodo, permanentlyDeleteTodo } = useTodos();
    const controls = useAnimation();
    const itemRef = useRef(null);

    const handleVibrate = (strength = 10) => {
        if (window.navigator.vibrate) {
            window.navigator.vibrate(strength);
        }
    };

    const animateCheck = () => {
        const tl = gsap.timeline();
        const burst = document.createElement('div');
        burst.className = 'checkmark-burst w-12 h-12 bg-primary/20 rounded-full absolute pointer-events-none z-10';
        itemRef.current.appendChild(burst);

        tl.fromTo(burst,
            { scale: 0, opacity: 0.8 },
            { scale: 2.5, opacity: 0, duration: 0.6, ease: "expo.out", onComplete: () => burst.remove() }
        );

        // Add a small scale bounce to the whole card
        gsap.to(itemRef.current, { scale: 0.98, duration: 0.1, yoyo: true, repeat: 1 });
    };

    const handlers = useSwipeable({
        onSwipedLeft: () => !isTrash && handleDelete(),
        onSwipedRight: () => !isTrash && handleToggle(),
        trackMouse: true,
        preventDefaultTouchmoveEvent: true
    });

    const handleToggle = async () => {
        handleVibrate(20);
        const nextStatus = todo.status === 'Done' ? 'Todo' : 'Done';
        if (nextStatus === 'Done') animateCheck();
        await updateTodo(todo._id, { status: nextStatus });
    };

    const handleDelete = async () => {
        handleVibrate(40);
        await deleteTodo(todo._id);
    };

    const categories = {
        Work: { icon: RiFileList2Line, color: 'text-indigo-600' },
        Food: { icon: RiPriceTag3Line, color: 'text-orange-500' },
        Sport: { icon: RiFlag2Line, color: 'text-emerald-500' },
        Idea: { icon: RiFlag2Line, color: 'text-amber-500' }, // Placeholder icons
        Music: { icon: RiFlag2Line, color: 'text-purple-500' },
    };

    const category = categories[todo.category] || categories.Work;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-start gap-4 group relative"
        >
            {/* Time Indicator */}
            <div className="w-16 pt-3 flex flex-col items-end gap-1 shrink-0">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                    {todo.dueTime || '10:30'}
                </span>
                <span className="text-[8px] font-bold text-slate-300 uppercase">
                    1 hour
                </span>
            </div>

            {/* Timeline Node */}
            <div className="absolute left-[7px] top-4 w-2 h-2 rounded-full border-2 border-primary bg-white z-10 shadow-sm" />

            {/* Content Card */}
            <div
                className={cn(
                    "flex-1 p-5 rounded-[24px] border transition-all relative overflow-hidden",
                    isActive
                        ? "bg-primary text-white border-primary shadow-2xl shadow-primary/30 active:scale-95"
                        : "bg-white text-slate-900 border-slate-100 shadow-sm hover:border-slate-200"
                )}
            >
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        {!isTrash && (
                            <button
                                onClick={handleToggle}
                                className={cn(
                                    "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                                    todo.status === 'Done'
                                        ? "bg-white border-white text-primary"
                                        : isActive ? "border-white/30" : "border-slate-200"
                                )}
                            >
                                {todo.status === 'Done' && <RiCheckLine className="text-lg font-bold" />}
                            </button>
                        )}
                        <h3 className={cn(
                            "font-bold text-sm leading-tight",
                            todo.status === 'Done' && "line-through opacity-50"
                        )}>
                            {todo.title}
                        </h3>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                        <category.icon className={cn("text-xs", isActive ? "text-white/70" : category.color)} />
                        <span className={cn("text-[10px] font-bold", isActive ? "text-white/60" : "text-slate-400")}>
                            {todo.dueTime || '10:30'} - 11:30
                        </span>
                    </div>
                    {isTrash && (
                        <button onClick={handleDelete} className="text-rose-500 hover:scale-110 transition-transform">
                            <RiDeleteBinLine className="text-lg" />
                        </button>
                    )}
                </div>

                {isActive && (
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl pointer-events-none" />
                )}
            </div>
        </motion.div>
    );
};

export default TodoItem;
