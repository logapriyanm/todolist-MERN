import React from 'react';
import BottomNav from './BottomNav';
import { cn } from '../utils/cn';
import {
    RiCalendarTodoLine,
    RiFileListLine,
    RiBarChartLine,
    RiDeleteBinLine,
    RiAddLine,
    RiLogoutBoxLine
} from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children, currentFilter, setFilter, onAddClick }) => {
    const { user, logout } = useAuth();
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
            {/* Desktop Side Navigation */}
            <aside className="hidden md:flex w-72 h-screen fixed left-0 top-0 border-r border-border bg-card p-8 flex-col gap-8">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <span className="text-white font-bold text-xl font-display">L</span>
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-foreground">Loop</span>
                </div>

                <nav className="flex-1 space-y-2">
                    {[
                        { id: 'all', label: 'All Tasks', icon: RiCalendarTodoLine },
                        { id: 'active', label: 'Active', icon: RiFileListLine },
                        { id: 'completed', label: 'Done', icon: RiBarChartLine },
                        { id: 'trash', label: 'Trash', icon: RiDeleteBinLine },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setFilter(item.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-semibold text-sm",
                                currentFilter === item.id
                                    ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]"
                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                            )}
                        >
                            <item.icon className="text-xl" />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="pt-6 border-t border-border space-y-4">

                    <div className="flex items-center gap-3 p-2 bg-secondary/50 rounded-2xl">
                        <div className="w-10 h-10 bg-white border border-border rounded-xl flex items-center justify-center font-bold text-primary">
                            {user?.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">{user?.name}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-xl transition-all"
                            title="Logout"
                        >
                            <RiLogoutBoxLine className="text-xl" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-72 min-h-screen">
                <div className="max-w-5xl mx-auto px-4 py-6 md:px-6 md:py-16">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden">
                <BottomNav
                    activeTab={currentFilter}
                    onTabChange={setFilter}
                    onAddClick={() => onAddClick?.()}
                />
            </div>
        </div>
    );
};

export default Layout;
