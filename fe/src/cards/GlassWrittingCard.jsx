import React from "react";
import { Box, Typography } from "@mui/material";

export default function GlassWrittingCard({ title, children }) {
  return (
    <Box
      sx={{
        // width: "100%",
        // maxWidth: 800,
        // mx: "auto",
        m:3,
        p: 2,
        // borderRadius: 4,

        /* 🌊 GLASS EFFECT */
        background: "rgba(255, 255, 255, 0.10)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",

        border: "1px solid rgba(255, 255, 255, 0.25)",

        /* ✨ soft reflection glow */
        boxShadow: `
          0 10px 30px rgba(0,0,0,0.15),
          inset 0 1px 1px rgba(255,255,255,0.25)
        `,

        // color: "#fff",
      }}
    >
      {/* TITLE */}
      {title && (
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 2,
            letterSpacing: "1px",
            textShadow: "0 0 15px rgba(0,0,0,0.3)",
            textAlign:'center'
          }}
        >
          {title}
        </Typography>
      )}

      {/* CONTENT */}
      <Box
        variant="body1"
        sx={{
          lineHeight: 1.8,
          color: "rgba(255,255,255,0.85)",
        }}
      >
      {children}
      </Box>
    </Box>
  );
}