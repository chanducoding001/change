import React, { useEffect, useRef, useState } from "react";
import PracticeUpload from "./PracticeUpload";
import ConnectRoute from "./ConnectRoute";
import PracticeMap from "./PracticeMap";
import { Box } from "@mui/material";
import ManualSearchAddRoute from "./ManualSearchAddRoute";

const PracticeRoot = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [tourNodes, setTourNodes] = useState([]);
  const [travelDestinations, setTravelDestinations] = useState([]);
  const [heading, setHeading] = useState(0);
  const mapRef = useRef();
  const lastLocation = useRef(null);
  const firstFix = useRef(true);

  // current location form in practice map itself
  // heading, mapref are required for current location in practice map itself 
  // tour nodes, remove nodes form in practice upload component after uploading the sheet
  // travel destinations form in connect route component after clicking the connect button

  // if the tour node route and location is not fetched/available, you need an option to manually search and add the route to all the travel destinations
  
  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Box>
        <ConnectRoute
          setTravelDestinations={setTravelDestinations}
          tourNodes={tourNodes}
          currentLocation={currentLocation}
        />
        <PracticeUpload tourNodes={tourNodes} setTourNodes={setTourNodes} />
      </Box>

      <Box
        sx={{
          width: "80%",
          height: "100%",
          margin:'20px 0 0 20px',

        }}
      >
        <ManualSearchAddRoute
        currentLocation={currentLocation}
        travelDestinations={travelDestinations}
        setTravelDestinations={setTravelDestinations}
        />
        <PracticeMap
          currentLocation={currentLocation}
          setCurrentLocation={setCurrentLocation}
          tourNodes={tourNodes}
          setTravelDestinations={setTravelDestinations}
          travelDestinations={travelDestinations}
          heading={heading}
          setHeading={setHeading}
          mapRef={mapRef}
          lastLocation={lastLocation}
          firstFix={firstFix}
          
        />
      </Box>
    </Box>
  );
};

export default PracticeRoot;
