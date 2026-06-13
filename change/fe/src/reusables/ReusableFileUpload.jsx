import React from "react";
import { Box, Typography } from "@mui/material";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";

const ReusableFileUpload = ({
  name,
  label = "Upload Image",
  accept = "image/*",
  fileName,
  onChange,
}) => {
  return (
    <>
      <input
        id="file-upload"
        type="file"
        accept={accept}
        hidden
        onChange={onChange}
        name={name}
      />

      <label htmlFor="file-upload">
        <Box
          sx={{
            height: 56,
            border: "1px solid",
            borderColor: "rgba(0,0,0,0.23)",
            borderRadius: 1,
            px: 2,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            cursor: "pointer",
            transition: "all 0.2s ease",
            bgcolor: "background.paper",
            "&:hover": {
              borderColor: "primary.main",
            },
          }}
        >
          <CloudUploadRoundedIcon
            color="primary"
            sx={{ fontSize: 24 }}
          />

          <Box
            sx={{
              flex: 1,
              overflow: "hidden",
            }}
          >
            <Typography
              variant="body2"
              color={fileName ? "text.primary" : "text.secondary"}
              noWrap
            >
              {fileName || label}
            </Typography>
          </Box>
        </Box>
      </label>
    </>
  );
};

export default ReusableFileUpload;




// import React from "react";
// import { Box, Typography } from "@mui/material";
// import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";

// const ReusableFileUpload = ({
//   label = "Upload Image",
//   accept = "image/*",
//   fileName,
//   onChange,
// }) => {
//   return (
//     <Box>
//       <input
//         id="file-upload"
//         type="file"
//         accept={accept}
//         hidden
//         onChange={onChange}
//       />

//       <label htmlFor="file-upload">
//         <Box
//           sx={{
//             border: "2px dashed rgba(0,0,0,0.15)",
//             borderRadius: "20px",
//             p: 4,
//             textAlign: "center",
//             cursor: "pointer",
//             background:
//               "linear-gradient(135deg, rgba(33,150,243,0.05), rgba(3,169,244,0.12))",
//             transition: "all 0.3s ease",
//             "&:hover": {
//               transform: "translateY(-2px)",
//               borderColor: "primary.main",
//               boxShadow: 3,
//             },
//           }}
//         >
//           <CloudUploadRoundedIcon
//             sx={{
//               fontSize: 60,
//               color: "primary.main",
//               mb: 1,
//             }}
//           />

//           <Typography
//             variant="h6"
//             fontWeight={600}
//             gutterBottom
//           >
//             {label}
//           </Typography>

//           <Typography
//             variant="body2"
//             color="text.secondary"
//           >
//             Drag & Drop or Click to Browse
//           </Typography>

//           {fileName && (
//             <Typography
//               sx={{
//                 mt: 2,
//                 py: 1,
//                 px: 2,
//                 display: "inline-block",
//                 borderRadius: 2,
//                 bgcolor: "rgba(76,175,80,0.12)",
//                 color: "success.main",
//                 fontWeight: 500,
//                 maxWidth: "100%",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//                 whiteSpace: "nowrap",
//               }}
//             >
//               {fileName}
//             </Typography>
//           )}
//         </Box>
//       </label>
//     </Box>
//   );
// };

// export default ReusableFileUpload;