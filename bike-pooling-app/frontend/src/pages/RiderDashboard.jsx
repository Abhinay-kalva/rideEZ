import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import MapComponent from '../components/MapComponent';
import { geocodeLocation } from '../utils/mapUtils';
import { createRide, getRidesByRider, completeRide, getRiderBookings, updateBookingStatus } from '../services/api'; // API imports
import { MapPin, Calendar, Clock, DollarSign, User } from 'lucide-react';
import NotificationList from '../components/NotificationList';

export default function RiderDashboard() {
    const { currentUser } = useAuth();
    const [sourceQuery, setSourceQuery] = useState('');
    const [destQuery, setDestQuery] = useState('');
    const [sourceLocation, setSourceLocation] = useState(null);
    const [destLocation, setDestLocation] = useState(null);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [price, setPrice] = useState('');
    const [rides, setRides] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('post');

    useEffect(() => {
        if (currentUser?.id) {
            loadRides();
            loadBookings();
        }
    }, [currentUser]);

    // Refresh bookings when tab switches to requests
    useEffect(() => {
        if (currentUser?.id && activeTab === 'requests') {
            loadBookings();
        }
    }, [activeTab]);

    async function loadRides() {
        try {
            const myRides = await getRidesByRider(currentUser.id);
            setRides(myRides);
        } catch (error) {
            console.error("Failed to load rides", error);
        }
    }

    async function loadBookings() {
        try {
            const data = await getRiderBookings(currentUser.id);
            // Sort: Pending first
            const sorted = data.sort((a, b) => {
                if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
                if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
                return new Date(b.id) - new Date(a.id);
            });
            setBookings(sorted);
        } catch (error) {
            console.error("Failed to load bookings", error);
        }
    }

    async function handleSearchSource() {
        if (!sourceQuery) return;
        const loc = await geocodeLocation(sourceQuery);
        if (loc) setSourceLocation(loc);
    }

    async function handleSearchDest() {
        if (!destQuery) return;
        const loc = await geocodeLocation(destQuery);
        if (loc) setDestLocation(loc);
    }

    async function handlePostRide(e) {
        e.preventDefault();
        if (!sourceLocation || !destLocation || !date || !time || !price) {
            alert("Please fill all fields and select valid locations.");
            return;
        }

        const rideData = {
            riderId: currentUser.id,
            sourceName: sourceLocation.display_name,
            sourceLat: sourceLocation.lat,
            sourceLon: sourceLocation.lon,
            destinationName: destLocation.display_name,
            destinationLat: destLocation.lat,
            destinationLon: destLocation.lon,
            date,
            time,
            price: parseFloat(price)
        };

        try {
            await createRide(rideData);
            alert("Ride posted successfully!");
            loadRides(); // Refresh list
            // Reset form
            setSourceQuery('');
            setDestQuery('');
            setSourceLocation(null);
            setDestLocation(null);
            setDate('');
            setTime('');
            setPrice('');
        } catch (error) {
            alert("Failed to post ride: " + error.message);
        }
    }

    async function handleCompleteRide(rideId) {
        try {
            await completeRide(rideId);
            loadRides();
        } catch (error) {
            alert("Failed to complete ride");
        }
    }

    async function handleBookingAction(bookingId, status) {
        try {
            await updateBookingStatus(bookingId, status);
            alert(`Booking ${status}`);
            loadBookings();
        } catch (error) {
            alert("Failed to update status: " + error.message);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex space-x-4 border-b border-gray-200 pb-2 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('post')}
                    className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'post' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Post Ride
                </button>
                <button
                    onClick={() => setActiveTab('rides')}
                    className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'rides' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    My Rides
                </button>
                <button
                    onClick={() => setActiveTab('requests')}
                    className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'requests' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Requests {bookings.filter(b => b.status === 'PENDING').length > 0 && <span className="ml-1 bg-red-100 text-red-600 px-2 rounded-full text-xs">{bookings.filter(b => b.status === 'PENDING').length}</span>}
                </button>
                <button
                    onClick={() => setActiveTab('notifications')}
                    className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'notifications' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Notifications
                </button>
            </div>

            {activeTab === 'notifications' && <NotificationList userId={currentUser?.id} />}

            {activeTab === 'post' && (
                <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                    {/* Post Ride Form (Same as before) */}
                    <form onSubmit={handlePostRide} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex gap-2 items-end">
                                <div className="flex-1">
                                    <Input label="From" value={sourceQuery} onChange={(e) => setSourceQuery(e.target.value)} />
                                </div>
                                <Button type="button" onClick={handleSearchSource} variant="secondary">Search</Button>
                            </div>
                            <div className="flex gap-2 items-end">
                                <div className="flex-1">
                                    <Input label="To" value={destQuery} onChange={(e) => setDestQuery(e.target.value)} />
                                </div>
                                <Button type="button" onClick={handleSearchDest} variant="secondary">Search</Button>
                            </div>
                        </div>
                        <div className="h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                            <MapComponent source={sourceLocation} destination={destLocation} height="100%" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
                            <Input label="Time" type="time" value={time} onChange={e => setTime(e.target.value)} required />
                            <Input label="Price (₹)" type="number" value={price} onChange={e => setPrice(e.target.value)} required />
                        </div>
                        <Button type="submit" className="w-full">Post Ride</Button>
                    </form>
                </div>
            )}

            {activeTab === 'rides' && (
                <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                    <div className="space-y-4">
                        {rides.map(ride => (
                            <div key={ride.id} className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                                        <MapPin className="h-5 w-5 text-blue-500" />
                                        {ride.sourceName?.split(',')[0]}
                                        <span className="text-gray-400">→</span>
                                        <MapPin className="h-5 w-5 text-red-500" />
                                        {ride.destinationName?.split(',')[0]}
                                    </div>
                                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                                        <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {ride.date}</span>
                                        <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {ride.time}</span>
                                        <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" /> ₹{ride.price}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ride.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                            {ride.status}
                                        </span>
                                    </div>
                                </div>
                                {ride.status !== 'COMPLETED' && (
                                    <Button onClick={() => handleCompleteRide(ride.id)} className="bg-green-600 hover:bg-green-700">
                                        Money Paid & Complete
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'requests' && (
                <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Booking Requests</h3>
                    {bookings.length === 0 ? <p className="text-gray-500">No bookings yet.</p> : (
                        <div className="space-y-4">
                            {bookings.map(booking => (
                                <div key={booking.id} className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 font-semibold text-gray-900">
                                            <User className="h-5 w-5 text-gray-500" />
                                            {booking.customer?.name}
                                            <span className="text-xs text-yellow-500 flex items-center">
                                                ★ {booking.customer?.averageRating?.toFixed(1) || "New"}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">
                                            Requested for: <span className="font-medium">{booking.ride?.sourceName?.split(',')[0]} → {booking.ride?.destinationName?.split(',')[0]}</span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            Status: <span className={`font-semibold ${booking.status === 'APPROVED' ? 'text-green-600' :
                                                booking.status === 'REJECTED' ? 'text-red-600' : 'text-yellow-600'
                                                }`}>{booking.status}</span>
                                        </div>
                                    </div>
                                    {booking.status === 'PENDING' && (
                                        <div className="flex gap-2">
                                            <Button onClick={() => handleBookingAction(booking.id, 'APPROVED')} className="bg-green-600 hover:bg-green-700 text-sm py-1">
                                                Approve
                                            </Button>
                                            <Button onClick={() => handleBookingAction(booking.id, 'REJECTED')} variant="secondary" className="text-red-600 hover:bg-red-50 text-sm py-1 border border-red-200">
                                                Reject
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
