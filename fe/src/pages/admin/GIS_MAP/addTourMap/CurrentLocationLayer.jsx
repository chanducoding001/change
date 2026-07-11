import React, { useEffect, useState } from "react";
import { Marker } from "react-map-gl/maplibre";

import PersonPinCircleIcon from "@mui/icons-material/PersonPinCircle";

const CurrentLocationLayer = ({
  mapRef,
}) => {
  const [currentLocation, setCurrentLocation] =
    useState(null);

  const [heading, setHeading] =
    useState(0);

  //------------------------------------------

  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId =
      navigator.geolocation.watchPosition(
        (position) => {
          const longitude =
            position.coords.longitude;

          const latitude =
            position.coords.latitude;

          const bearing =
            position.coords.heading ?? 0;

          setCurrentLocation([
            longitude,
            latitude,
          ]);

          setHeading(bearing);

          if (mapRef?.current) {
            mapRef.current.flyTo({
              center: [
                longitude,
                latitude,
              ],
              zoom: 16,
              pitch: 50,
              bearing,
              duration: 1000,
            });
          }
        },
        (err) =>
          console.error(err),
        {
          enableHighAccuracy: true,
        }
      );

    return () =>
      navigator.geolocation.clearWatch(
        watchId
      );
  }, [mapRef]);

  //------------------------------------------

  if (!currentLocation) return null;

  return (
    <Marker
      longitude={currentLocation[0]}
      latitude={currentLocation[1]}
      rotation={heading}
      anchor="center"
    >
      <PersonPinCircleIcon
        sx={{
          color: "#1976d2",
          fontSize: 42,
          transform: `rotate(${heading}deg)`,
          transition:
            "transform .3s linear",
        }}
      />
    </Marker>
  );
};

export default CurrentLocationLayer;