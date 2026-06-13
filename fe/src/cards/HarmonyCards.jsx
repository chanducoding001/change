import React from "react";
import { Box, Card, Typography } from "@mui/material";

/* ---------- ICON WRAPPER ---------- */
const Icon = ({ children }) => (
  <svg width="58" height="58" viewBox="0 0 100 100">
    {children}
  </svg>
);

const WHITE = "rgba(255,255,255,0.9)";

/* ---------- CARDS DATA ---------- */
const cards = [
  {
    title: "Primordial Water Harmony",
    text: "Early Earth was pure water balance — oceans and rivers flowed without pollution, sustaining life in its purest form.",
    icon: (
      <Icon>
        <path
          d="M50 10 C35 30, 20 45, 20 65 A30 30 0 0 0 80 65 C80 45, 65 30, 50 10Z"
          fill="none"
          stroke={WHITE}
          strokeWidth="2"
        />
      </Icon>
    ),
  },
  {
    title: "Natural Farming Era",
    text: "Soil, seed, and sun worked in harmony — agriculture was chemical-free and deeply connected to nature’s rhythm.",
    icon: (
      <Icon>
        <path d="M20 70 Q50 30 80 70" fill="none" stroke={WHITE} strokeWidth="2" />
        <path d="M40 70 Q50 50 60 70" fill="none" stroke={WHITE} strokeWidth="2" />
      </Icon>
    ),
  },
  {
    title: "Pure Thought Civilization",
    text: "Human thought was calm, centered, and connected — decisions were guided by awareness rather than chaos.",
    icon: (
      <Icon>
        <circle cx="50" cy="50" r="18" fill="none" stroke={WHITE} strokeWidth="2" />
        <circle cx="50" cy="50" r="5" fill={WHITE} />
      </Icon>
    ),
  },
  {
    title: "Earth as Heaven",
    text: "Early life on Earth reflected natural beauty — forests, rivers, and skies existed in untouched perfection.",
    icon: (
      <Icon>
        <path d="M20 70 L50 30 L80 70 Z" fill="none" stroke={WHITE} strokeWidth="2" />
      </Icon>
    ),
  },
  {
    title: "Human-Nature Balance",
    text: "Humans lived as part of nature, not above it — there was no pollution, only coexistence and respect.",
    icon: (
      <Icon>
        <circle cx="35" cy="60" r="10" fill="none" stroke={WHITE} strokeWidth="2" />
        <circle cx="65" cy="60" r="10" fill="none" stroke={WHITE} strokeWidth="2" />
      </Icon>
    ),
  },
  {
    title: "Universal Harmony",
    text: "All life forms coexisted in unity — energy, earth, water, and consciousness flowed as one system.",
    icon: (
      <Icon>
        <circle cx="50" cy="50" r="20" fill="none" stroke={WHITE} strokeWidth="2" />
        <circle cx="50" cy="50" r="8" fill={WHITE} />
      </Icon>
    ),
  },
];

/* ---------- COMPONENT (UNCHANGED UI) ---------- */
export default function HarmonyCards() {
  return (
    <Box
      sx={{
        // minHeight: "100vh",
        width: "100%",
        my:3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        // backgroundColor:'yellow'

        // background:
        //   "linear-gradient(135deg, #00c6ff 0%, #0072ff 50%, #00c6ff 100%)",
        // backgroundSize: "400% 400%",
        // animation: "waterFlow 12s ease infinite",

        // "@keyframes waterFlow": {
        //   "0%": { backgroundPosition: "0% 50%" },
        //   "50%": { backgroundPosition: "100% 50%" },
        //   "100%": { backgroundPosition: "0% 50%" },
        // },
        // boxShadow: `
        //   0 10px 30px rgba(0,0,0,0.15),
        //   inset 0 1px 1px rgba(255,255,255,0.25)
        // `,
        // py: 4,
        // px: 2,
        
      }}
    >
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          fontWeight: 700,
          color: "#fff",
          mb: 4,
          letterSpacing: "2px",
          textShadow: "0 0 20px rgba(0,0,0,0.3)",
        }}
      >
        Roots of Harmony
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 4,
          // maxWidth: "1100px",
          width: "100%",
        }}
      >
        {cards.map((c, i) => (
          <Card
            key={i}
            sx={{
              width: 260,
              height: 280,

              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 5,

              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",

              boxShadow: "0 12px 35px rgba(0,0,0,0.18)",

              transition: "0.35s ease",

              "&:hover": {
                transform: "translateY(-8px) scale(1.04)",
                background: "rgba(255,255,255,0.18)",
                boxShadow: "0 18px 45px rgba(0,0,0,0.25)",
              },
            }}
          >
            <Box sx={{ mb: 1 }}>{c.icon}</Box>

            <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#fff" }}>
              {c.title}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: "rgba(255,255,255,0.75)",
                mt: 1,
                px: 1,
              }}
            >
              {c.text}
            </Typography>
          </Card>
        ))}
      </Box>
    </Box>
  );
}





