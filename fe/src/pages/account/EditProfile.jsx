import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import ReusableFileUpload from "../../reusables/ReusableFileUpload";
import { navigationLocations, optimizeImage, uploadToCloudinary } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import { removeCurrentProfilePhotoApi, updateProfileApi } from "../../app/thunkApiCalls";
import { removeProfilePhoto, setUser } from "../../app/apiSlicer";
import UniversalModal from "../../features/UniversalModal";
import { baseUrlInstance } from "../../app/appUtils";

const EditProfile = () => {
  const [fileName, setFileName] = useState("");
  const [previewPhoto, setPreviewPhoto] = useState({});
  const [modalData,setModalData] = useState({title:'',content:''});
  const [modalType,setModalType] = useState('info');
  const [showModal,setShowModal] = useState(false);
  const [modalNavigation,setModalNavigation] = useState('');
  const [fileUploadData,setFileUploadData] = useState({
    isUploading:false,
    uploadSuccess:false
  })
  const navigate = useNavigate();
  const userProfile = useSelector((state) => state.apiSlicer.userProfile);
  const dispatch = useDispatch();
  const {
    name = "",
    email = "",
    mobile = "",
    address = "",
    profilePhoto,
    id
  } = userProfile || {};

  const initialValues = {
    name,
    address,
    profilePhoto: profilePhoto || null,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("User Name is required"),
  });
  const handleCancel = () => {
    navigate(navigationLocations?.PROFILE);
  };
  const handleRemoveCurrentProfilePhoto = async ()=>{
    try {
    const response = await dispatch(removeCurrentProfilePhotoApi({
      url:`${import.meta.env.VITE_REMOVE_CURRENT_PROFILE_PHOTO}`,
      data:profilePhoto
    }));

    if(removeCurrentProfilePhotoApi.fulfilled.match(response)){
      // update profile in the store
      dispatch(removeProfilePhoto());
      setModalData({
        title:'Success!',
        content:'Profile photo deleted successfully!'
      });
      setModalType('success');
    }else if(removeCurrentProfilePhotoApi.rejected.match(response)){
      setModalData({
        title:'Failed!',
        content:response.payload
      });
      setModalType('error');
    }
  } catch (error) {
    // console.log(error);
    setModalData({
        title:'Failed!',
        content:error.message
      });
      setModalType('error');
  }
  setShowModal(true);
  }
  const onSubmit = async (values) => {
    // console.log(values);
    try {
      const result = await dispatch(
      updateProfileApi({
        url: `${import.meta.env.VITE_UPDATE_PROFILE}/${id}`,
        data: values,
      }),
    );
    if (updateProfileApi.fulfilled.match(result)) {
      // console.log("inside success",result.payload.user);
      const userProfileData = {...result.payload.user,id:result.payload.user._id};
      // console.log('updated',userProfileData);
      
      dispatch(setUser(userProfileData));
      // navigate(navigationLocations?.PROFILE);
      setModalData({
        title:'Success!',
        content:'Profile updated successfully!'
      });
      setModalType('success');
      setModalNavigation(navigationLocations?.PROFILE);
    }else if (updateProfileApi.rejected.match(result)) {
      setModalData({
        title:'Failed!',
        content:result.payload
      });
      setModalType('error');
    }
      setShowModal(true);
    } catch (error) {
      setModalData({
        title:'Failed!',
        content:error.message
      });
      setModalType('error');
    }

  };

  return (
    <>
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        py: 4,
        px: 2,
      }}
    >
      <Card
        elevation={10}
        sx={{
          width: "100%",
          maxWidth: 800,
          borderRadius: 5,
          overflow: "visible",
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            height: 300,
            background: "linear-gradient(135deg,#0f172a,#1e3a8a,#0ea5e9)",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            textAlign: "center",
            px: 2,
          }}
        >
          {/* TITLE INSIDE HEADER */}
          <Typography variant="h4" fontWeight={800}>
            Update Profile
          </Typography>

          <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
            Manage your profile information
          </Typography>

          {/* AVATAR */}
          <Avatar
          src={optimizeImage(previewPhoto?.secure_url || profilePhoto?.secure_url || "", 100, 100)}
            // src={profilePhoto?.secure_url || previewPhoto?.secure_url}
            sx={{
              width: 140,
              height: 140,
              position: "absolute",
              bottom: "-70px",
              left: "50%",
              transform: "translateX(-50%)",
              border: "5px solid white",
              boxShadow: "0 15px 35px rgba(0,0,0,0.25)",
            }}
          >
            {(!profilePhoto?.secure_url || !previewPhoto?.secure_url) && (
              // (name ? (
              //   name.charAt(0).toUpperCase()
              // ) :
              <PersonIcon sx={{ fontSize: 80 }} />
              // )
            )}
          </Avatar>
        </Box>

        {/* BODY */}
        <CardContent
          sx={{
            pt: 10,
            px: { xs: 2, md: 4 },
            pb: 4,
          }}
        >
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={onSubmit}
          >
            {({ values, setFieldValue }) => {

              const handleFileUpload = async (event) => {
                try {
                  const file = event.target.files?.[0];
                if (!file) return;

                setFileName(file.name);
                setFileUploadData({
                  isUploading:true,
                  uploadSuccess:false
                })
                const imgData = await uploadToCloudinary(file);

                setFieldValue("profilePhoto", {
                  secure_url: imgData.secure_url,
                  public_id: imgData.public_id,
                });
                setFileUploadData({
                  isUploading:false,
                  uploadSuccess:true
                })
                setPreviewPhoto(imgData);
                } catch (error) {
                  setFileUploadData({
                    isUploading:false,
                    uploadSuccess:false
                  })
                }
              };

              return (
                <Form>
                  {/* INFO CARDS */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 3,
                      flexWrap: "wrap",
                      mb: 4,
                    }}
                  >
                    <Box sx={cardStyle}>
                      <Avatar sx={iconStyle}>
                        <EmailOutlinedIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Email Address
                        </Typography>
                        <Typography fontWeight={600}>
                          {email || "Not Available"}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={cardStyle}>
                      <Avatar
                        sx={{
                          ...iconStyle,
                          bgcolor: "rgba(46,125,50,0.12)",
                          color: "success.main",
                        }}
                      >
                        <PhoneOutlinedIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Mobile Number
                        </Typography>
                        <Typography fontWeight={600}>
                          {mobile || "Not Available"}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* FORM */}
                  <Stack spacing={3}>
                    <Field
                      as={TextField}
                      fullWidth
                      size="small"
                      name="name"
                      label="User Name"
                    />

                    <Field
                      as={TextField}
                      fullWidth
                      multiline
                      rows={4}
                      name="address"
                      label="Address"
                    />

                    <ReusableFileUpload
                      label="Change Profile Photo"
                      fileName={fileName}
                      onChange={handleFileUpload}
                    />
                    <Button variant="outlined" onClick={handleRemoveCurrentProfilePhoto}>Remove current profile Photo</Button>
                    <Stack direction="row" spacing={2} justifyContent="center">
                      <Button variant="outlined" onClick={handleCancel}>
                        Cancel
                      </Button>

                      <Button type="submit" variant="contained" disabled={fileUploadData?.isUploading}>
                        {
                          fileUploadData?.isUploading?'Uploading...':'Save Changes'
                        }
                      </Button>
                    </Stack>
                  </Stack>
                </Form>
              );
            }}
          </Formik>
        </CardContent>
      </Card>
    </Box>
    <UniversalModal
    showModal={showModal}
    setShowModal={setShowModal}
    modalData={modalData}
    setModalData={setModalData}
    type={modalType}
    setModalType={setModalType}
    navigateLocation={modalNavigation}
    />
    
    </>
  );
};

export default EditProfile;

/* STYLES */
const cardStyle = {
  width: { xs: "100%", sm: 320 },
  minHeight: 90,
  p: 2.5,
  borderRadius: 3,
  bgcolor: "#f8fafc",
  border: "1px solid #e2e8f0",
  display: "flex",
  alignItems: "center",
  gap: 2,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: 3,
  },
};

const iconStyle = {
  width: 48,
  height: 48,
  bgcolor: "rgba(25,118,210,0.12)",
  color: "primary.main",
};




// import { ErrorMessage, Field, Form, Formik } from "formik";
// import React, { useState } from "react";
// import {
//   Avatar,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";
// import PersonIcon from "@mui/icons-material/Person";
// import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
// import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
// import { useSelector } from "react-redux";
// import * as Yup from "yup";

