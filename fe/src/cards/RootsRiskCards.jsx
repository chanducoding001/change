import React from "react";
import { Box, Card, Typography } from "@mui/material";

/* ---------- ICON WRAPPER ---------- */
const Icon = ({ children }) => (
  <svg width="55" height="55" viewBox="0 0 100 100">
    {children}
  </svg>
);

/* ---------- ICONS ---------- */
const BorderThreatIcon = () => (
  <Icon>
    <path
      d="M20 80 L40 20 L60 80 L80 20"
      fill="none"
      stroke="#ffffff"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <circle cx="40" cy="20" r="3" fill="#ffffff" />
    <circle cx="60" cy="80" r="3" fill="#ffffff" />
  </Icon>
);

const TradeCollapseIcon = () => (
  <Icon>
    <path
      d="M20 30 L80 30"
      stroke="#ffffff"
      strokeWidth="3"
    />
    <path
      d="M20 70 L80 70"
      stroke="#ffffff"
      strokeWidth="3"
    />
    <path
      d="M40 20 L40 80"
      stroke="#ffffff"
      strokeWidth="3"
    />
    <path
      d="M60 20 L60 80"
      stroke="#ffffff"
      strokeWidth="3"
    />
    <path
      d="M25 25 L75 75"
      stroke="#ff4d4d"
      strokeWidth="2"
    />
  </Icon>
);

const AIJobCutsIcon = () => (
  <Icon>
    <circle cx="50" cy="35" r="10" stroke="#ffffff" fill="none" />
    <path
      d="M30 80 Q50 55 70 80"
      stroke="#ffffff"
      fill="none"
      strokeWidth="3"
    />
    <line x1="20" y1="20" x2="80" y2="80" stroke="#ff4d4d" strokeWidth="3" />
  </Icon>
);

const EconomyCollapseIcon = () => (
  <Icon>
    <path
      d="M20 70 L35 50 L50 60 L65 40 L80 30"
      stroke="#ffffff"
      strokeWidth="3"
      fill="none"
    />
    <circle cx="80" cy="30" r="3" fill="#ff4d4d" />
  </Icon>
);

const FarmingLossIcon = () => (
  <Icon>
    <path
      d="M50 80 L50 40"
      stroke="#ffffff"
      strokeWidth="3"
    />
    <path
      d="M50 60 Q35 50 40 35 Q50 45 50 60"
      stroke="#ffffff"
      fill="none"
      strokeWidth="2"
    />
    <line x1="30" y1="20" x2="70" y2="80" stroke="#ff4d4d" strokeWidth="3" />
  </Icon>
);

const TechImbalanceIcon = () => (
  <Icon>
    <rect x="25" y="25" width="20" height="20" stroke="#ffffff" fill="none" />
    <rect x="55" y="55" width="20" height="20" stroke="#ffffff" fill="none" />
    <path d="M25 45 L75 45" stroke="#ffffff" strokeWidth="2" />
    <path d="M45 25 L45 75" stroke="#ff4d4d" strokeWidth="2" />
  </Icon>
);

const PoorLifeIcon = () => (
  <Icon>
    <circle cx="50" cy="30" r="10" stroke="#ffffff" fill="none" />
    <path d="M50 40 L50 80" stroke="#ffffff" strokeWidth="3" />
    <path d="M35 80 L65 80" stroke="#ff4d4d" strokeWidth="3" />
  </Icon>
);

const ResourceMisuseIcon = () => (
  <Icon>
    <path
      d="M30 70 C40 20, 60 20, 70 70"
      stroke="#ffffff"
      fill="none"
      strokeWidth="3"
    />
    <circle cx="50" cy="45" r="6" fill="#ff4d4d" />
  </Icon>
);

/* ---------- CARDS ---------- */
const cards = [
  {
    title: "Border Threats",
    text: "Geopolitical tensions and instability affecting peace and security.",
    icon: <BorderThreatIcon />,
  },
  {
    title: "Trade Collapse",
    text: "Disruption in global trade systems leading to economic imbalance.",
    icon: <TradeCollapseIcon />,
  },
  {
    title: "AI Job Cuts",
    text: "Automation replacing traditional human jobs at large scale.",
    icon: <AIJobCutsIcon />,
  },
  {
    title: "Economic Instability",
    text: "Risk of financial collapse and weakening economic structures.",
    icon: <EconomyCollapseIcon />,
  },
  {
    title: "Loss of Farming Skills",
    text: "Traditional agricultural knowledge slowly disappearing.",
    icon: <FarmingLossIcon />,
  },
  {
    title: "Technology Imbalance",
    text: "Overdependence or mismatch of technology with real-world needs.",
    icon: <TechImbalanceIcon />,
  },
  {
    title: "Poor Quality of Life",
    text: "Decline in physical, mental, and social well-being of society.",
    icon: <PoorLifeIcon />,
  },
  {
    title: "Misuse of Natural Resources",
    text: "Overexploitation of water, soil, and energy resources.",
    icon: <ResourceMisuseIcon />,
  },
];

