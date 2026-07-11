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
} from "@mui/material";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";

const PracticeUpload = ({
  tourNodes=[],
  setTourNodes,
}) => {
  const inputRef = useRef();

  const [status, setStatus] =
    useState("");

  const [selectedFile, setSelectedFile] =
    useState(null);

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
      const workbook = XLSX.read(
        e.target.result,
        {
          type: "array",
        }
      );

      const sheet =
        workbook.Sheets[
          workbook.SheetNames[0]
        ];

      const rows =
        XLSX.utils.sheet_to_json(sheet, {
          defval: "",
        });

      const importedNodes = rows.map(
        (row, index) => ({
          id:
            crypto.randomUUID?.() ??
            `${Date.now()}-${index}`,

          state_name:
            row.state_name,

          district_name:
            row.district_name,

          sub_district_name:
            row.sub_district_name ??
            row["sub-district_name"],

          village_name:
            row.village_name,
            travelNode:`${row.village_name},${row.sub_district_name ??row["sub-district_name"]},${row.district_name},${row.state_name}`,
        })
      );

      setTourNodes((previous) => [
        ...previous,
        ...importedNodes,
      ]);

      setStatus(
        `${importedNodes.length} places imported successfully.`
      );
    };

    reader.readAsArrayBuffer(file);
  };

  //--------------------------------------------------

  const removeNode = (id) => {
    setTourNodes((previous) =>
      previous.filter(
        (node) => node.id !== id
      )
    );
  };

  //--------------------------------------------------

  return (
    <Box>
      <Typography
        variant="h6"
        gutterBottom
      >
        Import Travel Paths
      </Typography>

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

      {status && (
        <Alert
          severity="success"
          sx={{ mt: 2 }}
        >
          {status}
        </Alert>
      )}

      <Divider sx={{ my: 2 }} />

      <Stack
        direction="row"
        spacing={1}
        sx={{ mb: 2 }}
      >
        <Chip
          color="primary"
          label={`Places : ${tourNodes.length}`}
        />

        <Chip
          color={
            selectedFile
              ? "success"
              : "default"
          }
          label={
            selectedFile
              ? "Excel Loaded"
              : "No File"
          }
        />
      </Stack>

      <Typography
        variant="subtitle1"
        gutterBottom
      >
        Imported Places
      </Typography>

      <Stack spacing={1}>
        {tourNodes.map((node, index) => (
          <Paper
            key={node.id}
            variant="outlined"
            sx={{
              p: 1.5,
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography
                fontWeight={600}
              >
                {index + 1}.{" "}
                {node.village_name}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {
                  node.sub_district_name
                }
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {
                  node.district_name
                }
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {node.state_name}
              </Typography>
            </Box>

            <IconButton
              color="error"
              onClick={() =>
                removeNode(node.id)
              }
            >
              <DeleteIcon />
            </IconButton>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};

export default PracticeUpload;












// import React from 'react'

// const ImportTravelPaths = () => {

//   return (
//     <>
//     ImportTravelPaths
//     {/* contains a automatic file upload button for xlsx sheet where it contains 
//     state_name district_name sub_district_name village_name
//     and on clicking the connect button it will connect the travel paths and show the travel paths on the map, 
//     neaest travelling place hoghlighting it particularly and also show the travel paths on the map with different colors for different travel paths,
//     and there there will be a search box to search for a particular travel path and upon getting the route from current place to the destination place, upon clicking add route,
//     it should show the chain of travel paths as connecting nodes

//     there will be a add tour button upon clicking it,the selected travelling paths should get stored inside the tour list
//     all this will be in single component and this data will be given to the map component
//     the parent component will be Add Travel.jsx and the child component will be ImportTravelPaths.jsx and the map component will be GISMap.jsx
//     */}

//     </>
//   )
// }

// export default ImportTravelPaths;
