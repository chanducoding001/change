import React from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { useNavigate } from "react-router-dom";

const UnAuthorized = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 700,
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            textAlign: "center",
            border: "1px solid #E2E8F0",
            background:
              "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          }}
        >
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              mx: "auto",
              mb: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              color: "#fff",
              boxShadow: "0 15px 35px rgba(220,38,38,0.25)",
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 50 }} />
          </Box>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "4rem", md: "6rem" },
              fontWeight: 800,
              color: "#0F172A",
              lineHeight: 1,
            }}
          >
            403
          </Typography>

          <Typography
            variant="h4"
            sx={{
              mt: 1,
              fontWeight: 700,
              color: "#1E293B",
            }}
          >
            Access Denied
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mt: 2,
              color: "#64748B",
              maxWidth: 500,
              mx: "auto",
              lineHeight: 1.8,
            }}
          >
            You do not have permission to access this page.
            Please contact your administrator if you believe
            this is a mistake or navigate back to a page you
            are authorized to view.
          </Typography>

          <Box
            sx={{
              mt: 5,
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              startIcon={<HomeRoundedIcon />}
              onClick={() => navigate("/")}
              sx={{
                px: 4,
                py: 1.2,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Go To Dashboard
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={{
                px: 4,
                py: 1.2,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Go Back
            </Button>
          </Box>

          <Box
            sx={{
              mt: 5,
              pt: 3,
              borderTop: "1px solid #E2E8F0",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "#94A3B8",
                letterSpacing: 1,
              }}
            >
              ERROR CODE • 403 • UNAUTHORIZED ACCESS
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default UnAuthorized;