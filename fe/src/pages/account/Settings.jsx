import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Box,
  Alert,
  CircularProgress,
  Container
} from "@mui/material";
import { Lock, CheckCircle } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { changePasswordApi } from "../../app/thunkApiCalls";
import PasswordField from "../../reusables/PasswordField";
import { useNavigate } from "react-router-dom";
import { navigationLocations } from "../../utils/utils";
import UniversalModal from "../../features/UniversalModal";
import useModal from "../../reusables/useModal";

const Settings = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  // const [showModal,setShowModal] = useState(false);
  // const [modalData,setModalData] = useState({title:'',content:''});
  // const [modalType,setModalType] = useState('info');
  // const [modalNavigation,setModalNavigation] = useState('');
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
  const dispatch = useDispatch();
  const userProfileDetails = useSelector(
    (state) => state.apiSlicer.userProfile
  );
  const navigate = useNavigate();
  const { id } = userProfileDetails;

  console.log("inside settings",{id,userProfileDetails});
  
  // ---------------- INPUT ----------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    setError("");
  };

  // ---------------- TOGGLE PASSWORD ----------------
  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // ---------------- VALIDATION ----------------
  const validateForm = () => {
    setSuccess("");

    if (!formData.currentPassword) {
      setError("Current password is required");
      return false;
    }

    if (!formData.newPassword) {
      setError("New password is required");
      return false;
    }

    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError("New password must be different from current password");
      return false;
    }

    return true;
  };

  // ---------------- SAVE ----------------
  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await dispatch(
        changePasswordApi({
          url: `${import.meta.env.VITE_UPDATE_PASSWORD}/${id}`,
          data: formData
        })
      );

      if (changePasswordApi.fulfilled.match(result)) {
        setSuccess("Password changed successfully!");
        setModalData({
          title:'Success!',
          content:'Password updated successfully!'
        });
        setModalType('success');
        setModalNavigation(-1);
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });

        setError("");
        // navigate(-1);
        // navigate(navigationLocations?.PROFILE);
      } else if (changePasswordApi.rejected.match(result)) {
        setSuccess("");

        setError(
          result.payload ||
            result.error?.message ||
            "Failed to change password"
        );
        setModalData({
          title:'Failed!',
          content:result.payload
        });
        setModalType('error');
      }
      setShowModal(true);
    } catch (err) {
      setSuccess("");
      setError(err.message || "Failed to change password");
      setModalData({
          title:'Failed!',
          content:err.message
        });
        setModalType('error');
        setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- RESET ----------------
  const handleReset = () => {
    navigate(-1);
  };

  return (
    <>
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
        <CardHeader
          avatar={
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Lock sx={{ color: "white" }} />
            </Box>
          }
          title="Change Password"
          subheader="Update your password securely"
        />

        <CardContent>
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              severity="success"
              icon={<CheckCircle />}
              sx={{ mb: 2 }}
            >
              {success}
            </Alert>
          )}

          {/* FIELDS */}
          <PasswordField
            label="Current Password"
            name="currentPassword"
            value={formData.currentPassword}
            show={showPasswords.currentPassword}
            onChange={handleInputChange}
            toggle={togglePasswordVisibility}
            disabled={loading}
          />

          <PasswordField
            label="New Password"
            name="newPassword"
            value={formData.newPassword}
            show={showPasswords.newPassword}
            onChange={handleInputChange}
            toggle={togglePasswordVisibility}
            disabled={loading}
            helperText="Minimum 6 characters"
          />

          <PasswordField
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            show={showPasswords.confirmPassword}
            onChange={handleInputChange}
            toggle={togglePasswordVisibility}
            disabled={loading}
          />

          {/* BUTTONS */}
          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSave}
              disabled={loading}
              sx={{
                background:
                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Save Password"
              )}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={handleReset}
              disabled={loading}
            >
              Cancel
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
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

export default Settings;




// import React, { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   TextField,
//   Button,
//   Box,
//   Alert,
//   CircularProgress,
//   InputAdornment,
//   IconButton,
//   Container
// } from "@mui/material";
// import {
//   Visibility,
//   VisibilityOff,
//   Lock,
//   CheckCircle
// } from "@mui/icons-material";
// import { useDispatch, useSelector } from "react-redux";
// import { changePasswordApi } from "../../app/thunkApiCalls";

