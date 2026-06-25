import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { baseUrlInstance } from "../../app/appUtils";
import useModal from "../../reusables/useModal";
import UniversalModal from "../../features/UniversalModal";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

const UploadCsvData = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    showModal,
    modalData,
    modalType,
    modalNavigation,
    setShowModal,
    setModalData,
    setModalType,
    setModalNavigation,
  } = useModal();

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    setError("");
    setSelectedFile(null);

    if (!file) return;

    const allowedTypes = [
      "text/csv",
      "application/vnd.ms-excel",
    ];

    const extension = file.name
      .split(".")
      .pop()
      .toLowerCase();

    if (
      !allowedTypes.includes(file.type) &&
      extension !== "csv"
    ) {
      setError("Only CSV files (.csv) are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(
        `File size exceeds the maximum limit of ${
          MAX_FILE_SIZE / (1024 * 1024)
        } MB.`
      );
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

const handleUpload = async () => {
  if (!selectedFile || loading) return;

  try {
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    const { data, status } =
      await baseUrlInstance.post(
        import.meta.env.VITE_CENSUS_URL,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    // console.log(data);

    if (status === 200||status === 201) {
      setModalData({
        title: "Success",
        content:
          data?.message ||
          "Uploaded successfully!",
      });

      setModalType("success");
      setSelectedFile(null);
      return;
    } else {
      setModalData({
        title: "Failed",
        content:
          data?.message ||
          "Failed to upload CSV file.",
      });

      setModalType("error");
    }
  } catch (err) {
    console.error(err);

    const message =
      err?.response?.data?.message ||
      "Failed to upload CSV file.";

    setError(message);

    setModalData({
      title: "Failed",
      content: message,
    });

    setModalType("error");
  } finally {
    setLoading(false);
    setShowModal(true);
  }
};

return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 3,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 650,
          p: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 3,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={600}
        >
          Upload Census CSV Data
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Supported format:
          <strong> .csv</strong>
          <br />
          Maximum allowed file size:
          <strong> 100 MB</strong>
        </Typography>

        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUploadIcon />}
          size="large"
          disabled={loading}
        >
          Choose CSV File

          <input
            hidden
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={loading}
          />
        </Button>

        {selectedFile && (
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              width: "100%",
              maxWidth: 450,
              backgroundColor: "#fafafa",
            }}
          >
            <Typography>
              <strong>
                Selected File:
              </strong>
            </Typography>

            <Typography sx={{ mt: 1 }}>
              {selectedFile.name}
            </Typography>

            <Typography sx={{ mt: 1 }}>
              <strong>Size:</strong>{" "}
              {(
                selectedFile.size /
                (1024 * 1024)
              ).toFixed(2)}{" "}
              MB
            </Typography>
          </Paper>
        )}

        {error && (
          <Alert
            severity="error"
            sx={{
              width: "100%",
              maxWidth: 450,
            }}
          >
            {error}
          </Alert>
        )}

        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="success"
            size="large"
            disabled={
              !selectedFile || loading
            }
            onClick={handleUpload}
            startIcon={
              loading ? (
                <CircularProgress
                  size={20}
                  color="inherit"
                />
              ) : null
            }
          >
            {loading
              ? "Uploading..."
              : "Upload CSV"}
          </Button>
        </Box>
      </Paper>
      <UniversalModal
    showModal={showModal}
    setShowModal={setShowModal}
    modalData={modalData}
    setModalData={setModalData}
    type={modalType}
    setModalType={setModalType}
    // navigateLocation={modalNavigation}
    />
    </Box>
  );
};

export default UploadCsvData;






// import React, { useState } from "react";
// import {
//   Alert,
//   Box,
//   Button,
//   Paper,
//   Typography,
// } from "@mui/material";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import { baseUrlInstance } from "../../app/appUtils";
// // import axios from "axios";

// const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

// const UploadCsvData = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [error, setError] = useState("");

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];

//     setError("");
//     setSelectedFile(null);

//     if (!file) return;

//     const allowedTypes = [
//       "text/csv",
//       "application/vnd.ms-excel",
//     ];

//     const extension = file.name.split(".").pop().toLowerCase();

//     if (
//       !allowedTypes.includes(file.type) &&
//       extension !== "csv"
//     ) {
//       setError("Only CSV files (.csv) are allowed.");
//       e.target.value = "";
//       return;
//     }

//     if (file.size > MAX_FILE_SIZE) {
//       setError(
//         `File size exceeds the maximum limit of ${
//           MAX_FILE_SIZE / (1024 * 1024)
//         } MB.`
//       );
//       e.target.value = "";
//       return;
//     }

//     setSelectedFile(file);
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) return;

//     try {
//       const formData = new FormData();
//       formData.append("file", selectedFile);

//       console.log("Uploading CSV:", selectedFile);

//       const response = await baseUrlInstance.post(
//         import.meta.env.VITE_CENSUS_URL,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       console.log(response.data);

//       alert("CSV ready to upload.");
//     } catch (err) {
//       console.error(err);
//       setError("Failed to upload CSV file.");
//     }
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "80vh",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         p: 3,
//       }}
//     >
//       <Paper
//         elevation={4}
//         sx={{
//           width: "100%",
//           maxWidth: 650,
//           p: 5,
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           textAlign: "center",
//           gap: 3,
//           borderRadius: 3,
//         }}
//       >
//         <Typography variant="h5" fontWeight={600}>
//           Upload Census CSV Data
//         </Typography>

//         <Typography variant="body2" color="text.secondary">
//           Supported format: <strong>.csv</strong>
//           <br />
//           Maximum allowed file size: <strong>100 MB</strong>
//         </Typography>

//         <Button
//           variant="contained"
//           component="label"
//           startIcon={<CloudUploadIcon />}
//           size="large"
//         >
//           Choose CSV File
//           <input
//             hidden
//             type="file"
//             accept=".csv"
//             onChange={handleFileChange}
//           />
//         </Button>

//         {selectedFile && (
//           <Paper
//             variant="outlined"
//             sx={{
//               p: 2,
//               width: "100%",
//               maxWidth: 450,
//               backgroundColor: "#fafafa",
//             }}
//           >
//             <Typography>
//               <strong>Selected File:</strong>
//             </Typography>

//             <Typography sx={{ mt: 1 }}>
//               {selectedFile.name}
//             </Typography>

//             <Typography sx={{ mt: 1 }}>
//               <strong>Size:</strong>{" "}
//               {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
//             </Typography>
//           </Paper>
//         )}

//         {error && (
//           <Alert
//             severity="error"
//             sx={{
//               width: "100%",
//               maxWidth: 450,
//             }}
//           >
//             {error}
//           </Alert>
//         )}

//         <Box sx={{ mt: 2 }}>
//           <Button
//             variant="contained"
//             color="success"
//             size="large"
//             disabled={!selectedFile}
//             onClick={handleUpload}
//           >
//             Upload CSV
//           </Button>
//         </Box>
//       </Paper>
//     </Box>
//   );
// };

// export default UploadCsvData;
