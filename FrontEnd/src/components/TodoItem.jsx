import React, { useRef } from 'react';
import { useTodos } from '../context/TodoContext';
import {
    RiCheckboxCircleFill,
    RiCheckboxBlankCircleLine,
    RiDeleteBinLine,
    RiTimeLine,
    RiRefreshLine,
    RiAttachment2,
    RiCheckLine
} from 'react-icons/ri';
import { motion, useAnimation } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { gsap } from 'gsap';
import { cn } from '../utils/cn';

const TodoItem = ({ todo, isTrash }) => {
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

    return (
        <motion.div
            {...handlers}
            ref={itemRef}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="group relative bg-white border border-border rounded-xl p-3 flex items-center gap-3 transition-all active:scale-[0.98] hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20"
        >
            {!isTrash && (
                <button
                    onClick={handleToggle}
                    className="touch-target transition-transform active:scale-90"
                >
                    {todo.status === 'Done' ? (
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
                            <RiCheckLine className="text-white text-lg" />
                        </div>
                    ) : (
                        <div className="w-6 h-6 border-2 border-slate-300 rounded-full hover:border-primary transition-colors" />
                    )}
                </button>
            )}

            <div className="flex-1 min-w-0" onClick={() => !isTrash && handleToggle()}>
                <h3 className={cn(
                    "font-bold text-base transition-all leading-tight",
                    todo.status === 'Done' ? "text-muted-foreground line-through opacity-40" : "text-foreground"
                )}>
                    {todo.title}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                    {todo.dueDate && (
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-semibold">
                            <RiTimeLine className="text-sm" />
                            {new Date(todo.dueDate).toLocaleDateString()}
                        </div>
                    )}
                    {todo.attachments?.length > 0 && (
                        <div className="flex items-center gap-1 text-[10px] text-primary/80 font-bold">
                            <RiAttachment2 className="text-sm" />
                            {todo.attachments.length}
                        </div>
                    )}
                </div>
            </div>

            {isTrash && (
                <div className="flex gap-2">
                    <button
                        onClick={() => { handleVibrate(10); restoreTodo(todo._id); }}
                        className="touch-target text-slate-400 hover:text-emerald-500 transition-colors bg-slate-50 rounded-xl"
                        title="Restore"
                    >
                        <RiRefreshLine className="text-xl" />
                    </button>
                    <button
                        onClick={() => {
                            if (window.confirm('Permanently delete?')) {
                                handleVibrate(50);
                                permanentlyDeleteTodo(todo._id);
                            }
                        }}
                        className="touch-target text-slate-400 hover:text-destructive transition-colors bg-slate-50 rounded-xl"
                        title="Delete"
                    >
                        <RiDeleteBinLine className="text-xl" />
                    </button>
                </div>
            )}
        </motion.div>
    );
};

export default TodoItem;
