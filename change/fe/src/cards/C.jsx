import React from "react";

export default function C({ size = 32 }) {
  const k = size / 32; // scaling factor

  // leaf scaling adjustment (very important)
  const lx = 48;
  const ly = 38;
  const offset = (k - 1) * 2; // subtle expansion control

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ display: "block" }}
    >

      {/* 🌊 OUTER C */}
      <path
        d="M78 20
           A38 38 0 1 0 78 80"
        fill="none"
        stroke="url(#grad)"
        strokeWidth={12}
        strokeLinecap="round"
      />

      {/* 🌊 INNER FLOW */}
      <path
        d="M70 28
           A30 30 0 1 0 70 72"
        fill="none"
        stroke="rgba(0,198,255,0.7)"
        strokeWidth={4}
        strokeLinecap="round"
      />

      {/* 🌿 LEAF (now truly responsive) */}
      <path
        d={`
          M ${lx} ${ly}
          Q ${60 + offset} ${45} ${lx} ${52 + offset}
          Q ${36 - offset} ${45} ${lx} ${ly}
        `}
        fill="#2ecc71"
      />

      {/* 🧠 THOUGHT DOT (scales properly too) */}
      <circle
        cx="45"
        cy="52"
        r={4 + k * 1.2}
        fill="#0072ff"
      />

      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00c6ff" />
          <stop offset="100%" stopColor="#0072ff" />
        </linearGradient>
      </defs>

    </svg>
  );
}




// import React from "react";

// export default function C({ size = 32 }) {
//   const scale = size / 32; // base scaling reference

//   return (
//     <svg
//       width={size}
//       height={size}
//       viewBox="0 0 100 100"
//       style={{ display: "block" }}
//     >

//       {/* OUTER C */}
//       <path
//         d="M78 20
//            A38 38 0 1 0 78 80"
//         fill="none"
//         stroke="url(#grad)"
//         strokeWidth={12}
//         strokeLinecap="round"
//       />

//       {/* INNER FLOW */}
//       <path
//         d="M70 28
//            A30 30 0 1 0 70 72"
//         fill="none"
//         stroke="rgba(0,198,255,0.7)"
//         strokeWidth={4}
//         strokeLinecap="round"
//       />

//       {/* 🌿 LEAF (scaled properly) */}
//       <path
//         d="M48 38
//            Q60 45 48 52
//            Q36 45 48 38Z"
//         fill="#2ecc71"
//         transform={`scale(${1 + scale * 0.05})`}
//       />

//       {/* 🧠 DOT (scaled better visibility) */}
//       <circle
//         cx="45"
//         cy="52"
//         r={6 + scale * 1.2}
//         fill="#0072ff"
//       />

//       <defs>
//         <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
//           <stop offset="0%" stopColor="#00c6ff" />
//           <stop offset="100%" stopColor="#0072ff" />
//         </linearGradient>
//       </defs>

//     </svg>
//   );
// }




// import React from "react";

// export default function C() {
//   return (
//     <svg width="32" height="32" viewBox="0 0 100 100">

//       {/* OUTER C (slightly thicker + better visual balance) */}
//       <path
//         d="M78 20
//            A38 38 0 1 0 78 80"
//         fill="none"
//         stroke="url(#grad)"
//         strokeWidth="12"
//         strokeLinecap="round"
//       />

//       {/* INNER FLOW (slightly stronger presence) */}
//       <path
//         d="M70 28
//            A30 30 0 1 0 70 72"
//         fill="none"
//         stroke="rgba(0,198,255,0.7)"
//         strokeWidth="4"
//         strokeLinecap="round"
//       />

//       {/* 🌿 NATURE (bigger leaf) */}
//       <path
//         d="M48 38
//            Q60 45 48 52
//            Q36 45 48 38Z"
//         fill="#2ecc71"
//       />

//       {/* 🧠 THOUGHT (bigger dot) */}
//       <circle cx="45" cy="52" r="6" fill="#0072ff" />

//       <defs>
//         <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
//           <stop offset="0%" stopColor="#00c6ff" />
//           <stop offset="100%" stopColor="#0072ff" />
//         </linearGradient>
//       </defs>

//     </svg>
//   );
// }




// import React from "react";

// export default function C() {
//   return (
//     <svg width="32" height="32" viewBox="0 0 100 100">

