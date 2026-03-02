import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import 'leaflet-routing-machine';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function RoutingMachine({ source, destination }) {
    const map = useMap();

    useEffect(() => {
        if (!map || !source || !destination) return;

        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(source.lat, source.lon),
                L.latLng(destination.lat, destination.lon)
            ],
            routeWhileDragging: false,
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            showAlternatives: false,
            lineOptions: {
                styles: [{ color: '#3B82F6', weight: 4 }]
            }
        }).addTo(map);

        return () => map.removeControl(routingControl);
    }, [map, source, destination]);

    return null;
}

export default function MapComponent({ source, destination, height = "400px" }) {
    const defaultCenter = [20.5937, 78.9629]; // India center
    const center = source ? [source.lat, source.lon] : defaultCenter;

    return (
        <MapContainer
            center={center}
            zoom={source ? 13 : 5}
            style={{ height: height, width: "100%", borderRadius: "0.5rem", zIndex: 0 }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {source && (
                <Marker position={[source.lat, source.lon]}>
                    <Popup>Source: {source.display_name}</Popup>
                </Marker>
            )}

            {destination && (
                <Marker position={[destination.lat, destination.lon]}>
                    <Popup>Destination: {destination.display_name}</Popup>
                </Marker>
            )}

            {source && destination && (
                <RoutingMachine source={source} destination={destination} />
            )}
        </MapContainer>
    );
}
