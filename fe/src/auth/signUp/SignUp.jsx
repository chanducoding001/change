import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
  InputAdornment,
  Divider,
  MenuItem
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { data, useNavigate } from "react-router-dom";
import UniversalModal from "../../features/UniversalModal";
import { apiDetails, navigationLocations } from "../../utils/utils";
import { useDispatch } from "react-redux";
import { signupApi } from "../../app/thunkApiCalls";

const SignUp = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ title: "", content: "" });
  const [modalNavigation,setModalNavigation] = useState('');
  const [modalType,setModalType] = useState('info');
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* ---------------- FORM ---------------- */
  const initialValues = {
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    role: ""
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    mobile: Yup.string().required("Mobile is required"),
    password: Yup.string().min(6).required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
    role: Yup.string().required("Role is required")
  });

  /* ---------------- API ---------------- */
  
  /* ---------------- SUBMIT ---------------- */
  const onSubmit = async (values, { resetForm }) => {
    try {
      setLoading(true);

      // await signUpUser(values);
      const signupResult = await dispatch(signupApi({
        url:`${import.meta.env.VITE_SIGN_UP_URL}`,
        data:values
      }));
      if(signupApi.fulfilled.match(signupResult)){
        setModalData({
        title: "Account Created",
        content: "Welcome to the ocean flow"
      });
      setModalType('success');
      setModalNavigation(navigationLocations.LOGIN);
      resetForm();
      }else if(signupApi.rejected.match(signupResult)){
        setModalData({
        title: "Signup Failed",
        content: signupResult.payload
      });
      setModalType('error');
      }
      
      setShowModal(true);

    } catch (error) {
      setModalData({
        title: "Signup Failed",
        content: error.message
      });
      setModalType('error');
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🌊 BACKGROUND (same as login) */}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #00c6ff 0%, #0072ff 50%, #00c6ff 100%)",
          backgroundSize: "400% 400%",
          animation: "waterFlow 12s ease infinite",

          "@keyframes waterFlow": {
            "0%": { backgroundPosition: "0% 50%" },
            "50%": { backgroundPosition: "100% 50%" },
            "100%": { backgroundPosition: "0% 50%" }
          },

          "&::before": {
            content: '""',
            position: "absolute",
            width: "200%",
            height: "200%",
            top: "-50%",
            left: "-50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.15) 10%, transparent 60%)",
            animation: "floatBubbles 10s linear infinite"
          },

          "@keyframes floatBubbles": {
            "0%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-60px)" },
            "100%": { transform: "translateY(0px)" }
          }
        }}
      >
        <Container maxWidth="sm">
          {/* 🌊 GLASS CARD */}
          <Card
            sx={{
              backdropFilter: "blur(20px)",
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 4,
              boxShadow: "0 25px 80px rgba(0,0,0,0.25)",
              color: "white"
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, textAlign: "center" }}
              >
                Create Account
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  textAlign: "center",
                  opacity: 0.8,
                  mb: 2
                }}
              >
                Join the ocean flow
              </Typography>

              <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)", mb: 3 }} />

              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({ values, errors, touched, handleChange }) => (
                  <Form>

                    {/* NAME */}
                    <TextField
                      fullWidth
                      name="name"
                      label="Name"
                      value={values.name}
                      onChange={handleChange}
                      margin="normal"
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                      sx={inputStyle}
                    />

                    {/* EMAIL */}
                    <TextField
                      fullWidth
                      name="email"
                      label="Email"
                      value={values.email}
                      onChange={handleChange}
                      margin="normal"
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      sx={inputStyle}
                    />

                    {/* MOBILE */}
                    <TextField
                      fullWidth
                      name="mobile"
                      label="Mobile"
                      value={values.mobile}
                      onChange={handleChange}
                      margin="normal"
                      error={touched.mobile && Boolean(errors.mobile)}
                      helperText={touched.mobile && errors.mobile}
                      sx={inputStyle}
                    />

                    {/* PASSWORD */}
                    <TextField
                      fullWidth
                      name="password"
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      value={values.password}
                      onChange={handleChange}
                      margin="normal"
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                      sx={inputStyle}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowPassword((p) => !p)
                              }
                              sx={{ color: "white" }}
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />

                    {/* CONFIRM PASSWORD */}
                    <TextField
                      fullWidth
                      name="confirmPassword"
                      label="Confirm Password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={values.confirmPassword}
                      onChange={handleChange}
                      margin="normal"
                      error={
                        touched.confirmPassword &&
                        Boolean(errors.confirmPassword)
                      }
                      helperText={
                        touched.confirmPassword &&
                        errors.confirmPassword
                      }
                      sx={inputStyle}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowConfirmPassword((p) => !p)
                              }
                              sx={{ color: "white" }}
                            >
                              {showConfirmPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />

                    {/* ROLE */}
                    <TextField
                      select
                      fullWidth
                      name="role"
                      label="Role"
                      value={values.role}
                      onChange={handleChange}
                      margin="normal"
                      sx={inputStyle}
                    >
                      <MenuItem value="">Select Role</MenuItem>
                      <MenuItem value="user">User</MenuItem>
                      {/* <MenuItem value="admin">Admin</MenuItem> */}
                    </TextField>

                    {/* BUTTON */}
                    <Button
                      fullWidth
                      type="submit"
                      disabled={loading}
                      sx={{
                        mt: 3,
                        py: 1.4,
                        borderRadius: 2,
                        fontWeight: "bold",
                        color: "white",
                        background:
                          "linear-gradient(135deg, #00c6ff, #0072ff)",
                        boxShadow:
                          "0 10px 30px rgba(0, 198, 255, 0.4)",
                        "&:hover": {
                          transform: "translateY(-2px)"
                        }
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={22} sx={{ color: "white" }} />
                      ) : (
                        "Sign Up"
                      )}
                    </Button>

                    {/* LOGIN NAVIGATION */}
                    <Button
                      fullWidth
                      onClick={() => navigate("/login")}
                      sx={{
                        mt: 1,
                        color: "white",
                        opacity: 0.85,
                        textTransform: "none"
                      }}
                    >
                      Already have an account? Login
                    </Button>
                  </Form>
                )}
              </Formik>
            </CardContent>
          </Card>
        </Container>
      </Box>

      {/* MODAL */}
      <UniversalModal
        modalData={modalData}
        setModalData={setModalData}
        showModal={showModal}
        setShowModal={setShowModal}
        type={modalType}
        setModalType={setModalType}
        navigateLocation={modalNavigation}
      />
    </>
  );
};