// import ReusableFileUpload from "../../reusables/ReusableFileUpload";
// import { uploadToCloudinary } from "../../utils/utils";

// const EditProfile = () => {
//   const [fileName, setFileName] = useState("");

//   const userProfile = useSelector(
//     (state) => state.apiSlicer.userProfile
//   );

//   const {
//     name = "",
//     email = "",
//     mobile = "",
//     address = "",
//     profilePhoto,
//   } = userProfile || {};

//   const initialValues = {
//     username: name,
//     address,
//     profilePhoto: profilePhoto || null,
//   };

//   const validationSchema = Yup.object({
//     username: Yup.string().required(
//       "User Name is required"
//     ),
//   });

//   const onSubmit = (values) => {
//     console.log("FINAL VALUES", values);
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//         py: 4,
//         px: 2,
//       }}
//     >
//       <Card
//         elevation={10}
//         sx={{
//           width: "100%",
//           maxWidth: 800,
//           borderRadius: 5,
//           overflow: "visible",
//         }}
//       >
//         {/* GRADIENT HEADER */}
//         <Box
//           sx={{
//             height: 260,
//             position: "relative",
//             background:
//               "linear-gradient(135deg,#0f172a,#1e3a8a,#0ea5e9)",
//           }}
//         >
//           {/* AVATAR */}
//           <Avatar
//             src={profilePhoto?.secure_url}
//             sx={{
//               width: 140,
//               height: 140,
//               position: "absolute",
//               left: "50%",
//               bottom: "-70px",
//               transform: "translateX(-50%)",
//               border: "5px solid white",
//               bgcolor: "primary.main",
//               boxShadow:
//                 "0 15px 35px rgba(0,0,0,0.25)",
//               zIndex: 10,
//             }}
//           >
//             {!profilePhoto?.secure_url &&
//               (name ? (
//                 name.charAt(0).toUpperCase()
//               ) : (
//                 <PersonIcon sx={{ fontSize: 80 }} />
//               ))}
//           </Avatar>
//         </Box>

//         <CardContent
//           sx={{
//             pt: 10,
//             px: { xs: 2, md: 4 },
//             pb: 4,
//           }}
//         >
//           <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             enableReinitialize
//             onSubmit={onSubmit}
//           >
//             {({ values, setFieldValue }) => {
//               const handleFileUpload =
//                 async (event) => {
//                   const file =
//                     event.target.files?.[0];
//                   if (!file) return;

//                   setFileName(file.name);

//                   const imgData =
//                     await uploadToCloudinary(
//                       file
//                     );

//                   setFieldValue("profilePhoto", {
//                     secure_url:
//                       imgData.secure_url,
//                     public_id:
//                       imgData.public_id,
//                   });
//                 };

//               return (
//                 <Form>
//                   {/* CENTERED TITLE */}
//                   <Box
//                     textAlign="center"
//                     mb={5}
//                   >
//                     <Typography
//                       variant="h4"
//                       fontWeight={800}
//                     >
//                       Update Profile
//                     </Typography>

//                     <Typography
//                       variant="body1"
//                       color="text.secondary"
//                       mt={1}
//                     >
//                       Manage your profile
//                       information and
//                       settings
//                     </Typography>
//                   </Box>

//                   {/* INFO CARDS */}
//                   <Box
//                     sx={{
//                       display: "flex",
//                       justifyContent:
//                         "center",
//                       gap: 3,
//                       flexWrap: "wrap",
//                       mb: 4,
//                     }}
//                   >
//                     {/* EMAIL */}
//                     <Box sx={cardStyle}>
//                       <Avatar sx={iconStyle}>
//                         <EmailOutlinedIcon />
//                       </Avatar>

//                       <Box>
//                         <Typography
//                           variant="caption"
//                           color="text.secondary"
//                         >
//                           Email Address
//                         </Typography>
//                         <Typography
//                           fontWeight={600}
//                         >
//                           {email ||
//                             "Not Available"}
//                         </Typography>
//                       </Box>
//                     </Box>

//                     {/* MOBILE */}
//                     <Box sx={cardStyle}>
//                       <Avatar
//                         sx={{
//                           ...iconStyle,
//                           bgcolor:
//                             "rgba(46,125,50,0.12)",
//                           color: "success.main",
//                         }}
//                       >
//                         <PhoneOutlinedIcon />
//                       </Avatar>

//                       <Box>
//                         <Typography
//                           variant="caption"
//                           color="text.secondary"
//                         >
//                           Mobile Number
//                         </Typography>
//                         <Typography
//                           fontWeight={600}
//                         >
//                           {mobile ||
//                             "Not Available"}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   </Box>

//                   <Stack spacing={3}>
//                     {/* USERNAME */}
//                     <Field
//                       as={TextField}
//                       fullWidth
//                       size="small"
//                       name="username"
//                       label="User Name"
//                     />

//                     {/* ADDRESS */}
//                     <Field
//                       as={TextField}
//                       fullWidth
//                       multiline
//                       rows={4}
//                       name="address"
//                       label="Address"
//                     />

//                     {/* FILE UPLOAD */}
//                     <ReusableFileUpload
//                       label="Change Profile Photo"
//                       fileName={fileName}
//                       onChange={handleFileUpload}
//                     />

//                     {/* BUTTONS */}
//                     <Stack
//                       direction="row"
//                       spacing={2}
//                       justifyContent="center"
//                     >
//                       <Button variant="outlined">
//                         Cancel
//                       </Button>

//                       <Button
//                         type="submit"
//                         variant="contained"
//                       >
//                         Save Changes
//                       </Button>
//                     </Stack>
//                   </Stack>
//                 </Form>
//               );
//             }}
//           </Formik>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default EditProfile;

// /* STYLES */
// const cardStyle = {
//   width: { xs: "100%", sm: 320 },
//   minHeight: 90,
//   p: 2.5,
//   borderRadius: 3,
//   bgcolor: "#f8fafc",
//   border: "1px solid #e2e8f0",
//   display: "flex",
//   alignItems: "center",
//   gap: 2,
//   transition: "all 0.3s ease",
//   "&:hover": {
//     transform: "translateY(-3px)",
//     boxShadow: 3,
//   },
// };

// const iconStyle = {
//   width: 48,
//   height: 48,
//   bgcolor: "rgba(25,118,210,0.12)",
//   color: "primary.main",
// };

// import { ErrorMessage, Field, Form, Formik } from "formik";
// import React, { useState } from "react";
// import {
//   Avatar,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";
// import PersonIcon from "@mui/icons-material/Person";
// import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
// import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
// import { useSelector } from "react-redux";
// import * as Yup from "yup";

// import ReusableFileUpload from "../../reusables/ReusableFileUpload";
// import { uploadToCloudinary } from "../../utils/utils";

// const EditProfile = () => {
//   const [fileName, setFileName] = useState("");

//   const userProfile = useSelector(
//     (state) => state.apiSlicer.userProfile
//   );

//   const {
//     name = "",
//     email = "",
//     mobile = "",
//     address = "",
//     profilePhoto,
//   } = userProfile || {};

//   const initialValues = {
//     username: name,
//     address,
//     profilePhoto: profilePhoto || null,
//   };

//   const validationSchema = Yup.object({
//     username: Yup.string().required("User Name is required"),
//   });

//   const onSubmit = (values) => {
//     console.log("FINAL VALUES", values);
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//         py: 4,
//         px: 2,
//       }}
//     >
//       <Card
//         elevation={10}
//         sx={{
//           width: "100%",
//           maxWidth: 800,
//           borderRadius: 5,
//           overflow: "visible",
//         }}
//       >
//         {/* GRADIENT HEADER */}
//         <Box
//           sx={{
//             height: 240,
//             position: "relative",
//             background:
//               "linear-gradient(135deg,#0f172a,#1e3a8a,#0ea5e9)",
//           }}
//         >
//           {/* AVATAR FLOATING CENTER */}
//           <Avatar
//             src={profilePhoto?.secure_url}
//             sx={{
//               width: 140,
//               height: 140,
//               position: "absolute",
//               left: "50%",
//               bottom: "-70px",
//               transform: "translateX(-50%)",
//               border: "5px solid white",
//               bgcolor: "primary.main",
//               boxShadow: "0 15px 35px rgba(0,0,0,0.25)",
//               zIndex: 10,
//             }}
//           >
//             {!profilePhoto?.secure_url &&
//               (name ? (
//                 name.charAt(0).toUpperCase()
//               ) : (
//                 <PersonIcon sx={{ fontSize: 80 }} />
//               ))}
//           </Avatar>
//         </Box>

