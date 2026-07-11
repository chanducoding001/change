import React from 'react'
import PracticeRoot from '../practice_map/PracticeRoot';

const AddTour = () => {
  return (
    <>
    <PracticeRoot/>
    </>
  )
}

export default AddTour;





// import React, { useState } from "react";
// import { Box, Grid, Paper, Typography, Divider } from "@mui/material";

// import ImportTravelPaths from "./addTourComponents/ImportTravelPaths";
// import SearchPlace from "./addTourComponents/SearchPlace";
// import TourNodeList from "./addTourComponents/TourNodeList";
// import TourToolbar from "./addTourComponents/TourToolbar";
// import GISWorldMap from "./addTourMap/GISWorldMap";

// const AddTour = () => {
//   // --------------------------
//   // Tour Information
//   // --------------------------

//   const [tourName, setTourName] = useState("");

//   const [tourNodes, setTourNodes] = useState([]);

//   // --------------------------
//   // Selected Node
//   // --------------------------

//   const [selectedNode, setSelectedNode] = useState(null);

//   // --------------------------
//   // Graph Data
//   // --------------------------

//   const [travelEdges, setTravelEdges] = useState([]);

//   const [selectedRoute, setSelectedRoute] = useState([]);

//   // --------------------------
//   // Loading
//   // --------------------------

//   const [loading, setLoading] = useState(false);

//   return (
//     <Box sx={{
//       display: "flex",
//       height: "100vh",
//       overflow: "hidden",
//     }}>
//       <Box
//         sx={{
//           height: "100vh",
//           p: 2,
//         }}
//       >
//         <Grid
//           container
//           spacing={2}
//           sx={{
//             height: "100%",
//           }}
//         >
//           {/* ================= LEFT PANEL ================= */}

//           <Grid
//             item
//             xs={12}
//             md={4}
//             lg={3.5}
//             sx={{
//               height: "100%",
//             }}
//           >
//             <Paper
//               elevation={3}
//               sx={{
//                 height: "100%",
//                 overflow: "auto",
//                 p: 2,
//               }}
//             >
//               <Typography variant="h5" fontWeight="bold">
//                 Add Tour
//               </Typography>

//               <Typography variant="body2" color="text.secondary" mb={2}>
//                 Import places, search manually, build a tour and visualize it on
//                 the map.
//               </Typography>

//               <Divider sx={{ mb: 2 }} />

//               {/* Upload Excel */}

//               <ImportTravelPaths
//                 tourNodes={tourNodes}
//                 setTourNodes={setTourNodes}
//                 loading={loading}
//                 setLoading={setLoading}
//               />

//               <Divider sx={{ my: 3 }} />

//               {/* Search */}

//               <SearchPlace tourNodes={tourNodes} setTourNodes={setTourNodes} />

//               <Divider sx={{ my: 3 }} />

//               {/* Selected Nodes */}

//               <TourNodeList
//                 nodes={tourNodes}
//                 setNodes={setTourNodes}
//                 selectedNode={selectedNode}
//                 setSelectedNode={setSelectedNode}
//               />

//               <Divider sx={{ my: 3 }} />

//               {/* Toolbar */}

//               <TourToolbar
//                 tourName={tourName}
//                 setTourName={setTourName}
//                 nodes={tourNodes}
//                 travelEdges={travelEdges}
//                 setTravelEdges={setTravelEdges}
//                 selectedRoute={selectedRoute}
//                 setSelectedRoute={setSelectedRoute}
//               />
//             </Paper>
//           </Grid>

//           {/* ================= MAP ================= */}

//           {/* <Grid
//           item
//           xs={12}
//           md={8}
//           lg={8.5}
//           sx={{
//             height: "100%",
//           }}
//         >
//           <Paper
//             elevation={3}
//             sx={{
//               height: "100%",
//               overflow: "hidden",
//             }}
//           >
//             <GISWorldMap
//               tourNodes={tourNodes}
//               selectedNode={selectedNode}
//               setSelectedNode={setSelectedNode}
//               travelEdges={travelEdges}
//               selectedRoute={selectedRoute}
//             />
//           </Paper>
//         </Grid> */}
//         </Grid>
//       </Box>
//       <GISWorldMap
//         tourNodes={tourNodes}
//         selectedNode={selectedNode}
//         setSelectedNode={setSelectedNode}
//         travelEdges={travelEdges}
//         selectedRoute={selectedRoute}
//       />
//     </Box>
//   );
// };

// export default AddTour;





// import React from 'react'
// import ImportTravelPaths from './ImportTravelPaths';
// import GISWorldMap from './GISWorldMap';

// const AddTour = () => {

//   return (
//     <>
//     <ImportTravelPaths/>
//     <GISWorldMap/>
//     </>
//   )
// }

// export default AddTour;
