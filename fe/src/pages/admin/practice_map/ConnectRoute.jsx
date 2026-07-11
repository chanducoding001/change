import axios from "axios";
import { Button } from "@mui/material";

const ConnectRoute = ({
  tourNodes,
  currentLocation,
  setTravelDestinations,
}) => {

  const getCoordinates = async (node) => {
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

      const { data } = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: search,
            format: "json",
            limit: 1,
          },
        }
      );

      if (!data.length) return null;

      return {
        longitude: Number(data[0].lon),
        latitude: Number(data[0].lat),
      };
    } catch {
      return null;
    }
  };

  const getRoute = async (location) => {
    const { data } = await axios.get(
      `https://router.project-osrm.org/route/v1/driving/${currentLocation[0]},${currentLocation[1]};${location.longitude},${location.latitude}`,
      {
        params: {
          overview: "full",
          geometries: "geojson",
        },
      }
    );

    return data.routes[0].geometry;
  };

  const handleConnectRoute = async () => {
    if (!tourNodes.length || !currentLocation) return;

    const result = [];

    for (const node of tourNodes) {

      const location = await getCoordinates(node);

      if (!location) continue;

      const route = await getRoute(location);

      result.push({
        node,
        location,
        route,
      });
    }

    setTravelDestinations(result);
  };

  return (
    <Button
      variant="contained"
      onClick={handleConnectRoute}
    >
      Connect Routes
    </Button>
  );
};

export default ConnectRoute;









// import React from "react";
// import axios from "axios";
// import { Button } from "@mui/material";

// const ConnectRoute = ({
//   tourNodes,
//   currentLocation,
//   setMultipleDestinations,
//   setMultipleRoutes,
// }) => {
//   // ---------------------------------------
//   // Get Coordinates
//   // ---------------------------------------

//   const getCoordinates = async (node) => {
//     try {
//       const search = [
//         node.village_name,
//         node.sub_district_name,
//         node.district_name,
//         node.state_name,
//         "India",
//       ]
//         .filter(Boolean)
//         .join(", ");

//       const { data } = await axios.get(
//         "https://nominatim.openstreetmap.org/search",
//         {
//           params: {
//             q: search,
//             format: "json",
//             limit: 1,
//           },
//         }
//       );

//       if (!data.length) return null;

//       return {
//         ...node,
//         longitude: Number(data[0].lon),
//         latitude: Number(data[0].lat),
//       };
//     } catch (err) {
//       console.error("Coordinate Error:", err);
//       return null;
//     }
//   };

//   // ---------------------------------------
//   // Get Route
//   // ---------------------------------------

//   const getRoute = async (destination) => {
//     try {
//       const { data } = await axios.get(
//         `https://router.project-osrm.org/route/v1/driving/${currentLocation[0]},${currentLocation[1]};${destination.longitude},${destination.latitude}`,
//         {
//           params: {
//             overview: "full",
//             geometries: "geojson",
//           },
//         }
//       );

//       return {
//         destination,
//         geometry: data.routes[0].geometry,
//       };
//     } catch (err) {
//       console.error("Route Error:", err);
//       return null;
//     }
//   };

//   // ---------------------------------------
//   // Connect Routes
//   // ---------------------------------------

//   const handleConnectRoute = async () => {
//     if (!tourNodes.length || !currentLocation) return;

//     // Step 1: Resolve coordinates
//     const destinations = (
//       await Promise.all(tourNodes.map(getCoordinates))
//     ).filter(Boolean);

//     // Step 2: Resolve routes
//     const routes = (
//       await Promise.all(destinations.map(getRoute))
//     ).filter(Boolean);

//     setMultipleDestinations(destinations);
//     setMultipleRoutes(routes);
//   };

//   return (
//     <Button
//       variant="contained"
//       color="success"
//       onClick={handleConnectRoute}
//     >
//       Connect Route
//     </Button>
//   );
// };

// export default ConnectRoute;





// import axios from "axios";
// import { Button } from '@mui/material';
// import React from 'react'

// const ConnectRoute = (props) => {
//     const {setMultipleDestinations, setMultipleRoutes, tourNodes, currentLocation} = props;

//     // contains destination latitude and longitudes
//     async function searchPlace (node) {
//     // if (!search.trim()) return;
//     const search = [
//         node.village_name,
//         node.sub_district_name,
//         node.district_name,
//         node.state_name,
//         "India",
//       ]
//         .filter(Boolean)
//         .join(", ");

//     const res = await axios.get(
//       "https://nominatim.openstreetmap.org/search",
//       {
//         params: {
//           q: search,
//           format: "json",
//           limit: 1,
//         },
//       }
//     );

//     if (!res.data.length) {
//       alert("Location not found");
//       return;
//     }

//     const place = res.data[0];
//     const destination = [
//       Number(place.lon),
//       Number(place.lat),
//     ];
//     // setDestination([
//     //   Number(place.lon),
//     //   Number(place.lat),
//     // ]);
//     // await fetchRoute(destination);
//     return destination;
//     };
//     // contains the route type whether it is line or something else
//     async function fetchRoute(destination) {
//       const url = `https://router.project-osrm.org/route/v1/driving/${currentLocation[0]},${currentLocation[1]};${destination[0]},${destination[1]}?overview=full&geometries=geojson`;

//       const res = await axios.get(url);
//       const route = res.data.routes[0].geometry;
//       console.log("route", route);
//       return route;
//     //   setRoute(res.data.routes[0].geometry);
//     }
    

//     const handleConnectRoute = async (e) => {
//         e.preventDefault();
//         if (!tourNodes.length) {
//           return;
//         }

//       const nodes = await Promise.all(
//         tourNodes.map((node) => searchPlace(node)),
//       );

//     //   const destinations = nodes.filter((node) => node.latitude && node.longitude).map((node) => [node.longitude, node.latitude]);
//       const destinations = await Promise.all(
//         nodes.filter((node) => node.latitude && node.longitude).map(async (node) => {
//           return await fetchRoute(node);
//         })
//       );
//       setMultipleDestinations(nodes);
//       setMultipleRoutes(destinations);
//     }
//   return (
//     <>
//     <Button variant="outlined" color="success" onClick={handleConnectRoute}>
//         Connect Route
//     </Button>
//     </>
//   )
// }

// export default ConnectRoute;