/* ---------- COMPONENT ---------- */
export default function RootsRiskCards() {
  return (
    <Box
      sx={{
        // minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        px: 2,
        py: 3,
      }}
    >
      {/* TITLE */}
      <Typography
        variant="h4"
        sx={{
          color: "#fff",
          fontWeight: 700,
          mb: 4,
          textAlign: "center",
        }}
      >
        A Civilization Moving Against Its Roots
      </Typography>

      {/* GRID */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr 1fr",
          },
          gap: 3,
          maxWidth: "1200px",
          width: "100%",
        }}
      >
        {cards.map((c, i) => (
          <Card
            key={i}
            sx={{
              height: 180,
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 4,
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              transition: "0.3s",
              "&:hover": {
                transform: "translateY(-8px) scale(1.03)",
                background: "rgba(255,255,255,0.18)",
              },
            }}
          >
            {c.icon}

            <Typography fontWeight={700} mt={1}>
              {c.title}
            </Typography>

            <Typography variant="caption" sx={{ opacity: 0.75, px: 1 }}>
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

// /* ---------- ICON ---------- */
// const Icon = ({ children }) => (
//   <svg width="55" height="55" viewBox="0 0 100 100">
//     {children}
//   </svg>
// );

// const WHITE = "rgba(255,255,255,0.9)";

// /* ---------- CARDS ---------- */
// const cards = [
//   {
//     title: "Border Threats",
//     text: "Geopolitical tensions and instability affecting peace and security.",
//   },
//   {
//     title: "Trade Collapse",
//     text: "Disruption in global trade systems leading to economic imbalance.",
//   },
//   {
//     title: "AI Job Cuts",
//     text: "Automation replacing traditional human jobs at large scale.",
//   },
//   {
//     title: "Economic Instability",
//     text: "Risk of financial collapse and weakening economic structures.",
//   },
//   {
//     title: "Loss of Farming Skills",
//     text: "Traditional agricultural knowledge slowly disappearing.",
//   },
//   {
//     title: "Insufficient Technology Balance",
//     text: "Overdependence or mismatch of technology with real-world needs.",
//   },
//   {
//     title: "Poor Quality of Life",
//     text: "Decline in physical, mental, and social well-being of society.",
//   },
//   {
//     title: "Misuse of Natural Resources",
//     text: "Overexploitation of water, soil, and energy resources.",
//   },
// ];

// /* ---------- COMPONENT ---------- */
// export default function RootsRiskCards() {
//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         width: "100%",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",

//         // background:
//         //   "linear-gradient(135deg, #00c6ff 0%, #0072ff 50%, #00c6ff 100%)",
//         // backgroundSize: "400% 400%",
//         // animation: "waterFlow 12s ease infinite",

//         // "@keyframes waterFlow": {
//         //   "0%": { backgroundPosition: "0% 50%" },
//         //   "50%": { backgroundPosition: "100% 50%" },
//         //   "100%": { backgroundPosition: "0% 50%" },
//         // },

//         py: 2,
//         px: 2,
//       }}
//     >
//       {/* TITLE */}
//       <Typography
//         variant="h4"
//         sx={{
//           color: "#fff",
//           fontWeight: 700,
//           mb: 4,
//           letterSpacing: "2px",
//           textShadow: "0 0 20px rgba(0,0,0,0.3)",
//           textAlign: "center",
//         }}
//       >
//         {/* Living Against the Roots */}
//         A Civilization Moving Against Its Roots
//       </Typography>

//       {/* GRID */}
//       <Box
//         sx={{
//           display: "grid",
//           gridTemplateColumns: {
//             xs: "1fr",
//             sm: "1fr 1fr",
//             md: "1fr 1fr 1fr 1fr",
//           },
//           gap: 3,
//           maxWidth: "1200px",
//           width: "100%",
//         }}
//       >
//         {cards.map((c, i) => (
//           <Card
//             key={i}
//             sx={{
//               height: 180,

//               background: "rgba(255,255,255,0.12)",
//               backdropFilter: "blur(14px)",
//               WebkitBackdropFilter: "blur(14px)",

//               border: "1px solid rgba(255,255,255,0.25)",
//               borderRadius: 4,

//               display: "flex",
//               flexDirection: "column",
//               justifyContent: "center",
//               alignItems: "center",
//               textAlign: "center",

//               color: "#fff",

//               boxShadow: "0 12px 30px rgba(0,0,0,0.18)",

//               transition: "0.3s ease",

//               "&:hover": {
//                 transform: "translateY(-8px) scale(1.03)",
//                 background: "rgba(255,255,255,0.18)",
//                 boxShadow: "0 18px 45px rgba(0,0,0,0.25)",
//               },
//             }}
//           >
//             <Typography variant="subtitle1" fontWeight={700}>
//               {c.title}
//             </Typography>

//             <Typography
//               variant="caption"
//               sx={{
//                 mt: 1,
//                 px: 1,
//                 color: "rgba(255,255,255,0.75)",
//                 lineHeight: 1.5,
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
