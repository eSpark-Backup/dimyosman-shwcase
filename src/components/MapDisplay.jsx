import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';

const MapDisplay = React.memo(({ locations, marker, mapRef, map, setMap }) => {
  const markersRef = useRef([]); 

  useEffect(() => {
    if (!map) {
      const googleMap = new window.google.maps.Map(mapRef.current, {
        center: { lat: 28.40680267823096, lng: 68.2791477297778 },
        zoom: 6,
      });
      setMap(googleMap);
    }
  }, []);

  useEffect(() => {
    if (map && locations && locations.length > 0) {
      // Clear previous markers to prevent duplication
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      const customIcon = {
        url: marker,
        scaledSize: new window.google.maps.Size(32, 32),
        anchor: new window.google.maps.Point(16, 32),
      };

      locations.forEach((location) => {
        const marker = new window.google.maps.Marker({
          position: { lat: location.lat, lng: location.long },
          map: map,
          draggable: false,
          icon: customIcon,
        });

        markersRef.current.push(marker);
      });

      // Optionally fit map to show all markers
      const bounds = new window.google.maps.LatLngBounds();
      locations.forEach((loc) => bounds.extend({ lat: loc.lat, lng: loc.long }));
      map.fitBounds(bounds);
    }
  }, [map, locations]);

  return (
    <Box sx={{ height: '400px', width: '100%' }} ref={mapRef} />
  );
});

const MapWithKey = ({ locations, marker, mapRef, map, setMap }) => (
  <MapDisplay key={JSON.stringify(locations)} locations={locations} marker={marker} mapRef={mapRef} map={map} setMap={setMap} />
);

export default MapWithKey;
