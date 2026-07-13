import { Box, Modal, Typography, IconButton } from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import ErrorIcon from "@mui/icons-material/ErrorOutline";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 380,
  borderRadius: 4,
  overflow: "hidden",
  outline: "none",
  background: "rgba(255,255,255,0.12)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.25)",
  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  color: "#fff",
  animation: "pop 0.3s ease-out",
};

const headerStyle = {
  padding: "12px 16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: "linear-gradient(135deg, #00c6ff, #0072ff)",
};

const contentStyle = {
  padding: "20px",
  textAlign: "center",
};

const iconStyle = {
  fontSize: 55,
  marginBottom: 10,
  filter: "drop-shadow(0 0 10px rgba(255,255,255,0.5))",
  animation: "float 2s ease-in-out infinite",
};

const UniversalModal = (props) => {
  const navigate = useNavigate();
  const {
    showModal,
    setShowModal,
    modalData,
    setModalData,
    navigateLocation,
    setModalType,
    modalAction,
    setModalAction,
    deleteFunctionReference,
    modalType,
    type = "info", // success | error | info
  } = props;

  const handleClose = () => {
    setShowModal(false);
    setModalData({ title: "", content: "" });
    setModalType("info");
    if(setModalAction){
      setModalAction(null);
    }
    if (navigateLocation) {
      navigate(navigateLocation);
    }
  };

  const getIcon = () => {
    if (modalType === "success")
      return <CheckCircleIcon sx={{ ...iconStyle, color: "#00ffb3" }} />;
    if (modalType === "error")
      return <ErrorIcon sx={{ ...iconStyle, color: "#ff4d4d" }} />;
    return <InfoIcon sx={{ ...iconStyle, color: "#4da6ff" }} />;
  };
  
  return (
    <>
      <Modal open={showModal} onClose={handleClose}>
        <Box sx={style}>
          {/* HEADER */}
          <Box sx={headerStyle}>
            <Typography sx={{ fontWeight: 600 }}>{modalData?.title}</Typography>

            <IconButton onClick={handleClose} sx={{ color: "#fff" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* BODY */}
          {/* <Box sx={contentStyle}>
            {getIcon()}

            <Typography
              sx={{
                fontSize: "0.95rem",
                opacity: 0.9,
                mt: 1
              }}
            >
              {modalData?.content}
            </Typography>
          </Box> */}

          <Box sx={contentStyle}>
            {getIcon()}

            <Typography
              sx={{
                fontSize: "0.95rem",
                opacity: 0.9,
                mt: 1,
                mb: modalAction==="delete" ? 3 : 0,
              }}
            >
              {modalData?.content}
            </Typography>

            {modalAction==="delete" && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  mt: 2,
                }}
              >
                <Box
                  component="button"
                  onClick={handleClose}
                  sx={{
                    border: "none",
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    cursor: "pointer",
                    background: "rgba(255,255,255,0.15)",
                    color: "#fff",
                    fontWeight: 600,
                    transition: "0.3s",
                    "&:hover": {
                      background: "rgba(255,255,255,0.25)",
                    },
                  }}
                >
                  Cancel
                </Box>

                <Box
                  component="button"
                  onClick={deleteFunctionReference}
                  sx={{
                    border: "none",
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    cursor: "pointer",
                    background: "linear-gradient(135deg,#ff4d4d,#d32f2f)",
                    color: "#fff",
                    fontWeight: 700,
                    boxShadow: "0 8px 20px rgba(211,47,47,0.35)",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 25px rgba(211,47,47,0.5)",
                    },
                  }}
                >
                  Delete
                </Box>
              </Box>
            )}
          </Box>

          {/* ANIMATIONS */}
          <style>
            {`
              @keyframes float {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-6px); }
                100% { transform: translateY(0px); }
              }

              @keyframes pop {
                from { transform: translate(-50%, -55%) scale(0.9); opacity: 0; }
                to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
              }
            `}
          </style>
        </Box>
      </Modal>
    </>
  );
};

export default UniversalModal;


// import { Box, Modal, Typography } from '@mui/material';
// import React from 'react'
// import { useNavigate } from 'react-router-dom';

// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: 24,
//   p: 4,
// };

// const UniversalModal = (props) => {
//     const navigate = useNavigate();
//     const {showModal,setShowModal,modalData,setModalData,navigateLocation} = props;

//     const handleClose = ()=>{
//         setShowModal(false);
//         setModalData({title:'',content:''});
//         if(navigateLocation){
//           navigate(navigateLocation);
//         }
//     }
//   return (
//     <>
//     <Modal
//         open={showModal}
//         onClose={handleClose}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//       >
//         <Box sx={style}>
//           <Typography id="modal-modal-title" variant="h6" component="h2">
//             {modalData?.title}
//           </Typography>
//           <Typography id="modal-modal-description" sx={{ mt: 2 }}>
//             {modalData?.content}
//           </Typography>
//         </Box>
//       </Modal>
//     </>
//   )
// }

// export default UniversalModal;
