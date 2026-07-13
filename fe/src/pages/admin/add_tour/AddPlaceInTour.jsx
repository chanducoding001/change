import React, { useEffect } from 'react'
import GISMap from '../GIS/GISMap';
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { fetchUnResolvedPlacesFromTourId, getTourName } from '../../../app/mapSlicer';

const AddPlaceInTour = () => {
    const unresolvedPlaces = useSelector((state)=>state.mapSlicer.unresolvedPlaces);
    const slicerTourName = useSelector((state)=>state.mapSlicer.tourName);
    const dispatch = useDispatch();
    const { tourId,tourName } = useParams();
  useEffect(()=>{
    dispatch(getTourName(tourId));
    dispatch(fetchUnResolvedPlacesFromTourId(tourId));
  },[]);
  return (
    <>
    <Typography sx={{
        fontWeight:600,
        color:'white',
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
        }}>
            Add Place to Tour : {slicerTourName ?? tourName}
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