//         <CardContent
//           sx={{
//             pt: 10,
//             px: { xs: 2, md: 4 },
//             pb: 4,
//           }}
//         >
//           <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             enableReinitialize
//             onSubmit={onSubmit}
//           >
//             {({ values, setFieldValue }) => {
//               const handleFileUpload = async (event) => {
//                 const file = event.target.files?.[0];
//                 if (!file) return;

//                 setFileName(file.name);

//                 const imgData =
//                   await uploadToCloudinary(file);

//                 setFieldValue("profilePhoto", {
//                   secure_url: imgData.secure_url,
//                   public_id: imgData.public_id,
//                 });
//               };

//               return (
//                 <Form>
//                   {/* TITLE */}
//                   <Box textAlign="center" mb={4}>
//                     <Typography variant="h4" fontWeight={700}>
//                       Update Profile
//                     </Typography>

//                     <Typography
//                       variant="body1"
//                       color="text.secondary"
//                       mt={1}
//                     >
//                       Manage your profile information
//                     </Typography>
//                   </Box>

//                   {/* INFO CARDS */}
//                   <Box
//                     sx={{
//                       display: "flex",
//                       justifyContent: "center",
//                       gap: 3,
//                       flexWrap: "wrap",
//                       mb: 4,
//                     }}
//                   >
//                     {/* EMAIL */}
//                     <Box sx={cardStyle}>
//                       <Avatar sx={iconStyle}>
//                         <EmailOutlinedIcon />
//                       </Avatar>

//                       <Box>
//                         <Typography
//                           variant="caption"
//                           color="text.secondary"
//                         >
//                           Email Address
//                         </Typography>
//                         <Typography fontWeight={600}>
//                           {email || "Not Available"}
//                         </Typography>
//                       </Box>
//                     </Box>

//                     {/* MOBILE */}
//                     <Box sx={cardStyle}>
//                       <Avatar
//                         sx={{
//                           ...iconStyle,
//                           bgcolor: "rgba(46,125,50,0.12)",
//                           color: "success.main",
//                         }}
//                       >
//                         <PhoneOutlinedIcon />
//                       </Avatar>

//                       <Box>
//                         <Typography
//                           variant="caption"
//                           color="text.secondary"
//                         >
//                           Mobile Number
//                         </Typography>
//                         <Typography fontWeight={600}>
//                           {mobile || "Not Available"}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   </Box>

//                   <Stack spacing={3}>
//                     <Field
//                       as={TextField}
//                       fullWidth
//                       size="small"
//                       name="username"
//                       label="User Name"
//                     />

//                     <Field
//                       as={TextField}
//                       fullWidth
//                       multiline
//                       rows={4}
//                       name="address"
//                       label="Address"
//                     />

//                     <ReusableFileUpload
//                       label="Change Profile Photo"
//                       fileName={fileName}
//                       onChange={handleFileUpload}
//                     />

//                     <Stack
//                       direction="row"
//                       spacing={2}
//                       justifyContent="center"
//                     >
//                       <Button variant="outlined">
//                         Cancel
//                       </Button>

//                       <Button
//                         type="submit"
//                         variant="contained"
//                       >
//                         Save Changes
//                       </Button>
//                     </Stack>
//                   </Stack>
//                 </Form>
//               );
//             }}
//           </Formik>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default EditProfile;

// /* STYLES */
// const cardStyle = {
//   width: { xs: "100%", sm: 320 },
//   minHeight: 90,
//   p: 2.5,
//   borderRadius: 3,
//   bgcolor: "#f8fafc",
//   border: "1px solid #e2e8f0",
//   display: "flex",
//   alignItems: "center",
//   gap: 2,
//   transition: "all 0.3s ease",
//   "&:hover": {
//     transform: "translateY(-3px)",
//     boxShadow: 3,
//   },
// };

// const iconStyle = {
//   width: 48,
//   height: 48,
//   bgcolor: "rgba(25,118,210,0.12)",
//   color: "primary.main",
// };

// import { ErrorMessage, Field, Form, Formik } from "formik";
// import React, { useState } from "react";
// import {
//   Avatar,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Grid,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";
// import PersonIcon from "@mui/icons-material/Person";
// import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
// import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
// import { useSelector } from "react-redux";
// import * as Yup from "yup";

// import ReusableFileUpload from "../../reusables/ReusableFileUpload";
// import { uploadToCloudinary } from "../../utils/utils";

// const EditProfile = () => {
//   const [fileName, setFileName] = useState("");

//   const userProfile = useSelector((state) => state.apiSlicer.userProfile);

//   const {
//     name = "",
//     email = "",
//     mobile = "",
//     address = "",
//     profilePhoto,
//   } = userProfile || {};

//   const initialValues = {
//     username: name,
//     address,
//     profilePhoto: profilePhoto || null,
//   };

//   const validationSchema = Yup.object({
//     username: Yup.string().required("User Name is required"),
//   });

//   const onSubmit = (values) => {
//     console.log("FINAL FORMIK VALUES", values);

//     /*
//     {
//       username: "...",
//       address: "...",
//       profilePhoto: {
//         secure_url: "...",
//         public_id: "..."
//       }
//     }
//     */
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//         py: 4,
//         px: 2,
//       }}
//     >
//       <Card
//         elevation={10}
//         sx={{
//           width: "100%",
//           maxWidth: 800,
//           borderRadius: 5,
//           overflow: "hidden",
//         }}
//       >
//         <Box
//           sx={{
//             height: 220,
//             position: "relative",
//             background: "linear-gradient(135deg,#0f172a,#1e3a8a,#0ea5e9)",
//           }}
//         />

//         <CardContent
//           sx={{
//             pt: 4,
//             px: { xs: 2, md: 4 },
//             pb: 4,
//           }}
//         >
//           <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             enableReinitialize
//             onSubmit={onSubmit}
//           >
//             {({ values, setFieldValue }) => {
//               const handleFileUpload = async (event) => {
//                 try {
//                   const file = event.target.files?.[0];

//                   if (!file) return;

//                   setFileName(file.name);

//                   const imgData = await uploadToCloudinary(file);

//                   console.log("Cloudinary Response", imgData);

//                   setFieldValue("profilePhoto", {
//                     secure_url: imgData.secure_url,
//                     public_id: imgData.public_id,
//                   });
//                 } catch (error) {
//                   console.log(error);
//                 }
//               };

//               return (
//                 <Form>
//                   <Avatar
//                     src={values.profilePhoto?.secure_url}
//                     sx={{
//                       width: 140,
//                       height: 140,
//                       mx: "auto",
//                       mb: 3,
//                       border: "5px solid white",
//                       bgcolor: "primary.main",
//                       boxShadow: "0 15px 35px rgba(0,0,0,0.25)",
//                     }}
//                   >
//                     {!values.profilePhoto?.secure_url &&
//                       (name ? (
//                         name.charAt(0).toUpperCase()
//                       ) : (
//                         <PersonIcon
//                           sx={{
//                             fontSize: 80,
//                           }}
//                         />
//                       ))}
//                   </Avatar>

//                   <Box
//                     sx={{
//                       textAlign: "center",
//                       mb: 4,
//                     }}
//                   >
//                     <Typography variant="h4" fontWeight={700}>
//                       Update Profile
//                     </Typography>

//                     <Typography
//                       variant="body1"
//                       color="text.secondary"
//                       sx={{ mt: 1 }}
//                     >
//                       Manage your profile information and profile picture
//                     </Typography>
//                   </Box>

//                   <Box
//                     sx={{
//                       display: "flex",
//                       justifyContent: "center",
//                       alignItems: "center",
//                       gap: 3,
//                       flexWrap: "wrap",
//                       mb: 4,
//                     }}
//                   >
//                     {/* Email Card */}
//                     <Box
//                       sx={{
//                         width: { xs: "100%", sm: 320 },
//                         minHeight: 90,
//                         p: 2.5,
//                         borderRadius: 3,
//                         bgcolor: "#f8fafc",
//                         border: "1px solid #e2e8f0",
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 2,
//                         transition: "all 0.3s ease",
//                         "&:hover": {
//                           transform: "translateY(-3px)",
//                           boxShadow: 3,
//                         },
//                       }}
//                     >
//                       <Avatar
//                         sx={{
//                           width: 48,
//                           height: 48,
//                           bgcolor: "rgba(25,118,210,0.12)",
//                           color: "primary.main",
//                         }}
//                       >
//                         <EmailOutlinedIcon />
//                       </Avatar>

