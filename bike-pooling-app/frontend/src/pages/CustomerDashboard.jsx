import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import MapComponent from '../components/MapComponent';
import { geocodeLocation } from '../utils/mapUtils';
import { getOpenRides, createBooking, getBookingsByCustomer, rateUser } from '../services/api';
import { MapPin, Calendar, Clock, DollarSign, Search, Bike, Star } from 'lucide-react';

import NotificationList from '../components/NotificationList';

export default function CustomerDashboard() {
    const { currentUser } = useAuth();
    const [sourceQuery, setSourceQuery] = useState('');
    const [destQuery, setDestQuery] = useState('');
    const [sourceLocation, setSourceLocation] = useState(null);
    const [destLocation, setDestLocation] = useState(null);
    const [availableRides, setAvailableRides] = useState([]);
    const [myBookings, setMyBookings] = useState([]);

    // Rating Modal State
    const [ratingModalOpen, setRatingModalOpen] = useState(false);
    const [selectedBookingForRating, setSelectedBookingForRating] = useState(null);
    const [ratingScore, setRatingScore] = useState(5);
    const [activeTab, setActiveTab] = useState('search'); // search, bookings, notifications

    useEffect(() => {
        if (currentUser?.id) {
            loadBookings();
        }
    }, [currentUser]);

    async function loadBookings() {
        try {
            const bookings = await getBookingsByCustomer(currentUser.id);
            setMyBookings(bookings);
        } catch (error) {
            console.error("Failed to load bookings", error);
        }
    }

    async function handleSearch() {
        if (!sourceQuery || !destQuery) return;
        const source = await geocodeLocation(sourceQuery);
        const dest = await geocodeLocation(destQuery);
        setSourceLocation(source);
        setDestLocation(dest);

        if (source && dest) {
            try {
                const rides = await getOpenRides();
                setAvailableRides(rides);
            } catch (error) {
                console.error("Failed to fetch rides", error);
            }
        }
    }

    async function handleBookRide(ride) {
        if (!currentUser?.id) return;
        try {
            await createBooking({ rideId: ride.id, customerId: currentUser.id });
            alert("Booking request sent!");
            loadBookings();
        } catch (error) {
            alert("Booking failed: " + error.message);
        }
    }

    function openRatingModal(booking) {
        setSelectedBookingForRating(booking);
        setRatingModalOpen(true);
    }

    async function submitRating() {
        if (!selectedBookingForRating) return;
        try {
            // Rate the rider (rider is in booking.ride.rider)
            const riderId = selectedBookingForRating.ride?.rider?.id;
            if (riderId) {
                await rateUser(riderId, ratingScore);
                alert("Rated successfully!");
                setRatingModalOpen(false);
                setSelectedBookingForRating(null);
                // Optionally update local state or re-fetch
            }
        } catch (error) {
            alert("Failed to rate: " + error.message);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex space-x-4 border-b border-gray-200 pb-2">
                <button
                    onClick={() => setActiveTab('search')}
                    className={`px-4 py-2 font-medium ${activeTab === 'search' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Find Ride
                </button>
                <button
                    onClick={() => setActiveTab('bookings')}
                    className={`px-4 py-2 font-medium ${activeTab === 'bookings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    My Bookings
                </button>
                <button
                    onClick={() => setActiveTab('notifications')}
                    className={`px-4 py-2 font-medium ${activeTab === 'notifications' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Notifications
                </button>
            </div>

            {activeTab === 'notifications' && <NotificationList userId={currentUser?.id} />}

            {activeTab === 'search' && (
                <>
                    <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Find a Ride</h3>
                        {/* ... Search Form ... */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <Input label="From" value={sourceQuery} onChange={(e) => setSourceQuery(e.target.value)} />
                            <Input label="To" value={destQuery} onChange={(e) => setDestQuery(e.target.value)} />
                        </div>
                        <Button onClick={handleSearch} className="w-full flex justify-center items-center gap-2">
                            <Search className="h-4 w-4" /> Search Rides
                        </Button>
                        {(sourceLocation || destLocation) && (
                            <div className="mt-4 h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                <MapComponent source={sourceLocation} destination={destLocation} height="100%" />
                            </div>
                        )}
                    </div>

                    {availableRides.length > 0 && (
                        /* ... Available Rides ... */
                        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mt-6">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Available Rides</h3>
                            <div className="space-y-4">
                                {availableRides.map(ride => (
                                    <div key={ride.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                        {/* ... ride details ... */}
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2 font-semibold">
                                                    <Bike className="h-5 w-5 text-gray-700" />
                                                    {ride.rider?.name || "Rider"}
                                                    <span className="text-xs text-yellow-500 flex items-center">
                                                        <Star className="h-3 w-3 fill-current" /> {ride.rider?.averageRating?.toFixed(1) || "5.0"}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-gray-500 mt-1">
                                                    {ride.sourceName?.split(',')[0]} → {ride.destinationName?.split(',')[0]}
                                                </div>
                                                <div className="flex gap-4 mt-2 text-sm text-gray-600">
                                                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {ride.date}</span>
                                                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {ride.time}</span>
                                                    <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> ₹{ride.price}</span>
                                                </div>
                                            </div>
                                            <Button onClick={() => handleBookRide(ride)}>Book Ride</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {activeTab === 'bookings' && (
                <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Your Bookings</h3>
                    {myBookings.length === 0 ? <p className="text-gray-500">No bookings yet.</p> : (
                        <div className="space-y-4">
                            {myBookings.map(booking => (
                                <div key={booking.id} className="border rounded-lg p-4 flex justify-between items-center">
                                    <div>
                                        <div className="font-medium text-gray-900">
                                            <div className="flex items-center gap-2">
                                                <span className="text-blue-600">{booking.ride?.sourceName?.split(',')[0]}</span>
                                                <span className="text-gray-400">→</span>
                                                <span className="text-red-600">{booking.ride?.destinationName?.split(',')[0]}</span>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {booking.ride?.date} at {booking.ride?.time} • Rider: {booking.ride?.rider?.name}
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Status: <span className={`font-semibold ${booking.status === 'APPROVED' ? 'text-green-600' :
                                                booking.status === 'REJECTED' ? 'text-red-600' : 'text-yellow-600'
                                                }`}>{booking.status}</span>
                                            {booking.ride?.status === 'COMPLETED' && <span className="ml-2 text-blue-600">(Ride Completed)</span>}
                                        </div>
                                    </div>
                                    {booking.status === 'APPROVED' && booking.ride?.status === 'COMPLETED' && (
                                        <Button
                                            onClick={() => openRatingModal(booking)}
                                            variant="outline"
                                            className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                                        >
                                            Rate Rider
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Rating Modal */}
            {ratingModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full space-y-4">
                        <h3 className="text-lg font-bold">Rate Rider</h3>
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    onClick={() => setRatingScore(star)}
                                    className={`text-2xl ${ratingScore >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={submitRating} className="flex-1">Submit</Button>
                            <Button onClick={() => setRatingModalOpen(false)} variant="secondary" className="flex-1">Cancel</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
