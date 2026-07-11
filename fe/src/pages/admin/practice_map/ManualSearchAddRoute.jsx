import { Box, Button, Input } from '@mui/material';
import React, { useState } from 'react'
import axios from 'axios';

const ManualSearchAddRoute = (props) => {
    const {currentLocation,setTravelDestinations} = props;
    const [searchRouteCoords,setSearchRouteCoords] = useState({});
    const [searchValue,setSearchValue] = useState('');

    const handleChange = (e)=>{
        const {value} = e.target;
        setSearchValue(value);
    }
    const getCoordinates = async (search) => {
    try {
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

  const handleConnectRoute = async (e) => {
    e.preventDefault();
    const trimmedSearchValue = searchValue.trim();
    if (!trimmedSearchValue) return;
    console.log('search',trimmedSearchValue);
    
      const location = await getCoordinates(trimmedSearchValue);

    //   if (!location) continue;

      const route = await getRoute(location);

      setTravelDestinations((prev)=>{
        return [...prev,{
        node:trimmedSearchValue,
        location,
        route,
      }]
      })
      setSearchRouteCoords({
        node:trimmedSearchValue,
        location,
        route,
      });
      

    // setTravelDestinations(result);
  };
  const handleAddRoute = ()=>{
    console.log('search cords',searchRouteCoords);
  }

  return (
    <Box sx={{ 
        backgroundColor: "#f5f5f5", 
        padding: "16px", 
        marginBottom: "16px",
        display:'flex',
        justifyContent:'space-around'
        }}>
    <Input placeholder="Search for a location..." 
    onChange={handleChange}
    // onKeyDown={handleConnectRoute}
    />
    <Button variant="contained" color="success" onClick={handleConnectRoute}>
      Search Route
    </Button>
    <Button variant="contained" color="success" onClick={handleAddRoute}>
      Add Route
    </Button>
    </Box>
  )
}

export default ManualSearchAddRoute;