// import React from "react";
// import { Box, Card, Typography } from "@mui/material";

// /* ---------- SIMPLE SKETCH ICON ---------- */
// const Icon = ({ children }) => (
//   <svg width="58" height="58" viewBox="0 0 100 100">
//     {children}
//   </svg>
// );

// /* ---------- CARDS DATA (UNCHANGED) ---------- */
// const cards = [
//   {
//     title: "Primordial Water Harmony",
//     text: "Early Earth was pure water balance — oceans and rivers flowed without pollution, sustaining life in its purest form.",
//     icon: (
//       <Icon>
//         <path d="M50 10 C35 30, 20 45, 20 65 A30 30 0 0 0 80 65 C80 45, 65 30, 50 10Z"
//           fill="none" stroke="#00c6ff" strokeWidth="2" />
//       </Icon>
//     ),
//   },
//   {
//     title: "Natural Farming Era",
//     text: "Soil, seed, and sun worked in harmony — agriculture was chemical-free and deeply connected to nature’s rhythm.",
//     icon: (
//       <Icon>
//         <path d="M20 70 Q50 30 80 70" fill="none" stroke="#2ecc71" strokeWidth="2" />
//         <path d="M40 70 Q50 50 60 70" fill="none" stroke="#2ecc71" strokeWidth="2" />
//       </Icon>
//     ),
//   },
//   {
//     title: "Pure Thought Civilization",
//     text: "Human thought was calm, centered, and connected — decisions were guided by awareness rather than chaos.",
//     icon: (
//       <Icon>
//         <circle cx="50" cy="50" r="18" fill="none" stroke="#0072ff" strokeWidth="2" />
//         <circle cx="50" cy="50" r="5" fill="#0072ff" />
//       </Icon>
//     ),
//   },
//   {
//     title: "Earth as Heaven",
//     text: "Early life on Earth reflected natural beauty — forests, rivers, and skies existed in untouched perfection.",
//     icon: (
//       <Icon>
//         <path d="M20 70 L50 30 L80 70 Z" fill="none" stroke="#8e44ad" strokeWidth="2" />
//       </Icon>
//     ),
//   },
//   {
//     title: "Human-Nature Balance",
//     text: "Humans lived as part of nature, not above it — there was no pollution, only coexistence and respect.",
//     icon: (
//       <Icon>
//         <circle cx="35" cy="60" r="10" fill="none" stroke="#16a085" strokeWidth="2" />
//         <circle cx="65" cy="60" r="10" fill="none" stroke="#16a085" strokeWidth="2" />
//       </Icon>
//     ),
//   },
//   {
//     title: "Universal Harmony",
//     text: "All life forms coexisted in unity — energy, earth, water, and consciousness flowed as one system.",
//     icon: (
//       <Icon>
//         <circle cx="50" cy="50" r="20" fill="none" stroke="#f39c12" strokeWidth="2" />
//         <circle cx="50" cy="50" r="8" fill="#f39c12" />
//       </Icon>
//     ),
//   },
// ];

