import { useState } from "react";
import axios from "axios";
import AddPlaceButton from "../add_tour/AddPlaceButton";
import { Button, Input, TextField } from "@mui/material";

const SearchBox = (props) => {
  const { setDestination,addPlaceData } = props;
  const [search, setSearch] = useState("");
  const [searchedString,setSearchedString] = useState("");

  const searchPlace = async () => {
    if (!search.trim()) return;

    const res = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: search,
          format: "json",
          limit: 1,
        },
      }
    );

    if (!res.data.length) {
      alert("Location not found");
      return;
    }

    const place = res.data[0];
    // send searched string 
    setSearchedString(search);
    setDestination([
      Number(place.lon),
      Number(place.lat),
    ]);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        left: 20,
        zIndex: 100,
        background: "#fff",
        padding: 10,
        borderRadius: 8,
        gap: 10,
        width:'90%',
        // height:'70px',
        display: "flex",
        flexWrap:'wrap',
        justifyContent:'space-around',
        alignItems:'center'
      }}
    >
      <TextField
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search village"
        onKeyDown={(e) => {
          if (e.key === "Enter") searchPlace();
        }}
        size="small"
        sx={{width:'50%',}}
      />

      <Button onClick={searchPlace} size="small" variant="outlined">
        Search
      </Button>
      {
        addPlaceData?.addPlace && (
          <AddPlaceButton 
          addPlaceData={addPlaceData} 
          searchedString={searchedString}
          setSearchedString={setSearchedString}
          setSearch={setSearch}
          />
        )
      }
    </div>
  );
};

export default SearchBox;



// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useMap } from "react-leaflet";

// const SearchBox = ({ setFrom, setTo, setRoute }) => {
//   const [search, setSearch] = useState("");

//   const [currentLocation, setCurrentLocation] = useState(null);

//   const map = useMap();

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition((pos) => {
//       const location = [
//         pos.coords.latitude,
//         pos.coords.longitude,
//       ];

//       setCurrentLocation(location);
//       setFrom(location);

//       map.flyTo(location, 14);
//     });
//   }, []);

//   const searchLocation = async () => {
//     try {
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

//       if (!data.length) return;

//       const destination = [
//         Number(data[0].lat),
//         Number(data[0].lon),
//       ];

//       setTo(destination);

//       map.flyTo(destination, 14);

//       getRoute(currentLocation, destination);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const getRoute = async (start, end) => {
//     try {
//       const { data } = await axios.get(
//         `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}`,
//         {
//           params: {
//             overview: "full",
//             geometries: "geojson",
//           },
//         }
//       );

//       const coordinates =
//         data.routes[0].geometry.coordinates.map((coord) => [
//           coord[1],
//           coord[0],
//         ]);

//       setRoute(coordinates);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <div
//       style={{
//         position: "absolute",
//         zIndex: 1000,
//         top: 20,
//         left: 60,
//         background: "#fff",
//         padding: 10,
//       }}
//     >
//       <input
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         placeholder="Destination"
//       />

//       <button onClick={searchLocation}>
//         Connect
//       </button>
//     </div>
//   );
// };

// export default SearchBox;





// import { useState } from "react";
// import axios from "axios";
// import { useMap } from "react-leaflet";

// const SearchBox = ({ setPosition }) => {
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);

//   const map = useMap();

//   const searchLocation = async () => {
//     if (!search.trim()) {
//       alert("Please enter a location");
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await axios.get(
//         "https://nominatim.openstreetmap.org/search",
//         {
//           params: {
//             q: search,
//             format: "json",
//             limit: 1,
//             addressdetails: 1,
//           },
//           headers: {
//             "Accept-Language": "en",
//           },
//         }
//       );

//       const data = response.data;

//       if (!data.length) {
//         alert("Location not found");
//         setLoading(false);
//         return;
//       }

//       const result = data[0];

//       const lat = parseFloat(result.lat);
//       const lon = parseFloat(result.lon);

//       // Move map
//       map.flyTo([lat, lon], 14, {
//         animate: true,
//         duration: 1.5,
//       });

//       // Set centroid for marker
//       setPosition([lat, lon]);

//       // Update input with formatted location
//       setSearch(result.display_name);
//     } catch (error) {
//       console.error(error);
//       alert("Something went wrong while searching.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       style={{
//         position: "absolute",
//         top: 15,
//         left: "50%",
//         transform: "translateX(-50%)",
//         zIndex: 1000,
//         background: "#fff",
//         padding: "10px",
//         borderRadius: "8px",
//         boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
//         display: "flex",
//         gap: "10px",
//         alignItems: "center",
//       }}
//     >
//       <input
//         type="text"
//         placeholder="Search village, district, state..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         onKeyDown={(e) => {
//           if (e.key === "Enter") {
//             searchLocation();
//           }
//         }}
//         style={{
//           width: "350px",
//           padding: "10px",
//           borderRadius: "4px",
//           border: "1px solid #ccc",
//           outline: "none",
//           fontSize: "14px",
//         }}
//       />

//       <button
//         onClick={searchLocation}
//         disabled={loading}
//         style={{
//           padding: "10px 18px",
//           border: "none",
//           borderRadius: "4px",
//           background: "#1976d2",
//           color: "#fff",
//           cursor: "pointer",
//         }}
//       >
//         {loading ? "Searching..." : "Search"}
//       </button>
//     </div>
//   );
// };

// export default SearchBox;