//       {/* OUTER C */}
//       <path
//         d="M78 20
//            A38 38 0 1 0 78 80"
//         fill="none"
//         stroke="url(#grad)"
//         strokeWidth="10"
//         strokeLinecap="round"
//       />

//       {/* INNER FLOW */}
//       <path
//         d="M70 28
//            A30 30 0 1 0 70 72"
//         fill="none"
//         stroke="rgba(0,198,255,0.6)"
//         strokeWidth="3"
//         strokeLinecap="round"
//       />

//       {/* NATURE */}
//       <path
//         d="M52 40 Q58 45 52 50 Q46 45 52 40Z"
//         fill="#2ecc71"
//       />

//       {/* THOUGHT */}
//       <circle cx="45" cy="50" r="4" fill="#0072ff" />

//       <defs>
//         <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
//           <stop offset="0%" stopColor="#00c6ff" />
//           <stop offset="100%" stopColor="#0072ff" />
//         </linearGradient>
//       </defs>

//     </svg>
//   );
// }



// import React from "react";
// import { Box } from "@mui/material";

// export default function C() {
//   return (
//     <Box
//       sx={{
//         width: 160,
//         height: 160,
//         background: "#ffffff",
//         borderRadius: "50%",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
//       }}
//     >
//       <svg width="120" height="120" viewBox="0 0 100 100">

//         {/* OUTER GEOMETRIC C (main life flow) */}
//         <path
//           d="M78 20
//              A38 38 0 1 0 78 80"
//           fill="none"
//           stroke="url(#grad)"
//           strokeWidth="10"
//           strokeLinecap="round"
//         />

//         {/* WATER LAYER (flow direction) */}
//         <path
//           d="M70 28
//              A30 30 0 1 0 70 72"
//           fill="none"
//           stroke="rgba(0,198,255,0.6)"
//           strokeWidth="3"
//           strokeLinecap="round"
//         />

//         {/* NATURE ELEMENT (leaf node) */}
//         <path
//           d="M52 40
//              Q58 45 52 50
//              Q46 45 52 40Z"
//           fill="#2ecc71"
//           opacity="0.9"
//         />

//         {/* THOUGHT NODE (center consciousness) */}
//         <circle cx="45" cy="50" r="3" fill="#ffffff" opacity="0.9" />
//         <circle cx="45" cy="50" r="5" fill="none" stroke="#0072ff" strokeWidth="1.5" />

//         {/* GRADIENT */}
//         <defs>
//           <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
//             <stop offset="0%" stopColor="#00c6ff" />
//             <stop offset="50%" stopColor="#66e0ff" />
//             <stop offset="100%" stopColor="#0072ff" />
//           </linearGradient>
//         </defs>

//       </svg>
//     </Box>
//   );
// }





// import React from "react";
// import { Box } from "@mui/material";

// export default function C() {
//   return (
//     <Box
//       sx={{
//         width: 160,
//         height: 160,
//         background: "#ffffff",
//         borderRadius: "20px",

//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",

//         boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
//       }}
//     >
//       <svg width="110" height="110" viewBox="0 0 100 100">
//         {/* MAIN FLOWING C */}
//         <path
//           d="M75 20
//              C40 5, 10 30, 10 55
//              C10 80, 40 95, 75 80"
//           fill="none"
//           stroke="url(#waterGrad)"
//           strokeWidth="11"
//           strokeLinecap="round"
//         />

//         {/* INNER FLOW */}
//         <path
//           d="M65 30
//              C45 20, 25 35, 25 55
//              C25 75, 45 85, 65 75"
//           fill="none"
//           stroke="rgba(0, 114, 255, 0.35)"
//           strokeWidth="2"
//           strokeLinecap="round"
//         />

//         {/* THOUGHT POINT */}
//         <circle cx="45" cy="55" r="2.8" fill="#0072ff" opacity="0.7" />

//         {/* Gradient definition */}
//         <defs>
//           <linearGradient id="waterGrad" x1="0" y1="0" x2="1" y2="1">
//             <stop offset="0%" stopColor="#00c6ff" />
//             <stop offset="50%" stopColor="#66e0ff" />
//             <stop offset="100%" stopColor="#0072ff" />
//           </linearGradient>
//         </defs>
//       </svg>
//     </Box>
//   );
// }



// import React from "react";

