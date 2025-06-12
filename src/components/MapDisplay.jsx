import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Box } from "@mui/material";

import { addHyphenToName } from "../utils";

import { setShouldReturn } from "../store/slices/search";

const MapDisplay = React.memo(
  ({ locations, marker, mapRef, handleCloseFilterDrawer }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { parameters } = useSelector((state) => state.search);

    const markersRef = useRef([]);
    const [map, setMap] = useState(null);

    const adjustPosition = (position, index) => {
      const lat = position?.lat || 0;
      const lng = position?.long || 0;

      const angle = (index * 360) / locations.length; // Spread evenly
      const radius = 0.0001 * (index + 1); // Small offset per marker
      return {
        lat: lat + radius * Math.cos(angle),
        lng: lng + radius * Math.sin(angle),
      };
    };

    const navigateTo = (id, details) => {
      if (parameters.entity === "BRAND") {
        navigate(`/brand/${addHyphenToName(details?.brandName)}`, {
          state: { id },
        });
      } else if (parameters.entity === "SPACE") {
        navigate(`/space/${addHyphenToName(details?.spaceName)}`, {
          state: { id },
        });
      } else {
        navigate(`/event/${addHyphenToName(details?.eventName)}`, {
          state: { id },
        });
      }
    };

    useEffect(() => {
      if (!map) {
        const googleMap = new window.google.maps.Map(mapRef.current, {
          center: { lat: 40.0902, lng: -99.7129 },
          zoom: 5,
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

        locations.forEach((loc, index) => {
          const adjustedPosition = adjustPosition(loc.location, index);

          const marker = new window.google.maps.Marker({
            position: adjustedPosition,
            map: map,
            draggable: false,
            icon: customIcon,
          });

          marker.addListener("click", () => {
            handleCloseFilterDrawer();
            dispatch(setShouldReturn(true));
            navigateTo(loc.id, loc);
          });

          markersRef.current.push(marker);
        });

        // Optionally fit map to show all markers
        const bounds = new window.google.maps.LatLngBounds();
        locations.forEach((loc) => {
          const locat = {
            lat: loc.location.lat || 0,
            lng: loc.location.long || 0,
          };

          return bounds.extend(locat);
        });

        if (locations.length === 1) {
          map.setCenter({
            lat: locations[0].location.lat || 0,
            lng: locations[0].location.long || 0,
          });
          map.setZoom(14);
        } else {
          map.fitBounds(bounds);
        }
      }
    }, [map, locations]);

    return <Box sx={{ height: "400px", width: "100%" }} ref={mapRef} />;
  }
);

const MapWithKey = ({ locations, marker, mapRef, handleCloseFilterDrawer }) => (
  <MapDisplay
    key={JSON.stringify(locations)}
    locations={locations}
    marker={marker}
    mapRef={mapRef}
    handleCloseFilterDrawer={handleCloseFilterDrawer}
  />
);

export default MapWithKey;