// const Settings = () => {
//   const [formData, setFormData] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: ""
//   });

//   const [showPasswords, setShowPasswords] = useState({
//     currentPassword: false,
//     newPassword: false,
//     confirmPassword: false
//   });

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);

//   const dispatch = useDispatch();
//   const userProfileDetails = useSelector(
//     (state) => state.apiSlicer.userProfile
//   );

//   const { id } = userProfileDetails;

//   // ---------------- INPUT CHANGE ----------------
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value
//     }));

//     setError("");
//   };

//   // ---------------- TOGGLE PASSWORD ----------------
//   const togglePasswordVisibility = (field) => {
//     setShowPasswords((prev) => ({
//       ...prev,
//       [field]: !prev[field]
//     }));
//   };

//   // ---------------- VALIDATION ----------------
//   const validateForm = () => {
//     setSuccess("");

//     if (!formData.currentPassword) {
//       setError("Current password is required");
//       return false;
//     }

//     if (!formData.newPassword) {
//       setError("New password is required");
//       return false;
//     }

//     if (formData.newPassword.length < 6) {
//       setError("New password must be at least 6 characters");
//       return false;
//     }

//     if (formData.newPassword !== formData.confirmPassword) {
//       setError("Passwords do not match");
//       return false;
//     }

//     if (formData.currentPassword === formData.newPassword) {
//       setError("New password must be different from current password");
//       return false;
//     }

//     return true;
//   };

//   // ---------------- SAVE PASSWORD ----------------
//   const handleSave = async () => {
//     if (!validateForm()) return;

//     setLoading(true);

//     try {
//       const result = await dispatch(
//         changePasswordApi({
//           url: `${import.meta.env.VITE_UPDATE_PASSWORD}/${id}`,
//           data: formData
//         })
//       );

//       if (changePasswordApi.fulfilled.match(result)) {
//         setSuccess("Password changed successfully!");

//         setFormData({
//           currentPassword: "",
//           newPassword: "",
//           confirmPassword: ""
//         });

//         setError("");
//       } else if (changePasswordApi.rejected.match(result)) {
//         setSuccess("");

//         const message =
//           result.payload ||
//           result.error?.message ||
//           "Failed to change password";

//         setError(message);
//       }
//     } catch (err) {
//       setSuccess("");
//       setError(err.message || "Failed to change password");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------------- RESET ----------------
//   const handleReset = () => {
//     setFormData({
//       currentPassword: "",
//       newPassword: "",
//       confirmPassword: ""
//     });
//     setError("");
//     setSuccess("");
//   };

//   // ---------------- PASSWORD FIELD COMPONENT ----------------
//   const PasswordField = ({
//     label,
//     name,
//     value,
//     show,
//     onChange,
//     toggle,
//     disabled,
//     helperText
//   }) => {
//     return (
//       <TextField
//         fullWidth
//         label={label}
//         name={name}
//         type={show ? "text" : "password"}
//         value={value}
//         onChange={onChange}
//         margin="normal"
//         variant="outlined"
//         helperText={helperText}
//         disabled={disabled}
//         InputProps={{
//           endAdornment: (
//             <InputAdornment position="end">
//               <IconButton
//                 onClick={() => toggle(name)}
//                 edge="end"
//                 size="small"
//                 tabIndex={-1}
//               >
//                 {show ? <VisibilityOff /> : <Visibility />}
//               </IconButton>
//             </InputAdornment>
//           )
//         }}
//         sx={{
//           "& .MuiOutlinedInput-root": {
//             transition: "all 0.3s ease",
//             "&:hover fieldset": {
//               borderColor: "#667eea"
//             },
//             "&.Mui-focused fieldset": {
//               borderColor: "#667eea"
//             }
//           }
//         }}
//       />
//     );
//   };

