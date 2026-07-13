import { useEffect, useRef, useState } from "react";
import Map, {
  Marker,
  NavigationControl,
  Source,
  Layer,
  Popup,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import axios from "axios";
import NavigationIcon from "@mui/icons-material/Navigation";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonPinCircleIcon from "@mui/icons-material/PersonPinCircle";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import React from "react";
import { Chip } from "@mui/material";
import { distanceInKm } from "../TourStatistics";

const VisitTourMap = (props) => {
  const {
    currentLocation,
    setCurrentLocation,
    route,
    setRoute,
    allDestinations,
    setAllDestinations,
    runningTourData,
    heading,
    setHeading,
    mapRef,
    firstFix,
    lastLocation,
  } = props;
  const [hoveredPlace, setHoveredPlace] = useState(null);

  // const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  // const [route, setRoute] = useState(null);

  // Live GPS Tracking

  // console.log("hovered place", hoveredPlace);

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        longitude: 78.9629,
        latitude: 20.5937,
        zoom: 5,
      }}
      mapStyle="https://tiles.openfreemap.org/styles/liberty"
      dragRotate
      touchZoomRotate
      pitchWithRotate
      maxPitch={85}
      style={{
        width: "100%",
        height: "100vh",
      }}
    >
      <NavigationControl />
      {currentLocation && (
        <Marker
          longitude={currentLocation[0]}
          latitude={currentLocation[1]}
          rotation={heading}
          anchor="center"
        >
          {/* <PersonPinCircleIcon */}
          <MyLocationIcon
            sx={{
              fontSize: 25,
              // fontSize: 42,
              color: "#1976d2",
              // transform: `rotate(${heading || 0}deg)`,
              // transition: "transform 0.3s linear",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.35))",
            }}
          />
          {/* 🚗 */}
        </Marker>
      )}

      {runningTourData?.places?.length > 0 &&
        runningTourData?.places?.map((place, i) => (
          <React.Fragment key={place._id}>
            <Marker
              key={`route marker${i}-${place._id}`}
              // key={place?.place?._id}
              longitude={place?.place?.longitude}
              latitude={place?.place?.latitude}
            >
              <LocationOnIcon
                // size={32}
                // color={place?.markerColor}
                sx={{
                  color: place?.markerColor,
                  fontSize: 30,
                }}
                onMouseEnter={() => setHoveredPlace(place)}
                onMouseLeave={() => setHoveredPlace(null)}
              />
            </Marker>
            <Source
              // id="route"
              id={`route-${place?.place?._id}`}
              type="geojson"
              data={{
                type: "Feature",
                properties: {
                  name: place.place.name,
                  placeId: place.place._id,
                },
                geometry: place?.route?.geometry,
                // geometry: route,
              }}
            >
              <Layer
                // id="routeLine"
                id={`route-line-${place?.place?._id}`}
                type="line"
                paint={{
                  "line-color": place?.routeColor,
                  // "line-color": "#1976d2",
                  "line-width": 6,
                  // "line-opacity": 1,
                  // "line-blur": 0,
                  // "line-dasharray": [2, 2],
                }}
                // onClick={()=>console.log('clicked',place?.place?.name)}
              />
            </Source>
            {hoveredPlace && (
              <Popup
                longitude={hoveredPlace?.place?.longitude}
                latitude={hoveredPlace?.place?.latitude}
                closeButton={false}
                closeOnClick={false}
                anchor="top"
                offset={20}
              >
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <p>{hoveredPlace?.place?.name}</p>
                  {hoveredPlace?.route?.distance && (
                    <p style={{ fontSize: "0.6rem" }}>
                      Distance from Current Location is{" "}
                      {distanceInKm(hoveredPlace?.route?.distance)}
                    </p>
                  )}
                  <Chip
                    label={hoveredPlace?.visited ? "Visited" : "Not Visited"}
                    size="small"
                  />
                </div>
              </Popup>
            )}
          </React.Fragment>
        ))}
    </Map>
  );
};

export default VisitTourMap;
