import React, { useEffect } from 'react'
import GISMap from '../GIS/GISMap';
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { fetchUnResolvedPlacesFromTourId } from '../../../app/mapSlicer';

const AddPlaceInTour = () => {
    const unresolvedPlaces = useSelector((state)=>state.mapSlicer.unresolvedPlaces);
    const dispatch = useDispatch();
    const { tourId } = useParams();
  useEffect(()=>{
    dispatch(fetchUnResolvedPlacesFromTourId(tourId));
  },[])
  return (
    <>
    <Typography sx={{
        fontWeight:600,
        color:'white',
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
        }}>
            Add Place in this Tour
    </Typography>
    <GISMap 
      addPlaceData = {{
          addPlace:true,
          unresolvedPlaces,
          tourId
      }}
    />
    </>
  )
}

export default AddPlaceInTour;
