import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";

/* --- Simple icons unchanged --- */
const Icon = ({ color, path }) => (
  <svg width="58" height="58" viewBox="0 0 100 100">
    <path d={path} fill="none" stroke={color} strokeWidth="2" />
  </svg>
);

const cards = [
  {
    title: "Water Conservation",
    subtitle: "Vitality of Life",
    color: "#ffffff",
    icon: <Icon color="#ffffff" path="M50 10 C40 30,20 45,20 65 a30 30 0 0 0 60 0 C80 45,60 30,50 10z" />,
  },
  {
    title: "Natural Farming",
    subtitle: "Harmony with Nature",
    color: "#eaffea",
    // icon: <Icon color="#eaffea" path="M10 70 Q50 40 90 70 M20 70 Q50 50 80 70" />,
    icon: (
    <svg width="58" height="58" viewBox="0 0 100 100">
      {/* soil */}
      <path
        d="M20 70 Q50 60 80 70"
        fill="none"
        stroke="#eaffea"
        strokeWidth="2"
      />

      {/* stem */}
      <path
        d="M50 70 L50 40"
        fill="none"
        stroke="#eaffea"
        strokeWidth="2"
      />

      {/* left leaf */}
      <path
        d="M50 55 Q35 45 40 35 Q50 40 50 55"
        fill="none"
        stroke="#eaffea"
        strokeWidth="2"
      />

      {/* right leaf */}
      <path
        d="M50 55 Q65 45 60 35 Q50 40 50 55"
        fill="none"
        stroke="#eaffea"
        strokeWidth="2"
      />
    </svg>)
  },
  {
    title: "Quality of Thought",
    subtitle: "Inner Balance",
    color: "#f3eaff",
    icon: <Icon color="#f3eaff" path="M30 50 Q50 30 70 50 Q50 70 30 50" />,
  },
//   {
//     title: "Quality of Life",
//     subtitle: "Human Well-being",
//     color: "#fff3e0",
//     icon: <Icon color="#fff3e0" path="M50 20 L50 80 M20 50 L80 50" />,
//   },
//   {
//     title: "Balanced Economy",
//     subtitle: "Sustainable Growth",
//     color: "#e0ffff",
//     icon: <Icon color="#e0ffff" path="M20 70 L40 50 L60 60 L80 30" />,
//   },
];

