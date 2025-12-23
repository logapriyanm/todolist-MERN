import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { gsap } from 'gsap';
import toast from 'react-hot-toast';
import { RiUserLine, RiMailLine, RiLockLine, RiArrowRightUpLine } from 'react-icons/ri';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();
    const formRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline();
        tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 1 })
            .fromTo(formRef.current.children,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" },
                "-=0.5"
            );
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password);
            toast.success('Welcome to Loop! 🌈');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div ref={containerRef} className="min-h-screen flex items-center justify-center bg-white text-foreground p-6 selection:bg-primary/20">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[10%] left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-lg">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black tracking-tight mb-3">Create Account</h1>
                    <p className="text-muted-foreground text-lg">Join the Loop community.</p>
                </div>

                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="bg-white border border-border p-10 rounded-[40px] shadow-2xl shadow-black/5 space-y-6"
                >
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground/70 ml-1">Full Name</label>
                        <div className="relative">
                            <RiUserLine className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xl" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-slate-50 border border-border rounded-2xl pl-12 pr-4 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-muted-foreground/50 font-medium"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground/70 ml-1">Email</label>
                        <div className="relative">
                            <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xl" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-50 border border-border rounded-2xl pl-12 pr-4 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-muted-foreground/50 font-medium"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground/70 ml-1">Password</label>
                        <div className="relative">
                            <RiLockLine className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xl" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-50 border border-border rounded-2xl pl-12 pr-4 py-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-muted-foreground/50 font-medium"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-primary/25 flex items-center justify-center gap-2 group mt-4 h-16"
                    >
                        Sign Up
                        <RiArrowRightUpLine className="text-xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>

                    <div className="pt-4 text-center">
                        <p className="text-muted-foreground font-medium">
                            Already have an account? {' '}
                            <Link to="/login" className="text-primary hover:underline font-bold transition-colors">Sign In</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