//   // ---------------- UI ----------------
//   return (
//     <Container maxWidth="sm" sx={{ py: 4 }}>
//       <Card
//         sx={{
//           boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
//           borderRadius: 2
//         }}
//       >
//         <CardHeader
//           avatar={
//             <Box
//               sx={{
//                 width: 44,
//                 height: 44,
//                 borderRadius: "50%",
//                 background:
//                   "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center"
//               }}
//             >
//               <Lock sx={{ color: "white" }} />
//             </Box>
//           }
//           title="Change Password"
//           subheader="Update your password to keep your account secure"
//         />

//         <CardContent>
//           {error && (
//             <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
//               {error}
//             </Alert>
//           )}

//           {success && (
//             <Alert
//               severity="success"
//               icon={<CheckCircle />}
//               sx={{ mb: 2 }}
//             >
//               {success}
//             </Alert>
//           )}

//           {/* PASSWORD FIELDS */}
//           <PasswordField
//             label="Current Password"
//             name="currentPassword"
//             value={formData.currentPassword}
//             show={showPasswords.currentPassword}
//             onChange={handleInputChange}
//             toggle={togglePasswordVisibility}
//             disabled={loading}
//           />

//           <PasswordField
//             label="New Password"
//             name="newPassword"
//             value={formData.newPassword}
//             show={showPasswords.newPassword}
//             onChange={handleInputChange}
//             toggle={togglePasswordVisibility}
//             disabled={loading}
//             helperText="Minimum 6 characters"
//           />

//           <PasswordField
//             label="Confirm Password"
//             name="confirmPassword"
//             value={formData.confirmPassword}
//             show={showPasswords.confirmPassword}
//             onChange={handleInputChange}
//             toggle={togglePasswordVisibility}
//             disabled={loading}
//           />

//           {/* BUTTONS */}
//           <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
//             <Button
//               fullWidth
//               variant="contained"
//               onClick={handleSave}
//               disabled={loading}
//               sx={{
//                 background:
//                   "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
//               }}
//             >
//               {loading ? (
//                 <CircularProgress size={24} sx={{ color: "white" }} />
//               ) : (
//                 "Save Password"
//               )}
//             </Button>

//             <Button
//               fullWidth
//               variant="outlined"
//               onClick={handleReset}
//               disabled={loading}
//             >
//               Cancel
//             </Button>
//           </Box>
//         </CardContent>
//       </Card>
//     </Container>
//   );
// };

// export default Settings;



// import React, { useState } from 'react'
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   TextField,
//   Button,
//   Box,
//   Alert,
//   CircularProgress,
//   InputAdornment,
//   IconButton,
//   Container
// } from '@mui/material'
// import { Visibility, VisibilityOff, Lock, CheckCircle } from '@mui/icons-material'
// import { useDispatch, useSelector } from 'react-redux'
// import { changePasswordApi } from '../../app/thunkApiCalls'

// const Settings = () => {
//   const [formData, setFormData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   })
//   const [showPasswords, setShowPasswords] = useState({
//     currentPassword: false,
//     newPassword: false,
//     confirmPassword: false
//   })
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const [loading, setLoading] = useState(false)
//   const dispatch = useDispatch();
//   const userProfileDetails = useSelector((state)=>state.apiSlicer.userProfile);

//   const {id} = userProfileDetails;
//   const handleInputChange = (e) => {
//     const { name, value } = e.target
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }))
//     setError('')
//   }

//   const togglePasswordVisibility = (field) => {
//     setShowPasswords(prev => ({
//       ...prev,
//       [field]: !prev[field]
//     }))
//   }

//   const validateForm = () => {
//     setSuccess('');
//     if (!formData.currentPassword) {
//       setError('current password is required')
//       return false
//     }
//     if (!formData.newPassword) {
//       setError('New password is required')
//       return false
//     }
//     if (formData.newPassword.length < 6) {
//       setError('New password must be at least 6 characters')
//       return false
//     }
//     if (formData.newPassword !== formData.confirmPassword) {
//       setError('Passwords do not match')
//       return false
//     }
//     if (formData.currentPassword === formData.newPassword) {
//       setError('New password must be different from current password')
//       return false
//     }
//     return true
//   }

//   const handleSave = async () => {
//     if (!validateForm()) return