//                       <Box sx={{ flex: 1 }}>
//                         <Typography variant="caption" color="text.secondary">
//                           Email Address
//                         </Typography>

//                         <Typography variant="body1" fontWeight={600} noWrap>
//                           {email || "Not Available"}
//                         </Typography>
//                       </Box>
//                     </Box>

//                     {/* Mobile Card */}
//                     <Box
//                       sx={{
//                         width: { xs: "100%", sm: 320 },
//                         minHeight: 90,
//                         p: 2.5,
//                         borderRadius: 3,
//                         bgcolor: "#f8fafc",
//                         border: "1px solid #e2e8f0",
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 2,
//                         transition: "all 0.3s ease",
//                         "&:hover": {
//                           transform: "translateY(-3px)",
//                           boxShadow: 3,
//                         },
//                       }}
//                     >
//                       <Avatar
//                         sx={{
//                           width: 48,
//                           height: 48,
//                           bgcolor: "rgba(46,125,50,0.12)",
//                           color: "success.main",
//                         }}
//                       >
//                         <PhoneOutlinedIcon />
//                       </Avatar>

//                       <Box sx={{ flex: 1 }}>
//                         <Typography variant="caption" color="text.secondary">
//                           Mobile Number
//                         </Typography>

//                         <Typography variant="body1" fontWeight={600} noWrap>
//                           {mobile || "Not Available"}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   </Box>
//                   <Stack spacing={3}>
//                     <Box>
//                       <Field
//                         as={TextField}
//                         fullWidth
//                         size="small"
//                         name="username"
//                         label="User Name"
//                       />

//                       <ErrorMessage
//                         name="username"
//                         component="div"
//                         className="errorStyles"
//                       />
//                     </Box>

//                     <Box>
//                       <Field
//                         as={TextField}
//                         fullWidth
//                         multiline
//                         rows={4}
//                         name="address"
//                         label="Address"
//                       />

//                       <ErrorMessage
//                         name="address"
//                         component="div"
//                         className="errorStyles"
//                       />
//                     </Box>

//                     <ReusableFileUpload
//                       label="Change Profile Photo"
//                       fileName={fileName}
//                       onChange={handleFileUpload}
//                     />

//                     {/* Debug */}
//                     {/* <pre>
//                       {JSON.stringify(
//                         values,
//                         null,
//                         2
//                       )}
//                     </pre> */}

//                     <Stack direction="row" spacing={2} justifyContent="center">
//                       <Button variant="outlined">Cancel</Button>

//                       <Button type="submit" variant="contained">
//                         Save Changes
//                       </Button>
//                     </Stack>
//                   </Stack>
//                 </Form>
//               );
//             }}
//           </Formik>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default EditProfile;

// import { ErrorMessage, Field, Form, Formik } from "formik";
// import React, { useState } from "react";
// import {
//   Avatar,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Grid,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";
// import PersonIcon from "@mui/icons-material/Person";
// import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
// import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
// import { useSelector } from "react-redux";
// import * as Yup from "yup";

// import ReusableFileUpload from "../../reusables/ReusableFileUpload";
// import { uploadToCloudinary } from "../../utils/utils";

// const EditProfile = () => {
//   const [file, setFile] = useState(null);
//   const [previewPhoto, setPreviewPhoto] =
//     useState(null);

//   const userProfile = useSelector(
//     (state) => state.apiSlicer.userProfile
//   );

//   const {
//     name = "",
//     email = "",
//     mobile = "",
//     address = "",
//     profilePhoto,
//   } = userProfile || {};

//   const initialValues = {
//     username: name,
//     address,
//     profilePhoto,
//   };

//   const validationSchema = Yup.object({
//     username: Yup.string().required(
//       "User Name is required"
//     ),
//   });

//   const handleFileUpload = async (
//     event,
//     setFieldValue
//   ) => {
//     try {
//       const selectedFile =
//         event.target.files?.[0];

//       if (!selectedFile) return;

//       setFile(selectedFile);

//       const imgData =
//         await uploadToCloudinary(
//           selectedFile
//         );

//       setPreviewPhoto(imgData);

