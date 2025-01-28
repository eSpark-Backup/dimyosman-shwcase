import { useState, useRef, useEffect } from 'react';
import Input from './input';
import { Box, Button, IconButton, InputAdornment, Typography, useTheme, List, ListItem, ListItemText } from '@mui/material';
import { locationIcon, mapMarker, mapMarkerBrand, mapMarkerSpace } from '../assets';

const MapModal = ({
    value, setValue, addressLine, address, handleClose, buttonVal, initialPosition, setBrandData, instructionValue, setInstructionValue, disabled, activity
}) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const [map, setMap] = useState(null);
    const [streetAddress, setStreetAddress] = useState(address);
    const theme = useTheme();

    const [position, setPosition] = useState(initialPosition);
    const [suggestions, setSuggestions] = useState([]); // New state to store place suggestions

    const handleSearch = (e) => {
        if (disabled) return;
        const query = e.target.value;
        setValue(query);

        if (query.length >= 3) {
            fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${apiKey}`
            )
                .then((response) => response.json())
                .then((data) => {
                    if (data.results[0]) {
                        const lat = data.results[0].geometry.location.lat;
                        const lng = data.results[0].geometry.location.lng;
                        const address = data.results[0].formatted_address;
                        setPosition([lat, lng]);
                        setStreetAddress(address);

                        if (markerRef.current) {
                            markerRef.current.setPosition({ lat, lng });
                        }

                        setBrandData((prevData) => ({
                            ...prevData,
                            location: { lat, long: lng },
                            streetAddress: address
                        }));
                    }
                })
                .catch((error) => console.error("Error fetching location:", error));
        }
    };

    const handleSelectPlace = (place) => {
        setValue(place.description); // Set input value to selected place
        setSuggestions([]); // Clear suggestions after selection

        // Fetch details of the selected place
        fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?place_id=${place.place_id}&key=${apiKey}`
        )
            .then((response) => response.json())
            .then((data) => {
                if (data.results[0]) {
                    const lat = data.results[0].geometry.location.lat;
                    const lng = data.results[0].geometry.location.lng;
                    const address = data.results[0].formatted_address;
                    setPosition([lat, lng]);
                    setStreetAddress(address);

                    if (markerRef.current) {
                        markerRef.current.setPosition({ lat, lng });
                    }

                    setBrandData((prevData) => ({
                        ...prevData,
                        location: { lat, long: lng },
                        streetAddress: address
                    }));
                }
            })
            .catch((error) => console.error("Error fetching location details:", error));
    };

    const fetchAddressFromCoordinates = (lat, lng) => {
        fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
        )
            .then((response) => response.json())
            .then((data) => {
                if (data.results[0]) {
                    const address = data.results[0].formatted_address;
                    setStreetAddress(address);

                    setBrandData((prevData) => ({
                        ...prevData,
                        address,
                        streetAddress: address
                    }));
                }
            })
            .catch((error) => console.error("Error fetching address:", error));
    };

    useEffect(() => {
        let googleMap;
        const initializeMap = () => {
            googleMap = new window.google.maps.Map(mapRef.current, {
                center: { lat: position[0], lng: position[1] },
                zoom: 10, // Set the initial zoom level
            });

            const customIcon = {
                url: activity === "event" ? mapMarker : activity === "brand" ? mapMarkerBrand : mapMarkerSpace,
                scaledSize: new window.google.maps.Size(32, 32),
                anchor: new window.google.maps.Point(16, 32),
            };

            const marker = new window.google.maps.Marker({
                position: { lat: position[0], lng: position[1] },
                map: googleMap,
                draggable: false,
                icon: customIcon,
            });

            markerRef.current = marker;
            setMap(googleMap);

            fetchAddressFromCoordinates(position[0], position[1]);

            if (!disabled) {
                googleMap.addListener("click", (e) => {
                    const lat = e.latLng.lat();
                    const lng = e.latLng.lng();
                    setPosition([lat, lng]);

                    marker.setPosition({ lat, lng });
                    fetchAddressFromCoordinates(lat, lng);

                    setBrandData((prevData) => ({
                        ...prevData,
                        location: { lat, long: lng },
                    }));
                });
            }
        };

        // Initialize the map only once
        if (!map) {
            initializeMap();
        }
    }, [mapRef, disabled]);

    useEffect(() => {
        if (map && markerRef.current) {
            const newPosition = { lat: position[0], lng: position[1] };
            markerRef.current.setPosition(newPosition);

            // Optionally center the map on the new position
            map.panTo(newPosition);
        }
    }, [position, map]);

    return (
        <>
            <Input
                sx={{ border: "1px solid #D1DBD7 !important" }}
                value={value}
                type={"text"}
                placeholder={"Type Address..."}
                onInputChange={handleSearch}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton disabled>
                            <img src={locationIcon} alt="" />
                        </IconButton>
                    </InputAdornment>
                }
                disabled={disabled}
            />

            {/* Suggestions List */}
            {suggestions.length > 0 && (
                <Box sx={{ maxHeight: 200, overflowY: 'auto', position: 'absolute', zIndex: 1, width: '100%', backgroundColor: 'white', border: '1px solid #ddd' }}>
                    <List>
                        {suggestions.map((suggestion) => (
                            <ListItem button key={suggestion.place_id} onClick={() => handleSelectPlace(suggestion)}>
                                <ListItemText primary={suggestion.description} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}

            <Box sx={{ height: '300px', width: '100%' }} ref={mapRef} />

            <Box sx={{ display: "flex", flexDirection: "column", rowGap: "3px" }}>
                <Typography variant='h5' sx={{ textAlign: "left", color: theme.palette.primary.main, fontWeight: "600" }}>
                    <span style={{ fontWeight: "300" }}>{addressLine} </span>
                    {streetAddress}
                </Typography>
                <Input disabled={disabled} type={"text"} placeholder={"Additional instructions like entrances, floors..."} value={instructionValue} onInputChange={setInstructionValue} />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                    sx={{
                        height: "31px",
                        width: "92px",
                        background: "rgba(209, 219, 215, 0.4)",
                        fontSize: "16px",
                        fontWeight: "700",
                        color: theme.palette.primary.main,
                        "&:hover": { backgroundColor: "rgba(209, 219, 215, 0.4)" }
                    }}
                    onClick={handleClose}
                >
                    {buttonVal}
                </Button>
            </Box>
        </>
    );
};

export default MapModal;
