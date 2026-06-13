import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";

const ContributionFloater = () => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center", // centers inside any container
        p: 1,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 220, //  prevents over-expansion
          borderRadius: 3,
          background:
            "linear-gradient(135deg, #00c6ff 0%, #0072ff 50%, #00c6ff 100%)",
          backgroundSize: "400% 400%",
          animation: "waterFlow 12s ease infinite",

          "@keyframes waterFlow": {
            "0%": { backgroundPosition: "0% 50%" },
            "50%": { backgroundPosition: "100% 50%" },
            "100%": { backgroundPosition: "0% 50%" },
          },
          boxShadow: `
  inset 0 1px 1px rgba(255,255,255,0.25),
  0 10px 30px rgba(0,114,255,0.25),
  0 20px 60px rgba(0,198,255,0.20)
`,
          // boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
          // background:
          //   "linear-gradient(135deg, #0077B6 0%, #00B4D8 50%, #90E0EF 100%)",
        }}
      >
        <CardContent sx={{ textAlign: "center", p: 1 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: "bold",
              color: "white",
              mb: 1,
              fontSize: "0.95rem",
            }}
          >
            Contribute
          </Typography>

          <Box
            component="img"
            src="/images/myTrimQrCode.jpeg"
            alt="QR Code"
            sx={{
              width: "100%",
              maxWidth: 160,
              height: "auto",
              borderRadius: 2,
              mx: "auto",
              display: "block",
            }}
          />

          <Typography
            variant="body2"
            sx={{
              color: "#f1f1f1",
              fontSize: "0.75rem",
              mt: 0.5,
            }}
          >
            Scan & Pay
          </Typography>

          <Typography
            variant="body2"
            sx={{
              fontWeight: "bold",
              mt: 1,
              color: "#f1f1f1",
              // color: "#000",
              fontSize: "0.8rem",
            }}
          >
            +91 9182522387
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ContributionFloater;




// import React from "react";
// import { Box, Card, CardContent, Typography, Divider } from "@mui/material";

// const ContributionFloater = () => {
//   return (
//     <Box
//       sx={{
//         width: "100%",
//         p: 1,
//         // height:'200px',
//         // backgroundColor:'blue'
//       }}
//     >
//       <Card
//         sx={{
//           borderRadius: 3,
//           boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
//         //   background: "linear-gradient(145deg, #ffffff, #f4f7ff)",
//         background: "linear-gradient(135deg, #0077B6 0%, #00B4D8 50%, #90E0EF 100%)",
//             filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
//         }}
//       >
//         <CardContent sx={{ textAlign: "center", p: 1 }}>
//           <Typography
//             variant="h7"
//             sx={{
//               fontWeight: "bold",
//               color: "white",
//             //   color: "#1976d2",
//               mb: 1,
//             }}
//           >
//             Contribute
//           </Typography>

//           <Box
//             component="img"
//             src="/images/myTrimQrCode.jpeg"
//             alt="QR Code"
//             sx={{
//               width: "100%",
//               maxWidth: 180,
//             //   height: "150px",
//               height: "auto",
//               borderRadius: 2,
//             //   mb: 1,
//               mx: "auto",
//             //   backgroundColor:'yellow'
//             }}
//           />

//           <Typography variant="body2" sx={{ 
//             color: "#333" 
//             // color: "text.secondary" 
//             }}>
//             Scan & Pay
//           </Typography>

//           <Typography
//             variant="body2"
//             sx={{
//               fontWeight: "bold",
//               mt: 1,
//               color: "black",
//             //   color: "#333",
//             }}
//           >
//             +91 9182522387
//             {/* +91 XXXXX XXXXX */}
//           </Typography>
//         </CardContent>
//       </Card>

//       {/* <Divider sx={{ my: 2 }} /> */}
//     </Box>
//   );
// };

// export default ContributionFloater;



// import React, { useRef, useState, useEffect } from "react";
// import { Card, CardContent, Typography, Box } from "@mui/material";

// const ContributionFloater = () => {
//   const boxRef = useRef(null);

//   const pos = useRef({
//     x: window.innerWidth - 280,
//     y: 120,
//   });

//   const offset = useRef({ x: 0, y: 0 });
//   const dragging = useRef(false);

//   const [, forceRender] = useState(0); // only for initial render if needed

//   const updatePosition = () => {
//     if (boxRef.current) {
//       boxRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
//     }
//   };

//   const onPointerDown = (e) => {
//     dragging.current = true;

//     const rect = boxRef.current.getBoundingClientRect();

//     offset.current = {
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top,
//     };

//     document.addEventListener("pointermove", onPointerMove);
//     document.addEventListener("pointerup", onPointerUp);
//   };

//   const onPointerMove = (e) => {
//     if (!dragging.current) return;

//     pos.current = {
//       x: e.clientX - offset.current.x,
//       y: e.clientY - offset.current.y,
//     };

//     updatePosition();
//   };

//   const onPointerUp = () => {
//     dragging.current = false;

//     document.removeEventListener("pointermove", onPointerMove);
//     document.removeEventListener("pointerup", onPointerUp);
//   };

//   useEffect(() => {
//     updatePosition();
//   }, []);

