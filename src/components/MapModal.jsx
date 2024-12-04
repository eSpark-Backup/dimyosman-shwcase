import React, { useState, useEffect } from 'react'
import Input from './input'
import { Box, Button, IconButton, InputAdornment, Typography, useTheme } from '@mui/material'
import { locationIcon, mapMarker } from '../assets'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import "leaflet/dist/leaflet.css"

const MapModal = ({
    value, setValue, addressLine, address, handleClose, buttonVal, initialPosition, setBrandData
}) => {
    const theme = useTheme()

    const [position, setPosition] = useState(initialPosition)

    const customIcon = new L.Icon({
        iconUrl: mapMarker,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    })

    const MapEvents = () => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng
                console.log("Map clicked at:", lat, lng)
                setPosition([lat, lng])

                // Update the brandData in the parent component with the new position
                setBrandData(prevData => ({
                    ...prevData,
                    location: { lat, long: lng }
                }))
            }
        })
        return null
    }

    return (
        <>
            <Input
                sx={{ border: "1px solid #D1DBD7 !important" }}
                value={value}
                type={"text"}
                placeholder={"Type Address..."}
                onInputChange={(e) => setValue(e.target.value)}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton>
                            <img src={locationIcon} alt="" />
                        </IconButton>
                    </InputAdornment>
                }
            />

            <Box sx={{ height: '300px', width: '100%' }}>
                <MapContainer center={position} zoom={6} style={{ width: '100%', height: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <MapEvents />
                    <Marker position={position} icon={customIcon} />
                </MapContainer>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", rowGap: "3px" }}>
                <Typography variant='h5' sx={{ textAlign: "left", color: theme.palette.primary.main, fontWeight: "600" }}>
                    <span style={{ fontWeight: "300" }}>{addressLine} </span>
                    {address}
                </Typography>
                <Input type={"text"} placeholder={"Additional instructions like entrances, floors..."} />
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