// /* ---------- COMPONENT (UI FROM SUSTAINABILITY STYLE) ---------- */
// export default function HarmonyCards() {
//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         width: "100%",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",

//         background:
//           "linear-gradient(135deg, #00c6ff 0%, #0072ff 50%, #00c6ff 100%)",
//         backgroundSize: "400% 400%",
//         animation: "waterFlow 12s ease infinite",

//         "@keyframes waterFlow": {
//           "0%": { backgroundPosition: "0% 50%" },
//           "50%": { backgroundPosition: "100% 50%" },
//           "100%": { backgroundPosition: "0% 50%" },
//         },

//         py: 4,
//         px: 2,
//       }}
//     >
//       {/* TITLE (same style as SustainabilityCards) */}
//       <Typography
//         variant="h4"
//         sx={{
//           textAlign: "center",
//           fontWeight: 700,
//           color: "#fff",
//           mb: 4,
//           letterSpacing: "2px",
//           textShadow: "0 0 20px rgba(0,0,0,0.3)",
//         }}
//       >
//         Roots of Harmony
//       </Typography>

//       {/* CARDS WRAPPER (from SustainabilityCards UI) */}
//       <Box
//         sx={{
//           display: "flex",
//           flexWrap: "wrap",
//           justifyContent: "center",
//           gap: 4,
//           maxWidth: "1100px",
//           width: "100%",
//         }}
//       >
//         {cards.map((c, i) => (
//           <Card
//             key={i}
//             sx={{
//               width: 260,
//               height: 280,

//               background: "rgba(255,255,255,0.12)",
//               backdropFilter: "blur(14px)",
//               border: "1px solid rgba(255,255,255,0.25)",
//               borderRadius: 5,

//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               justifyContent: "center",
//               textAlign: "center",

//               boxShadow: "0 12px 35px rgba(0,0,0,0.18)",

//               transition: "0.35s ease",

//               "&:hover": {
//                 transform: "translateY(-8px) scale(1.04)",
//                 background: "rgba(255,255,255,0.18)",
//                 boxShadow: "0 18px 45px rgba(0,0,0,0.25)",
//               },
//             }}
//           >
//             {/* ICON */}
//             <Box sx={{ mb: 1 }}>{c.icon}</Box>

//             <Typography
//               variant="subtitle1"
//               fontWeight={700}
//               sx={{ color: "#fff", letterSpacing: "0.5px" }}
//             >
//               {c.title}
//             </Typography>

//             <Typography
//               variant="caption"
//               sx={{
//                 color: "rgba(255,255,255,0.75)",
//                 mt: 1,
//                 px: 1,
//               }}
//             >
//               {c.text}
//             </Typography>
//           </Card>
//         ))}
//       </Box>
//     </Box>
//   );
// }





// import React from "react";
// import { Box, Card, CardContent, Typography } from "@mui/material";

// /* ---------- SIMPLE SVG ICON WRAPPER ---------- */
// const Icon = ({ children }) => (
//   <svg width="58" height="58" viewBox="0 0 100 100">
//     {children}
//   </svg>
// );

// const cards = [
//   {
//     title: "Water Harmony",
//     subtitle: "Source of all life",
//     color: "#ffffff",
//     icon: (
//       <Icon>
//         <path
//           d="M50 10 C40 30,20 45,20 65
//              a30 30 0 0 0 60 0
//              C80 45,60 30,50 10Z"
//           fill="none"
//           stroke="#ffffff"
//           strokeWidth="2"
//         />
//       </Icon>
//     ),
//   },

//   {
//     title: "Natural Farming",
//     subtitle: "Earth nourishment",
//     color: "#eaffea",
//     icon: (
//       <Icon>
//         <path d="M20 70 Q50 60 80 70" fill="none" stroke="#eaffea" strokeWidth="2" />
//         <path d="M50 70 L50 40" fill="none" stroke="#eaffea" strokeWidth="2" />
//         <path d="M50 55 Q35 45 40 35 Q50 40 50 55" fill="none" stroke="#eaffea" strokeWidth="2" />
//         <path d="M50 55 Q65 45 60 35 Q50 40 50 55" fill="none" stroke="#eaffea" strokeWidth="2" />
//       </Icon>
//     ),
//   },