// export default function C() {
//   return (
//     <svg width="120" height="120" viewBox="0 0 100 100">
//       {/* MAIN FLOWING C */}
//       <path
//         d="M75 20
//            C40 5, 10 30, 10 55
//            C10 80, 40 95, 75 80"
//         fill="none"
//         stroke="url(#waterGrad)"
//         strokeWidth="11"
//         strokeLinecap="round"
//       />

//       {/* INNER FLOW (subtle life layer) */}
//       <path
//         d="M65 30
//            C45 20, 25 35, 25 55
//            C25 75, 45 85, 65 75"
//         fill="none"
//         stroke="rgba(255,255,255,0.35)"
//         strokeWidth="2"
//         strokeLinecap="round"
//       />

//       {/* ENERGY / THOUGHT POINT */}
//       <circle cx="45" cy="55" r="2.8" fill="rgba(255,255,255,0.6)" />

//       {/* WATER-GLOW GRADIENT (matches your app) */}
//       <defs>
//         <linearGradient id="waterGrad" x1="0" y1="0" x2="1" y2="1">
//           <stop offset="0%" stopColor="#00c6ff" />
//           <stop offset="50%" stopColor="#66e0ff" />
//           <stop offset="100%" stopColor="#0072ff" />
//         </linearGradient>
//       </defs>
//     </svg>
//   );
// }





// import React from "react";

// export default function C() {
//   return (
//     <svg width="120" height="120" viewBox="0 0 100 100">
//       {/* Outer thick C (water flow shape) */}
//       <path
//         d="M75 20
//            C40 5, 10 30, 10 55
//            C10 80, 40 95, 75 80"
//         fill="none"
//         stroke="url(#grad1)"
//         strokeWidth="10"
//         strokeLinecap="round"
//       />

//       {/* Inner life flow line */}
//       <path
//         d="M65 30
//            C45 20, 25 35, 25 55
//            C25 75, 45 85, 65 75"
//         fill="none"
//         stroke="rgba(255,255,255,0.6)"
//         strokeWidth="2"
//         strokeLinecap="round"
//       />

//       {/* Thought dot (center balance point) */}
//       <circle cx="45" cy="55" r="2.5" fill="white" opacity="0.9" />

//       {/* Gradient definition */}
//       <defs>
//         <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
//           <stop offset="0%" stopColor="#00c6ff" />
//           <stop offset="50%" stopColor="#ffffff" />
//           <stop offset="100%" stopColor="#0072ff" />
//         </linearGradient>
//       </defs>
//     </svg>
//   );
// }



// import React from "react";
// import { Box } from "@mui/material";

// export default function C({ size = 400 }) {
//   return (
//     <Box sx={{ width: size, height: size }}>
//       <svg
//         viewBox="0 0 600 600"
//         width="100%"
//         height="100%"
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         <defs>
//           <linearGradient id="green" x1="0%" y1="0%" x2="100%" y2="0%">
//             <stop offset="0%" stopColor="#008A2E" />
//             <stop offset="100%" stopColor="#A5D600" />
//           </linearGradient>

//           <linearGradient id="blue" x1="0%" y1="0%" x2="100%" y2="0%">
//             <stop offset="0%" stopColor="#003E9E" />
//             <stop offset="100%" stopColor="#3CC8FF" />
//           </linearGradient>

//           <linearGradient id="brain" x1="0%" y1="0%" x2="100%" y2="100%">
//             <stop offset="0%" stopColor="#66CC33" />
//             <stop offset="100%" stopColor="#00A6FF" />
//           </linearGradient>
//         </defs>

//         {/* ENVIRONMENT HALF */}

//         <path
//           d="
//             M470 140
//             C390 70 270 60 180 110
//             C90 160 70 270 110 360
//           "
//           fill="none"
//           stroke="url(#green)"
//           strokeWidth="55"
//           strokeLinecap="round"
//         />

//         <path
//           d="
//             M320 95
//             C380 60 450 70 520 120
//             C470 145 390 145 320 95
//           "
//           fill="url(#green)"
//         />

//         <path
//           d="
//             M185 355
//             C195 300 210 250 240 200
//           "
//           stroke="#008A2E"
//           strokeWidth="8"
//           fill="none"
//         />

//         {[0, 1, 2, 3].map((i) => (
//           <ellipse
//             key={i}
//             cx={165 + i * 15}
//             cy={220 + i * 55}
//             rx="18"
//             ry="32"
//             fill="#8FD63F"
//             transform={`rotate(-25 ${165 + i * 15} ${220 + i * 55})`}
//           />
//         ))}

