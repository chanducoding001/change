import { useEffect, useRef, useState } from "react";
import Map, {
  Marker,
  NavigationControl,
  Source,
  Layer,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import axios from "axios";
// import SearchBox from "./SearchBox";
import NavigationIcon from '@mui/icons-material/Navigation';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';

const PracticeMap = (props) => {
  const {
    currentLocation,
    setCurrentLocation,
    tourNodes,
    travelDestinations,
    setTravelDestinations,
    heading,
    setHeading,
    mapRef,
    lastLocation,
    firstFix,
    // followUserRef,
    // interactionTimeout
  } = props;
  // Live GPS Tracking
useEffect(() => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by this browser.");
    return;
  }

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      const lng = position.coords.longitude;
      const lat = position.coords.latitude;

      const location = [lng, lat];

      // Update current marker
      setCurrentLocation(location);

      const bearing =
        position.coords.heading != null
          ? position.coords.heading
          : heading;

      setHeading(bearing);

      if (!mapRef.current) return;

      // Only move camera on the very first GPS fix
      if (firstFix.current) {
        firstFix.current = false;

        lastLocation.current = location;

        mapRef.current.flyTo({
          center: location,
          zoom: 17,
          pitch: 60,
          bearing,
          duration: 1200,
        });

        return;
      }

      // Save latest location
      lastLocation.current = location;

      // IMPORTANT:
      // Do NOT call flyTo() or easeTo() here.
      // Only the marker position changes.
    },
    (err) => {
      console.error(err);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 1000,
      timeout: 10000,
    }
  );

  return () => {
    navigator.geolocation.clearWatch(watchId);
  };
}, []);
    console.log('travel destinations',travelDestinations);


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

      {/* <SearchBox setDestination={setDestination} /> */}

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
        </Marker>
      )}
      {travelDestinations.map((item, index) => (

    <Marker
        key={index}
        longitude={item.location.longitude}
        latitude={item.location.latitude}
        anchor="bottom"
    >
        <LocationOnIcon
            sx={{
                color:"#1976d2",
                fontSize:42,
            }}
        />
    </Marker>

))}

      {travelDestinations.map((item,index)=>(

    <Source
        key={index}
        id={`route-${index}`}
        type="geojson"
        data={{
            type:"Feature",
            geometry:item.route
        }}
    >
        <Layer
            id={`layer-${index}`}
            type="line"
            paint={{
                "line-color":"#1976d2",
                "line-width":5
            }}
        />
    </Source>

))}
    </Map>
  );
};

export default PracticeMap;










// import { useEffect, useRef, useState } from "react";
// import Map, {
//   Marker,
//   NavigationControl,
//   Source,
//   Layer,
// } from "react-map-gl/maplibre";
// import "maplibre-gl/dist/maplibre-gl.css";
// import axios from "axios";
// // import SearchBox from "./SearchBox";
// import NavigationIcon from '@mui/icons-material/Navigation';
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';

// const PracticeMap = (props) => {
//   const {
//     currentLocation,
//     setCurrentLocation,
//     tourNodes,
//     travelDestinations,
//     setTravelDestinations,
//     heading,
//     setHeading,
//     mapRef,
//   } = props;

//   // Live GPS Tracking
//   useEffect(() => {
//     const watchId = navigator.geolocation.watchPosition(
//       (pos) => {
//         const lng = pos.coords.longitude;
//         const lat = pos.coords.latitude;

//         const location = [lng, lat];

//         setCurrentLocation(location);

//         const bearing = pos.coords.heading ?? heading;
//         setHeading(bearing);

//         if (mapRef.current) {
//           mapRef.current.flyTo({
//             center: location,
//             zoom: 17,
//             pitch: 60,
//             bearing,
//             duration: 1000,
//           });
//         }
//       },
//       console.error,
//       {
//         enableHighAccuracy: true,
//       }
//     );

//     return () => navigator.geolocation.clearWatch(watchId);
//   }, []);

//     console.log('travel destinations',travelDestinations);
    
//   return (
//     <Map
//       ref={mapRef}
//       initialViewState={{
//         longitude: 78.9629,
//         latitude: 20.5937,
//         zoom: 5,
//       }}
//       mapStyle="https://tiles.openfreemap.org/styles/liberty"
//       style={{
//         width: "100%",
//         height: "100vh",
//       }}
//     >
//       <NavigationControl />

//       {/* <SearchBox setDestination={setDestination} /> */}

//       {currentLocation && (
//         <Marker
//           longitude={currentLocation[0]}
//           latitude={currentLocation[1]}
//           rotation={heading}
//           anchor="center"
//         >
//           <PersonPinCircleIcon
//       sx={{
//         fontSize: 42,
//         color: "#1976d2",
//         transform: `rotate(${heading || 0}deg)`,
//         transition: "transform 0.3s linear",
//         filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.35))",
//       }}
//     />
//         </Marker>
//       )}
//       {travelDestinations.map((item, index) => (

//     <Marker
//         key={index}
//         longitude={item.location.longitude}
//         latitude={item.location.latitude}
//         anchor="bottom"
//     >
//         <LocationOnIcon
//             sx={{
//                 color:"#1976d2",
//                 fontSize:42,
//             }}
//         />
//     </Marker>

// ))}

//       {travelDestinations.map((item,index)=>(

//     <Source
//         key={index}
//         id={`route-${index}`}
//         type="geojson"
//         data={{
//             type:"Feature",
//             geometry:item.route
//         }}
//     >
//         <Layer
//             id={`layer-${index}`}
//             type="line"
//             paint={{
//                 "line-color":"#1976d2",
//                 "line-width":5
//             }}
//         />
//     </Source>

// ))}
//     </Map>
//   );
// };

// export default PracticeMap;