//   {
//     title: "Pure Thought",
//     subtitle: "Inner clarity",
//     color: "#f3eaff",
//     icon: (
//       <Icon>
//         <circle cx="50" cy="50" r="18" fill="none" stroke="#f3eaff" strokeWidth="2" />
//         <circle cx="50" cy="50" r="4" fill="#f3eaff" />
//       </Icon>
//     ),
//   },

//   {
//     title: "Earth Paradise",
//     subtitle: "Early world beauty",
//     color: "#ffffff",
//     icon: (
//       <Icon>
//         <path
//           d="M20 70 L50 30 L80 70 Z"
//           fill="none"
//           stroke="#ffffff"
//           strokeWidth="2"
//         />
//       </Icon>
//     ),
//   },

//   {
//     title: "Human-Nature Unity",
//     subtitle: "Coexistence era",
//     color: "#e0ffff",
//     icon: (
//       <Icon>
//         <circle cx="35" cy="60" r="10" fill="none" stroke="#e0ffff" strokeWidth="2" />
//         <circle cx="65" cy="60" r="10" fill="none" stroke="#e0ffff" strokeWidth="2" />
//       </Icon>
//     ),
//   },

//   {
//     title: "Universal Balance",
//     subtitle: "Everything connected",
//     color: "#ffffff",
//     icon: (
//       <Icon>
//         <circle cx="50" cy="50" r="20" fill="none" stroke="#ffffff" strokeWidth="2" />
//         <circle cx="50" cy="50" r="5" fill="#ffffff" />
//       </Icon>
//     ),
//   },
// ];

// /* ---------- COMPONENT ---------- */
// export default function HarmonyCards() {
//   return (
//     <Box
//       sx={{
//         minHeight: "100%",
//         width: "100%",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",

//         background:
//           "linear-gradient(135deg, #00c6ff 0%, #0072ff 50%, #00c6ff 100%)",
//         backgroundSize: "400% 400%",
//         animation: "waterFlow 12s ease infinite",

//         "@keyframes waterFlow": {
//           "0%": { backgroundPosition: "0% 50%" },
//           "50%": { backgroundPosition: "100% 50%" },
//           "100%": { backgroundPosition: "0% 50%" },
//         },

//         p: 3,
//       }}
//     >
//       {/* 🌿 TITLE */}
//       <Typography
//         variant="h4"
//         sx={{
//           width: "100%",
//           textAlign: "center",
//           fontWeight: 700,
//           color: "#fff",
//           mb: 3,
//           letterSpacing: "2px",
//           textShadow: "0 0 20px rgba(0,0,0,0.3)",
//         }}
//       >
//         Roots of Life
//       </Typography>

//       {/* CARDS */}
//       <Box
//         sx={{
//           display: "flex",
//           flexWrap: "wrap",
//           gap: 3,
//           justifyContent: "center",
//           maxWidth: "1200px",
//           backdropFilter: "blur(2px)",
//         }}
//       >
//         {cards.map((item, index) => (
//           <Card
//             key={index}
//             sx={{
//               width: 230,
//               height: 260,

//               background: "rgba(255,255,255,0.10)",
//               backdropFilter: "blur(12px)",
//               border: "1px solid rgba(255,255,255,0.25)",

//               borderRadius: 4,
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               justifyContent: "center",
//               textAlign: "center",

//               boxShadow: "0 8px 32px rgba(0,0,0,0.15)",

//               transition: "0.3s",

//               "&:hover": {
//                 transform: "translateY(-6px) scale(1.03)",
//                 boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
//                 background: "rgba(255,255,255,0.18)",
//               },
//             }}
//           >
//             {item.icon}

//             <CardContent sx={{ p: 1 }}>
//               <Typography variant="subtitle1" fontWeight="700" sx={{ color: item.color }}>
//                 {item.title}
//               </Typography>

