import React, { useState } from "react";
import axios from "axios";

import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
  Alert,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import HubIcon from "@mui/icons-material/Hub";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";

const TourToolbar = ({
  tourName,
  setTourName,
  nodes,
  travelEdges,
  setTravelEdges,
  selectedRoute,
  setSelectedRoute,
}) => {
  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  //----------------------------------------
  // Connect Tour
  //----------------------------------------

  const connectTour = async () => {
    if (nodes.length < 2) {
      setMessage(
        "Please add at least two places."
      );
      return;
    }

    try {
      setLoading(true);

      /**
       * Later this API will:
       *
       * 1. Fetch village coordinates
       * 2. Create graph
       * 3. Connect nearest nodes
       * 4. Return graph edges
       */

      // Example
      // const res = await axios.post(
      //   "/api/tours/connect",
      //   {
      //     nodes,
      //   }
      // );
      //
      // setTravelEdges(res.data.edges);

      setTravelEdges([]);

      setSelectedRoute(nodes);

      setMessage(
        "Tour connected successfully."
      );
    } catch (err) {
      console.error(err);

      setMessage(
        "Unable to connect tour."
      );
    } finally {
      setLoading(false);
    }
  };

  //----------------------------------------
  // Save Tour
  //----------------------------------------

  const saveTour = async () => {
    if (!tourName.trim()) {
      setMessage(
        "Enter tour name."
      );
      return;
    }

    if (nodes.length === 0) {
      setMessage(
        "No places selected."
      );
      return;
    }

    try {
      setLoading(true);

      await axios.post("/api/tours", {
        tour_name: tourName,
        places: nodes,
      });

      setMessage(
        "Tour saved successfully."
      );
    } catch (err) {
      console.error(err);

      setMessage(
        "Failed to save tour."
      );
    } finally {
      setLoading(false);
    }
  };

  //----------------------------------------
  // Clear Tour
  //----------------------------------------

  const clearTour = () => {
    setTravelEdges([]);

    setSelectedRoute([]);

    setMessage("Tour cleared.");
  };

  //----------------------------------------

  return (
    <Box>

      <Typography
        variant="h6"
        gutterBottom
      >
        Tour Actions
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Stack spacing={2}>

        <TextField
          fullWidth
          label="Tour Name"
          value={tourName}
          onChange={(e) =>
            setTourName(
              e.target.value
            )
          }
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<HubIcon />}
          disabled={loading}
          onClick={connectTour}
        >
          Connect Tour
        </Button>

        <Button
          fullWidth
          variant="contained"
          color="success"
          startIcon={<SaveIcon />}
          disabled={loading}
          onClick={saveTour}
        >
          Save Tour
        </Button>

        <Button
          fullWidth
          variant="outlined"
          color="error"
          startIcon={
            <DeleteSweepIcon />
          }
          onClick={clearTour}
        >
          Clear Tour
        </Button>

        <Divider />

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Tour Summary
        </Typography>

        <Typography variant="body2">
          Places : {nodes.length}
        </Typography>

        <Typography variant="body2">
          Routes : {travelEdges.length}
        </Typography>

        {message && (
          <Alert severity="info">
            {message}
          </Alert>
        )}

      </Stack>

    </Box>
  );
};

export default TourToolbar;