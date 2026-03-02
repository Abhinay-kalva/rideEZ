import React, { useEffect, useState } from 'react';
import { getNotifications, markNotificationRead } from '../services/api';
import { Bell, Check } from 'lucide-react';

export default function NotificationList({ userId }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNotifications();
        // Poll every 30 seconds for new notifications (simple real-time sim)
        const interval = setInterval(loadNotifications, 30000);
        return () => clearInterval(interval);
    }, [userId]);

    async function loadNotifications() {
        try {
            const data = await getNotifications(userId);
            setNotifications(data);
        } catch (error) {
            console.error("Failed to load notifications", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleMarkRead(id) {
        try {
            await markNotificationRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error("Failed to mark read", error);
        }
    }

    if (loading) return <div className="p-4 text-gray-500">Loading notifications...</div>;

    if (notifications.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow-sm">
                <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No notifications yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {notifications.map(notification => (
                <div
                    key={notification.id}
                    className={`p-4 rounded-lg shadow-sm border-l-4 transition-all ${notification.read ? 'bg-gray-50 border-gray-300' : 'bg-white border-blue-500 shadow-md'
                        }`}
                >
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                                {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                {new Date(notification.timestamp).toLocaleString()}
                            </p>
                        </div>
                        {!notification.read && (
                            <button
                                onClick={() => handleMarkRead(notification.id)}
                                className="ml-2 p-1 text-blue-600 hover:bg-blue-50 rounded-full"
                                title="Mark as read"
                            >
                                <Check className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