export default SignUp;

/* ---------------- INPUT STYLE ---------------- */
export const inputStyle = {
  input: { color: "white" },
  label: { color: "rgba(255,255,255,0.8)" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.6)" },
    "&.Mui-focused fieldset": { borderColor: "#00c6ff" }
  }
};



// import React, { useState } from "react";
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Container,
//   TextField,
//   Typography,
//   MenuItem,
//   CircularProgress,
//   Divider,
//   IconButton,
//   InputAdornment
// } from "@mui/material";

// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import { Formik, Form } from "formik";
// import * as Yup from "yup";
// import { useNavigate } from "react-router-dom";
// import UniversalModal from "../../features/UniversalModal";
// import { apiDetails } from "../../utils/utils";

// const SignUp = () => {
//   const navigate = useNavigate();

//   const [showModal, setShowModal] = useState(false);
//   const [modalData, setModalData] = useState({ title: "", content: "" });

//   const [loading, setLoading] = useState(false);

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const initialValues = {
//     name: "",
//     email: "",
//     mobile: "",
//     password: "",
//     confirmPassword: "",
//     role: ""
//   };

//   const validationSchema = Yup.object({
//     name: Yup.string().required("Name is required"),
//     email: Yup.string().email("Invalid email").required("Email is required"),
//     mobile: Yup.string().required("Phone number is required"),
//     password: Yup.string().min(6).required("Password is required"),
//     confirmPassword: Yup.string()
//       .oneOf([Yup.ref("password")])
//       .required("Confirm password is required"),
//     role: Yup.string().required("Role is required")
//   });

//   const signUpUser = async (obj) => {
//     const response = await fetch(apiDetails.signUpUrl, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(obj)
//     });

//     const data = await response.json();

//     if (!response.ok) throw new Error(data.message || "Signup failed");

//     return data;
//   };

//   const onSubmit = async (values, { resetForm }) => {
//     try {
//       setLoading(true);
//       await signUpUser(values);

//       setModalData({
//         title: "Welcome to the Ocean 🌊",
//         content: "Account created successfully"
//       });

//       setShowModal(true);
//       resetForm();

//       setTimeout(() => navigate("/login"), 1000);
//     } catch (error) {
//       setModalData({
//         title: "Wave Disrupted 🌊",
//         content: error.message
//       });
//       setShowModal(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box className="oceanBackground" onClick={(e) => createRipple(e)}>
//       {/* LIGHT RAYS */}
//       <div className="lightRays"></div>

//       {/* BUBBLES */}
//       {createBubbles()}

//       {/* PARTICLES */}
//       {createParticles()}

//       <Container maxWidth="sm" sx={{ zIndex: 2 }}>
//         <Card className="glassCard">
//           <CardContent>
//             <Typography variant="h5" sx={{ textAlign: "center", fontWeight: 700 }}>
//               Enter the Ocean Portal 🌊
//             </Typography>

//             <Typography variant="body2" sx={{ textAlign: "center", color: "gray", mb: 2 }}>
//               Where energy flows like water
//             </Typography>

//             <Divider sx={{ mb: 2 }} />

//             <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
//               {({ values, errors, touched, handleChange }) => (
//                 <Form>
//                   <TextField fullWidth name="name" label="Name" value={values.name} onChange={handleChange} margin="normal" />

//                   <TextField fullWidth name="email" label="Email" value={values.email} onChange={handleChange} margin="normal" />

//                   <TextField fullWidth name="mobile" label="Mobile" value={values.mobile} onChange={handleChange} margin="normal" />

//                   <TextField
//                     fullWidth
//                     name="password"
//                     label="Password"
//                     type={showPassword ? "text" : "password"}
//                     value={values.password}
//                     onChange={handleChange}
//                     margin="normal"
//                     InputProps={{
//                       endAdornment: (
//                         <InputAdornment position="end">
//                           <IconButton onClick={() => setShowPassword((p) => !p)}>
//                             {showPassword ? <VisibilityOff /> : <Visibility />}
//                           </IconButton>
//                         </InputAdornment>
//                       )
//                     }}
//                   />

//                   <TextField
//                     fullWidth
//                     name="confirmPassword"
//                     label="Confirm Password"
//                     type={showConfirmPassword ? "text" : "password"}
//                     value={values.confirmPassword}
//                     onChange={handleChange}
//                     margin="normal"
//                     InputProps={{
//                       endAdornment: (
//                         <InputAdornment position="end">
//                           <IconButton onClick={() => setShowConfirmPassword((p) => !p)}>
//                             {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
//                           </IconButton>
//                         </InputAdornment>
//                       )
//                     }}
//                   />

//                   <TextField select fullWidth name="role" label="Role" value={values.role} onChange={handleChange} margin="normal">
//                     <MenuItem value="">Select Role</MenuItem>
//                     <MenuItem value="user">User</MenuItem>
//                     <MenuItem value="admin">Admin</MenuItem>
//                   </TextField>

//                   <Button fullWidth type="submit" variant="contained" disabled={loading} className="oceanButton">
//                     {loading ? <CircularProgress size={22} sx={{ color: "white" }} /> : "Dive In"}
//                   </Button>
//                 </Form>
//               )}
//             </Formik>
//           </CardContent>
//         </Card>
//       </Container>

//       <UniversalModal modalData={modalData} setModalData={setModalData} showModal={showModal} setShowModal={setShowModal} />
//     </Box>
//   );
// };

// export default SignUp;

// /* ===================== HELPERS ===================== */

// const createBubbles = () => {
//   return Array.from({ length: 20 }).map((_, i) => (
//     <span
//       key={i}
//       className="bubble"
//       style={{
//         left: Math.random() * 100 + "%",
//         width: Math.random() * 30 + 10 + "px",
//         height: Math.random() * 30 + 10 + "px",
//         animationDuration: 8 + Math.random() * 10 + "s",
//         animationDelay: Math.random() * 5 + "s"
//       }}
//     />
//   ));
// };

// const createParticles = () => {
//   return Array.from({ length: 25 }).map((_, i) => (
//     <span
//       key={i}
//       className="particle"
//       style={{
//         left: Math.random() * 100 + "%",
//         top: Math.random() * 100 + "%",
//         animationDuration: 6 + Math.random() * 10 + "s"
//       }}
//     />
//   ));
// };

// const createRipple = (e) => {
//   const ripple = document.createElement("span");
//   ripple.className = "ripple";

//   const rect = e.currentTarget.getBoundingClientRect();
//   ripple.style.left = e.clientX - rect.left + "px";
//   ripple.style.top = e.clientY - rect.top + "px";

//   e.currentTarget.appendChild(ripple);

//   setTimeout(() => ripple.remove(), 1200);
// };




// import React, { useState } from "react";
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Container,
//   TextField,
//   Typography,
//   MenuItem,
//   CircularProgress,
//   Divider,
//   IconButton,
//   InputAdornment
// } from "@mui/material";

// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import { Formik, Form } from "formik";
// import * as Yup from "yup";
// import { useNavigate } from "react-router-dom";
// import UniversalModal from "../../features/UniversalModal";
// import { apiDetails } from "../../utils/utils";

// const SignUp = () => {
//   const navigate = useNavigate();

//   const [showModal, setShowModal] = useState(false);
//   const [modalData, setModalData] = useState({
//     title: "",
//     content: ""
//   });

//   const [loading, setLoading] = useState(false);

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const initialValues = {
//     name: "",
//     email: "",
//     mobile: "",
//     password: "",
//     confirmPassword: "",
//     role: ""
//   };

//   const validationSchema = Yup.object({
//     name: Yup.string().required("Name is required"),
//     email: Yup.string().email("Invalid email").required("Email is required"),
//     mobile: Yup.string().required("Phone number is required"),
//     password: Yup.string()
//       .min(6, "Minimum 6 characters")
//       .required("Password is required"),
//     confirmPassword: Yup.string()
//       .oneOf([Yup.ref("password")], "Passwords must match")
//       .required("Confirm password is required"),
//     role: Yup.string().required("Role is required")
//   });

//   const signUpUser = async (obj) => {
//     const response = await fetch(apiDetails.signUpUrl, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(obj)
//     });

//     const data = await response.json();

//     if (!response.ok) throw new Error(data.message || "Signup failed");

//     return data;
//   };

//   const onSubmit = async (values, { resetForm }) => {
//     try {
//       setLoading(true);

//       await signUpUser(values);

//       setModalData({
//         title: "Signup Successful",
//         content: "Account created successfully"
//       });

//       setShowModal(true);

//       resetForm();

//       setTimeout(() => navigate("/login"), 800);
//     } catch (error) {
//       setModalData({
//         title: "Signup Failed",
//         content: error.message
//       });

//       setShowModal(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         background: "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)"
//       }}
//     >
//       <Container maxWidth="sm">
//         <Card
//           sx={{
//             backdropFilter: "blur(20px)",
//             background: "rgba(255,255,255,0.9)",
//             borderRadius: 4,
//             boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
//             p: 2
//           }}
//         >
//           <CardContent>
//             <Typography
//               variant="h5"
//               sx={{ fontWeight: 700, textAlign: "center" }}
//             >
//               Create Account
//             </Typography>

//             <Typography
//               variant="body2"
//               sx={{
//                 textAlign: "center",
//                 color: "gray",
//                 mb: 2
//               }}
//             >
//               Join us and get started
//             </Typography>

//             <Divider sx={{ mb: 3 }} />

//             <Formik
//               initialValues={initialValues}
//               validationSchema={validationSchema}
//               onSubmit={onSubmit}
//             >
//               {({
//                 values,
//                 errors,
//                 touched,
//                 handleChange
//               }) => (
//                 <Form>
//                   <TextField
//                     fullWidth
//                     name="name"
//                     label="Name"
//                     value={values.name}
//                     onChange={handleChange}
//                     margin="normal"
//                     error={touched.name && Boolean(errors.name)}
//                     helperText={touched.name && errors.name}
//                   />

//                   <TextField
//                     fullWidth
//                     name="email"
//                     label="Email"
//                     value={values.email}
//                     onChange={handleChange}
//                     margin="normal"
//                     error={touched.email && Boolean(errors.email)}
//                     helperText={touched.email && errors.email}
//                   />

//                   <TextField
//                     fullWidth
//                     name="mobile"
//                     label="Mobile"
//                     value={values.mobile}
//                     onChange={handleChange}
//                     margin="normal"
//                   />

//                   {/* PASSWORD */}
//                   <TextField
//                     fullWidth
//                     name="password"
//                     label="Password"
//                     type={showPassword ? "text" : "password"}
//                     value={values.password}
//                     onChange={handleChange}
//                     margin="normal"
//                     error={
//                       touched.password && Boolean(errors.password)
//                     }
//                     helperText={
//                       touched.password && errors.password
//                     }
//                     InputProps={{
//                       endAdornment: (
//                         <InputAdornment position="end">
//                           <IconButton
//                             onClick={() =>
//                               setShowPassword((p) => !p)
//                             }
//                           >
//                             {showPassword ? (
//                               <VisibilityOff />
//                             ) : (
//                               <Visibility />
//                             )}
//                           </IconButton>
//                         </InputAdornment>
//                       )
//                     }}
//                   />

//                   {/* CONFIRM PASSWORD */}
//                   <TextField
//                     fullWidth
//                     name="confirmPassword"
//                     label="Confirm Password"
//                     type={showConfirmPassword ? "text" : "password"}
//                     value={values.confirmPassword}
//                     onChange={handleChange}
//                     margin="normal"
//                     error={
//                       touched.confirmPassword &&
//                       Boolean(errors.confirmPassword)
//                     }
//                     helperText={
//                       touched.confirmPassword &&
//                       errors.confirmPassword
//                     }
//                     InputProps={{
//                       endAdornment: (
//                         <InputAdornment position="end">
//                           <IconButton
//                             onClick={() =>
//                               setShowConfirmPassword((p) => !p)
//                             }
//                           >
//                             {showConfirmPassword ? (
//                               <VisibilityOff />
//                             ) : (
//                               <Visibility />
//                             )}
//                           </IconButton>
//                         </InputAdornment>
//                       )
//                     }}
//                   />

//                   {/* ROLE */}
//                   <TextField
//                     select
//                     fullWidth
//                     name="role"
//                     label="Role"
//                     value={values.role}
//                     onChange={handleChange}
//                     margin="normal"
//                   >
//                     <MenuItem value="">Select Role</MenuItem>
//                     <MenuItem value="user">User</MenuItem>
//                     <MenuItem value="admin">Admin</MenuItem>
//                   </TextField>

//                   <Button
//                     fullWidth
//                     type="submit"
//                     variant="contained"
//                     disabled={loading}
//                     sx={{
//                       mt: 3,
//                       py: 1.3,
//                       borderRadius: 2,
//                       background:
//                         "linear-gradient(135deg, #667eea, #764ba2)"
//                     }}
//                   >
//                     {loading ? (
//                       <CircularProgress size={22} sx={{ color: "white" }} />
//                     ) : (
//                       "Sign Up"
//                     )}
//                   </Button>

//                   <Button
//                     fullWidth
//                     onClick={() => navigate("/login")}
//                     sx={{
//                       mt: 1,
//                       color: "#667eea",
//                       textTransform: "none"
//                     }}
//                   >
//                     Already have an account? Login
//                   </Button>
//                 </Form>
//               )}
//             </Formik>
//           </CardContent>
//         </Card>
//       </Container>

//       <UniversalModal
//         modalData={modalData}
//         setModalData={setModalData}
//         showModal={showModal}
//         setShowModal={setShowModal}
//         navigateLocation="/login"
//       />
//     </Box>
//   );
// };

// export default SignUp;



// import React, { useState } from "react";
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Container,
//   TextField,
//   Typography,
//   MenuItem,
//   CircularProgress,
//   Divider
// } from "@mui/material";
// import { Formik, Form } from "formik";
// import * as Yup from "yup";
// import { useNavigate } from "react-router-dom";
// import UniversalModal from "../../features/UniversalModal";
// import { apiDetails } from "../../utils/utils";

// const SignUp = () => {
//   const navigate = useNavigate();

//   const [showModal, setShowModal] = useState(false);
//   const [modalData, setModalData] = useState({
//     title: "",
//     content: ""
//   });
//   const [loading, setLoading] = useState(false);

//   const initialValues = {
//     name: "",
//     email: "",
//     mobile: "",
//     password: "",
//     confirmPassword: "",
//     role: ""
//   };

//   const validationSchema = Yup.object({
//     name: Yup.string().required("Name is required"),
//     email: Yup.string().email("Invalid email").required("Email is required"),
//     mobile: Yup.string().required("Phone number is required"),
//     password: Yup.string()
//       .min(6, "Minimum 6 characters")
//       .required("Password is required"),
//     confirmPassword: Yup.string()
//       .oneOf([Yup.ref("password")], "Passwords must match")
//       .required("Confirm password is required"),
//     role: Yup.string().required("Role is required")
//   });

//   const signUpUser = async (obj) => {
//     const response = await fetch(apiDetails.signUpUrl, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(obj)
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || "Signup failed");
//     }

//     return data;
//   };

//   const onSubmit = async (values, { resetForm }) => {
//     try {
//       setLoading(true);

//       const result = await signUpUser(values);

//       setModalData({
//         title: "Signup Successful",
//         content: "Your account has been created successfully"
//       });
//       setShowModal(true);

//       resetForm();

//       setTimeout(() => {
//         navigate("/login");
//       }, 800);
//     } catch (error) {
//       setModalData({
//         title: "Signup Failed",
//         content: error.message
//       });
//       setShowModal(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container
//       maxWidth="sm"
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         background: "linear-gradient(135deg, #eef2f3, #dfe9f3)"
//       }}
//     >
//       <Card
//         sx={{
//           width: "100%",
//           borderRadius: 4,
//           boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
//           p: 2
//         }}
//       >
//         <CardContent>
//           <Typography
//             variant="h5"
//             sx={{ fontWeight: 700, textAlign: "center", mb: 1 }}
//           >
//             Create Account
//           </Typography>

//           <Typography
//             variant="body2"
//             sx={{ textAlign: "center", color: "gray", mb: 3 }}
//           >
//             Sign up to get started
//           </Typography>

//           <Divider sx={{ mb: 3 }} />

//           <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             onSubmit={onSubmit}
//           >
//             {({
//               values,
//               errors,
//               touched,
//               handleChange,
//               handleBlur
//             }) => (
//               <Form>
//                 <TextField
//                   fullWidth
//                   name="name"
//                   label="Name"
//                   value={values.name}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={touched.name && Boolean(errors.name)}
//                   helperText={touched.name && errors.name}
//                   margin="normal"
//                 />

//                 <TextField
//                   fullWidth
//                   name="email"
//                   label="Email"
//                   value={values.email}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={touched.email && Boolean(errors.email)}
//                   helperText={touched.email && errors.email}
//                   margin="normal"
//                 />

//                 <TextField
//                   fullWidth
//                   name="mobile"
//                   label="Mobile"
//                   value={values.mobile}
//                   onChange={handleChange}
//                   margin="normal"
//                 />

//                 <TextField
//                   fullWidth
//                   type="password"
//                   name="password"
//                   label="Password"
//                   value={values.password}
//                   onChange={handleChange}
//                   error={touched.password && Boolean(errors.password)}
//                   helperText={touched.password && errors.password}
//                   margin="normal"
//                 />

//                 <TextField
//                   fullWidth
//                   type="password"
//                   name="confirmPassword"
//                   label="Confirm Password"
//                   value={values.confirmPassword}
//                   onChange={handleChange}
//                   error={
//                     touched.confirmPassword &&
//                     Boolean(errors.confirmPassword)
//                   }
//                   helperText={
//                     touched.confirmPassword && errors.confirmPassword
//                   }
//                   margin="normal"
//                 />

//                 <TextField
//                   select
//                   fullWidth
//                   name="role"
//                   label="Role"
//                   value={values.role}
//                   onChange={handleChange}
//                   margin="normal"
//                 >
//                   <MenuItem value="">Select Role</MenuItem>
//                   <MenuItem value="user">User</MenuItem>
//                   <MenuItem value="admin">Admin</MenuItem>
//                 </TextField>

//                 <Button
//                   fullWidth
//                   type="submit"
//                   variant="contained"
//                   disabled={loading}
//                   sx={{
//                     mt: 3,
//                     py: 1.3,
//                     borderRadius: 2,
//                     background:
//                       "linear-gradient(135deg, #667eea, #764ba2)",
//                     fontWeight: 600,
//                     textTransform: "none"
//                   }}
//                 >
//                   {loading ? (
//                     <CircularProgress size={22} sx={{ color: "white" }} />
//                   ) : (
//                     "Sign Up"
//                   )}
//                 </Button>

//                 <Button
//                   fullWidth
//                   onClick={() => navigate("/login")}
//                   sx={{
//                     mt: 1,
//                     textTransform: "none",
//                     color: "#667eea"
//                   }}
//                 >
//                   Already have an account? Login
//                 </Button>
//               </Form>
//             )}
//           </Formik>
//         </CardContent>
//       </Card>

//       <UniversalModal
//         modalData={modalData}
//         setModalData={setModalData}
//         showModal={showModal}
//         setShowModal={setShowModal}
//         navigateLocation="/login"
//       />
//     </Container>
//   );
// };

// export default SignUp;




// import React from "react";
// import TextField from "@mui/material/TextField";
// import {
//   Box,
//   Button,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   Slide,
// } from "@mui/material";
// import { ErrorMessage, Field, Form, Formik } from "formik";
// import ReusableTextField from "../../reusables/ReusableTextField";
// import * as Yup from "yup";
// import ReusableButtonContainer from "../../reusables/ReusableButtonContainer";
// import "../authStyles.css";
// import ReusableSelectField from "../../reusables/ReusableSelectField";
// import { PersonPinCircleOutlined } from "@mui/icons-material";
// import PersonIcon from "@mui/icons-material/Person";
// import { apiDetails } from "../../utils/utils";
// import { useState } from "react";
// import UniversalModal from "../../features/UniversalModal";
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const SignUp = () => {
//   const [showModal,setShowModal] = useState(false);
//   const [modalData,setModalData] = useState({
//     title:'',
//     content:''
//   });
//   const navigate = useNavigate();

  
//   const initialValues = {
//     name: "",
//     email: "",
//     mobile: "",
//     password: "",
//     confirmPassword: "",
//     role: "",
//     // isEmailVerified: false,
//   };
//   const validationSchema = Yup.object().shape({
//     name: Yup.string().required("enter user name"),
//     email: Yup.string().email("invalid email").required("enter email"),
//     // phone number for us, uk, australia and india
//     mobile: Yup.string()
//       .matches(
//         /^(\+1\d{10}|\+44\d{10}|\+61\d{9}|\+91\d{10})$/,
//         "Enter a valid phone number with country code",
//       )
//       .required("Enter phone number"),
//     password: Yup.string()
//       .min(6, "password must be at least 6 characters")
//       .required("enter password"),
//     confirmPassword: Yup.string()
//       .oneOf([Yup.ref("password"), null], "passwords must match")
//       .required("confirm password"),
//     role: Yup.string().required("select role"),
//     // isEmailVerified: Yup.boolean().oneOf(
//     //   [true],
//     //   "Email should be authenticated!",
//     // ),
//   });
//   const onReset = (data, { resetForm }) => {
//     console.log("form reset", data);
//     resetForm();
//   };
//   // const signUpUser = async (obj) => {
//   //   try {
//   //     const response = await fetch(apiDetails.signUpUrl, {
//   //       method: "POST",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //       },
//   //       body: JSON.stringify(obj),
//   //     });

//   //     const data = await response.json();

//   //     if (!response.ok) {
//   //       throw new Error(data.message || "Signup failed");
//   //     }

//   //     console.log("Signup Success:", data);
//   //     return data;
//   //   } catch (error) {
//   //     console.error("Signup Error:", error.message);
//   //     throw error;
//   //   }
//   // };
//   // const onSubmit = async (values, { resetForm }) => {
//   //   console.log(values);
//   //   // call api to register the user
//   //   const data = await signUpUser(values);
//   //   if (data?.success === true) {
//   //     console.log("api success", data);
//   //     setShowModal(true);
//   //     setModalData({
//   //       title:"Sign Up Successful!",
//   //       content:"Now you could login successfully in the next page."
//   //     });
//   //     resetForm();
//   //   } else {
//   //     console.log("api call failed", data);
//   //     setShowModal(false);
//   //     setModalData({
//   //       title:"Sign Up  un successful!",
//   //       content:data
//   //     });
//   //   }
//   // };
  
//   const signUpUser = async (obj) => {
//   try {
//     const controller = new AbortController();

//     const timeout = setTimeout(() => {
//       controller.abort();
//     }, 10000); // 10 seconds

//     const response = await fetch(apiDetails.signUpUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(obj),
//       signal: controller.signal,
//     });

//     clearTimeout(timeout);

//     let data;

//     try {
//       data = await response.json();
//     } catch {
//       throw new Error("Invalid response received from server");
//     }

//     if (!response.ok) {
//       switch (response.status) {
//         case 400:
//           throw new Error(data.message || "Invalid request");

//         case 401:
//           throw new Error("Unauthorized");

//         case 403:
//           throw new Error("Access denied");

//         case 404:
//           throw new Error("API endpoint not found");

//         case 409:
//           throw new Error(data.message || "User already exists");

//         case 500:
//           throw new Error("Internal server error");

//         default:
//           throw new Error(
//             data.message || `Request failed (${response.status})`
//           );
//       }
//     }

//     return {
//       success: true,
//       data,
//     };
//   } catch (error) {
//     if (error.name === "AbortError") {
//       throw new Error(
//         "Request timeout. Server took too long to respond."
//       );
//     }

//     if (
//       error.message === "Failed to fetch" ||
//       error.message.includes("NetworkError")
//     ) {
//       throw new Error(
//         "Cannot connect to server. Please check your internet connection or backend server."
//       );
//     }

//     throw error;
//   }
// };
// const onSubmit = async (values, { resetForm }) => {
//   try {
//     const result = await signUpUser(values);

//     if (result.success) {
//       setShowModal(true);

//       setModalData({
//         title: "Sign Up Successful!",
//         content:
//           "Your account has been created successfully.",
//       });
//       resetForm();
//     }
//   } catch (error) {
//     console.error(error);

//     setShowModal(true);

//     setModalData({
//       title: "Sign Up Failed",
//       content: error.message,
//     });
//   }
// };
//   const handleChange = (event, setFieldValue) => {
//     const { name, value } = event.target;
//     setFieldValue(name, value);
//   };
//   const inputStyles = {
//     width: "30%",
//   };
 
//   return (
//     <>
//       <Formik
//         initialValues={initialValues}
//         validationSchema={validationSchema}
//         onSubmit={onSubmit}
//       >
//         {({
//           resetForm,
//           values,
//           isValid,
//           touched,
//           errors,
//           setFieldValue,
//           setFieldTouched,
//         }) => (
//           <Form className="formContainerStyles">
//             <h3 className="authHeadingStyles">Sign Up page</h3>
//             <Box className="fieldContainerStyles">
//               <ReusableTextField
//                 errorMessage="enter user name"
//                 type="text"
//                 onChange={handleChange}
//                 label="User Name"
//                 name="name"
//                 variant="outlined"
//                 as={TextField}
//                 size="small"
//                 icon={<PersonIcon />}
//               />
//               <ReusableTextField
//                 type="email"
//                 onChange={handleChange}
//                 errorMessage="enter email"
//                 label="Email"
//                 name="email"
//                 variant="outlined"
//                 as={TextField}
//                 size="small"
//               />

//               <ReusableTextField
//                 type="text"
//                 onChange={handleChange}
//                 errorMessage="enter phone number"
//                 label="Phone Number"
//                 name="mobile"
//                 variant="outlined"
//                 as={TextField}
//                 size="small"
//               />

//               <ReusableTextField
//                 type="password"
//                 onChange={handleChange}
//                 errorMessage="enter password"
//                 label="Password"
//                 name="password"
//                 variant="outlined"
//                 as={TextField}
//                 size="small"
//               />
//               <ReusableTextField
//                 type="password"
//                 onChange={handleChange}
//                 errorMessage="enter password"
//                 label="Confirm Password"
//                 name="confirmPassword"
//                 variant="outlined"
//                 as={TextField}
//                 size="small"
//               />
//               <ReusableSelectField
//                 as={Select}
//                 name="role"
//                 label="Role"
//                 inputLabel="Role"
//                 menuItems={[
//                   { value: "", label: "Select Role", disabled: true },
//                   { value: "user", label: "User" },
//                   { value: "admin", label: "Admin" },
//                 ]}
//                 size="small"
//               />
//               {/* <SlideInDialog
//                 values={
//                   isAllFieldsFilledExceptEmail(values)
//                     ? values
//                     : null
//                 }
//                 name="isEmailVerified"
//                 setFieldValue={setFieldValue}
//                 setFieldTouched={setFieldTouched}
//               /> */}

//               <ReusableButtonContainer
//                 resetForm={resetForm}
//                 initialValues={initialValues}
//                 // content = {{mainBtn:'Sign Up',}}
//                 content = {{
//                   mainBtn:'Sign Up',
//                   navigateBtn:'Go to Login',
//                   onClick:()=>{
//                     navigate('/login')
//                   }
//                 }}
//               />
//             </Box>
//           </Form>
//         )}
//       </Formik>
//       <UniversalModal 
//       modalData={modalData} 
//       setModalData={setModalData}  
//       showModal={showModal}
//       setShowModal={setShowModal}
//       navigateLocation="/login"
//       />
//     </>
//   );
// };

// export default SignUp;
