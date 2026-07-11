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
import NavigationIcon from '@mui/icons-material/Navigation';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import React from "react";
import { Chip } from "@mui/material";

const VisitTourMap = (props) => {
  const {currentLocation,setCurrentLocation,
    route, setRoute,allDestinations,
    setAllDestinations,runningTourData,heading,setHeading,mapRef,firstFix,lastLocation
  } = props;
  const [hoveredPlace, setHoveredPlace] = useState(null);

  // const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  // const [route, setRoute] = useState(null);
  
  // Live GPS Tracking
 

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
          <PersonPinCircleIcon
      sx={{
        fontSize: 42,
        color: "#1976d2",
        // transform: `rotate(${heading || 0}deg)`,
        // transition: "transform 0.3s linear",
        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.35))",
      }}
    />
          {/* 🚗 */}
        </Marker>
      )}

    {
    runningTourData?.places?.length > 0 &&
    runningTourData?.places?.map((place, i) => (
    <React.Fragment key={place.place._id}>
    <Marker
      // key={`route-${place._id}`}
      // key={place?.place?._id}
      longitude={place?.place?.longitude}
      latitude={place?.place?.latitude}
    >
      <LocationPinIcon
        sx={{
          // fontSize: 42,
          // color: "white",
          color: place?.route?.color,
          // color: "#0d47a1",
          // filter: "drop-shadow(0 2px 5px rgba(0,0,0,.3))",
        }}
        onMouseEnter={() => setHoveredPlace(place?.place)}
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
            geometry: place?.route?.geometry?.geometry,
            // geometry: route,
          }}
        >
          <Layer
            // id="routeLine"
            id={`route-line-${place?.place?._id}`}
            type="line"
            paint={{
              "line-color": place?.route?.color,
              // "line-color": "#1976d2",
              "line-width": 6,
              "line-opacity": 1,
              "line-blur": 0,
              "line-dasharray": [2, 2],
            }}
          // onClick={()=>console.log('clicked',place?.place?.name)}
          />
    </Source>
    {hoveredPlace && (
  <Popup
    longitude={hoveredPlace.longitude}
    latitude={hoveredPlace.latitude}
    closeButton={false}
    closeOnClick={false}
    anchor="top"
    offset={20}
  >
    <div
      style={{
        fontWeight: 600,
        fontSize: "14px",
      }}
    >
      <p>{hoveredPlace?.name}</p>
      <Chip
      label={hoveredPlace?.visited?'Visited':'Not Visited'}
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


// {
//     tourId,
//     lastKnownLocation: {
//         latitude,
//         longitude
//     },
//     offlineAt: Date.now(),
//     currentDestination,
//     currentPlaceIndex
// }

