import { useState, useRef, useEffect } from 'react';
import Input from './input';
import { Box, Button, IconButton, InputAdornment, Typography, useTheme, List, ListItem, ListItemText } from '@mui/material';
import { locationIcon, mapMarker, mapMarkerBrand, mapMarkerSpace } from '../assets';
import { useGetGeneralLocationQuery } from '../services/general';

const MapModal = ({
    value, setValue, addressLine, address, handleClose, buttonVal, initialPosition, setBrandData, instructionValue, setInstructionValue, disabled, activity
}) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const [map, setMap] = useState(null);
    const [streetAddress, setStreetAddress] = useState(address);
    const theme = useTheme();
    const [isSelecting, setIsSelecting] = useState(false);

    const [position, setPosition] = useState(initialPosition);
    const [suggestions, setSuggestions] = useState([]);
    const autocompleteService = useRef(null); // Persistent reference for AutocompleteService
    const { data, error } = useGetGeneralLocationQuery({ query: value }, {
        skip: !value || value.length < 3 || isSelecting,
    });


    useEffect(() => {
        if (!window.google || !window.google.maps || !window.google.maps.places) return;
        autocompleteService.current = new google.maps.places.AutocompleteService();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mapRef.current && !mapRef.current.contains(event.target)) {
                setSuggestions([]);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);


    const handleSearch = (e) => {
        if (disabled) return;
        setIsSelecting(false)
        setValue(e.target.value);
    };

    useEffect(() => {
        if (data?.status && data?.data) {
            setSuggestions(data.data);
        } else {
            setSuggestions([]);
        }
    }, [data]);

    const handleSelectPlace = (place) => {
        setValue(place.description);
        setSuggestions([]);
        setIsSelecting(true);

        // Fetch details for selected place
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?place_id=${place.placeId}&key=${apiKey}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.results[0]) {
                    const { lat, lng } = data.results[0].geometry.location;
                    const formattedAddress = data.results[0].formatted_address;
                    setPosition([lat, lng]);
                    setStreetAddress(formattedAddress);

                    if (markerRef.current) {
                        markerRef.current.setPosition({ lat, lng });
                    }

                    setBrandData && setBrandData((prevData) => ({
                        ...prevData,
                        location: { lat, long: lng },
                        streetAddress: formattedAddress
                    }));

                    if (map) map.panTo({ lat, lng });
                }
                setSuggestions([]);
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

                    setBrandData  && setBrandData((prevData) => ({
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
            const validLat = typeof position[0] === 'number';
            const validLng = typeof position[1] === 'number';
            
            const initialLat = validLat ? position[0] : 40.0902;
            const initialLng = validLng ? position[1] : -99.7129;

            googleMap = new window.google.maps.Map(mapRef.current, {
                center: { lat: initialLat, lng: initialLng},
                zoom: 10, // Set the initial zoom level
            });

            const customIcon = {
                url: activity === "event" ? mapMarker : activity === "brand" ? mapMarkerBrand : mapMarkerSpace,
                scaledSize: new window.google.maps.Size(32, 32),
                anchor: new window.google.maps.Point(16, 32),
            };

            const marker = new window.google.maps.Marker({
                position: { lat: initialLat, lng: initialLng },
                map: googleMap,
                draggable: false,
                icon: customIcon,
            });

            markerRef.current = marker;
            setMap(googleMap);

            if (validLat && validLng) {
                fetchAddressFromCoordinates(initialLat, initialLng);
            }

            if (!disabled) {
                googleMap.addListener("click", (e) => {
                    const lat = e.latLng.lat();
                    const lng = e.latLng.lng();
                    setPosition([lat, lng]);

                    marker.setPosition({ lat, lng });
                    fetchAddressFromCoordinates(lat, lng);

                    setBrandData && setBrandData((prevData) => ({
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
            const validLat = typeof position[0] === 'number';
            const validLng = typeof position[1] === 'number';

            const initialLat = validLat ? position[0] : 40.0902;
            const initialLng = validLng ? position[1] : -99.7129;

            const newPosition = { lat: initialLat, lng: initialLng };
            markerRef.current.setPosition(newPosition);

            // Optionally center the map on the new position
            map.panTo(newPosition);
        }
    }, [position, map]);

    return (
        <Box sx={{ position: "relative" }}>
            { !disabled && <Input
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
            /> }

            {/* Suggestions List */}
            {suggestions.length > 0 && (
                <Box sx={{ maxHeight: 200, overflowY: 'auto', position: 'absolute', zIndex: 1, width: '100%', backgroundColor: 'white', border: '1px solid #ddd' }}>
                    <List>
                        {suggestions.map((suggestion, index) => (
                            <ListItem component={"button"} key={index} onClick={() => handleSelectPlace(suggestion)} sx={{ cursor: "pointer", backgroundColor:"white" }}>
                                <ListItemText primary={suggestion.description} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}

            <Box sx={{ height: '300px', width: '100%', top: "6px" }} ref={mapRef} />

            <Box sx={{ display: "flex", flexDirection: "column", rowGap: "3px", pt: "8px" }}>
                <Typography variant='h5' sx={{ textAlign: "left", color: theme.palette.primary.main, fontWeight: "600" }}>
                    <span style={{ fontWeight: "300" }}>{addressLine} </span>
                    {streetAddress}
                </Typography>
                { !disabled && <Input disabled={disabled} type={"text"} placeholder={"Additional instructions like entrances, floors..."} value={instructionValue} onInputChange={setInstructionValue} /> }
            </Box>

            { !disabled && <Box sx={{ display: "flex", justifyContent: "flex-end", pt: "10px" }}>
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
            </Box> }
        </Box>
    );
};

export default MapModal;
