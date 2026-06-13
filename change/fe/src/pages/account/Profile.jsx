import React from "react";
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
  Divider,
  Stack,
  Button,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EditIcon from "@mui/icons-material/Edit";
import {useSelector} from "react-redux";
import { navigationLocations, optimizeImage, ROLES } from "../../utils/utils";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  
  const navigate = useNavigate();
  const userProfileDetails = useSelector((state)=>state.apiSlicer.userProfile);

  const {name,email,mobile,profilePhoto,address,role,id} = userProfileDetails;
  // console.log(userProfileDetails);
  
  const handleEditProfile = () => {
    console.log("Edit Profile");
    navigate(
  navigationLocations.EDITPROFILE.replace(":id", id)
);
  };

  return (
    <Box
      sx={{
        // minHeight: "100vh",
        minHeight: "100dvh",
        display: "flex",
        justifyContent: "center",
        alignItems: {
          xs: "flex-start",
          md: "center",
        },
        // p: {
        //   xs: 1,
        //   sm: 2,
        //   md: 3,
        // },
        // background:
        //   "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 550,
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 20px 40px rgba(37,99,235,0.15)",
          my: {
            xs: 0,
            md: 2,
          },
        }}
      >
        <Box
          sx={{
            height: 140,
            background:
              "linear-gradient(135deg, #2563EB, #06B6D4)",
            position: "relative",
          }}
        >
          <Avatar
            src={optimizeImage(profilePhoto?.secure_url,100,100)}
            // src={profilePhoto?.secure_url}
            // src={profilePhoto}
            alt={name}
            // src={user.profilePhoto}
            // alt={user.name}
            sx={{
              width: { xs: 90, sm: 110 },
              height: { xs: 90, sm: 110 },
              border: "5px solid white",
              position: "absolute",
              bottom: { xs: -45, sm: -55 },
              left: "50%",
              transform: "translateX(-50%)",
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            }}
          >
            <PersonIcon sx={{ fontSize: 50 }} />
          </Avatar>
        </Box>

        <CardContent
          sx={{
            pt: { xs: 7, sm: 8 },
            px: { xs: 2, sm: 3 },
          }}
        >
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{ textAlign: "center" }}
          >
            {name}
            {/* {user.name} */}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              textAlign: "center",
              mb: 2,
            }}
          >
            {
              role === ROLES.ADMIN ? "Admin" : "User"
            } Profile
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEditProfile}
              sx={{
                borderRadius: 10,
                textTransform: "none",
                px: 3,
                background:
                  "linear-gradient(135deg, #2563EB, #06B6D4)",
              }}
            >
              Edit Profile
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Stack spacing={3}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <EmailIcon color="primary" />
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Email
                </Typography>
                <Typography>
                  {email}
                  {/* {user.email} */}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <PhoneIcon color="primary" />
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Mobile
                </Typography>
                <Typography>
                  {mobile}
                  {/* {user.mobile} */}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <LocationOnIcon color="primary" />
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Address
                </Typography>
                <Typography>
                  {address?address:"-"}
                  {/* {user.address} */}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;



// import React from "react";
// import {
//   Card,
//   CardContent,
//   Avatar,
//   Typography,
//   Box,
//   Divider,
//   Stack,
//   Button,
// } from "@mui/material";
// import PersonIcon from "@mui/icons-material/Person";
// import EmailIcon from "@mui/icons-material/Email";
// import PhoneIcon from "@mui/icons-material/Phone";
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import EditIcon from "@mui/icons-material/Edit";

// const Profile = () => {
//   const user = {
//     name: "John Doe",
//     email: "john@example.com",
//     mobile: "+91 9876543210",
//     address: "Hyderabad, Telangana, India",
//     profilePhoto: "",
//   };

//   const handleEditProfile = () => {
//     console.log("Edit Profile");
//     // Open dialog or navigate to edit profile page
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: { xs: "flex-start", md: "center" },
//         minHeight: "100vh",
//         p: { xs: 1, sm: 3 },
//         background:
//           "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
//       }}
//     >
//       <Card
//         sx={{
//           width: "100%",
//           maxWidth: 500,
//           borderRadius: 5,
//           overflow: "hidden",
//           boxShadow: "0 20px 40px rgba(37,99,235,0.15)",
//         }}
//       >
//         {/* Header */}
//         <Box
//           sx={{
//             height: 140,
//             background:
//               "linear-gradient(135deg, #2563EB, #06B6D4)",
//             position: "relative",
//           }}
//         >
//           <Avatar
//             src={user.profilePhoto}
//             alt={user.name}
//             sx={{
//               width: { xs: 90, sm: 110 },
//               height: { xs: 90, sm: 110 },
//               border: "5px solid white",
//               position: "absolute",
//               bottom: { xs: -45, sm: -55 },
//               left: "50%",
//               transform: "translateX(-50%)",
//               boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
//             }}
//           >
//             <PersonIcon sx={{ fontSize: { xs: 45, sm: 55 } }} />
//           </Avatar>
//         </Box>

