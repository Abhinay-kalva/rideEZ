import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Bike, LogOut, User } from 'lucide-react';
import Button from './Button';

export default function Layout({ children }) {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    async function handleLogout() {
        try {
            setLoading(true);
            await logout();
            navigate('/login');
        } catch {
            console.error("Failed to log out");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 font-inter">
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                                <Bike className="h-8 w-8 text-blue-600" />
                                <span className="font-bold text-xl text-gray-900">RideEasy</span>
                            </Link>
                        </div>

                        <div className="flex items-center gap-4">
                            {currentUser ? (
                                <>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <User className="h-5 w-5" />
                                        <span className="hidden sm:inline">{currentUser.email}</span>
                                    </div>
                                    <Button variant="outline" onClick={handleLogout} disabled={loading} className="flex items-center gap-2">
                                        <LogOut className="h-4 w-4" />
                                        <span>Log Out</span>
                                    </Button>
                                </>
                            ) : (
                                <div className="space-x-4">
                                    <Link to="/login">
                                        <Button variant="outline">Sign In</Button>
                                    </Link>
                                    <Link to="/register">
                                        <Button>Sign Up</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
