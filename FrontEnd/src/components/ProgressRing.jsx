import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const ProgressRing = ({ progress = 0 }) => {
    const circleRef = useRef(null);
    const textRef = useRef(null);
    const size = 100;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;

    useEffect(() => {
        const offset = circumference - (progress / 100) * circumference;
        gsap.to(circleRef.current, {
            strokeDashoffset: offset,
            duration: 1.5,
            ease: "power2.out",
        });

        gsap.fromTo(textRef.current,
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, delay: 0.5 }
        );
    }, [progress, circumference]);

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    className="text-slate-100"
                />
                <circle
                    ref={circleRef}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference}
                    strokeLinecap="round"
                    className="text-primary"
                />
            </svg>
            <div ref={textRef} className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold">{Math.round(progress)}%</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Done</span>
            </div>
        </div>
    );
};

export default ProgressRing;
