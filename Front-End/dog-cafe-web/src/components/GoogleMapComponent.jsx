import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '100%',
};

const center = {
    lat: 22.341831620527756,
    lng: 114.13623103275536,
};

const GoogleMapComponent = () => {
    console.log(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
    return (
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}>
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={17}>
                <Marker position={center} />
            </GoogleMap>
        </LoadScript>
    );
};


export default GoogleMapComponent;