//     setLoading(true)
//     try {
//       // Replace with your actual API call
//       // await api.changePassword(formData)
      
//       // Simulating API call
//       // await new Promise(resolve => setTimeout(resolve, 1000))
//       const result = await dispatch(changePasswordApi({
//         url:`${import.meta.env.VITE_UPDATE_PASSWORD}/${id}`,
//         data:formData
//       }))
//       if(changePasswordApi.fulfilled.match(result)){

//         setSuccess('Password changed successfully!');
//         setFormData({
//         currentPassword: '',
//         newPassword: '',
//         confirmPassword: ''
//       });
//       // setTimeout(() => setSuccess(''), 3000)
//       }else if(changePasswordApi.rejected.match(result)){
//         // setError(err.message || 'Failed to change password')
//         //  setError(result.error?.message || "Failed to change password");
//         setSuccess('');
//         setError(result.payload || "Failed to change password");
//       }
      
//     } catch (err) {
//       setSuccess('');
//       setError(err.message || 'Failed to change password');
//     } finally {
//       setLoading(false);
      
//     }
//   }

//   const handleReset = () => {
//     setFormData({
//       currentPassword: '',
//       newPassword: '',
//       confirmPassword: ''
//     })
//     setError('')
//     setSuccess('')
//   }

//   return (
//     <Container maxWidth="sm" sx={{ py: 4 }}>
//       <Card
//         sx={{
//           boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
//           borderRadius: 2,
//           overflow: 'hidden',
//           transition: 'box-shadow 0.3s ease',
//           '&:hover': {
//             boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)'
//           }
//         }}
//       >
//         <CardHeader
//           avatar={
//             <Box
//               sx={{
//                 width: 44,
//                 height: 44,
//                 borderRadius: '50%',
//                 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center'
//               }}
//             >
//               <Lock sx={{ color: 'white', fontSize: 24 }} />
//             </Box>
//           }
//           title="Change Password"
//           subheader="Update your password to keep your account secure"
//           sx={{
//             pb: 2,
//             '& .MuiCardHeader-title': {
//               fontSize: '1.5rem',
//               fontWeight: 700,
//               color: '#1a1a1a'
//             },
//             '& .MuiCardHeader-subheader': {
//               color: '#666',
//               marginTop: 0.5,
//               fontSize: '0.95rem'
//             }
//           }}
//         />
//         <CardContent sx={{ pt: 3, pb: 3 }}>
//           {error && (
//             <Alert 
//               severity="error" 
//               sx={{ mb: 2, borderRadius: 1.5 }}
//               onClose={() => setError('')}
//             >
//               {error}
//             </Alert>
//           )}
//           {success && (
//             <Alert 
//               severity="success" 
//               sx={{ mb: 2, borderRadius: 1.5 }}
//               icon={<CheckCircle />}
//             >
//               {success}
//             </Alert>
//           )}

//           <TextField
//             fullWidth
//             label="Current Password"
//             name="currentPassword"
//             type={showPasswords.currentPassword ? 'text' : 'password'}
//             value={formData.currentPassword}
//             onChange={handleInputChange}
//             margin="normal"
//             variant="outlined"
//             placeholder="Enter your current password"
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton
//                     onClick={() => togglePasswordVisibility('currentPassword')}
//                     edge="end"
//                     size="small"
//                     tabIndex={-1}
//                   >
//                     {showPasswords.currentPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               )
//             }}
//             disabled={loading}
//             sx={{
//               '& .MuiOutlinedInput-root': {
//                 transition: 'all 0.3s ease',
//                 '&:hover fieldset': {
//                   borderColor: '#667eea'
//                 },
//                 '&.Mui-focused fieldset': {
//                   borderColor: '#667eea'
//                 }
//               }
//             }}
//           />

