import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { RiCloseLine } from 'react-icons/ri';

const BottomSheet = ({ isOpen, onClose, title, children }) => {
    const sheetRef = useRef(null);
    const backdropRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            gsap.fromTo(sheetRef.current,
                { y: '100%' },
                { y: '0%', duration: 0.5, ease: 'back.out(1.2)' }
            );
            gsap.fromTo(backdropRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.3 }
            );
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
            <div
                ref={backdropRef}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div
                ref={sheetRef}
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative w-full max-w-xl bg-white border-t border-border rounded-t-[40px] p-8 pb-14 shadow-2xl safe-bottom focus:outline-none"
            >
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-slate-200 rounded-full" />

                <div className="flex items-center justify-between mb-8 pt-2">
                    <h2 className="text-2xl font-bold text-foreground">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-3 hover:bg-secondary rounded-full transition-colors"
                    >
                        <RiCloseLine className="text-2xl text-muted-foreground" />
                    </button>
                </div>

                {children}
            </motion.div>
        </div>
    );
};

export default BottomSheet;