//         <CardContent sx={{ pt: { xs: 7, sm: 8 } }}>
//           <Typography
//             variant="h5"
//             fontWeight={700}
//             textAlign="center"
//           >
//             {user.name}
//           </Typography>

//           <Typography
//             variant="body2"
//             color="text.secondary"
//             textAlign="center"
//             sx={{ mb: 3 }}
//           >
//             User Profile
//           </Typography>

//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "center",
//               mb: 3,
//             }}
//           >
//             <Button
//               variant="contained"
//               startIcon={<EditIcon />}
//               onClick={handleEditProfile}
//               sx={{
//                 borderRadius: "25px",
//                 textTransform: "none",
//                 px: 3,
//                 background:
//                   "linear-gradient(135deg, #2563EB, #06B6D4)",
//                 boxShadow: "0 8px 20px rgba(37,99,235,0.25)",
//               }}
//             >
//               Edit Profile
//             </Button>
//           </Box>

//           <Divider sx={{ mb: 3 }} />

//           <Stack spacing={3}>
//             <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//               <EmailIcon color="primary" />
//               <Box>
//                 <Typography
//                   variant="caption"
//                   color="text.secondary"
//                 >
//                   Email
//                 </Typography>
//                 <Typography variant="body1">
//                   {user.email}
//                 </Typography>
//               </Box>
//             </Box>

//             <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//               <PhoneIcon color="primary" />
//               <Box>
//                 <Typography
//                   variant="caption"
//                   color="text.secondary"
//                 >
//                   Mobile
//                 </Typography>
//                 <Typography variant="body1">
//                   {user.mobile}
//                 </Typography>
//               </Box>
//             </Box>

//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "flex-start",
//                 gap: 2,
//               }}
//             >
//               <LocationOnIcon color="primary" />
//               <Box>
//                 <Typography
//                   variant="caption"
//                   color="text.secondary"
//                 >
//                   Address
//                 </Typography>
//                 <Typography variant="body1">
//                   {user.address}
//                 </Typography>
//               </Box>
//             </Box>
//           </Stack>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default Profile;



// import React from "react";
// import {
//   Card,
//   CardContent,
//   Avatar,
//   Typography,
//   Box,
//   Divider,
//   Stack,
// } from "@mui/material";
// import PersonIcon from "@mui/icons-material/Person";
// import EmailIcon from "@mui/icons-material/Email";
// import PhoneIcon from "@mui/icons-material/Phone";
// import LocationOnIcon from "@mui/icons-material/LocationOn";

// const Profile = () => {
//   const user = {
//     name: "John Doe",
//     email: "john@example.com",
//     mobile: "+91 9876543210",
//     address: "Hyderabad, Telangana, India",
//     profilePhoto: "",
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         minHeight: "100vh",
//         p: 3,
//         background:
//           "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
//       }}
//     >
//       <Card
//         sx={{
//           width: "100%",
//           maxWidth: 450,
//           borderRadius: 5,
//           overflow: "hidden",
//           boxShadow: "0 20px 40px rgba(37,99,235,0.15)",
//         }}
//       >
//         {/* Header */}
//         <Box
//           sx={{
//             height: 130,
//             background:
//               "linear-gradient(135deg, #2563EB, #06B6D4)",
//             position: "relative",
//           }}
//         >
//           <Avatar
//             src={user.profilePhoto}
//             sx={{
//               width: 110,
//               height: 110,
//               border: "5px solid white",
//               position: "absolute",
//               bottom: -55,
//               left: "50%",
//               transform: "translateX(-50%)",
//               boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
//             }}
//           >
//             <PersonIcon sx={{ fontSize: 55 }} />
//           </Avatar>
//         </Box>

//         <CardContent sx={{ pt: 8 }}>
//           <Typography
//             variant="h5"
//             fontWeight={700}
//             // textAlign="center"
//             gutterBottom
//           >
//             {user.name}
//           </Typography>

//           <Typography
//             variant="body2"
//             color="text.secondary"
//             // textAlign="center"
//             sx={{ mb: 3 }}
//           >
//             User Profile
//           </Typography>

//           <Divider sx={{ mb: 3 }} />

//           <Stack spacing={2.5}>
//             <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//               <EmailIcon color="primary" />
//               <Box>
//                 <Typography variant="caption" color="text.secondary">
//                   Email
//                 </Typography>
//                 <Typography variant="body1">
//                   {user.email}
//                 </Typography>
//               </Box>
//             </Box>

//             <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//               <PhoneIcon color="primary" />
//               <Box>
//                 <Typography variant="caption" color="text.secondary">
//                   Mobile
//                 </Typography>
//                 <Typography variant="body1">
//                   {user.mobile}
//                 </Typography>
//               </Box>
//             </Box>

//             <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
//               <LocationOnIcon color="primary" />
//               <Box>
//                 <Typography variant="caption" color="text.secondary">
//                   Address
//                 </Typography>
//                 <Typography variant="body1">
//                   {user.address}
//                 </Typography>
//               </Box>
//             </Box>
//           </Stack>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default Profile;

