"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
    username: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string, email: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    // Ideally we should have a /me endpoint, but for now we'll assume valid if token exists
                    // and maybe decode it or fetch user details. 
                    // For MVP, let's just set a dummy user or fetch if we had the endpoint.
                    // Let's add a simple fetch to a protected route to verify token?
                    // Or just decode JWT. For now, we will just set loading false.
                    // TODO: Implement /me endpoint in backend for better auth check.
                    setUser({ username: 'User', email: 'user@example.com' }); // Placeholder
                } catch (error) {
                    console.error("Auth check failed", error);
                    localStorage.removeItem('access_token');
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const response = await api.post('/token/', { username, password });
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            setUser({ username, email: '' }); // We should fetch real user data here
            router.push('/');
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const register = async (username: string, password: string, email: string) => {
        try {
            await api.post('/auth/register/', { username, password, email });
            router.push('/login');
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
