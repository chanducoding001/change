import axios from "axios";
import React, { useEffect, useRef } from "react";
import Map, { NavigationControl } from "react-map-gl/maplibre";

import "maplibre-gl/dist/maplibre-gl.css";

import CurrentLocationLayer from "./CurrentLocationLayer";
import MarkerLayer from "./MarkerLayer";
import RouteLayer from "./RouteLayer";

const GISWorldMap = ({
  tourNodes = [],
  selectedNode,
  setSelectedNode,
  travelEdges = [],
  selectedRoute = [],
}) => {
  const mapRef = useRef(null);
  const [travelNodes, setTravelNodes] = React.useState([]);

  const searchPlace = async (node) => {
    try {
      const search = [
        node.village_name,
        node.sub_district_name,
        node.district_name,
        node.state_name,
        "India",
      ]
        .filter(Boolean)
        .join(", ");
      // const search = node.travelNode;
      const { data } = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: search,
            format: "json",
            limit: 1,
          },
        },
      );
      console.log("search",search);
      console.log("data",data);
      if (!data.length) {
        return {
          ...node,
          latitude: null,
          longitude: null,
        };
      }

      return {
        ...node,
        latitude: Number(data[0].lat),
        longitude: Number(data[0].lon),
      };
    } catch (err) {
      console.error("Coordinate Search Error", err);

      return {
        ...node,
        latitude: null,
        longitude: null,
      };
    }
  };

  //----------------------------------------------------
  // Resolve all imported villages
  //----------------------------------------------------

  useEffect(() => {
    if (!tourNodes.length) {
      setTravelNodes([]);
      return;
    }

    const resolveNodes = async () => {
      const nodes = await Promise.all(
        tourNodes.map((node) => searchPlace(node)),
      );

      setTravelNodes(nodes);
      
    };

    resolveNodes();
  }, [tourNodes]);

  //----------------------------------------------------

  console.log(travelNodes);
  return (
    <Map
      ref={mapRef}
      initialViewState={{
        longitude: 78.9629,
        latitude: 20.5937,
        zoom: 5,
      }}
      mapStyle="https://tiles.openfreemap.org/styles/liberty"
      style={{
        width: "100%",
        height: "100%",
      }}
      onClick={() => setSelectedNode(null)}
    >
      {/* Navigation */}
      <NavigationControl position="top-right" />

      {/* Current GPS */}
      <CurrentLocationLayer mapRef={mapRef} />

      {/* Village Markers */}
      <MarkerLayer
        mapRef={mapRef}
        nodes={travelNodes}
        // nodes={tourNodes}
        selectedNode={selectedNode}
        setSelectedNode={setSelectedNode}
      />

      {/* Travel Routes */}
      <RouteLayer travelEdges={travelEdges} selectedRoute={selectedRoute} />
    </Map>
  );
};

export default GISWorldMap;







// import { useEffect, useRef, useState } from "react";
// import Map, {
//   Marker,
//   NavigationControl,
// } from "react-map-gl/maplibre";
// import "maplibre-gl/dist/maplibre-gl.css";

// import PersonPinCircleIcon from "@mui/icons-material/PersonPinCircle";

// const GISWorldMap = ({ data = [] }) => {
//   const mapRef = useRef();

//   const [currentLocation, setCurrentLocation] =
//     useState(null);

//   const [heading, setHeading] = useState(0);

//   useEffect(() => {
//     const watchId =
//       navigator.geolocation.watchPosition(
//         (position) => {
//           const longitude =
//             position.coords.longitude;

//           const latitude =
//             position.coords.latitude;

//           const bearing =
//             position.coords.heading ?? 0;

//           setCurrentLocation([
//             longitude,
//             latitude,
//           ]);

//           setHeading(bearing);

//           if (mapRef.current) {
//             mapRef.current.flyTo({
//               center: [
//                 longitude,
//                 latitude,
//               ],
//               zoom: 17,
//               pitch: 60,
//               bearing,
//               duration: 1000,
//             });
//           }
//         },
//         (error) => {
//           console.error(error);
//         },
//         {
//           enableHighAccuracy: true,
//           maximumAge: 1000,
//           timeout: 10000,
//         }
//       );

//     return () => {
//       navigator.geolocation.clearWatch(
//         watchId
//       );
//     };
//   }, []);

//   console.log("Received Data:", data);

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

//       {currentLocation && (
//         <Marker
//           longitude={currentLocation[0]}
//           latitude={currentLocation[1]}
//           rotation={heading}
//           anchor="center"
//         >
//           <PersonPinCircleIcon
//             sx={{
//               fontSize: 42,
//               color: "#1976d2",
//               transform: `rotate(${heading}deg)`,
//               transition:
//                 "transform .3s linear",
//               filter:
//                 "drop-shadow(0 2px 4px rgba(0,0,0,.35))",
//             }}
//           />
//         </Marker>
//       )}
//     </Map>
//   );
// };

// export default GISWorldMap;
