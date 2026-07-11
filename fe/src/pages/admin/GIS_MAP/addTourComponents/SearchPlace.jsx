import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  TextField,
  Typography,
  Autocomplete,
  Button,
  Stack,
} from "@mui/material";

import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";

const SearchPlace = ({
  tourNodes,
  setTourNodes,
}) => {
  const [search, setSearch] =
    useState("");

  const [options, setOptions] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [selectedVillage, setSelectedVillage] =
    useState(null);

  //----------------------------------------------

  useEffect(() => {
    if (search.length < 3) {
      setOptions([]);
      return;
    }

    const delay = setTimeout(() => {
      searchVillage();
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  //----------------------------------------------

  const searchVillage = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `/api/lgd/searchVillages`,
        {
          params: {
            search,
          },
        }
      );

      setOptions(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //----------------------------------------------

  const addVillage = () => {
    if (!selectedVillage) return;

    const exists =
      tourNodes.some(
        (node) =>
          node.village_code ===
          selectedVillage.village_code
      );

    if (exists) {
      alert("Village already added.");
      return;
    }

    setTourNodes((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),

        village_code:
          selectedVillage.village_code,

        village_name:
          selectedVillage.village_name,

        sub_district_name:
          selectedVillage.sub_district_name,

        district_name:
          selectedVillage.district_name,

        state_name:
          selectedVillage.state_name,

        latitude:
          selectedVillage.latitude ??
          null,

        longitude:
          selectedVillage.longitude ??
          null,
      },
    ]);

    setSelectedVillage(null);
    setSearch("");
  };

  //----------------------------------------------

  return (
    <Box>
      <Typography
        variant="h6"
        gutterBottom
      >
        Search Village
      </Typography>

      <Stack spacing={2}>
        <Autocomplete
          loading={loading}
          value={selectedVillage}
          options={options}
          onChange={(e, value) =>
            setSelectedVillage(value)
          }
          getOptionLabel={(option) =>
            `${option.village_name}, ${option.sub_district_name}, ${option.district_name}`
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Village"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />
          )}
        />

        <Button
          variant="contained"
          color="success"
          startIcon={
            <AddLocationAltIcon />
          }
          disabled={!selectedVillage}
          onClick={addVillage}
        >
          Add Place
        </Button>
      </Stack>
    </Box>
  );
};

export default SearchPlace;