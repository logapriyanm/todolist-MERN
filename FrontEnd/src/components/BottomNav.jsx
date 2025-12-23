import React from 'react';
import { RiCalendarTodoLine, RiFileListLine, RiBarChartLine, RiUserLine, RiAddLine } from 'react-icons/ri';
import { cn } from '../utils/cn';

const BottomNav = ({ activeTab, onTabChange, onAddClick }) => {
    const tabs = [
        { id: 'all', icon: RiCalendarTodoLine, label: 'Today' },
        { id: 'active', icon: RiFileListLine, label: 'Active' },
        { id: 'add', isFab: true },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border safe-bottom h-20 px-4 flex items-center justify-around">
            {tabs.map((tab) => {
                if (tab.isFab) {
                    return (
                        <button
                            key="add"
                            onClick={onAddClick}
                            className="relative -top-8 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-xl shadow-primary/40 active:scale-90 transition-transform"
                        >
                            <RiAddLine className="text-3xl text-white" />
                        </button>
                    );
                }

                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={cn(
                            "flex flex-col items-center gap-1 transition-all touch-target",
                            isActive ? "text-primary scale-110" : "text-muted-foreground"
                        )}
                    >
                        <tab.icon className="text-2xl" />
                        <span className="text-[10px] font-medium">{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default BottomNav;
