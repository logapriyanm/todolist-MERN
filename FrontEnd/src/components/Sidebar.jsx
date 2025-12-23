import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
    RiHome4Line,
    RiCheckboxCircleLine,
    RiTimeLine,
    RiStarLine,
    RiDeleteBin7Line,
    RiLogoutBoxRLine,
    RiSettings4Line
} from 'react-icons/ri';

const Sidebar = ({ currentFilter, setFilter }) => {
    const { user, logout } = useAuth();

    const menuItems = [
        { id: 'all', icon: RiHome4Line, label: 'All Tasks' },
        { id: 'active', icon: RiTimeLine, label: 'Active' },
        { id: 'completed', icon: RiCheckboxCircleLine, label: 'Completed' },
        { id: 'priority', icon: RiStarLine, label: 'High Priority' },
        { id: 'trash', icon: RiDeleteBin7Line, label: 'Trash' },
    ];

    return (
        <div className="w-72 bg-[#0f172a] h-screen border-r border-white/5 flex flex-col p-6 fixed left-0 top-0 z-20">
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <RiCheckboxCircleLine className="text-2xl text-white" />
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Antigravity</h2>
            </div>

            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setFilter(item.id)}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group ${currentFilter === item.id
                                ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20'
                                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
                            }`}
                    >
                        <item.icon className={`text-xl ${currentFilter === item.id ? 'text-purple-400' : 'group-hover:text-slate-200'}`} />
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="mt-auto space-y-4 pt-6 border-t border-white/5">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 overflow-hidden">
                        {user?.avatar ? (
                            <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold">
                                {user?.name?.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-semibold text-slate-200 truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-all border border-transparent"
                >
                    <RiLogoutBoxRLine className="text-xl" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
