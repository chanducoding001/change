import React from "react";
import { Box, Card, Typography } from "@mui/material";

/* ---------- ICON ---------- */
const Icon = ({ children }) => (
  <svg width="60" height="60" viewBox="0 0 100 100">
    {children}
  </svg>
);

const WHITE = "rgba(255,255,255,0.9)";

/* ---------- CARDS ---------- */
const cards = [
  {
    title: "Live with Change",
    text: "Embracing change brings clarity, growth, and harmony with the natural flow of life. Evolution becomes effortless when we accept transformation.",
    icon: (
      <Icon>
        {/* smooth upward flow curve */}
        <path
          d="M20 70 C40 40, 60 40, 80 20"
          fill="none"
          stroke={WHITE}
          strokeWidth="2"
        />
        <circle cx="80" cy="20" r="4" fill={WHITE} />
      </Icon>
    ),
  },
  {
    title: "Live with Chaos",
    text: "Resisting change creates confusion, stress, and imbalance. Life becomes reactive instead of flowing naturally with time.",
    icon: (
      <Icon>
        {/* broken chaotic lines */}
        <path
          d="M20 20 L40 60 L60 30 L80 70"
          fill="none"
          stroke={WHITE}
          strokeWidth="2"
        />
        <circle cx="60" cy="30" r="4" fill={WHITE} />
      </Icon>
    ),
  },
];

/* ---------- COMPONENT ---------- */
export default function ChoiceCards() {
  return (
    <Box
      sx={{
        width: "100%",
        // minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 2,
        // backgroundColor:'black'
      }}
    >
      {/* TITLE */}
      <Typography
        variant="h4"
        sx={{
          color: "#fff",
          fontWeight: 700,
          mb: 4,
          letterSpacing: "2px",
          textShadow: "0 0 20px rgba(0,0,0,0.3)",
          textAlign: "center",
        }}
      >
        What will you embrace?
      </Typography>

      {/* CARDS ROW */}
      <Box
        sx={{
          display: "flex",
          gap: 4,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {cards.map((c, i) => (
          <Card
            key={i}
            sx={{
              width: 280,
              height: 300,

              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",

              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 5,

              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",

              color: "#fff",

              boxShadow: "0 12px 35px rgba(0,0,0,0.18)",

              transition: "0.35s ease",

              "&:hover": {
                transform: "translateY(-10px) scale(1.05)",
                background: "rgba(255,255,255,0.18)",
                boxShadow: "0 18px 50px rgba(0,0,0,0.25)",
              },
            }}
          >
            <Box sx={{ mb: 1 }}>{c.icon}</Box>

            <Typography variant="h6" fontWeight={700}>
              {c.title}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 1.5,
                px: 2,
                color: "rgba(255,255,255,0.75)",
                lineHeight: 1.6,
              }}
            >
              {c.text} edit
            </Typography>
          </Card>
        ))}
      </Box>
    </Box>
  );
}