//       setFieldValue(
//         "profilePhoto",
//         imgData
//       );
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const onSubmit = (values) => {
//     console.log(values);

//     /*
//     {
//       username,
//       address,
//       profilePhoto:{
//         secure_url,
//         public_id
//       }
//     }
//     */
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//         py: 4,
//         px: 2,
//       }}
//     >
//       <Card
//         elevation={10}
//         sx={{
//           width: "100%",
//           maxWidth: 800,
//           borderRadius: 5,
//           overflow: "hidden",
//         }}
//       >
//         <Box
//           sx={{
//             height: 220,
//             position: "relative",
//             background:
//               "linear-gradient(135deg,#0f172a,#1e3a8a,#0ea5e9)",
//           }}
//         >
//           <Avatar
//             src={
//               previewPhoto?.secure_url ||
//               profilePhoto?.secure_url ||
//               undefined
//             }
//             sx={{
//               width: 140,
//               height: 140,
//               position: "absolute",
//               left: "50%",
//               bottom: -70,
//               transform: "translateX(-50%)",
//               border: "5px solid white",
//               bgcolor: "primary.main",
//               boxShadow:
//                 "0 15px 35px rgba(0,0,0,0.25)",
//               fontSize: 50,
//               fontWeight: 700,
//             }}
//           >
//             {!(
//               previewPhoto?.secure_url ||
//               profilePhoto?.secure_url
//             ) &&
//               (name ? (
//                 name
//                   .charAt(0)
//                   .toUpperCase()
//               ) : (
//                 <PersonIcon
//                   sx={{ fontSize: 80 }}
//                 />
//               ))}
//           </Avatar>
//         </Box>

//         <CardContent
//           sx={{
//             pt: 12,
//             px: { xs: 2, md: 4 },
//             pb: 4,
//           }}
//         >
//           <Box
//             sx={{
//               textAlign: "center",
//               mb: 4,
//             }}
//           >
//             <Typography
//               variant="h4"
//               fontWeight={700}
//             >
//               Update Profile
//             </Typography>

//             <Typography
//               variant="body1"
//               color="text.secondary"
//               sx={{ mt: 1 }}
//             >
//               Manage your profile information and
//               profile picture
//             </Typography>
//           </Box>

//           <Grid
//             container
//             spacing={2}
//             sx={{ mb: 4 }}
//           >
//             <Grid size={{ xs: 12, md: 6 }}>
//               <Box
//                 sx={{
//                   p: 2.5,
//                   borderRadius: 3,
//                   bgcolor: "#f8fafc",
//                   border: "1px solid #e2e8f0",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 2,
//                   height: "100%",
//                 }}
//               >
//                 <Avatar
//                   sx={{
//                     bgcolor:
//                       "rgba(25,118,210,0.1)",
//                     color: "primary.main",
//                   }}
//                 >
//                   <EmailOutlinedIcon />
//                 </Avatar>

//                 <Box>
//                   <Typography
//                     variant="caption"
//                     color="text.secondary"
//                   >
//                     Email Address
//                   </Typography>

//                   <Typography
//                     variant="body1"
//                     fontWeight={600}
//                   >
//                     {email ||
//                       "Not Available"}
//                   </Typography>
//                 </Box>
//               </Box>
//             </Grid>

//             <Grid size={{ xs: 12, md: 6 }}>
//               <Box
//                 sx={{
//                   p: 2.5,
//                   borderRadius: 3,
//                   bgcolor: "#f8fafc",
//                   border: "1px solid #e2e8f0",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 2,
//                   height: "100%",
//                 }}
//               >
//                 <Avatar
//                   sx={{
//                     bgcolor:
//                       "rgba(46,125,50,0.1)",
//                     color: "success.main",
//                   }}
//                 >
//                   <PhoneOutlinedIcon />
//                 </Avatar>

//                 <Box>
//                   <Typography
//                     variant="caption"
//                     color="text.secondary"
//                   >
//                     Mobile Number
//                   </Typography>

//                   <Typography
//                     variant="body1"
//                     fontWeight={600}
//                   >
//                     {mobile ||
//                       "Not Available"}
//                   </Typography>
//                 </Box>
//               </Box>
//             </Grid>
//           </Grid>

//           <Formik
//             initialValues={initialValues}
//             validationSchema={
//               validationSchema
//             }
//             enableReinitialize
//             onSubmit={onSubmit}
//           >
//             {({ setFieldValue }) => (
//               <Form>
//                 <Stack spacing={3}>
//                   <Box>
//                     <Field
//                       as={TextField}
//                       fullWidth
//                       size="small"
//                       name="username"
//                       label="User Name"
//                     />

//                     <ErrorMessage
//                       name="username"
//                       component="div"
//                       className="errorStyles"
//                     />
//                   </Box>

//                   <Box>
//                     <Field
//                       as={TextField}
//                       fullWidth
//                       multiline
//                       rows={4}
//                       name="address"
//                       label="Address"
//                     />

//                     <ErrorMessage
//                       name="address"
//                       component="div"
//                       className="errorStyles"
//                     />
//                   </Box>

//                   <ReusableFileUpload
//                     label="Change Profile Photo"
//                     fileName={file?.name}
//                     name="profilePhoto"
//                     onChange={(e) =>
//                       handleFileUpload(
//                         e,
//                         setFieldValue
//                       )
//                     }
//                   />

//                   <Stack
//                     direction="row"
//                     spacing={2}
//                     justifyContent="center"
//                     sx={{ mt: 2 }}
//                   >
//                     <Button
//                       variant="outlined"
//                       size="large"
//                       sx={{
//                         minWidth: 140,
//                       }}
//                     >
//                       Cancel
//                     </Button>

//                     <Button
//                       type="submit"
//                       variant="contained"
//                       size="large"
//                       sx={{
//                         minWidth: 180,
//                       }}
//                     >
//                       Save Changes
//                     </Button>
//                   </Stack>
//                 </Stack>
//               </Form>
//             )}
//           </Formik>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default EditProfile;

// import { ErrorMessage, Field, Form, Formik } from "formik";
// import React, { useState } from "react";
// import {
//   Avatar,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Grid,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";
// import PersonIcon from "@mui/icons-material/Person";
// import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
// import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
// import { useSelector } from "react-redux";
// import * as Yup from "yup";

// import ReusableFileUpload from "../../reusables/ReusableFileUpload";
// import { uploadToCloudinary } from "../../utils/utils";

// const EditProfile = () => {
//   const [file, setFile] = useState(null);
//   const [previewPhoto, setPreviewPhoto] =
//     useState(null);

//   const userProfile = useSelector(
//     (state) => state.apiSlicer.userProfile
//   );

//   const {
//     name = "",
//     email = "",
//     mobile = "",
//     address = "",
//     profilePhoto,
//   } = userProfile || {};

//   const initialValues = {
//     username: name,
//     address,
//     profilePhoto: profilePhoto || null,
//   };

//   const validationSchema = Yup.object({
//     username: Yup.string().required(
//       "User Name is required"
//     ),
//   });

//   const handleFileUpload = async (
//     event,
//     setFieldValue
//   ) => {
//     try {
//       const selectedFile =
//         event.target.files?.[0];

//       if (!selectedFile) return;

//       setFile(selectedFile);

//       const imgData =
//         await uploadToCloudinary(
//           selectedFile
//         );

//       setPreviewPhoto(imgData);

//       setFieldValue(
//         "profilePhoto",
//         imgData
//       );
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const onSubmit = (values) => {
//     console.log(values);

//     /*
//     values = {
//       username,
//       address,
//       profilePhoto:{
//         secure_url,
//         public_id
//       }
//     }
//     */
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//         py: 4,
//         px: 2,
//       }}
//     >
//       <Card
//         elevation={10}
//         sx={{
//           width: "100%",
//           maxWidth: 800,
//           borderRadius: 5,
//           overflow: "hidden",
//         }}
//       >
//         {/* Header */}
//         <Box
//           sx={{
//             height: 220,
//             position: "relative",
//             background:
//               "linear-gradient(135deg,#0f172a,#1e3a8a,#0ea5e9)",
//           }}
//         >
//           <Avatar
//             src={
//               previewPhoto?.secure_url ||
//               profilePhoto?.secure_url
//             }
//             sx={{
//               width: 140,
//               height: 140,
//               position: "absolute",
//               left: "50%",
//               bottom: -70,
//               transform:
//                 "translateX(-50%)",
//               border: "5px solid white",
//               bgcolor: "primary.main",
//               boxShadow:
//                 "0 15px 35px rgba(0,0,0,0.25)",
//             }}
//           >
//             {!previewPhoto?.secure_url &&
//               !profilePhoto?.secure_url &&
//               (name ? (
//                 name
//                   .charAt(0)
//                   .toUpperCase()
//               ) : (
//                 <PersonIcon
//                   sx={{
//                     fontSize: 80,
//                   }}
//                 />
//               ))}
//           </Avatar>
//         </Box>

//         <CardContent
//           sx={{
//             pt: 12,
//             px: {
//               xs: 2,
//               md: 4,
//             },
//             pb: 4,
//           }}
//         >
//           <Box
//             sx={{
//               textAlign: "center",
//               mb: 4,
//             }}
//           >
//             <Typography
//               variant="h4"
//               fontWeight={700}
//             >
//               Update Profile
//             </Typography>

//             <Typography
//               variant="body1"
//               color="text.secondary"
//               sx={{ mt: 1 }}
//             >
//               Manage your profile
//               information and profile
//               picture
//             </Typography>
//           </Box>

//           <Grid
//             container
//             spacing={2}
//             sx={{ mb: 4 }}
//           >
//             <Grid
//               item
//               xs={12}
//               md={6}
//             >
//               <Box
//                 sx={{
//                   p: 2,
//                   borderRadius: 3,
//                   bgcolor: "#f8fafc",
//                   border:
//                     "1px solid #e2e8f0",
//                   display: "flex",
//                   gap: 2,
//                   alignItems: "center",
//                 }}
//               >
//                 <Avatar
//                   sx={{
//                     bgcolor:
//                       "rgba(25,118,210,0.1)",
//                     color:
//                       "primary.main",
//                   }}
//                 >
//                   <EmailOutlinedIcon />
//                 </Avatar>

//                 <Box>
//                   <Typography
//                     variant="caption"
//                     color="text.secondary"
//                   >
//                     Email Address
//                   </Typography>

//                   <Typography fontWeight={600}>
//                     {email}
//                   </Typography>
//                 </Box>
//               </Box>
//             </Grid>

//             <Grid
//               item
//               xs={12}
//               md={6}
//             >
//               <Box
//                 sx={{
//                   p: 2,
//                   borderRadius: 3,
//                   bgcolor: "#f8fafc",
//                   border:
//                     "1px solid #e2e8f0",
//                   display: "flex",
//                   gap: 2,
//                   alignItems: "center",
//                 }}
//               >
//                 <Avatar
//                   sx={{
//                     bgcolor:
//                       "rgba(46,125,50,0.1)",
//                     color:
//                       "success.main",
//                   }}
//                 >
//                   <PhoneOutlinedIcon />
//                 </Avatar>

//                 <Box>
//                   <Typography
//                     variant="caption"
//                     color="text.secondary"
//                   >
//                     Mobile Number
//                   </Typography>

//                   <Typography fontWeight={600}>
//                     {mobile}
//                   </Typography>
//                 </Box>
//               </Box>
//             </Grid>
//           </Grid>

//           <Formik
//             initialValues={
//               initialValues
//             }
//             validationSchema={
//               validationSchema
//             }
//             enableReinitialize
//             onSubmit={onSubmit}
//           >
//             {({
//               setFieldValue,
//             }) => (
//               <Form>
//                 <Stack spacing={3}>
//                   <Box>
//                     <Field
//                       as={TextField}
//                       fullWidth
//                       size="small"
//                       name="username"
//                       label="User Name"
//                     />

//                     <ErrorMessage
//                       name="username"
//                       component="div"
//                       className="errorStyles"
//                     />
//                   </Box>

//                   <Box>
//                     <Field
//                       as={TextField}
//                       fullWidth
//                       multiline
//                       rows={4}
//                       name="address"
//                       label="Address"
//                     />

//                     <ErrorMessage
//                       name="address"
//                       component="div"
//                       className="errorStyles"
//                     />
//                   </Box>

//                   <ReusableFileUpload
//                     label="Change Profile Photo"
//                     fileName={
//                       file?.name
//                     }
//                     name="profilePhoto"
//                     onChange={(e) =>
//                       handleFileUpload(
//                         e,
//                         setFieldValue
//                       )
//                     }
//                   />

//                   <Stack
//                     direction="row"
//                     spacing={2}
//                     justifyContent="center"
//                   >
//                     <Button variant="outlined">
//                       Cancel
//                     </Button>

//                     <Button
//                       type="submit"
//                       variant="contained"
//                     >
//                       Save Changes
//                     </Button>
//                   </Stack>
//                 </Stack>
//               </Form>
//             )}
//           </Formik>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default EditProfile;

// import { ErrorMessage, Field, Form, Formik } from "formik";
// import React, { useEffect, useMemo, useState } from "react";
// import {
//   Avatar,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Grid,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";
// import PersonIcon from "@mui/icons-material/Person";
// import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
// import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
// import { useSelector } from "react-redux";
// import * as Yup from "yup";
// import ReusableFileUpload from "../../reusables/ReusableFileUpload";
// import { uploadToCloudinary } from "../../utils/utils";

// const EditProfile = () => {
//   const [file, setFile] = useState(null);
//   const [previewPhoto,setPreviewPhoto] = useState(null);
//   const userProfile = useSelector((state) => state.apiSlicer.userProfile);

//   const {
//     name = "",
//     email = "",
//     mobile = "",
//     address = "",
//     profilePhoto,
//   } = userProfile || {};

//   // const previewImage = useMemo(() => {
//   //   if (!file) {
//   //     return profilePhoto?.secure_url || "";
//   //   }

//   //   return URL.createObjectURL(file);
//   // }, [file, profilePhoto]);

//   // useEffect(() => {
//   //   return () => {
//   //     if (file && previewImage) {
//   //       URL.revokeObjectURL(previewImage);
//   //     }
//   //   };
//   // }, [file, previewImage]);

//   const initialValues = {
//     username: name,
//     address,
//     profilePhoto
//   };

//   const validationSchema = Yup.object({
//     username: Yup.string().required("User Name is required"),
//   });
//   const handleFileUpload = async (e) => {
//     // setFile(e.target.files?.[0] || null);
//     const file = e.target.files?.[0];
//     const imgData = await uploadToCloudinary(file);
//     setPreviewPhoto(imgData);
//   };
//   const onSubmit = (values) => {
//     console.log(values);

//     // const payload = {
//     //   ...values,
//     //   profilePhoto: file,
//     // };

//     // console.log(payload);
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//         py: 4,
//         px: 2,
//       }}
//     >
//       <Card
//         elevation={10}
//         sx={{
//           width: "100%",
//           maxWidth: 800,
//           borderRadius: 5,
//           overflow: "hidden",
//         }}
//       >
//         {/* Header */}
//         <Box
//           sx={{
//             height: 220,
//             position: "relative",
//             background: "linear-gradient(135deg,#0f172a,#1e3a8a,#0ea5e9)",
//           }}
//         >
//           <Avatar
//             src={previewPhoto?.secure_url || undefined}
//             // src={previewImage || undefined}
//             sx={{
//               width: 140,
//               height: 140,
//               position: "absolute",
//               left: "50%",
//               bottom: -70,
//               transform: "translateX(-50%)",
//               border: "5px solid white",
//               bgcolor: "primary.main",
//               boxShadow: "0 15px 35px rgba(0,0,0,0.25)",
//               fontSize: 50,
//               fontWeight: 700,
//             }}
//           >
//             {!previewPhoto?.secure_url &&
//               (name ? (
//                 name.charAt(0).toUpperCase()
//               ) : (
//                 <PersonIcon sx={{ fontSize: 80 }} />
//               ))}
//             {/* {!previewImage &&
//               (name ? (
//                 name.charAt(0).toUpperCase()
//               ) : (
//                 <PersonIcon sx={{ fontSize: 80 }} />
//               ))} */}
//           </Avatar>
//         </Box>

//         <CardContent
//           sx={{
//             pt: 12,
//             px: { xs: 2, md: 4 },
//             pb: 4,
//           }}
//         >
//           {/* Title */}
//           <Box
//             sx={{
//               textAlign: "center",
//               mb: 4,
//             }}
//           >
//             <Typography variant="h4" fontWeight={700}>
//               Update Profile
//             </Typography>

//             <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
//               Manage your profile information and profile picture
//             </Typography>
//           </Box>

//           {/* Email & Mobile Cards */}
//           <Grid container spacing={2} sx={{ mb: 4 }}>
//             <Grid size={{ xs: 12, md: 6 }}>
//               <Box
//                 sx={{
//                   p: 2.5,
//                   borderRadius: 3,
//                   bgcolor: "#f8fafc",
//                   border: "1px solid #e2e8f0",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 2,
//                 }}
//               >
//                 <Avatar
//                   sx={{
//                     bgcolor: "rgba(25,118,210,0.1)",
//                     color: "primary.main",
//                   }}
//                 >
//                   <EmailOutlinedIcon />
//                 </Avatar>

//                 <Box>
//                   <Typography variant="caption" color="text.secondary">
//                     Email Address
//                   </Typography>

//                   <Typography variant="body1" fontWeight={600}>
//                     {email || "Not Available"}
//                   </Typography>
//                 </Box>
//               </Box>
//             </Grid>

//             <Grid size={{ xs: 12, md: 6 }}>
//               <Box
//                 sx={{
//                   p: 2.5,
//                   borderRadius: 3,
//                   bgcolor: "#f8fafc",
//                   border: "1px solid #e2e8f0",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 2,
//                 }}
//               >
//                 <Avatar
//                   sx={{
//                     bgcolor: "rgba(46,125,50,0.1)",
//                     color: "success.main",
//                   }}
//                 >
//                   <PhoneOutlinedIcon />
//                 </Avatar>

//                 <Box>
//                   <Typography variant="caption" color="text.secondary">
//                     Mobile Number
//                   </Typography>

//                   <Typography variant="body1" fontWeight={600}>
//                     {mobile || "Not Available"}
//                   </Typography>
//                 </Box>
//               </Box>
//             </Grid>
//           </Grid>

//           {/* Form */}
//           <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             enableReinitialize
//             onSubmit={onSubmit}
//           >
//             <Form>
//               <Stack spacing={3}>
//                 <Box>
//                   <Field
//                     as={TextField}
//                     fullWidth
//                     size="small"
//                     name="username"
//                     label="User Name"
//                   />

//                   <ErrorMessage
//                     name="username"
//                     component="div"
//                     className="errorStyles"
//                   />
//                 </Box>

//                 <Box>
//                   <Field
//                     as={TextField}
//                     fullWidth
//                     multiline
//                     rows={4}
//                     name="address"
//                     label="Address"
//                   />

//                   <ErrorMessage
//                     name="address"
//                     component="div"
//                     className="errorStyles"
//                   />
//                 </Box>

//                 <ReusableFileUpload
//                   label="Change Profile Photo"
//                   fileName={file?.name}
//                   onChange={(e) => handleFileUpload(e)}
//                   name="profilePhoto"
//                 />

//                 <Stack
//                   direction="row"
//                   spacing={2}
//                   justifyContent="center"
//                   sx={{ mt: 2 }}
//                 >
//                   <Button
//                     variant="outlined"
//                     size="large"
//                     sx={{
//                       minWidth: 140,
//                     }}
//                   >
//                     Cancel
//                   </Button>

//                   <Button
//                     type="submit"
//                     variant="contained"
//                     size="large"
//                     sx={{
//                       minWidth: 180,
//                     }}
//                   >
//                     Save Changes
//                   </Button>
//                 </Stack>
//               </Stack>
//             </Form>
//           </Formik>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default EditProfile;

// import { ErrorMessage, Field, Form, Formik } from "formik";
// import React, { useEffect, useMemo, useState } from "react";
// import {
//   Avatar,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";
// import PersonIcon from "@mui/icons-material/Person";
// import { useSelector } from "react-redux";
// import * as Yup from "yup";
// import ReusableFileUpload from "../../reusables/ReusableFileUpload";

// const EditProfile = () => {
//   const [file, setFile] = useState(null);

//   const userProfile = useSelector(
//     (state) => state.apiSlicer.userProfile
//   );

//   const {
//     name = "",
//     address = "",
//     profilePhoto,
//     email,
//     mobile
//   } = userProfile || {};

//   const previewImage = useMemo(() => {
//     if (!file) {
//       return profilePhoto?.secure_url || "";
//     }

//     return URL.createObjectURL(file);
//   }, [file, profilePhoto]);

//   useEffect(() => {
//     return () => {
//       if (file && previewImage) {
//         URL.revokeObjectURL(previewImage);
//       }
//     };
//   }, [file, previewImage]);

//   const initialValues = {
//     username: name,
//     address,
//   };

//   const validationSchema = Yup.object({
//     username: Yup.string().required(
//       "User Name is required"
//     ),
//   });

//   const onSubmit = (values) => {
//     const payload = {
//       ...values,
//       profilePhoto: file,
//     };

//     console.log(payload);
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//         // alignItems:'center',
//         // width:"60%",
//         // margin:'auto'
//         // p: { xs: 2, md: 4 },
//       }}
//     >
//       <Card
//         elevation={8}
//         sx={{
//           width: "100%",
//           maxWidth: 750,
//           borderRadius: 4,
//           overflow: "hidden",
//         }}
//       >
//         {/* Header */}
//         <Box
//           sx={{
//             height: 200,
//             // height: 220,
//             position: "relative",
//             background:
//               "linear-gradient(135deg,#0f172a,#1e3a8a,#0ea5e9)",
//           }}
//         >
//           <Avatar
//             src={previewImage || undefined}
//             sx={{
//               width: 140,
//               height: 140,
//               position: "absolute",
//               left: "50%",
//               bottom: -70,
//               transform: "translateX(-50%)",
//               border: "5px solid #fff",
//               bgcolor: "primary.main",
//               boxShadow:
//                 "0 10px 30px rgba(0,0,0,0.25)",
//               fontSize: 52,
//               fontWeight: 700,
//             }}
//           >
//             {!previewImage &&
//               // (name ? (
//               //   name.charAt(0).toUpperCase()
//               // ) :
//               (
//                 <PersonIcon
//                   sx={{ fontSize: 80 }}
//                 />
//               )}
//           </Avatar>
//         </Box>

//         <CardContent
//           sx={{
//             pt: 12,
//             px: { xs: 2, md: 4 },
//             pb: 4,
//           }}
//         >
//           <Box
//             sx={{
//               textAlign: "center",
//               mb: 4,
//             }}
//           >
//             <Typography
//               variant="h5"
//               fontWeight={700}
//             >
//               Update Profile
//             </Typography>

//             <Typography
//               variant="body2"
//               color="text.secondary"
//               sx={{ mt: 1 }}
//             >
//               Update your profile information and
//               profile picture
//             </Typography>
//           </Box>

//           <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             enableReinitialize
//             onSubmit={onSubmit}
//           >
//             <Form>
//               <Stack spacing={3}>
//                 <Box>
//                   <Field
//                     as={TextField}
//                     fullWidth
//                     size="small"
//                     name="username"
//                     label="User Name"
//                   />

//                   <ErrorMessage
//                     name="username"
//                     component="div"
//                     className="errorStyles"
//                   />
//                 </Box>

//                 <Box>
//                   <Field
//                     as={TextField}
//                     fullWidth
//                     multiline
//                     rows={4}
//                     name="address"
//                     label="Address"
//                   />

//                   <ErrorMessage
//                     name="address"
//                     component="div"
//                     className="errorStyles"
//                   />
//                 </Box>

//                 <ReusableFileUpload
//                   label="Change Profile Photo"
//                   fileName={file?.name}
//                   onChange={(e) =>
//                     setFile(
//                       e.target.files?.[0] || null
//                     )
//                   }
//                 />

//                 <Stack
//                   direction="row"
//                   spacing={2}
//                   justifyContent="center"
//                 >
//                   <Button
//                     variant="outlined"
//                     size="large"
//                   >
//                     Cancel
//                   </Button>

//                   <Button
//                     type="submit"
//                     variant="contained"
//                     size="large"
//                   >
//                     Save Changes
//                   </Button>
//                 </Stack>
//               </Stack>
//             </Form>
//           </Formik>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default EditProfile;

// import { ErrorMessage, Field, Form, Formik } from "formik";
// import React, { useMemo, useState } from "react";
// import {
//   Avatar,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { useSelector } from "react-redux";
// import * as Yup from "yup";
// import ReusableFileUpload from "../../reusables/ReusableFileUpload";

// const EditProfile = () => {
//   const [file, setFile] = useState(null);

//   const userProfile = useSelector(
//     (state) => state.apiSlicer.userProfile
//   );

//   const {
//     name = "",
//     address = "",
//     profilePhoto,
//   } = userProfile || {};

//   const previewImage = useMemo(() => {
//     if (file) {
//       return URL.createObjectURL(file);
//     }

//     return profilePhoto?.secure_url || "";
//   }, [file, profilePhoto]);

//   const initialValues = {
//     username: name,
//     address,
//   };

//   const validationSchema = Yup.object({
//     username: Yup.string().required(
//       "User Name is required"
//     ),
//     address: Yup.string(),
//   });

//   const onSubmit = (values) => {
//     console.log({
//       ...values,
//       profilePhoto: file,
//     });
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//         p: { xs: 2, md: 4 },
//       }}
//     >
//       <Card
//         elevation={8}
//         sx={{
//           width: "100%",
//           maxWidth: 750,
//           borderRadius: 4,
//           overflow: "hidden",
//         }}
//       >
//         {/* Header */}
//         <Box
//           sx={{
//             height: 180,
//             position: "relative",
//             background:
//               "linear-gradient(135deg,#0f172a,#1e3a8a,#0ea5e9)",
//           }}
//         >
//           <Avatar
//             src={previewImage}
//             sx={{
//               width: 130,
//               height: 130,
//               position: "absolute",
//               left: "50%",
//               bottom: -65,
//               transform: "translateX(-50%)",
//               border: "5px solid white",
//               boxShadow:
//                 "0 10px 30px rgba(0,0,0,0.25)",
//               bgcolor: "white",
//             }}
//           />
//         </Box>

//         <CardContent
//           sx={{
//             pt: 10,
//             px: { xs: 2, md: 4 },
//             pb: 4,
//           }}
//         >
//           {/* Title */}
//           <Box
//             sx={{
//               textAlign: "center",
//               mb: 4,
//             }}
//           >
//             <Typography
//               variant="h5"
//               fontWeight={700}
//             >
//               Edit Profile
//             </Typography>

//             <Typography
//               variant="body2"
//               color="text.secondary"
//               sx={{
//                 mt: 1,
//               }}
//             >
//               Update your personal information and
//               profile picture
//             </Typography>
//           </Box>

//           <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             onSubmit={onSubmit}
//             enableReinitialize
//           >
//             <Form>
//               <Stack spacing={3}>
//                 {/* Username */}
//                 <Box>
//                   <Field
//                     as={TextField}
//                     fullWidth
//                     size="small"
//                     name="username"
//                     label="User Name"
//                   />

//                   <ErrorMessage
//                     name="username"
//                     component="div"
//                     className="errorStyles"
//                   />
//                 </Box>

//                 {/* Address */}
//                 <Box>
//                   <Field
//                     as={TextField}
//                     fullWidth
//                     multiline
//                     rows={4}
//                     name="address"
//                     label="Address"
//                   />

//                   <ErrorMessage
//                     name="address"
//                     component="div"
//                     className="errorStyles"
//                   />
//                 </Box>

//                 {/* Upload */}
//                 <ReusableFileUpload
//                   label="Change Profile Photo"
//                   fileName={file?.name}
//                   onChange={(e) =>
//                     setFile(e.target.files?.[0])
//                   }
//                 />

//                 {/* Buttons */}
//                 <Stack
//                   direction="row"
//                   spacing={2}
//                   justifyContent="center"
//                   sx={{ mt: 2 }}
//                 >
//                   <Button
//                     variant="outlined"
//                     size="large"
//                     sx={{
//                       minWidth: 140,
//                     }}
//                   >
//                     Cancel
//                   </Button>

//                   <Button
//                     type="submit"
//                     variant="contained"
//                     size="large"
//                     sx={{
//                       minWidth: 180,
//                     }}
//                   >
//                     Save Changes
//                   </Button>
//                 </Stack>
//               </Stack>
//             </Form>
//           </Formik>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default EditProfile;

// import { ErrorMessage, Field, Form, Formik } from "formik";
// import React, { useMemo, useState } from "react";
// import {
//   Avatar,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Divider,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { useSelector } from "react-redux";
// import * as Yup from "yup";
// import ReusableFileUpload from "../../reusables/ReusableFileUpload";

// const EditProfile = () => {
//   const [file, setFile] = useState(null);

//   const userProfile = useSelector(
//     (state) => state.apiSlicer.userProfile
//   );

//   const {
//     name = "",
//     address = "",
//     profilePhoto,
//   } = userProfile || {};

//   const previewImage = useMemo(() => {
//     if (file) {
//       return URL.createObjectURL(file);
//     }

//     return profilePhoto?.secure_url || "";
//   }, [file, profilePhoto]);

//   const initialValues = {
//     username: name,
//     address,
//   };

//   const validationSchema = Yup.object({
//     username: Yup.string().required(
//       "User Name is required"
//     ),
//   });

//   const onSubmit = (values) => {
//     console.log({
//       ...values,
//       profilePhoto: file,
//     });
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//         p: 3,
//       }}
//     >
//       <Card
//         sx={{
//           width: "100%",
//           maxWidth: 700,
//           borderRadius: 4,
//           overflow: "hidden",
//         }}
//       >
//         <Box
//           sx={{
//             height: 140,
//             background:
//               "linear-gradient(135deg,#0f172a,#1e3a8a,#0ea5e9)",
//           }}
//         />

//         <CardContent sx={{ mt: -8 }}>
//           <Stack
//             spacing={2}
//             sx={{my:2}}
//             // alignItems="center"
//           >
//             <Avatar
//               src={previewImage}
//               sx={{
//                 width: 120,
//                 height: 120,
//                 border: "4px solid white",
//                 boxShadow: 3,
//               }}
//             />

//             <Typography
//               variant="h5"
//               fontWeight={700}
//             >
//               Edit Profile
//             </Typography>

//             <Typography
//               variant="body2"
//               color="text.secondary"
//             >
//               Update your profile information
//             </Typography>
//           </Stack>

//           {/* <Divider sx={{ my: 2 }} /> */}

//           <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             onSubmit={onSubmit}
//             enableReinitialize
//           >
//             <Form>
//               <Stack spacing={3}>
//                 <Box>
//                   <Field
//                     as={TextField}
//                     fullWidth
//                     size="small"
//                     name="username"
//                     label="User Name"
//                   />

//                   <ErrorMessage
//                     name="username"
//                     component="span"
//                     className="errorStyles"
//                   />
//                 </Box>

//                 <Box>
//                   <Field
//                     as={TextField}
//                     fullWidth
//                     multiline
//                     rows={4}
//                     name="address"
//                     label="Address"
//                   />

//                   <ErrorMessage
//                     name="address"
//                     component="span"
//                     className="errorStyles"
//                   />
//                 </Box>

//                 <ReusableFileUpload
//                   label="Change Profile Photo"
//                   fileName={file?.name}
//                   onChange={(e) =>
//                     setFile(e.target.files[0])
//                   }
//                 />

//                 <Stack
//                   direction="row"
//                   spacing={2}
//                   // justifyContent="flex-end"
//                 >
//                   <Button
//                     variant="outlined"
//                     type="button"
//                   >
//                     Cancel
//                   </Button>

//                   <Button
//                     type="submit"
//                     variant="contained"
//                   >
//                     Save Changes
//                   </Button>
//                 </Stack>
//               </Stack>
//             </Form>
//           </Formik>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default EditProfile;

// import { ErrorMessage, Field, Form, Formik } from "formik";
// import React, { useState } from "react";
// import {
//   Avatar,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Divider,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { useSelector } from "react-redux";
// import * as Yup from "yup";

// import ReusableTextField from "../../reusables/ReusableTextField";
// import ReusableFileUpload from "../../reusables/ReusableFileUpload";

// const EditProfile = () => {
//   const [file, setFile] = useState(null);

//   const userProfileDetails = useSelector(
//     (state) => state.apiSlicer.userProfile,
//   );

//   const { name, profilePhoto, address } = userProfileDetails || {};

//   const initialValues = {
//     username: name || "",
//     address: address || "",
//     profilePhoto: profilePhoto || "",
//   };

//   const validationSchema = Yup.object({
//     username: Yup.string().required("User Name is required!"),
//   });

//   const onSubmit = (values) => {
//     console.log(values);
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//         py: 4,
//         px: 2,
//       }}
//     >
//       <Card
//         elevation={5}
//         sx={{
//           width: "100%",
//           maxWidth: 700,
//           borderRadius: 4,
//           overflow: "hidden",
//         }}
//       >
//         {/* Header */}
//         <Box
//           sx={{
//             height: 140,
//             background: "linear-gradient(135deg,#0f172a,#1e3a8a,#0ea5e9)",
//           }}
//         />

//         <CardContent
//           sx={{
//             mt: -8,
//             px: 4,
//             pb: 4,
//           }}
//         >
//           {/* Profile Image */}
//           <Stack alignItems="center" spacing={2} mb={3}>
//             <Avatar
//               src={file ? URL.createObjectURL(file) : profilePhoto?.secure_url}
//               sx={{
//                 width: 120,
//                 height: 120,
//                 border: "4px solid white",
//                 boxShadow: 3,
//               }}
//             />

//             <Typography variant="h5" fontWeight={700}>
//               Edit Profile
//             </Typography>

//             <Typography variant="body2" color="text.secondary">
//               Update your profile information
//             </Typography>
//           </Stack>

//           <Divider sx={{ mb: 4 }} />

//           <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             onSubmit={onSubmit}
//             enableReinitialize
//           >
//             <Form>
//               <Stack spacing={3}>
//                 <Box>
//                   <Field
//                   label="User Name"
//                   name="username"
//                   size="small"
//                   fullWidth
//                   as={TextField}
//                   variant="outlined"
//                 />
//                 <ErrorMessage name="username" component="span" className="errorStyles" />
//                 </Box>
//                 <TextField
//                   label="Address"
//                   name="address"
//                   multiline
//                   rows={4}
//                   fullWidth
//                   variant="outlined"
//                 />

//                 <ReusableFileUpload
//                   label="Change Profile Photo"
//                   fileName={file?.name}
//                   onChange={(e) => setFile(e.target.files[0])}
//                 />

//                 <Stack direction="row" spacing={2} justifyContent="flex-end">
//                   <Button variant="outlined">Cancel</Button>

//                   <Button
//                     type="submit"
//                     variant="contained"
//                     sx={{
//                       px: 4,
//                       borderRadius: 2,
//                     }}
//                   >
//                     Save Changes
//                   </Button>
//                 </Stack>
//               </Stack>
//             </Form>
//           </Formik>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default EditProfile;

// import { Form, Formik } from "formik";
// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import * as Yup from "yup";
// import ReusableTextField from "../../reusables/ReusableTextField";
// import { Button, TextareaAutosize, TextField } from "@mui/material";
// import ReusableFileUpload from "../../reusables/ReusableFileUpload";

// const EditProfile = () => {
//     const [file, setFile] = useState(null);

//   const userProfileDetails = useSelector(
//     (state) => state.apiSlicer.userProfile,
//   );

//   const { name, email, mobile, profilePhoto, address, role, id } =
//     userProfileDetails;
//   const initialValues = { username: name, address, profilePhoto };
//   const validationSchema = Yup.object().shape({
//     username: Yup.string().required("user name is required!"),
//   });
//   const handleChange = (event, setFieldValue) => {
//     const { name, value } = event.target;
//     setFieldValue(name, value);
//   };
//   const handleFileUpload = ()=>{

//   }
//   const onSubmit = (values,{resetForm})=>{
//     console.log(values);
//     resetForm();
//   }
//   return (
//     <>
//       <h3>Edit Profile</h3>
//       <Formik initialValues={initialValues}
//       validationSchema={validationSchema}
//       onSubmit={onSubmit}
//       >
//         <Form>
//           <ReusableTextField
//             type="text"
//             onChange={handleChange}
//             label="User Name"
//             name="username"
//             variant="outlined"
//             as={TextField}
//             size="small"
//           />
//           <ReusableTextField
//             type="text"
//             onChange={handleChange}
//             label="Address"
//             name="address"
//             variant="outlined"
//             as={Textarea}
//             size="small"
//           />
//           <ReusableFileUpload
//           label="Profile Photo"
//         fileName={file?.name}
//         onChange={(e) => setFile(e.target.files[0])}
//           />
//           <Button variant="outlined" type="submit">Save</Button>
//         </Form>
//       </Formik>
//     </>
//   );
// };

// export default EditProfile;
