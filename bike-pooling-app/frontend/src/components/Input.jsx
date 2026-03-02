import React from 'react';

export default function Input({ label, type = "text", className = "", ...props }) {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
            <input
                type={type}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                {...props}
            />
        </div>
    );
}
