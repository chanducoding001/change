import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";

import {
  Box,
  Button,
  Typography,
  Stack,
  Paper,
  IconButton,
  Alert,
  Divider,
  Chip,
  Input,
  TextField,
} from "@mui/material";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import { inputStyle } from "../../../auth/signUp/SignUp";
import { createInfoWorkBtnStyles } from "../CreateInfoWork";
import { useDispatch } from "react-redux";
import { createTourApi } from "../../../app/thunkApiCalls";
import useModal from "../../../reusables/useModal";
import UniversalModal from "../../../features/UniversalModal";

const initialErrors = {
    name: "",
    description: "",
    places: "",
  }
const CreateTour = () => {
  const inputRef = useRef();
  const [nameDesc, setNameDesc] = useState({ name: "", description: "" });
  const [places, setPlaces] = useState([]);
  const [status, setStatus] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState(initialErrors);
  const dispatch = useDispatch();
  const {
    showModal,
    modalData,
    modalType,
    setShowModal,
    setModalData,
    setModalType,
  } = useModal();

  const validate = () => {
    const newErrors = {
      name: "",
      description: "",
      places: "",
    };

    let isValid = true;

    if (!nameDesc.name.trim()) {
      newErrors.name = "Tour name is required.";
      isValid = false;
    }

    if (!nameDesc.description.trim()) {
      newErrors.description = "Description is required.";
      isValid = false;
    }

    // if (places.length === 0) {
    //   newErrors.places = "Please upload an Excel file containing places.";
    //   isValid = false;
    // }

    setErrors(newErrors);

    return isValid;
  };
  //--------------------------------------------------

  const handleBrowse = () => {
    inputRef.current.click();
  };

  //--------------------------------------------------

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setSelectedFile(file);

    readExcel(file);
  };

  //--------------------------------------------------

  const readExcel = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, {
        type: "array",
      });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const rows = XLSX.utils.sheet_to_json(sheet, {
        defval: "",
      });

      const onlyPlaces = rows.map((row, index) => ({
        id: crypto.randomUUID?.() ?? `${Date.now()}-${index}`,
        searchQuery: `${row.village_name},${row.sub_district_name ?? row["sub-district_name"]},${row.district_name},${row.state_name}`,
      }));

      setPlaces(onlyPlaces);

      setStatus(`${onlyPlaces.length} places imported successfully.`);
    };

    reader.readAsArrayBuffer(file);
  };

  //--------------------------------------------------

  const removePlace = (id) => {
    setPlaces((previous) => previous.filter((place) => place.id !== id));
  };
  const handleClear = ()=>{
    setNameDesc({name:'',description:''});
    setPlaces([]);
    setStatus(null);
    setSelectedFile(null);
    setErrors(initialErrors);
  };
  //--------------------------------------------------
  const handleAddTour = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const requiredObj = {
      ...nameDesc,
      places,
    };

    // console.log("tour", requiredObj);
    
    // API Call
    try {
        const result = await dispatch(createTourApi({
            url:import.meta.env.VITE_CREATE_TOUR,
            data:requiredObj
        }));
        if(createTourApi.fulfilled.match(result)){
            // console.log(' fulfilled result',result);
            setModalData({
          title:'Create A tour',
          content:'Tour created successfully!'
        });
        setModalType('success');
        handleClear();

        }else if(createTourApi.rejected.match(result)){
            // console.log('error',result.payload);
            setModalData({
          title:'Create A tour',
          content:result.payload
        });
        setModalType('error');
        }
        setShowModal(true);
    } catch (error) {
        // console.log('error',error.message);
        setModalData({
          title:'Create A tour',
          content:error.message
        });
        setModalType('error');
        setShowModal(true);
    }
  };

  return (
    <Box>
      <h1 style={{
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        color:'white',
        fontSize:"2rem"
      }}>
        Create a Tour
      </h1>
      <span style={{
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        color:'yellow',
        // fontSize:"2rem"
      }}>
        Upload Excel in Map searchable rows such as village_name sub_district_name district_name state_name
      </span>

      <TextField
        id="outlined-basic"
        label="Name of Tour"
        variant="outlined"
        margin="normal"
        sx={inputStyle}
        fullWidth
        placeholder="Enter Name of Tour"
        value={nameDesc?.name}
        onChange={(e) => {
          setNameDesc({
            ...nameDesc,
            name: e.target.value,
          });

          if (errors.name) {
            setErrors({
              ...errors,
              name: "",
            });
          }
        }}
        error={Boolean(errors.name)}
        helperText={errors.name}
      />
      <TextField
        id="outlined-multiline-static"
        label="Description"
        multiline
        margin="normal"
        rows={2}
        placeholder="Say something about tour..."
        sx={inputStyle}
        fullWidth
        value={nameDesc.description}
        onChange={(e) => {
          setNameDesc({
            ...nameDesc,
            description: e.target.value,
          });

          if (errors.description) {
            setErrors({
              ...errors,
              description: "",
            });
          }
        }}
        error={Boolean(errors.description)}
        helperText={errors.description}
      />
      <input
        hidden
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
      />

      <Button
        fullWidth
        variant="contained"
        startIcon={<UploadFileIcon />}
        onClick={handleBrowse}
      >
        Upload Excel
      </Button>
      {errors.places && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {errors.places}
        </Typography>
      )}
      {status && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {status}
        </Alert>
      )}

      <Divider sx={{ my: 2 }} />

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Chip color="primary" label={`Places : ${places.length}`} />

        <Chip
          color={selectedFile ? "success" : "default"}
          label={selectedFile ? "Excel Loaded" : "No File"}
        />
      </Stack>

      <Typography variant="subtitle1" gutterBottom>
        Imported Places
      </Typography>

      <Stack spacing={1}>
        {places.map((node, index) => (
          <Paper
            key={node.id}
            variant="outlined"
            sx={{
              p: 1.5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography fontWeight={600}>
                {index + 1}. {node.searchQuery}
              </Typography>
            </Box>

            <IconButton color="error" onClick={() => removePlace(node.id)}>
              <DeleteIcon />
            </IconButton>
          </Paper>
        ))}
      </Stack>
      <Button variant="outlined" onClick={handleAddTour} sx={{
        ...createInfoWorkBtnStyles,
        margin:'10px'
      }}>
        Add Tour
      </Button>
      <UniversalModal
        showModal={showModal}
        modalData={modalData}
        modalType={modalType}
        setModalType={setModalType}
        setModalData={setModalData}
        setShowModal={setShowModal}
      />
    </Box>
  );
};

export default CreateTour;
