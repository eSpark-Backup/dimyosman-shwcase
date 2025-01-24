import { useState, useRef, useEffect } from 'react'
import Input from './input'
import { Box, Button, IconButton, InputAdornment, Typography, useTheme } from '@mui/material'
import { locationIcon, mapMarker } from '../assets'

const MapModal = ({
  value, setValue, addressLine, address, handleClose, buttonVal, initialPosition, setBrandData, instructionValue, setInstructionValue, disabled
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [streetAddress, setStreetAddress] = useState(address);
  const theme = useTheme()

  const [position, setPosition] = useState(initialPosition)

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
    const initializeMap = async () => {
      const googleMap = new window.google.maps.Map(mapRef.current, {
        center: { lat: position[0], lng: position[1] },
        zoom: 6,
      });

      const customIcon = {
        url: mapMarker,
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

      setMap(googleMap);
    };

    initializeMap();
  }, [mapRef, position, disabled]);

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
            <IconButton>
              <img src={locationIcon} alt="" />
            </IconButton>
          </InputAdornment>
        }
        disabled={disabled}

      />

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
  )
}

export default MapModal
