import { useEffect, useRef, useState } from "react";
import Map, {
  Marker,
  NavigationControl,
  Source,
  Layer,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import axios from "axios";
import SearchBox from "./SearchBox";
import NavigationIcon from '@mui/icons-material/Navigation';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';

const GISMap = (props) => {
  const {addPlaceData} = props;
  const mapRef = useRef();

  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [heading, setHeading] = useState(0);
  const [route, setRoute] = useState(null);
  const lastLocation = useRef(null);
  const firstFix = useRef(true);
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

  // Route
  useEffect(() => {
    if (!currentLocation || !destination) return;

    async function fetchRoute() {
      const url = `https://router.project-osrm.org/route/v1/driving/${currentLocation[0]},${currentLocation[1]};${destination[0]},${destination[1]}?overview=full&geometries=geojson`;

      const res = await axios.get(url);

      console.log("Route data:", res.data.routes[0].geometry);
      setRoute(res.data.routes[0].geometry);
    }

    fetchRoute();
  }, [currentLocation, destination]);

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

      <SearchBox setDestination={setDestination} addPlaceData={addPlaceData ?? null}/>

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

      {destination && (
        <Marker
          longitude={destination[0]}
          latitude={destination[1]}
        >
          <LocationOnIcon
      sx={{
        fontSize: 42,
        color: "#0d47a1",
        filter: "drop-shadow(0 2px 5px rgba(0,0,0,.3))",
      }}
    />
          {/* 📍 */}
        </Marker>
      )}

      {route && (
        <Source
          id="route"
          type="geojson"
          data={{
            type: "Feature",
            geometry: route,
          }}
        >
          <Layer
            id="routeLine"
            type="line"
            paint={{
              "line-color": "#1976d2",
              "line-width": 6,
            }}
          />
        </Source>
      )}
    </Map>
  );
};

export default GISMap;











// import { useEffect, useRef, useState } from "react";
// import Map, {
//   Marker,
//   NavigationControl,
//   Source,
//   Layer,
// } from "react-map-gl/maplibre";
// import "maplibre-gl/dist/maplibre-gl.css";
// import axios from "axios";
// import SearchBox from "./SearchBox";
// import NavigationIcon from '@mui/icons-material/Navigation';
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';

// const GISMap = () => {
//   const mapRef = useRef();

//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [destination, setDestination] = useState(null);
//   const [heading, setHeading] = useState(0);
//   const [route, setRoute] = useState(null);

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

//   // Route
//   useEffect(() => {
//     if (!currentLocation || !destination) return;

//     async function fetchRoute() {
//       const url = `https://router.project-osrm.org/route/v1/driving/${currentLocation[0]},${currentLocation[1]};${destination[0]},${destination[1]}?overview=full&geometries=geojson`;

//       const res = await axios.get(url);

//       // console.log("Route data:", res.data.routes[0].geometry);
//       setRoute(res.data.routes[0].geometry);
//     }

//     fetchRoute();
//   }, [currentLocation, destination]);

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

//       <SearchBox setDestination={setDestination} />

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
//           {/* 🚗 */}
//         </Marker>
//       )}

//       {destination && (
//         <Marker
//           longitude={destination[0]}
//           latitude={destination[1]}
//         >
//           <LocationOnIcon
//       sx={{
//         fontSize: 42,
//         color: "#0d47a1",
//         filter: "drop-shadow(0 2px 5px rgba(0,0,0,.3))",
//       }}
//     />
//           {/* 📍 */}
//         </Marker>
//       )}

//       {route && (
//         <Source
//           id="route"
//           type="geojson"
//           data={{
//             type: "Feature",
//             geometry: route,
//           }}
//         >
//           <Layer
//             id="routeLine"
//             type="line"
//             paint={{
//               "line-color": "#1976d2",
//               "line-width": 6,
//             }}
//           />
//         </Source>
//       )}
//     </Map>
//   );
// };

// export default GISMap;











// import { useState } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   Polyline,
// } from "react-leaflet";
// import SearchBox from "./SearchBox";

// const GISMap = () => {
//   const [from, setFrom] = useState(null);
//   const [to, setTo] = useState(null);
//   const [route, setRoute] = useState([]);

//   return (
//     <MapContainer
//       center={[20.5937, 78.9629]}
//       zoom={5}
//       style={{ height: "100vh", width: "100%" }}
//     >
//       <TileLayer
//         attribution="© OpenStreetMap"
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />

//       <SearchBox
//         setFrom={setFrom}
//         setTo={setTo}
//         setRoute={setRoute}
//       />

//       {from && (
//         <Marker position={from}>
//           <Popup>From</Popup>
//         </Marker>
//       )}

//       {to && (
//         <Marker position={to}>
//           <Popup>Destination</Popup>
//         </Marker>
//       )}

//       {route.length > 0 && (
//         <Polyline
//           positions={route}
//           pathOptions={{
//             color: "blue",
//             weight: 5,
//           }}
//         />
//       )}
//     </MapContainer>
//   );
// };

// export default GISMap;









// import { useState } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
// } from "react-leaflet";
// import SearchBox from "./SearchBox";

// const GISMap = () => {
//   const [position, setPosition] = useState(null);

//   return (
//     <MapContainer
//       center={[20.5937, 78.9629]}
//       zoom={5}
//       style={{
//         height: "100vh",
//         width: "100%",
//       }}
//     >
//       <TileLayer
//         attribution="&copy; OpenStreetMap contributors"
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />

//       <SearchBox setPosition={setPosition} />

//       {position && (
//         <Marker position={position}>
//           <Popup>Village Centroid</Popup>
//         </Marker>
//       )}
//     </MapContainer>
//   );
// };

// export default GISMap;
