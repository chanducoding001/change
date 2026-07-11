import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import {
  getATourByIdApi,
  startATourApi,
  syncATourApi,
} from "../../../../app/thunkApiCalls";

import { loadingStates } from "../../../../app/appUtils";
import {
  containRunningTourData,
} from "../../../../app/mapSlicer";

import VisitTourMap from "./VisitTourMap";
import VisitTourMapFloatingComponent from "./VisitTourMapFloatingComponent";

const VisitTour = () => {
  const { tourId } = useParams();

  const dispatch = useDispatch();

  const [currentLocation, setCurrentLocation] = useState(null);
  const [heading, setHeading] = useState(0);
  const mapRef = useRef();
  const lastLocation = useRef(null);
  const firstFix = useRef(true);
  const enteredPlacesRef = useRef(new Set());
  const isInsideBoundaryRef = useRef(false);
  const currentLocationRef = useRef(null);

  const getATourState = useSelector(
    (state) => state.mapSlicer.getATourByIdState
  );

  const runningTourData = useSelector(
    (state) => state.mapSlicer.runningTourData
  );

  const getATourLoading = getATourState.loading;
  const getATourData = getATourState?.data?.data;

  //-------------------------------------------------------
  // Fetch Tour
  //-------------------------------------------------------

  const fetchATour = async () => {
    try {
      const url = `${import.meta.env.VITE_TOUR_MAIN_URL}/${tourId}`;

      await dispatch(
        getATourByIdApi({
          url,
          data: [],
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  //-------------------------------------------------------
  // Start Tour
  //-------------------------------------------------------

  const handleStartTour = async () => {
    try {
      if (!currentLocation) return;

      const url = import.meta.env.VITE_START_TOUR.replace(
        ":tourId",
        tourId
      );

      const result = await dispatch(
        startATourApi({
          url,
          data: {
            longitude: currentLocation[0],
            latitude: currentLocation[1],
          },
        })
      );

      if (startATourApi.fulfilled.match(result)) {
        dispatch(containRunningTourData(result.payload.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  //-------------------------------------------------------
  // Sync Tour
  //-------------------------------------------------------

  const handleSyncTour = async (location = currentLocationRef.current) => {
  try {
    if (!location) return;

    const url = import.meta.env.VITE_SYNC_TOUR.replace(":tourId", tourId);

    const result = await dispatch(
      syncATourApi({
        url,
        data: {
          longitude: location[0],
          latitude: location[1],
        },
      })
    );

    if (syncATourApi.fulfilled.match(result)) {
      dispatch(containRunningTourData(result.payload.data));
    }
  } catch (error) {
    console.log(error);
  }
};

  useEffect(() => {
  currentLocationRef.current = currentLocation;
}, [currentLocation]);
  //-------------------------------------------------------
  // GPS Tracking
  //-------------------------------------------------------

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const lng = position.coords.longitude;
        const lat = position.coords.latitude;

        const location = [lng, lat];

        setCurrentLocation(location);

        const bearing =
          position.coords.heading != null
            ? position.coords.heading
            : heading;

        setHeading(bearing);

        if (!mapRef.current) return;

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

        lastLocation.current = location;
      },
      console.error,
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

  //-------------------------------------------------------
  // Load Tour
  //-------------------------------------------------------

  useEffect(() => {
    if (getATourLoading === loadingStates.IDLE) {
      fetchATour();
    }
  }, [getATourLoading]);

  //-------------------------------------------------------
  // Sync when page is opened/refreshed
  //-------------------------------------------------------

  useEffect(() => {
    if (!currentLocation) return;
    if (!getATourData) return;

    if (getATourData.status === "running") {
      handleSyncTour();
    }
  }, [currentLocation, getATourData]);

  //-------------------------------------------------------
  // Periodic Sync (every 15 seconds)
  //-------------------------------------------------------


// Move outside the component
const VISIT_RADIUS = 100;

const getDistanceBetweenCoordinates = (lat1, lon1, lat2, lon2) => {
  const R = 6371000;

  const toRad = (value) => (value * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

useEffect(() => {
  if (!currentLocation) return;
  if (!runningTourData?.places?.length) return;

  let insideBoundary = false;

  for (const tourPlace of runningTourData.places) {
    if (tourPlace.visited) continue;

    const distance = getDistanceBetweenCoordinates(
      currentLocation[1],
      currentLocation[0],
      tourPlace.place.latitude,
      tourPlace.place.longitude
    );

    if (distance <= VISIT_RADIUS) {
      insideBoundary = true;
      break;
    }
  }

  // Just entered
  if (insideBoundary && !isInsideBoundaryRef.current) {
    isInsideBoundaryRef.current = true;
    handleSyncTour();
  }

  // Just left
  if (!insideBoundary && isInsideBoundaryRef.current) {
    isInsideBoundaryRef.current = false;
  }
}, [currentLocation, runningTourData]);

useEffect(() => {
  if (runningTourData?.status !== "running") return;

  const interval = setInterval(() => {
    if (!isInsideBoundaryRef.current) {
      handleSyncTour();
    }
  }, 300000); // 5 minutes

  return () => clearInterval(interval);
}, [runningTourData?.status]);

  // useEffect(() => {
  //   if (!currentLocation) return;
  //   if (getATourData?.status !== "running") return;

  //   const interval = setInterval(() => {
  //     handleSyncTour();
  //   }, 15000);

  //   return () => clearInterval(interval);
  // }, [currentLocation, getATourData?.status]);

  return (
    <>
      <VisitTourMapFloatingComponent
        currentLocation={currentLocation}
        handleStartTour={handleStartTour}
        runningTourData={runningTourData}
      />

      <VisitTourMap
        currentLocation={currentLocation}
        setCurrentLocation={setCurrentLocation}
        runningTourData={runningTourData}
        heading={heading}
        setHeading={setHeading}
        mapRef={mapRef}
        lastLocation={lastLocation}
        firstFix={firstFix}
      />
    </>
  );
};

export default VisitTour;









// import React, { useEffect, useState, useRef } from 'react'
// import { useDispatch, useSelector } from 'react-redux';
// import { useParams } from 'react-router-dom';
// import { getATourByIdApi, startATourApi } from '../../../../app/thunkApiCalls';
// import { loadingStates } from '../../../../app/appUtils';
// import VisitTourMap from './VisitTourMap';
// import VisitTourMapFloatingComponent from './VisitTourMapFloatingComponent';
// import { containRunningTourData } from '../../../../app/mapSlicer';

// const VisitTour = () => {
//   const { tourId } = useParams();
//   // [lng, lat] = cl
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [heading, setHeading] = useState(0);
//   const dispatch = useDispatch();
//   const getATourByIdStateData = useSelector((state)=>state.mapSlicer.getATourByIdState);
//   const startATourStateData = useSelector((state)=>state.mapSlicer.startATourState);
//   const runningTourData = useSelector((state)=>state.mapSlicer.runningTourData);
//   const mapRef = useRef();
//   const lastLocation = useRef(null);
//   const firstFix = useRef(true);
//   const getATourLoading = getATourByIdStateData?.loading;
//   const getATourData = getATourByIdStateData?.data?.data;
//   const startATourLoading = startATourStateData?.loading;
//   const startATourData = startATourStateData?.data?.data;

//   const fetchATour = async ()=>{
//     try {
//       const url = `${import.meta.env.VITE_TOUR_MAIN_URL}/${tourId}`;
//       const result = await dispatch(getATourByIdApi({
//         url,
//         data:[]
//       }));
//       if(getATourByIdApi.fulfilled.match(result)){
//         // show pop up
//       }else if(getATourByIdApi.rejected.match(result)){
//         // show pop up
//         console.log('error',result.payload);
        
//       }
//     } catch (error) {
//       console.log('error',error.message);
//       // show pop up 
//     }
//   }
//   useEffect(() => {
//     if (!navigator.geolocation) {
//       alert("Geolocation is not supported by this browser.");
//       return;
//     }
  
//     const watchId = navigator.geolocation.watchPosition(
//       (position) => {
//         const lng = position.coords.longitude;
//         const lat = position.coords.latitude;
  
//         const location = [lng, lat];
  
//         // Update current marker
//         setCurrentLocation(location);
  
//         const bearing =
//           position.coords.heading != null
//             ? position.coords.heading
//             : heading;
  
//         setHeading(bearing);
  
//         if (!mapRef.current) return;
  
//         // Only move camera on the very first GPS fix
//         if (firstFix.current) {
//           firstFix.current = false;
  
//           lastLocation.current = location;
  
//           mapRef.current.flyTo({
//             center: location,
//             zoom: 17,
//             pitch: 60,
//             bearing,
//             duration: 1200,
//           });
  
//           return;
//         }
  
//         // Save latest location
//         lastLocation.current = location;
  
//         // IMPORTANT:
//         // Do NOT call flyTo() or easeTo() here.
//         // Only the marker position changes.
//       },
//       (err) => {
//         console.error(err);
//       },
//       {
//         enableHighAccuracy: true,
//         maximumAge: 1000,
//         timeout: 10000,
//       }
//     );
  
//     return () => {
//       navigator.geolocation.clearWatch(watchId);
//     };
//   }, []);

//   useEffect(()=>{
//     // call api with current location
//     // update td for every 10m or 30m or 1hr
//     if(getATourLoading===loadingStates.IDLE){
//       fetchATour();
//     }
//   },[getATourLoading]);

//   const handleStartTour = async ()=>{
//     try {
//       const url = import.meta.env.VITE_START_TOUR.replace(':tourId',tourId);
//       // [lng,lat] = cl
//       console.log('cl',currentLocation);
      
//       const location = {
//         longitude:currentLocation[0],
//         latitude:currentLocation[1],
//       }
//       const result = await dispatch(startATourApi({
//         url,
//         data: location
//       }));
//       if(startATourApi.fulfilled.match(result)){
//         console.log('fetched successfully!');
//         const required = result.payload.data;
//         dispatch(containRunningTourData(required));
//         // show pop up
//       }else if(startATourApi.rejected.match(result)){
//         // show pop up
//         console.log('error',result.payload);
        
//       }
//     } catch (error) {
//       console.log('error',error.message);
//     }
//   };


//   return (
//     <>
//       <VisitTourMapFloatingComponent
//       currentLocation={currentLocation}
//       handleStartTour={handleStartTour}
//       />
//       <VisitTourMap
//       currentLocation={currentLocation}
//       setCurrentLocation={setCurrentLocation}
//       runningTourData={runningTourData}
//       setHeading={setHeading}
//       heading={heading}
//       mapRef={mapRef}
//       lastLocation={lastLocation}
//       firstFix={firstFix}
//       />
      
//     </>
//   )
// }

// export default VisitTour;
