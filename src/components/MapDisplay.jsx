import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Box } from "@mui/material";

import { addHyphenToName } from "../utils";

import { setShouldReturn } from "../store/slices/search";

const MapDisplay = React.memo(
  ({ locations, marker, mapRef, handleCloseFilterDrawer }) => {
    // const { pathname } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
      parameters,
      // , allData, isTyping
    } = useSelector((state) => state.search);

    const markersRef = useRef([]);
    const [map, setMap] = useState(null);

    const adjustPosition = (position, index) => {
      const angle = (index * 360) / locations.length; // Spread evenly
      const radius = 0.0001 * (index + 1); // Small offset per marker
      return {
        lat: position?.lat + radius * Math.cos(angle),
        lng: position?.lng + radius * Math.sin(angle),
      };
    };

    const returnPosition = (obj) => {
      const navigationKeys = {
        BRAND: { lat: obj?.location?.lat || 0, lng: obj?.location?.long || 0 },
        SPACE: {
          lat: obj?.brand?.location?.lat || 0,
          lng: obj?.brand?.location?.long || 0,
        },
        EVENT: {
          lat: obj?.space?.brand?.location?.lat || 0,
          lng: obj?.space?.brand?.location?.long || 0,
        },
      };
      return navigationKeys[parameters.entity];
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
          const adjustedPosition = adjustPosition(returnPosition(loc), index);

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
        locations.forEach((loc) => bounds.extend(returnPosition(loc)));

        map.fitBounds(bounds);
      }
    }, [map, locations]);

    // useEffect(() => {
    //   if (pathname === "/search") {
    //     if (isTyping && allData?.length === 0 && map && parameters?.lat) {
    //       map.panTo({ lat: parameters?.lat, lng: parameters?.long });
    //     }
    //   }
    // }, [allData, isTyping, map, parameters, pathname]);

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