//           <TextField
//             fullWidth
//             label="New Password"
//             name="newPassword"
//             type={showPasswords.newPassword ? 'text' : 'password'}
//             value={formData.newPassword}
//             onChange={handleInputChange}
//             margin="normal"
//             variant="outlined"
//             placeholder="Enter your new password"
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton
//                     onClick={() => togglePasswordVisibility('newPassword')}
//                     edge="end"
//                     size="small"
//                     tabIndex={-1}
//                   >
//                     {showPasswords.newPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               )
//             }}
//             disabled={loading}
//             helperText="Minimum 6 characters"
//             sx={{
//               '& .MuiOutlinedInput-root': {
//                 transition: 'all 0.3s ease',
//                 '&:hover fieldset': {
//                   borderColor: '#667eea'
//                 },
//                 '&.Mui-focused fieldset': {
//                   borderColor: '#667eea'
//                 }
//               }
//             }}
//           />

//           <TextField
//             fullWidth
//             label="Confirm Password"
//             name="confirmPassword"
//             type={showPasswords.confirmPassword ? 'text' : 'password'}
//             value={formData.confirmPassword}
//             onChange={handleInputChange}
//             margin="normal"
//             variant="outlined"
//             placeholder="Confirm your new password"
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton
//                     onClick={() => togglePasswordVisibility('confirmPassword')}
//                     edge="end"
//                     size="small"
//                     tabIndex={-1}
//                   >
//                     {showPasswords.confirmPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               )
//             }}
//             disabled={loading}
//             sx={{
//               '& .MuiOutlinedInput-root': {
//                 transition: 'all 0.3s ease',
//                 '&:hover fieldset': {
//                   borderColor: '#667eea'
//                 },
//                 '&.Mui-focused fieldset': {
//                   borderColor: '#667eea'
//                 }
//               }
//             }}
//           />

//           <Box sx={{ display: 'flex', gap: 2, mt: 3.5 }}>
//             <Button
//               fullWidth
//               variant="contained"
//               // size="small"
//               size="large"
//               onClick={handleSave}
//               disabled={loading}
//               sx={{
//                 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                 textTransform: 'none',
//                 fontSize: '1rem',
//                 fontWeight: 600,
//                 py: 1.3,
//                 color: 'white',
//                 border: 'none',
//                 '&:hover': {
//                   boxShadow: '0 8px 16px rgba(102, 126, 234, 0.4)',
//                   transform: 'translateY(-2px)',
//                   background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
//                 },
//                 '&:disabled': {
//                   background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                   opacity: 0.7
//                 },
//                 transition: 'all 0.3s ease'
//               }}
//             >
//               {loading ? (
//                 <CircularProgress size={24} sx={{ color: 'white' }} />
//               ) : (
//                 'Save Password'
//               )}
//             </Button>
//             <Button
//               fullWidth
//               variant="outlined"
//               // size="small"
//               size="large"
//               onClick={handleReset}
//               disabled={loading}
//               sx={{
//                 textTransform: 'none',
//                 fontSize: '1rem',
//                 fontWeight: 600,
//                 py: 1.3,
//                 borderColor: '#ddd',
//                 color: '#666',
//                 '&:hover': {
//                   borderColor: '#667eea',
//                   backgroundColor: 'rgba(102, 126, 234, 0.05)'
//                 },
//                 transition: 'all 0.3s ease'
//               }}
//             >
//               Cancel
//             </Button>
//           </Box>
//         </CardContent>
//       </Card>
//     </Container>
//   )
// }

// export default Settings



// import React, { useState } from 'react'
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   TextField,
//   Button,
//   Box,
//   Alert,
//   CircularProgress,
//   InputAdornment,
//   IconButton,
//   Container
// } from '@mui/material'
// import { Visibility, VisibilityOff, Lock, CheckCircle } from '@mui/icons-material'
// import { useDispatch, useSelector } from 'react-redux'
// import { changePasswordApi } from '../../app/thunkApiCalls'

// const Settings = () => {
//   const [formData, setFormData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   })
//   const [showPasswords, setShowPasswords] = useState({
//     currentPassword: false,
//     newPassword: false,
//     confirmPassword: false
//   })
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const [loading, setLoading] = useState(false)
//   const dispatch = useDispatch();
//   const userProfileDetails = useSelector((state)=>state.apiSlicer.userProfile);

