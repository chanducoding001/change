import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setStateLGDSelectedSdsd } from "../../app/apiSlicer";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import {
  getStateLGDAllStatesApi,
  getStateLGDDistrictsByStateApi,
  getStateLGDSubDistsByStateDistApi,
  getStateLGDVillagesByStateDistSubDistApi,
} from "../../app/thunkApiCalls";
import PsuedoTable from "../../reusables/PsuedoTable";
import { createInfoWorkBtnStyles } from "../admin/CreateInfoWork";

const whiteAutocompleteStyles = {
  "& .MuiInputLabel-root": {
    color: "white",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "white",
  },
  "& .MuiOutlinedInput-root": {
    color: "white",
    "& fieldset": {
      borderColor: "white",
    },
    "&:hover fieldset": {
      borderColor: "white",
    },
    "&.Mui-focused fieldset": {
      borderColor: "white",
    },
  },
  "& .MuiAutocomplete-popupIndicator": {
    color: "white",
  },
  "& .MuiAutocomplete-clearIndicator": {
    color: "white",
  },
};

const DisplaySDSDVData = () => {
  const { data: getStateLGDAllStatesData } = useSelector(
    (state) => state.apiSlicer.getStateLGDAllStates,
  );
  const { data: getStateLGDDistrictsByStateData } = useSelector(
    (state) => state.apiSlicer.getStateLGDDistrictsByState,
  );
  const { data: getStateLGDSubDistsByStateDistData } = useSelector(
    (state) => state.apiSlicer.getStateLGDSubDistsByStateDist,
  );
  const { data: getStateLGDVillagesByStateDistSubDistData } = useSelector(
    (state) => state.apiSlicer.getStateLGDVillagesByStateDistSubDist,
  );
  const { selectedState, selectedDist, selectedSubDist } = useSelector(
    (state) => state.apiSlicer.stateLGDSelectedSdsd,
  );

  const { data: allStates } = getStateLGDAllStatesData;
  const { data: allDistrictsOfState } = getStateLGDDistrictsByStateData;
  const { data: allSubDissOfDist } = getStateLGDSubDistsByStateDistData;
  const { data: allVillsofSubDist } = getStateLGDVillagesByStateDistSubDistData;
  // hold the state in redux for selected state dist subdist
  
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [statistics, setStatistics] = useState(null);

  const [search, setSearch] = useState("");

  const [populationLimit, setPopulationLimit] = useState("");

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const dispatch = useDispatch();
  // console.log('selected state',selectedState);
  const stateCode = selectedState?.stateCode;
  const districtCode = selectedDist?.districtCode;
  const subDistrictCode = selectedSubDist?.subDistrictCode;

  const fetchStates = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const result = await dispatch(
        getStateLGDAllStatesApi({
          url: `${import.meta.env.VITE_STATELGD_GET_ALL_STATES}`,
          data: [],
        }),
      );

      if (getStateLGDAllStatesApi.fulfilled.match(result)) {
      } else if (getStateLGDAllStatesApi.rejected.match(result)) {
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDistricts = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await dispatch(
        getStateLGDDistrictsByStateApi({
          url: `${import.meta.env.VITE_STATELGD_GET_DISTRICTS_BY_STATE}/${stateCode}`,
        }),
      );
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubDistricts = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await dispatch(
        getStateLGDSubDistsByStateDistApi({
          url: `${import.meta.env.VITE_STATELGD_GET_SUB_DIST_BY_STATE_DIST}/${stateCode}/${districtCode}`,
        }),
      );
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchVillages = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await dispatch(
        getStateLGDVillagesByStateDistSubDistApi({
          url: `${import.meta.env.VITE_STATELGD_GET_VILLS_BY_STATE_DIST_SUB_DIST}/${stateCode}/${districtCode}/${subDistrictCode}`,
        }),
      );
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const buttonText = !allStates?.length
    ? "Get States"
    : selectedState && !allDistrictsOfState?.length
      ? "Get Districts"
      : selectedDist && !allSubDissOfDist?.length
        ? "Get Mandals"
        : allSubDissOfDist?.length
          ? "Get Villages"
          : "Select an option";

  const buttonAction = !allStates?.length
    ? fetchStates
    : selectedState && !allDistrictsOfState?.length
      ? fetchDistricts
      : selectedDist && !allSubDissOfDist?.length
        ? fetchSubDistricts
        : fetchVillages;
  return (
    <Box sx={{p:2}}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2} sx={{ marginTop: "10px" }}>
        {allStates?.length > 0 && (
          <Grid
            size={{
              xs: 12,
              md: 3,
            }}
          >
            <Autocomplete
              options={allStates}
              value={selectedState}
              sx={whiteAutocompleteStyles}
              disableClearable
              onChange={(e, value) =>
                dispatch(setStateLGDSelectedSdsd({ selectedState: value }))
              }
              getOptionLabel={(o) => o?.label || ""}
              renderInput={(params) => <TextField {...params} label="State" />}
            />
          </Grid>
        )}

        {allDistrictsOfState?.length > 0 && (
          <Grid
            size={{
              xs: 12,
              md: 3,
            }}
          >
            <Autocomplete
              options={allDistrictsOfState}
              value={selectedDist}
              sx={whiteAutocompleteStyles}
              disableClearable
              onChange={(e, value) =>
                dispatch(setStateLGDSelectedSdsd({ selectedDist: value }))
              }
              getOptionLabel={(o) => o?.label || ""}
              renderInput={(params) => (
                <TextField {...params} label="District" />
              )}
            />
          </Grid>
        )}

        {allSubDissOfDist?.length > 0 && (
          <Grid
            size={{
              xs: 12,
              md: 3,
            }}
          >
            <Autocomplete
              options={allSubDissOfDist}
              value={selectedSubDist}
              sx={whiteAutocompleteStyles}
              disableClearable
              onChange={(e, value) =>
                dispatch(setStateLGDSelectedSdsd({ selectedSubDist: value }))
              }
              getOptionLabel={(o) => o?.label || ""}
              renderInput={(params) => <TextField {...params} label="Sub District" />}
            />
          </Grid>
        )}
      </Grid>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width:'100%',
          my: 2,
        }}
      >
        <Button
          variant="outlined"
          onClick={buttonAction}
          disabled={loading || allVillsofSubDist?.length > 0}
          sx={createInfoWorkBtnStyles}
        >
          {loading ? "Loading..." : buttonText}
        </Button>
      </Box>

      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "rgba(0,0,0,0.3)",
            zIndex: 9999,
          }}
        >
          <CircularProgress sx={{ color: "white" }} />
        </Box>
      )}

      {allVillsofSubDist?.length > 0 && (
          <PsuedoTable 
          data={allVillsofSubDist}
          selectedState={selectedState}
          selectedDist={selectedDist}
          selectedSubDist={selectedSubDist}
          />
      )}

    </Box>
  );
};

export default DisplaySDSDVData;