//         {[0, 1, 2, 3].map((i) => (
//           <ellipse
//             key={`r${i}`}
//             cx={250 + i * 5}
//             cy={250 + i * 45}
//             rx="18"
//             ry="32"
//             fill="#7BCB2F"
//             transform={`rotate(65 ${250 + i * 5} ${250 + i * 45})`}
//           />
//         ))}

//         {/* WATER HALF */}

//         <path
//           d="
//             M120 380
//             C210 330 320 340 410 390
//             C470 425 520 420 560 380
//           "
//           fill="none"
//           stroke="url(#blue)"
//           strokeWidth="65"
//           strokeLinecap="round"
//         />

//         <path
//           d="
//             M120 390
//             C220 460 370 470 510 430
//           "
//           fill="none"
//           stroke="url(#blue)"
//           strokeWidth="55"
//           strokeLinecap="round"
//         />

//         <path
//           d="
//             M505 360
//             C535 390 545 420 520 450
//           "
//           fill="none"
//           stroke="#39C4FF"
//           strokeWidth="28"
//           strokeLinecap="round"
//         />

//         <circle cx="520" cy="320" r="16" fill="#39C4FF" />
//         <circle cx="555" cy="350" r="10" fill="#39C4FF" />

//         {/* BRAIN */}

//         <g transform="translate(300 300)">
//           <path
//             d="
//               M-70 -60
//               C-110 -60 -120 0 -95 30
//               C-115 65 -85 110 -40 105
//               C-10 120 0 80 0 45
//               C0 10 -25 -60 -70 -60
//             "
//             fill="none"
//             stroke="url(#brain)"
//             strokeWidth="10"
//           />

//           <path
//             d="
//               M70 -60
//               C110 -60 120 0 95 30
//               C115 65 85 110 40 105
//               C10 120 0 80 0 45
//               C0 10 25 -60 70 -60
//             "
//             fill="none"
//             stroke="url(#brain)"
//             strokeWidth="10"
//           />

//           <circle cx="-35" cy="-15" r="10" fill="#3AB54A" />
//           <circle cx="-55" cy="40" r="10" fill="#3AB54A" />
//           <circle cx="-15" cy="65" r="10" fill="#3AB54A" />

//           <circle cx="35" cy="-15" r="10" fill="#00A6FF" />
//           <circle cx="55" cy="40" r="10" fill="#00A6FF" />
//           <circle cx="15" cy="65" r="10" fill="#00A6FF" />

//           <line
//             x1="-35"
//             y1="-15"
//             x2="-55"
//             y2="40"
//             stroke="#3AB54A"
//             strokeWidth="4"
//           />

//           <line
//             x1="-55"
//             y1="40"
//             x2="-15"
//             y2="65"
//             stroke="#3AB54A"
//             strokeWidth="4"
//           />

//           <line
//             x1="35"
//             y1="-15"
//             x2="55"
//             y2="40"
//             stroke="#00A6FF"
//             strokeWidth="4"
//           />

//           <line
//             x1="55"
//             y1="40"
//             x2="15"
//             y2="65"
//             stroke="#00A6FF"
//             strokeWidth="4"
//           />

//           <path
//             d="
//               M0 -15
//               L12 0
//               L0 15
//               L-12 0
//               Z
//             "
//             fill="#A5D600"
//           />
//         </g>
//       </svg>
//     </Box>
//   );
// }



// import React from "react";
// import { Box } from "@mui/material";

// export default function C({ size = 320 }) {
//   return (
//     <Box
//       sx={{
//         width: size,
//         height: size,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//     >
//       <svg
//         viewBox="0 0 500 500"
//         width="100%"
//         height="100%"
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         <defs>
//           <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="0%">
//             <stop offset="0%" stopColor="#0B7A3A" />
//             <stop offset="100%" stopColor="#8CD63F" />
//           </linearGradient>

//           <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
//             <stop offset="0%" stopColor="#005EA8" />
//             <stop offset="100%" stopColor="#38BDF8" />
//           </linearGradient>

//           <linearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
//             <stop offset="0%" stopColor="#00A9A5" />
//             <stop offset="100%" stopColor="#66CC33" />
//           </linearGradient>

//           <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
//             <feDropShadow
//               dx="0"
//               dy="4"
//               stdDeviation="8"
//               floodOpacity="0.15"
//             />
//           </filter>
//         </defs>