//   const {id} = userProfileDetails;
//   const handleInputChange = (e) => {
//     const { name, value } = e.target
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }))
//     setError('')
//   }

//   const togglePasswordVisibility = (field) => {
//     setShowPasswords(prev => ({
//       ...prev,
//       [field]: !prev[field]
//     }))
//   }

//   const validateForm = () => {
//     setSuccess('');
//     if (!formData.currentPassword) {
//       setError('current password is required')
//       return false
//     }
//     if (!formData.newPassword) {
//       setError('New password is required')
//       return false
//     }
//     if (formData.newPassword.length < 6) {
//       setError('New password must be at least 6 characters')
//       return false
//     }
//     if (formData.newPassword !== formData.confirmPassword) {
//       setError('Passwords do not match')
//       return false
//     }
//     if (formData.currentPassword === formData.newPassword) {
//       setError('New password must be different from current password')
//       return false
//     }
//     return true
//   }

//   const handleSave = async () => {
//     if (!validateForm()) return

//     setLoading(true)
//     try {
//       // Replace with your actual API call
//       // await api.changePassword(formData)
      
//       // Simulating API call
//       // await new Promise(resolve => setTimeout(resolve, 1000))
//       const result = await dispatch(changePasswordApi({
//         url:`${import.meta.env.VITE_UPDATE_PASSWORD}/${id}`,
//         data:formData
//       }))
//       if(changePasswordApi.fulfilled.match(result)){

//         setSuccess('Password changed successfully!');
//         setFormData({
//         currentPassword: '',
//         newPassword: '',
//         confirmPassword: ''
//       });
//       // setTimeout(() => setSuccess(''), 3000)
//       }else if(changePasswordApi.rejected.match(result)){
//         // setError(err.message || 'Failed to change password')
//         //  setError(result.error?.message || "Failed to change password");
//         setSuccess('');
//         setError(result.payload || "Failed to change password");
//       }
      
//     } catch (err) {
//       setSuccess('');
//       setError(err.message || 'Failed to change password');
//     } finally {
//       setLoading(false);
      
//     }
//   }

//   const handleReset = () => {
//     setFormData({
//       currentPassword: '',
//       newPassword: '',
//       confirmPassword: ''
//     })
//     setError('')
//     setSuccess('')
//   }

//   return (
//     <Container maxWidth="sm" sx={{ py: 4 }}>
//       <Card
//         sx={{
//           boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
//           borderRadius: 2,
//           overflow: 'hidden',
//           transition: 'box-shadow 0.3s ease',
//           '&:hover': {
//             boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)'
//           }
//         }}
//       >
//         <CardHeader
//           avatar={
//             <Box
//               sx={{
//                 width: 44,
//                 height: 44,
//                 borderRadius: '50%',
//                 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center'
//               }}
//             >
//               <Lock sx={{ color: 'white', fontSize: 24 }} />
//             </Box>
//           }
//           title="Change Password"
//           subheader="Update your password to keep your account secure"
//           sx={{
//             pb: 2,
//             '& .MuiCardHeader-title': {
//               fontSize: '1.5rem',
//               fontWeight: 700,
//               color: '#1a1a1a'
//             },
//             '& .MuiCardHeader-subheader': {
//               color: '#666',
//               marginTop: 0.5,
//               fontSize: '0.95rem'
//             }
//           }}
//         />
//         <CardContent sx={{ pt: 3, pb: 3 }}>
//           {error && (
//             <Alert 
//               severity="error" 
//               sx={{ mb: 2, borderRadius: 1.5 }}
//               onClose={() => setError('')}
//             >
//               {error}
//             </Alert>
//           )}
//           {success && (
//             <Alert 
//               severity="success" 
//               sx={{ mb: 2, borderRadius: 1.5 }}
//               icon={<CheckCircle />}
//             >
//               {success}
//             </Alert>
//           )}

