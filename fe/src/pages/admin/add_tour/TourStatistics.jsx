import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Box, Chip } from "@mui/material";

export const distanceInKm = (distance)=>{
    const d = (distance/1000).toFixed(2);
    return d+" km"
}
export default function TourStatistics(props) {
  const {place,visitCount} = props;

  

  return (
    <React.Fragment>
          <Box 
          sx={{
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            flexWrap:"wrap",
            gap:"10px",
            width:"100%"
          }}
          className="center topBtnContainers">
            <Chip
              label={`Total Places : ${place?.places?.length}`}
              variant="outlined"
            />
            <Chip label={`Visited : ${visitCount}`} variant="outlined" />
            <Chip label={`Tour Status : ${place?.status}`} variant="outlined" />
            <Chip
              label={`Distance bw places : ${distanceInKm(place?.totalDistance)}`}
              variant="outlined"
            />
            <Chip
              label={`Actual Total Distance from SL : ${distanceInKm(place?.actualTotalDistanceFromStartLocation)}`}
              variant="outlined"
            />
            <Chip
              label={`Visited Total Distance from SL : ${distanceInKm(place?.visitedTotalDistanceFromStartLocation)}`}
              variant="outlined"
            />
            <Chip
              label={`Actual Travelled Distance : ${distanceInKm(place?.actualTravelledDistance)}`}
              variant="outlined"
            />
            <Chip
              label={`Started Location Name : ${place?.startLocation?.displayName}`}
              variant="outlined"
            />
            {/* <Chip
              label={`Remaining Distance from CL : not available`}
              variant="outlined"
            /> */}
          </Box>
    </React.Fragment>
  );
}









// import * as React from "react";
// import Button from "@mui/material/Button";
// import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
// import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
// import DialogTitle from "@mui/material/DialogTitle";
// import useMediaQuery from "@mui/material/useMediaQuery";
// import { useTheme } from "@mui/material/styles";
// import { Box, Chip } from "@mui/material";

// const distanceInKm = (distance)=>{
//     const d = (distance/1000).toFixed(2);
//     return d+" km"
// }
// export default function TourStatistics(props) {
//   const {place,visitCount} = props;
//   const [open, setOpen] = React.useState(false);
//   const theme = useTheme();
//   const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  
//   const handleClickOpen = () => {
//     console.log('place in ts',place);
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   return (
//     <React.Fragment>
//       <Button variant="outlined" onClick={handleClickOpen}>
//         Tour Statistics
//       </Button>
//       <Dialog
//         fullScreen={fullScreen}
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="responsive-dialog-title"
//       >
//         <DialogTitle id="responsive-dialog-title">
//           {place?.name}
//         </DialogTitle>
//         <DialogContent>
//           <Box 
//           sx={{
//             display:"flex",
//             alignItems:"center",
//             justifyContent:"center",
//             flexWrap:"wrap",
//             gap:"10px",
//             width:"100%"
//           }}
//           className="center topBtnContainers">
//             <Chip
//               label={`Total Places : ${place?.places?.length}`}
//               variant="outlined"
//             />
//             <Chip label={`Visited : ${visitCount}`} variant="outlined" />
//             <Chip label={`Tour Status : ${place?.status}`} variant="outlined" />
//             <Chip
//               label={`Distance bw places : ${distanceInKm(place?.totalDistance)}`}
//               variant="outlined"
//             />
//             <Chip
//               label={`Total Distance from CL : not available`}
//               variant="outlined"
//             />
//             <Chip
//               label={`Remaining Distance from CL : not available`}
//               variant="outlined"
//             />
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} autoFocus>
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </React.Fragment>
//   );
// }





// import { Box, Chip } from '@mui/material';
// import React from 'react'

// const distanceInKm = (distance)=>{
//     const d = (distance/1000).toFixed(2);
//     return d+" km"
// }
// const TourStatistics = (props) => {

//     const {place,visitCount} = props;
//   return (
//     <>
//     <Box className="center topBtnContainers">
//               <Chip
//                 label={`Total Places : ${place?.places?.length}`}
//                 variant="outlined"
//               />
//               <Chip label={`Visited : ${visitCount}`} variant="outlined" />
//               <Chip
//                 label={`Tour Status : ${place?.status}`}
//                 variant="outlined"
//               />
//               <Chip
//                 label={`Distance bw places : ${distanceInKm(place?.totalDistance)}`}
//                 variant="outlined"
//               />
//               <Chip
//                 label={`Total Distance from CL : not available`}
//                 variant="outlined"
//               />
//               <Chip
//                 label={`Remaining Distance from CL : not available`}
//                 variant="outlined"
//               />
//     </Box>
//     </>
//   )
// }

// export default TourStatistics;