//         {/* Main C */}
//         <path
//           d="
//             M390 110
//             A170 170 0 1 0
//             390 390
//           "
//           fill="none"
//           stroke="url(#greenGrad)"
//           strokeWidth="38"
//           strokeLinecap="round"
//           filter="url(#shadow)"
//         />

//         {/* Leaf */}
//         <g filter="url(#shadow)">
//           <path
//             d="
//               M250 105
//               C295 70 345 72 380 112
//               C340 128 292 128 250 105
//             "
//             fill="url(#greenGrad)"
//           />

//           <path
//             d="
//               M285 103
//               C305 113 325 118 350 120
//             "
//             fill="none"
//             stroke="white"
//             strokeWidth="2.5"
//             opacity="0.75"
//             strokeLinecap="round"
//           />
//         </g>

//         {/* Water */}
//         <g filter="url(#shadow)">
//           <path
//             d="
//               M145 325
//               C185 300 220 300 250 320
//               C280 340 320 340 355 320
//             "
//             fill="none"
//             stroke="url(#blueGrad)"
//             strokeWidth="14"
//             strokeLinecap="round"
//           />

//           <path
//             d="
//               M160 350
//               C195 330 225 330 250 345
//               C275 360 305 360 340 345
//             "
//             fill="none"
//             stroke="url(#blueGrad)"
//             strokeWidth="8"
//             strokeLinecap="round"
//             opacity="0.5"
//           />
//         </g>

//         {/* Brain */}
//         <g transform="translate(250 245)">
//           {/* Left hemisphere */}
//           <path
//             d="
//               M-55 -35
//               C-85 -35 -95 5 -75 30
//               C-85 55 -65 85 -30 80
//               C-10 95 5 70 0 40
//               C5 10 -15 -35 -55 -35
//             "
//             fill="none"
//             stroke="url(#brainGrad)"
//             strokeWidth="8"
//             strokeLinecap="round"
//           />

//           {/* Right hemisphere */}
//           <path
//             d="
//               M55 -35
//               C85 -35 95 5 75 30
//               C85 55 65 85 30 80
//               C10 95 -5 70 0 40
//               C-5 10 15 -35 55 -35
//             "
//             fill="none"
//             stroke="url(#brainGrad)"
//             strokeWidth="8"
//             strokeLinecap="round"
//           />

//           {/* Center connection */}
//           <path
//             d="
//               M0 -35
//               C-5 -10 -5 10 0 35
//               C5 55 5 70 0 85
//             "
//             fill="none"
//             stroke="url(#brainGrad)"
//             strokeWidth="6"
//             strokeLinecap="round"
//           />

//           {/* Neural nodes */}
//           <circle cx="-45" cy="-15" r="6" fill="#00A9A5" />
//           <circle cx="-25" cy="20" r="6" fill="#00A9A5" />
//           <circle cx="-5" cy="55" r="6" fill="#00A9A5" />

//           <circle cx="45" cy="-15" r="6" fill="#00A9A5" />
//           <circle cx="25" cy="20" r="6" fill="#00A9A5" />
//           <circle cx="5" cy="55" r="6" fill="#00A9A5" />

//           {/* Neural connections */}
//           <line
//             x1="-45"
//             y1="-15"
//             x2="-25"
//             y2="20"
//             stroke="#00A9A5"
//             strokeWidth="3"
//           />

//           <line
//             x1="-25"
//             y1="20"
//             x2="-5"
//             y2="55"
//             stroke="#00A9A5"
//             strokeWidth="3"
//           />

//           <line
//             x1="45"
//             y1="-15"
//             x2="25"
//             y2="20"
//             stroke="#00A9A5"
//             strokeWidth="3"
//           />

//           <line
//             x1="25"
//             y1="20"
//             x2="5"
//             y2="55"
//             stroke="#00A9A5"
//             strokeWidth="3"
//           />

//           {/* Thought spark */}
//           <circle
//             cx="0"
//             cy="5"
//             r="12"
//             fill="#ffffff"
//             opacity="0.95"
//           />

//           <path
//             d="
//               M0 -10
//               L4 0
//               L14 4
//               L4 8
//               L0 18
//               L-4 8
//               L-14 4
//               L-4 0
//               Z
//             "
//             fill="url(#brainGrad)"
//           />
//         </g>
//       </svg>
//     </Box>
//   );
// }