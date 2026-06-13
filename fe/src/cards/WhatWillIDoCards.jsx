import React from "react";
import { Box, Card, Typography } from "@mui/material";

/* ---------- ICON WRAPPER ---------- */
const Icon = ({ children }) => (
  <svg width="55" height="55" viewBox="0 0 100 100">
    {children}
  </svg>
);

/* ---------- ICONS ---------- */
const WaterIcon = () => (
  <Icon>
    <path
      d="M50 10 C40 30, 20 45, 20 65 A30 30 0 0 0 80 65 C80 45, 60 30, 50 10Z"
      fill="none"
      stroke="#ffffff"
      strokeWidth="3"
    />
    <circle cx="50" cy="65" r="5" fill="#00c6ff" />
  </Icon>
);

const FarmingIcon = () => (
  <Icon>
    <path d="M50 80 L50 40" stroke="#ffffff" strokeWidth="3" />
    <path
      d="M50 60 Q35 50 40 35 Q50 45 50 60"
      fill="none"
      stroke="#ffffff"
      strokeWidth="2"
    />
    <path
      d="M50 60 Q65 50 60 35 Q50 45 50 60"
      fill="none"
      stroke="#ffffff"
      strokeWidth="2"
    />
  </Icon>
);

const LifeQualityIcon = () => (
  <Icon>
    <circle cx="50" cy="35" r="10" stroke="#ffffff" fill="none" />
    <path d="M50 45 L50 80" stroke="#ffffff" strokeWidth="3" />
    <path d="M35 80 L65 80" stroke="#ffffff" strokeWidth="3" />
    <circle cx="50" cy="35" r="3" fill="#00c6ff" />
  </Icon>
);

/* ---------- CARDS ---------- */
const cards = [
  {
    title: "Conserve Water",
    text: "Protecting and preserving water resources for sustainable future.",
    icon: <WaterIcon />,
  },
  {
    title: "Improve Farming",
    text: "Enhancing agricultural practices for healthier soil and yield.",
    icon: <FarmingIcon />,
  },
  {
    title: "Improve Standards of Life",
    text: "Creating better health, awareness, and quality living conditions.",
    icon: <LifeQualityIcon />,
  },
];

/* ---------- COMPONENT ---------- */
export default function WhatWillIDoCards() {
  return (
    <Box
      sx={{
        // minHeight: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        // backgroundColor:'yellow',

        // background:
        //   "linear-gradient(135deg, #00c6ff 0%, #0072ff 50%, #00c6ff 100%)",
        // backgroundSize: "400% 400%",
        // animation: "waterFlow 12s ease infinite",

        // "@keyframes waterFlow": {
        //   "0%": { backgroundPosition: "0% 50%" },
        //   "50%": { backgroundPosition: "100% 50%" },
        //   "100%": { backgroundPosition: "0% 50%" },
        // },

        py: 2,
        px: 2,
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
          letterSpacing: "2px",
          textShadow: "0 0 20px rgba(0,0,0,0.3)",
        }}
      >
        What will I Do?
      </Typography>

      {/* GRID */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr",
          },
          gap: 3,
          maxWidth: "900px",
          width: "100%",
        }}
      >
        {cards.map((c, i) => (
          <Card
            key={i}
            sx={{
              height: 200,

              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 4,

              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",

              color: "#fff",

              boxShadow: "0 12px 30px rgba(0,0,0,0.18)",

              transition: "0.3s ease",

              "&:hover": {
                transform: "translateY(-8px) scale(1.03)",
                background: "rgba(255,255,255,0.18)",
                boxShadow: "0 18px 45px rgba(0,0,0,0.25)",
              },
            }}
          >
            {c.icon}

            <Typography fontWeight={700} mt={1}>
              {c.title}
            </Typography>

            <Typography variant="caption" sx={{ opacity: 0.8, px: 1, mt: 1 }}>
              {c.text}
            </Typography>
          </Card>
        ))}
      </Box>
    </Box>
  );
}