//           <TextField
//             fullWidth
//             label="Current Password"
//             name="currentPassword"
//             type={showPasswords.currentPassword ? 'text' : 'password'}
//             value={formData.currentPassword}
//             onChange={handleInputChange}
//             margin="normal"
//             variant="outlined"
//             placeholder="Enter your current password"
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton
//                     onClick={() => togglePasswordVisibility('currentPassword')}
//                     edge="end"
//                     size="small"
//                     tabIndex={-1}
//                   >
//                     {showPasswords.currentPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               )
//             }}
//             disabled={loading}
//             sx={{
//               '& .MuiOutlinedInput-root': {
//                 transition: 'all 0.3s ease',
//                 '&:hover fieldset': {
//                   borderColor: '#667eea'
//                 },
//                 '&.Mui-focused fieldset': {
//                   borderColor: '#667eea'
//                 }
//               }
//             }}
//           />

//           <TextField
//             fullWidth
//             label="New Password"
//             name="newPassword"
//             type={showPasswords.newPassword ? 'text' : 'password'}
//             value={formData.newPassword}
//             onChange={handleInputChange}
//             margin="normal"
//             variant="outlined"
//             placeholder="Enter your new password"
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton
//                     onClick={() => togglePasswordVisibility('newPassword')}
//                     edge="end"
//                     size="small"
//                     tabIndex={-1}
//                   >
//                     {showPasswords.newPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               )
//             }}
//             disabled={loading}
//             helperText="Minimum 6 characters"
//             sx={{
//               '& .MuiOutlinedInput-root': {
//                 transition: 'all 0.3s ease',
//                 '&:hover fieldset': {
//                   borderColor: '#667eea'
//                 },
//                 '&.Mui-focused fieldset': {
//                   borderColor: '#667eea'
//                 }
//               }
//             }}
//           />

//           <TextField
//             fullWidth
//             label="Confirm Password"
//             name="confirmPassword"
//             type={showPasswords.confirmPassword ? 'text' : 'password'}
//             value={formData.confirmPassword}
//             onChange={handleInputChange}
//             margin="normal"
//             variant="outlined"
//             placeholder="Confirm your new password"
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton
//                     onClick={() => togglePasswordVisibility('confirmPassword')}
//                     edge="end"
//                     size="small"
//                     tabIndex={-1}
//                   >
//                     {showPasswords.confirmPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               )
//             }}
//             disabled={loading}
//             sx={{
//               '& .MuiOutlinedInput-root': {
//                 transition: 'all 0.3s ease',
//                 '&:hover fieldset': {
//                   borderColor: '#667eea'
//                 },
//                 '&.Mui-focused fieldset': {
//                   borderColor: '#667eea'
//                 }
//               }
//             }}
//           />

//           <Box sx={{ display: 'flex', gap: 2, mt: 3.5 }}>
//             <Button
//               fullWidth
//               variant="contained"
//               // size="small"
//               size="large"
//               onClick={handleSave}
//               disabled={loading}
//               sx={{
//                 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                 textTransform: 'none',
//                 fontSize: '1rem',
//                 fontWeight: 600,
//                 py: 1.3,
//                 color: 'white',
//                 border: 'none',
//                 '&:hover': {
//                   boxShadow: '0 8px 16px rgba(102, 126, 234, 0.4)',
//                   transform: 'translateY(-2px)',
//                   background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
//                 },
//                 '&:disabled': {
//                   background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                   opacity: 0.7
//                 },
//                 transition: 'all 0.3s ease'
//               }}
//             >
//               {loading ? (
//                 <CircularProgress size={24} sx={{ color: 'white' }} />
//               ) : (
//                 'Save Password'
//               )}
//             </Button>
//             <Button
//               fullWidth
//               variant="outlined"
//               // size="small"
//               size="large"
//               onClick={handleReset}
//               disabled={loading}
//               sx={{
//                 textTransform: 'none',
//                 fontSize: '1rem',
//                 fontWeight: 600,
//                 py: 1.3,
//                 borderColor: '#ddd',
//                 color: '#666',
//                 '&:hover': {
//                   borderColor: '#667eea',
//                   backgroundColor: 'rgba(102, 126, 234, 0.05)'
//                 },
//                 transition: 'all 0.3s ease'
//               }}
//             >
//               Cancel
//             </Button>
//           </Box>
//         </CardContent>
//       </Card>
//     </Container>
//   )
// }

// export default Settings