export default function SustainabilityCards() {
  return (
    <Box
      sx={{
        // minHeight: "100%",
        // minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection:'column',
        alignItems: "center",
        py:2
        /* 🌊 YOUR WATER BACKGROUND (kept intact) */
        // background:
        //   "linear-gradient(135deg, #00c6ff 0%, #0072ff 50%, #00c6ff 100%)",
        // backgroundSize: "400% 400%",
        // animation: "waterFlow 12s ease infinite",

        // "@keyframes waterFlow": {
        //   "0%": { backgroundPosition: "0% 50%" },
        //   "50%": { backgroundPosition: "100% 50%" },
        //   "100%": { backgroundPosition: "0% 50%" },
        // },

        // p: 3,
      }}
    >
        {/* 🌿 TITLE */}
  <Typography
    variant="h4"
    sx={{
      width: "100%",
      textAlign: "center",
      fontWeight: 700,
      color: "#fff",
      mb: 2,
      letterSpacing: "2px",
      textShadow: "0 0 20px rgba(0,0,0,0.3)",
    //   fontFamily: "'Poppins', sans-serif",
    }}
  >
   {/* Foundations of Life */}
    Roots of Life
  </Typography>
      {/* CARD CONTAINER (glass layer) */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "center",
          maxWidth: "1200px",

          /* 🌫️ subtle glass overlay so cards blend into water */
          backdropFilter: "blur(2px)",
        }}
      >
        {cards.map((item, index) => (
          <Card
            key={index}
            sx={{
              width: 230,
              height: 260,

              /* 🌊 GLASSMORPHISM */
              background: "rgba(255, 255, 255, 0.10)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.25)",

              borderRadius: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",

              boxShadow:
                "0 8px 32px rgba(0, 0, 0, 0.15)",

              transition: "0.3s",

              "&:hover": {
                transform: "translateY(-6px) scale(1.03)",
                boxShadow:
                  "0 12px 40px rgba(0, 0, 0, 0.25)",
                background: "rgba(255, 255, 255, 0.18)",
              },
            }}
          >
            {item.icon}

            <CardContent sx={{ p: 1 }}>
              <Typography
                variant="subtitle1"
                fontWeight="700"
                sx={{ color: item.color }}
              >
                {item.title}
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                {item.subtitle}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}




// import React from "react";
// import { Box, Card, CardContent, Typography } from "@mui/material";

// /* --- Icons (same simple sketch style) --- */
// const Icon = ({ color, path }) => (
//   <svg width="58" height="58" viewBox="0 0 100 100">
//     <path d={path} fill="none" stroke={color} strokeWidth="2" />
//   </svg>
// );

// const cards = [
//   {
//     title: "Water Conservation",
//     subtitle: "Vitality of Life",
//     color: "#1E88E5",
//     bg: "#EAF4FF",
//     icon: <Icon color="#1E88E5" path="M50 10 C40 30,20 45,20 65 a30 30 0 0 0 60 0 C80 45,60 30,50 10z" />,
//   },
//   {
//     title: "Natural Farming",
//     subtitle: "Harmony with Nature",
//     color: "#2E7D32",
//     bg: "#EAF7EE",
//     icon: <Icon color="#2E7D32" path="M10 70 Q50 40 90 70 M20 70 Q50 50 80 70" />,
//   },
//   {
//     title: "Quality of Thought",
//     subtitle: "Inner Balance",
//     color: "#6A1B9A",
//     bg: "#F3EAFB",
//     icon: <Icon color="#6A1B9A" path="M30 50 Q50 30 70 50 Q50 70 30 50" />,
//   },
//   {
//     title: "Quality of Life",
//     subtitle: "Human Well-being",
//     color: "#EF6C00",
//     bg: "#FFF1E6",
//     icon: <Icon color="#EF6C00" path="M50 20 L50 80 M20 50 L80 50" />,
//   },
//   {
//     title: "Balanced Economy",
//     subtitle: "Sustainable Growth",
//     color: "#00897B",
//     bg: "#E6F6F4",
//     icon: <Icon color="#00897B" path="M20 70 L40 50 L60 60 L80 30" />,
//   },
// ];

// export default function SustainabilityCards() {
//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         width: "100%",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         background:
//           "linear-gradient(180deg, #F7FAF7 0%, #EEF5EE 100%)",
//         p: 3,
//       }}
//     >
//       <Box
//         sx={{
//           display: "flex",
//           flexWrap: "wrap",
//           gap: 2.5,
//           justifyContent: "center",
//           maxWidth: "1200px",
//         }}
//       >
//         {cards.map((item, index) => (
//           <Card
//             key={index}
//             sx={{
//               width: 230,
//               height: 260,
//               borderRadius: 3,
//               background: item.bg,
//               boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               justifyContent: "center",
//               textAlign: "center",
//               transition: "0.25s",

//               "&:hover": {
//                 transform: "translateY(-6px)",
//                 boxShadow: "0 14px 28px rgba(0,0,0,0.12)",
//               },
//             }}
//           >
//             {item.icon}

//             <CardContent sx={{ p: 1 }}>
//               <Typography
//                 variant="subtitle1"
//                 fontWeight="700"
//                 color={item.color}
//               >
//                 {item.title}
//               </Typography>

//               <Typography variant="caption" sx={{ opacity: 0.65 }}>
//                 {item.subtitle}
//               </Typography>
//             </CardContent>
//           </Card>
//         ))}
//       </Box>
//     </Box>
//   );
// }



// import React from "react";
// import { Box, Card, CardContent, Typography } from "@mui/material";

// /* --- Simple Sketch Icons --- */
// const Icon = ({ color, path }) => (
//   <svg width="60" height="60" viewBox="0 0 100 100">
//     <path
//       d={path}
//       fill="none"
//       stroke={color}
//       strokeWidth="2"
//     />
//   </svg>
// );

// const cards = [
//   {
//     title: "Water Conservation",
//     subtitle: "Vitality of Life",
//     color: "#1976d2",
//     icon: (
//       <Icon
//         color="#1976d2"
//         path="M50 10 C40 30, 20 45, 20 65 a30 30 0 0 0 60 0 C80 45, 60 30, 50 10z"
//       />
//     ),
//   },
//   {
//     title: "Natural Farming",
//     subtitle: "Harmony with Nature",
//     color: "#2e7d32",
//     icon: (
//       <Icon
//         color="#2e7d32"
//         path="M10 70 Q50 40 90 70 M20 70 Q50 50 80 70"
//       />
//     ),
//   },
//   {
//     title: "Quality of Thought",
//     subtitle: "Inner Balance",
//     color: "#6a1b9a",
//     icon: (
//       <Icon
//         color="#6a1b9a"
//         path="M30 50 Q50 30 70 50 Q50 70 30 50"
//       />
//     ),
//   },
//   {
//     title: "Quality of Life",
//     subtitle: "Well-being",
//     color: "#ef6c00",
//     icon: (
//       <Icon
//         color="#ef6c00"
//         path="M50 20 L50 80 M20 50 L80 50"
//       />
//     ),
//   },
//   {
//     title: "Balanced Economy",
//     subtitle: "Sustainable Growth",
//     color: "#00897b",
//     icon: (
//       <Icon
//         color="#00897b"
//         path="M20 70 L40 50 L60 60 L80 30"
//       />
//     ),
//   },
// ];

// export default function SustainabilityCards() {
//   return (
//     <Box
//       sx={{
//         width: "100%",
//         minHeight: "100vh",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         background: "#f5f6f8",
//         p: 2,
//       }}
//     >
//       {/* ROW CONTAINER */}
//       <Box
//         sx={{
//           display: "flex",
//           gap: 2,
//           flexWrap: "wrap",     // responsive wrap
//           justifyContent: "center",
//           width: "100%",
//           maxWidth: "1300px",
//         }}
//       >
//         {cards.map((item, index) => (
//           <Card
//             key={index}
//             sx={{
//               width: 220,          // 👈 decent fixed width
//               height: 260,         // 👈 equal height
//               borderRadius: 3,
//               display: "flex",
//               flexDirection: "column",
//               justifyContent: "center",
//               alignItems: "center",
//               textAlign: "center",
//               p: 2,
//               boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
//               transition: "0.25s",

//               "&:hover": {
//                 transform: "translateY(-5px)",
//                 boxShadow: "0 12px 26px rgba(0,0,0,0.15)",
//               },
//             }}
//           >
//             {item.icon}

//             <CardContent sx={{ p: 1 }}>
//               <Typography
//                 variant="subtitle1"
//                 fontWeight="700"
//                 color={item.color}
//               >
//                 {item.title}
//               </Typography>

//               <Typography variant="caption" sx={{ opacity: 0.7 }}>
//                 {item.subtitle}
//               </Typography>
//             </CardContent>
//           </Card>
//         ))}
//       </Box>
//     </Box>
//   );
// }




// import React from "react";
// import { Box, Card, CardContent, Typography, Grid } from "@mui/material";

// /* --- Sketch Icons --- */

// const WaterSketch = () => (
//   <svg width="80" height="80" viewBox="0 0 100 100">
//     <path
//       d="M50 10 C40 30, 20 45, 20 65 a30 30 0 0 0 60 0 C80 45, 60 30, 50 10z"
//       fill="none"
//       stroke="#1976d2"
//       strokeWidth="2"
//     />
//   </svg>
// );

// const FarmSketch = () => (
//   <svg width="80" height="80" viewBox="0 0 100 100">
//     <path d="M10 70 Q50 40 90 70" stroke="#2e7d32" fill="none" strokeWidth="2" />
//     <path d="M20 70 Q50 50 80 70" stroke="#2e7d32" fill="none" strokeWidth="2" />
//   </svg>
// );

// const MindSketch = () => (
//   <svg width="80" height="80" viewBox="0 0 100 100">
//     <circle cx="50" cy="50" r="30" fill="none" stroke="#6a1b9a" strokeWidth="2" />
//     <path d="M30 50 Q50 30 70 50 Q50 70 30 50" fill="none" stroke="#6a1b9a" strokeWidth="2" />
//   </svg>
// );

// const LifeSketch = () => (
//   <svg width="80" height="80" viewBox="0 0 100 100">
//     <circle cx="50" cy="50" r="28" fill="none" stroke="#ef6c00" strokeWidth="2" />
//     <path d="M50 22 L50 78" stroke="#ef6c00" strokeWidth="2" />
//     <path d="M22 50 L78 50" stroke="#ef6c00" strokeWidth="2" />
//   </svg>
// );

// const EconomySketch = () => (
//   <svg width="80" height="80" viewBox="0 0 100 100">
//     <path d="M20 70 L40 50 L55 60 L80 30" fill="none" stroke="#00897b" strokeWidth="2" />
//     <circle cx="20" cy="70" r="2" fill="#00897b" />
//     <circle cx="40" cy="50" r="2" fill="#00897b" />
//     <circle cx="55" cy="60" r="2" fill="#00897b" />
//     <circle cx="80" cy="30" r="2" fill="#00897b" />
//   </svg>
// );

// /* --- Card Data --- */
// const cards = [
//   {
//     title: "Water Conservation",
//     subtitle: "Vitality of Life",
//     description:
//       "Water sustains all life systems. Its conservation ensures ecological balance and future survival.",
//     icon: <WaterSketch />,
//     color: "#1976d2",
//   },
//   {
//     title: "Natural Farming",
//     subtitle: "Harmony with Nature",
//     description:
//       "Restores soil health and biodiversity while avoiding chemical dependency.",
//     icon: <FarmSketch />,
//     color: "#2e7d32",
//   },
//   {
//     title: "Quality of Thought",
//     subtitle: "Inner Sustainability",
//     description:
//       "Balanced thinking leads to better decisions and a healthier society.",
//     icon: <MindSketch />,
//     color: "#6a1b9a",
//   },
//   {
//     title: "Quality of Life",
//     subtitle: "Human Well-being",
//     description:
//       "A balanced life integrates health, happiness, purpose, and sustainable living.",
//     icon: <LifeSketch />,
//     color: "#ef6c00",
//   },
//   {
//     title: "Balanced Economic Growth",
//     subtitle: "Sustainable Development",
//     description:
//       "Economic growth aligned with environmental protection ensures long-term prosperity.",
//     icon: <EconomySketch />,
//     color: "#00897b",
//   },
// ];

// export default function SustainabilityCards() {
//   return (
//     <Box sx={{ p: 4, background: "#f4f6f8" }}>
//       <Grid container spacing={3} justifyContent="center">

//         {cards.map((item, index) => (
//           <Grid
//             item
//             xs={12}
//             sm={6}
//             md={4}
//             key={index}
//             display="flex"
//             justifyContent="center"
//           >
//             <Card
//               sx={{
//                 width: 320,
//                 borderRadius: 4,
//                 textAlign: "center",
//                 p: 2,
//                 boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
//                 transition: "0.3s",
//                 "&:hover": {
//                   transform: "translateY(-6px)",
//                   boxShadow: "0 14px 32px rgba(0,0,0,0.15)",
//                 },
//               }}
//             >
//               <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
//                 {item.icon}
//               </Box>

//               <CardContent>
//                 <Typography variant="h6" fontWeight="700" color={item.color}>
//                   {item.title}
//                 </Typography>

//                 <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.7 }}>
//                   {item.subtitle}
//                 </Typography>

//                 <Typography variant="body2" color="text.secondary">
//                   {item.description}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}

//       </Grid>
//     </Box>
//   );
// }




// import React from "react";
// import { Box, Card, CardContent, Typography, Grid } from "@mui/material";

// /* --- Simple inline SVG illustrations --- */
// const WaterSketch = () => (
//   <svg width="80" height="80" viewBox="0 0 100 100">
//     <path
//       d="M50 10 C40 30, 20 45, 20 65 a30 30 0 0 0 60 0 C80 45, 60 30, 50 10z"
//       fill="none"
//       stroke="#1976d2"
//       strokeWidth="2"
//     />
//     <circle cx="45" cy="60" r="3" fill="#1976d2" />
//     <circle cx="55" cy="60" r="3" fill="#1976d2" />
//     <path
//       d="M40 70 Q50 78 60 70"
//       stroke="#1976d2"
//       fill="none"
//       strokeWidth="2"
//     />
//   </svg>
// );

// const FarmSketch = () => (
//   <svg width="80" height="80" viewBox="0 0 100 100">
//     <path d="M10 70 Q50 40 90 70" stroke="#2e7d32" fill="none" strokeWidth="2" />
//     <path d="M20 70 Q50 50 80 70" stroke="#2e7d32" fill="none" strokeWidth="2" />
//     <circle cx="50" cy="35" r="8" fill="none" stroke="#2e7d32" strokeWidth="2" />
//     <path d="M50 43 L50 70" stroke="#2e7d32" strokeWidth="2" />
//   </svg>
// );

// const MindSketch = () => (
//   <svg width="80" height="80" viewBox="0 0 100 100">
//     <circle cx="50" cy="50" r="30" fill="none" stroke="#6a1b9a" strokeWidth="2" />
//     <path
//       d="M30 50 Q50 30 70 50 Q50 70 30 50"
//       fill="none"
//       stroke="#6a1b9a"
//       strokeWidth="2"
//     />
//     <circle cx="50" cy="50" r="5" fill="#6a1b9a" />
//   </svg>
// );

// const cards = [
//   {
//     title: "Water Conservation",
//     subtitle: "Vitality of Life",
//     description:
//       "Water is essential for all living systems. Conserving it ensures ecological balance and future survival.",
//     icon: <WaterSketch />,
//     color: "#1976d2",
//   },
//   {
//     title: "Natural Farming",
//     subtitle: "Harmony with Nature",
//     description:
//       "Natural farming restores soil health and strengthens biodiversity without chemical dependency.",
//     icon: <FarmSketch />,
//     color: "#2e7d32",
//   },
//   {
//     title: "Quality of Thought",
//     subtitle: "Inner Sustainability",
//     description:
//       "Clear thinking shapes better actions, leading to balanced life and society.",
//     icon: <MindSketch />,
//     color: "#6a1b9a",
//   },
// ];

// export default function SustainabilityCards() {
//   return (
//     <Box sx={{ p: 4, background: "#f4f6f8" }}>
//       <Grid container spacing={3} justifyContent="center">

//         {cards.map((item, index) => (
//           <Grid item xs={12} md={4} key={index} display="flex" justifyContent="center">
//             <Card
//               sx={{
//                 width: 320, // 👈 controlled width (decent + clean)
//                 borderRadius: 4,
//                 textAlign: "center",
//                 p: 2,
//                 boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
//                 transition: "0.3s",
//                 "&:hover": {
//                   transform: "translateY(-6px)",
//                   boxShadow: "0 14px 32px rgba(0,0,0,0.15)",
//                 },
//               }}
//             >
//               <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
//                 {item.icon}
//               </Box>

//               <CardContent>
//                 <Typography variant="h6" fontWeight="700" color={item.color}>
//                   {item.title}
//                 </Typography>

//                 <Typography
//                   variant="subtitle2"
//                   sx={{ mb: 1, opacity: 0.7 }}
//                 >
//                   {item.subtitle}
//                 </Typography>

//                 <Typography variant="body2" color="text.secondary">
//                   {item.description}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}

//       </Grid>
//     </Box>
//   );
// }