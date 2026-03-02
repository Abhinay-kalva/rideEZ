import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { Bike, User, ShieldCheck } from 'lucide-react';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [role, setRole] = useState('CUSTOMER'); // 'CUSTOMER' or 'RIDER'
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        if (password !== passwordConfirm) {
            return setError('Passwords do not match');
        }

        try {
            setError('');
            setLoading(true);
            await signup(email, password, name, role);
            navigate('/');
        } catch (err) {
            setError('Failed to create an account: ' + err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div className="text-center">
                    <Bike className="mx-auto h-12 w-12 text-blue-600" />
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create your account</h2>
                </div>
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">{error}</div>}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div
                            onClick={() => setRole('CUSTOMER')}
                            className={`cursor-pointer p-4 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${role === 'CUSTOMER' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                            <User className={`h-8 w-8 mb-2 ${role === 'CUSTOMER' ? 'text-blue-600' : 'text-gray-400'}`} />
                            <span className={`font-medium ${role === 'CUSTOMER' ? 'text-blue-900' : 'text-gray-500'}`}>Customer</span>
                        </div>
                        <div
                            onClick={() => setRole('RIDER')}
                            className={`cursor-pointer p-4 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${role === 'RIDER' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                            <ShieldCheck className={`h-8 w-8 mb-2 ${role === 'RIDER' ? 'text-blue-600' : 'text-gray-400'}`} />
                            <span className={`font-medium ${role === 'RIDER' ? 'text-blue-900' : 'text-gray-500'}`}>Rider</span>
                        </div>
                    </div>

                    <div className="rounded-md shadow-sm space-y-4">
                        <Input
                            label="Full Name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                        />
                        <Input
                            label="Email address"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                        <Input
                            label="Password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a password"
                        />
                        <Input
                            label="Confirm Password"
                            type="password"
                            required
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            placeholder="Confirm your password"
                        />
                    </div>

                    <Button type="submit" className="w-full flex justify-center" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </Button>

                    <div className="text-sm text-center">
                        <span className="text-gray-500">Already have an account? </span>
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