//   return (
//     <Box
//       ref={boxRef}
//       onPointerDown={onPointerDown}
//       sx={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         zIndex: 9999,
//         width: { xs: 220, sm: 240, md: 260 },
//         cursor: "grab",
//         userSelect: "none",
//       }}
//     >
//       <Card
//         sx={{
//           borderRadius: 3,
//           boxShadow: "0 15px 35px rgba(0,0,0,0.25)",
//           background: "linear-gradient(145deg, #ffffff, #f3f7ff)",
//         }}
//       >
//         <CardContent sx={{ textAlign: "center", p: 2 }}>
//           <Typography
//             variant="h6"
//             sx={{ fontWeight: "bold", color: "#1976d2", mb: 1 }}
//           >
//             Contribute
//           </Typography>

//           <Box
//             component="img"
//             src="/images/myTrimQrCode.jpeg"
//             alt="QR Code"
//             sx={{
//               width: "100%",
//               borderRadius: 2,
//               mb: 1,
//             }}
//           />

//           <Typography variant="body2">Scan & Pay</Typography>

//           <Typography sx={{ fontWeight: "bold", mt: 1 }}>
//             +91 XXXXX XXXXX
//           </Typography>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default ContributionFloater;




// import React, { useRef, useState } from "react";
// import { Card, CardContent, Typography, Box } from "@mui/material";

// const ContributionFloater = () => {
//   const cardRef = useRef(null);

//   const [position, setPosition] = useState({
//     x: window.innerWidth - 280,
//     y: 120,
//   });

//   const [dragging, setDragging] = useState(false);

//   const offsetRef = useRef({ x: 0, y: 0 });

//   const handlePointerDown = (e) => {
//     setDragging(true);

//     const rect = cardRef.current.getBoundingClientRect();

//     offsetRef.current = {
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top,
//     };

//     document.addEventListener("pointermove", handlePointerMove);
//     document.addEventListener("pointerup", handlePointerUp);
//   };

//   const handlePointerMove = (e) => {
//     if (!dragging) return;

//     setPosition({
//       x: e.clientX - offsetRef.current.x,
//       y: e.clientY - offsetRef.current.y,
//     });
//   };

//   const handlePointerUp = () => {
//     setDragging(false);
//     document.removeEventListener("pointermove", handlePointerMove);
//     document.removeEventListener("pointerup", handlePointerUp);
//   };

//   return (
//     <Box
//       ref={cardRef}
//       onPointerDown={handlePointerDown}
//       sx={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         transform: `translate(${position.x}px, ${position.y}px)`,
//         zIndex: 9999,
//         width: { xs: 220, sm: 240, md: 260 },
//         cursor: dragging ? "grabbing" : "grab",
//         userSelect: "none",
//       }}
//     >
//       <Card
//         sx={{
//           borderRadius: 3,
//           boxShadow: "0 15px 35px rgba(0,0,0,0.25)",
//           background: "linear-gradient(145deg, #ffffff, #f3f7ff)",
//         }}
//       >
//         <CardContent sx={{ textAlign: "center", p: 2 }}>
//           <Typography
//             variant="h6"
//             sx={{ fontWeight: "bold", color: "#1976d2", mb: 1 }}
//           >
//             Contribute
//           </Typography>

//           <Box
//             component="img"
//             src="/images/myTrimQrCode.jpeg"
//             alt="QR Code"
//             sx={{
//               width: "100%",
//               borderRadius: 2,
//               mb: 1,
//             }}
//           />

//           <Typography variant="body2">Scan & Pay</Typography>

//           <Typography sx={{ fontWeight: "bold", mt: 1 }}>
//             +91 XXXXX XXXXX
//           </Typography>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default ContributionFloater;




// import React from "react";
// import { Box, Card, CardContent, Typography } from "@mui/material";

// const ContributionFloater = () => {
//   return (
//     <Box
//       sx={{
//         position: "fixed",
//         right: { xs: 10, sm: 20, md: 30 },
//         top: "50%",
//         transform: "translateY(-50%)",
//         zIndex: 9999,
//         width: { xs: 160, sm: 200, md: 240 },
//       }}
//     >
//       <Card
//         sx={{
//           borderRadius: 3,
//           boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
//           backdropFilter: "blur(10px)",
//           background: "linear-gradient(145deg, #ffffff, #f3f6ff)",
//           transition: "0.3s ease",
//           "&:hover": {
//             transform: "scale(1.03)",
//             boxShadow: "0 18px 40px rgba(0,0,0,0.3)",
//           },
//         }}
//       >
//         <CardContent
//           sx={{
//             textAlign: "center",
//             padding: 2,
//           }}
//         >
//           <Typography
//             variant="h6"
//             sx={{
//               fontWeight: "bold",
//               mb: 1,
//               color: "#1976d2",
//             }}
//           >
//             Contribute
//           </Typography>

//           <Box
//             component="img"
//             src="/images/myTrimQrCode.jpeg"
//             alt="QR Code"
//             sx={{
//               width: "100%",
//               height: "auto",
//               borderRadius: 2,
//               mb: 1,
//               boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//             }}
//           />

//           <Typography variant="body2" sx={{ color: "text.secondary" }}>
//             Scan & Pay
//           </Typography>

//           <Typography
//             variant="body2"
//             sx={{
//               fontWeight: "bold",
//               mt: 1,
//               color: "#333",
//             }}
//           >
//             +91 XXXXX XXXXX
//           </Typography>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default ContributionFloater;