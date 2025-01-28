import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { mapMarker } from '../assets';

const MapDisplay = React.memo(({ locations }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
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
    if (map) {
      // Clear previous markers to prevent duplication
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      const customIcon = {
        url: mapMarker,
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
      if (locations.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        locations.forEach((loc) => bounds.extend({ lat: loc.lat, lng: loc.long }));
        map.fitBounds(bounds);
      }
    }
  }, [locations]);

  return (
    <Box sx={{ height: '100%', width: '100%' }} ref={mapRef} />
  );
});

export default MapDisplay;