//               <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.75)" }}>
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
// import { Box, Card, Typography } from "@mui/material";

// /* ---------- SIMPLE SKETCH ICON ---------- */
// const Icon = ({ children }) => (
//   <svg width="70" height="70" viewBox="0 0 100 100">
//     {children}
//   </svg>
// );

// /* ---------- CARDS DATA ---------- */
// const cards = [
//   {
//     title: "Primordial Water Harmony",
//     text: "Early Earth was pure water balance — oceans and rivers flowed without pollution, sustaining life in its purest form.",
//     icon: (
//       <Icon>
//         <path d="M50 10 C35 30, 20 45, 20 65 A30 30 0 0 0 80 65 C80 45, 65 30, 50 10Z"
//           fill="none" stroke="#00c6ff" strokeWidth="2" />
//       </Icon>
//     ),
//   },
//   {
//     title: "Natural Farming Era",
//     text: "Soil, seed, and sun worked in harmony — agriculture was chemical-free and deeply connected to nature’s rhythm.",
//     icon: (
//       <Icon>
//         <path d="M20 70 Q50 30 80 70" fill="none" stroke="#2ecc71" strokeWidth="2" />
//         <path d="M40 70 Q50 50 60 70" fill="none" stroke="#2ecc71" strokeWidth="2" />
//       </Icon>
//     ),
//   },
//   {
//     title: "Pure Thought Civilization",
//     text: "Human thought was calm, centered, and connected — decisions were guided by awareness rather than chaos.",
//     icon: (
//       <Icon>
//         <circle cx="50" cy="50" r="18" fill="none" stroke="#0072ff" strokeWidth="2" />
//         <circle cx="50" cy="50" r="5" fill="#0072ff" />
//       </Icon>
//     ),
//   },
//   {
//     title: "Earth as Heaven",
//     text: "Early life on Earth reflected natural beauty — forests, rivers, and skies existed in untouched perfection.",
//     icon: (
//       <Icon>
//         <path d="M20 70 L50 30 L80 70 Z" fill="none" stroke="#8e44ad" strokeWidth="2" />
//       </Icon>
//     ),
//   },
//   {
//     title: "Human-Nature Balance",
//     text: "Humans lived as part of nature, not above it — there was no pollution, only coexistence and respect.",
//     icon: (
//       <Icon>
//         <circle cx="35" cy="60" r="10" fill="none" stroke="#16a085" strokeWidth="2" />
//         <circle cx="65" cy="60" r="10" fill="none" stroke="#16a085" strokeWidth="2" />
//       </Icon>
//     ),
//   },
//   {
//     title: "Universal Harmony",
//     text: "All life forms coexisted in unity — energy, earth, water, and consciousness flowed as one system.",
//     icon: (
//       <Icon>
//         <circle cx="50" cy="50" r="20" fill="none" stroke="#f39c12" strokeWidth="2" />
//         <circle cx="50" cy="50" r="8" fill="#f39c12" />
//       </Icon>
//     ),
//   },
// ];

// /* ---------- COMPONENT ---------- */
// export default function HarmonyCards() {
//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexWrap: "wrap",
//         gap: 3,
//         justifyContent: "center",
//         p: 3,
//         background: "linear-gradient(135deg, #00c6ff, #0072ff)",
//         minHeight: "100vh",
//       }}
//     >
//       {cards.map((c, i) => (
//         <Card
//           key={i}
//           sx={{
//             width: 260,
//             height: 280,
//             p: 2,
//             borderRadius: 4,
//             textAlign: "center",
//             background: "rgba(255,255,255,0.12)",
//             backdropFilter: "blur(10px)",
//             color: "#fff",
//             boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           {c.icon}

//           <Typography variant="subtitle1" fontWeight={700} mt={2}>
//             {c.title}
//           </Typography>

//           <Typography variant="caption" sx={{ opacity: 0.85, mt: 1 }}>
//             {c.text}
//           </Typography>
//         </Card>
//       ))}
//     </Box>
//   );
// }