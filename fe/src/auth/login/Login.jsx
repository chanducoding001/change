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
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { data, useNavigate } from "react-router-dom";
import UniversalModal from "../../features/UniversalModal";
import { apiDetails, navigationLocations, ROLES } from "../../utils/utils";
import { inputStyle } from "../signUp/SignUp";
import { useDispatch } from "react-redux";
import { loginApi } from "../../app/thunkApiCalls";
import { setUser } from "../../app/apiSlicer";

const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    title: "",
    content: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [redirectPath, setRedirectPath] = useState("");
  const [modalType, setModalType] = useState("info");
  const dispatch = useDispatch();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Minimum 6 characters")
      .required("Password is required"),
  });


  const onSubmit = async (values, { resetForm }) => {
    try {
      setLoading(true);

      // const result = await loginUser(values);
      const loginResult = await dispatch(
        loginApi({
          url: `${import.meta.env.VITE_LOGIN_URL}`,
          data: values,
        }),
      );
      if (loginApi.fulfilled.match(loginResult)) {
        // console.log("login", loginResult.payload);
        const loginUser = loginResult.payload?.user
        const loginUserRole = loginResult.payload?.user?.role;
        localStorage.setItem(
          "user",
          JSON.stringify({
            token: loginResult.payload.token,
            role: loginResult.payload.user.role,
            id: loginResult.payload.user.id,
          }),
        );
        // load the userProfile
        const profileData = {
          ...loginUser
        };
        dispatch(setUser(profileData));
        setModalData({
          title: "Welcome Back!",
          content: "Login successful",
        });
        setRedirectPath(
          loginUserRole === ROLES.ADMIN
            ? navigationLocations.ADMINDASHBOARD
            : navigationLocations.USERDASHBOARD,
        );
        setModalType("success");

        resetForm();
      }else if(loginApi.rejected.match(loginResult)){
        console.log('error',loginResult.payload);
        
        setModalData({
          title: "Login Failed",
          content: loginResult.payload,
        });
        setModalType("error");
      }
        setShowModal(true);
    } catch (error) {
      setModalType("error");
      setModalData({
        title: "Login Failed",
        content: error.message,
      });

      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/*  Animated Water Background */}
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
            "100%": { backgroundPosition: "0% 50%" },
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
            animation: "floatBubbles 10s linear infinite",
          },

          "@keyframes floatBubbles": {
            "0%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-50px)" },
            "100%": { transform: "translateY(0px)" },
          },
        }}
      >
        <Container maxWidth="sm">
          {/*  Glass Card */}
          <Card
            sx={{
              backdropFilter: "blur(20px)",
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 4,
              boxShadow: "0 25px 80px rgba(0,0,0,0.25)",
              color: "white",
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                Welcome Back
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  textAlign: "center",
                  opacity: 0.8,
                  mb: 2,
                }}
              >
                Login to continue your journey
              </Typography>

              <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)", mb: 3 }} />

              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({ values, errors, touched, handleChange }) => (
                  <Form>
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
                      // sx={{
                      //   input: { color: "white" },
                      //   label: { color: "rgba(255,255,255,0.8)" }
                      // }}
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
                      // sx={{
                      //   input: { color: "white" },
                      //   label: { color: "rgba(255,255,255,0.8)" }
                      // }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword((p) => !p)}
                              sx={{ color: "white" }}
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    {/* LOGIN BUTTON */}
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
                        background: "linear-gradient(135deg, #00c6ff, #0072ff)",
                        boxShadow: "0 10px 30px rgba(0, 198, 255, 0.4)",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 15px 40px rgba(0, 198, 255, 0.6)",
                        },
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={22} sx={{ color: "white" }} />
                      ) : (
                        "Login"
                      )}
                    </Button>

                    {/* SIGNUP BUTTON */}
                    <Button
                      fullWidth
                      onClick={() => navigate("/signUp")}
                      sx={{
                        mt: 1,
                        color: "white",
                        textTransform: "none",
                        opacity: 0.9,
                      }}
                    >
                      Don’t have an account? Sign Up
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
        navigateLocation={redirectPath}
        modalType={modalType}
        setModalType={setModalType}
      />
    </>
  );
};

export default Login;







// import React, { useState } from "react";
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Container,
//   TextField,
//   Typography,
//   Divider,
//   CircularProgress
// } from "@mui/material";
// import { Formik, Form } from "formik";
// import * as Yup from "yup";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { setUser } from "../../app/apiSlicer";
// import UniversalModal from "../../features/UniversalModal";
// import { apiDetails } from "../../utils/utils";

// const Login = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [showModal, setShowModal] = useState(false);
//   const [modalData, setModalData] = useState({ title: "", content: "" });
//   const [loading, setLoading] = useState(false);

//   const initialValues = {
//     email: "",
//     password: ""
//   };

//   const validationSchema = Yup.object({
//     email: Yup.string().email("Invalid email").required("Email is required"),
//     password: Yup.string()
//       .min(6, "Minimum 6 characters")
//       .required("Password is required")
//   });

//   const loginUser = async (obj) => {
//     const response = await fetch(apiDetails.loginUrl, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(obj)
//     });

//     const data = await response.json();

//     if (!response.ok) throw new Error(data.message || "Login failed");

//     return data;
//   };

//   const onSubmit = async (values, { resetForm }) => {
//     try {
//       setLoading(true);

//       const result = await loginUser(values);

//       setModalData({
//         title: "Login Successful",
//         content: "Welcome back!"
//       });
//       setShowModal(true);

//       const localUser = {
//         token: result?.data?.token,
//         role: result?.data?.user?.role,
//         id: result?.data?.user?.id
//       };

//       localStorage.setItem("user", JSON.stringify(localUser));
//       dispatch(setUser(result?.data?.user));

//       resetForm();

//       setTimeout(() => {
//         if (result?.data?.user?.role === "admin") {
//           navigate("/admin/dashboard");
//         } else {
//           navigate("/user/dashboard");
//         }
//       }, 800);
//     } catch (error) {
//       setModalData({
//         title: "Login Failed",
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
//         // background: "linear-gradient(135deg, #eef2f3, #dfe9f3)"
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
//             Welcome Back
//           </Typography>

//           <Typography
//             variant="body2"
//             sx={{ textAlign: "center", color: "gray", mb: 3 }}
//           >
//             Login to continue
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
//                   type="password"
//                   name="password"
//                   label="Password"
//                   value={values.password}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={touched.password && Boolean(errors.password)}
//                   helperText={touched.password && errors.password}
//                   margin="normal"
//                 />

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
//                     "Login"
//                   )}
//                 </Button>

//                 <Button
//                   fullWidth
//                   onClick={() => navigate("/signUp")}
//                   sx={{
//                     mt: 1,
//                     textTransform: "none",
//                     color: "#667eea"
//                   }}
//                 >
//                   Don't have an account? Sign Up
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
//       />
//     </Container>
//   );
// };

// export default Login;

// import React from "react";
// import TextField from "@mui/material/TextField";
// import {
//   Box,
//   Button,
//   Fab,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   Slide,
// } from "@mui/material";
// import NavigationIcon from "@mui/icons-material/Navigation";
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
// import { useDispatch } from "react-redux";
// import { setUser } from "../../app/apiSlicer";

// const Login = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [modalData, setModalData] = useState({
//     title: "",
//     content: "",
//   });
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const initialValues = {
//     email: "",
//     password: "",
//   };
//   const validationSchema = Yup.object().shape({
//     email: Yup.string().email("invalid email").required("enter email"),
//     password: Yup.string()
//       .min(6, "password must be at least 6 characters")
//       .required("enter password"),
//   });
//   const onReset = (data, { resetForm }) => {
//     console.log("form reset", data);
//     resetForm();
//   };

//   const loginUser = async (obj) => {
//     try {
//       const controller = new AbortController();

//       const timeout = setTimeout(() => {
//         controller.abort();
//       }, 10000); // 10 seconds

//       const response = await fetch(apiDetails.loginUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(obj),
//         signal: controller.signal,
//       });

//       clearTimeout(timeout);

//       let data;

//       try {
//         data = await response.json();
//       } catch {
//         throw new Error("Invalid response received from server");
//       }

//       if (!response.ok) {
//         switch (response.status) {
//           case 400:
//             throw new Error(data.message || "Invalid request");

//           case 401:
//             throw new Error("Unauthorized");

//           case 403:
//             throw new Error("Access denied");

//           case 404:
//             throw new Error("API endpoint not found");

//           case 409:
//             throw new Error(data.message || "User already exists");

//           case 500:
//             throw new Error("Internal server error");

//           default:
//             throw new Error(
//               data.message || `Request failed (${response.status})`,
//             );
//         }
//       }

//       return {
//         success: true,
//         data,
//       };
//     } catch (error) {
//       if (error.name === "AbortError") {
//         throw new Error("Request timeout. Server took too long to respond.");
//       }

//       if (
//         error.message === "Failed to fetch" ||
//         error.message.includes("NetworkError")
//       ) {
//         throw new Error(
//           "Cannot connect to server. Please check your internet connection or backend server.",
//         );
//       }

//       throw error;
//     }
//   };
//   const onSubmit = async (values, { resetForm }) => {
//     try {
//       const result = await loginUser(values);
//       console.log("result",result);

//       if (result.success) {
//         setShowModal(true);

//         setModalData({
//           title: "Login Successful!",
//           content: "You can enter dashboard successfully.",
//         });

//         // localStorage.setItem("token", result.token);
//         // localStorage.setItem("role", result.user.role);
//         const localUser = {
//           token: result?.data?.token,
//           role: result?.data?.user?.role,
//           id:result?.data?.user?.id
//         };
//         const stateUser = result?.data?.user;
//         localStorage.setItem("user", JSON.stringify(localUser));
//         // dispatch to set user
//         dispatch(setUser(stateUser));

//         if (result?.data?.user?.role === "admin") {
//           navigate("/admin/dashboard");
//         } else {
//           navigate("/user/dashboard");
//         }

//         resetForm();
//       }
//     } catch (error) {
//       console.error(error);

//       setShowModal(true);

//       setModalData({
//         title: "Login Failed",
//         content: error.message,
//       });
//     }
//   };
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
//             <h3 className="authHeadingStyles">Login page</h3>
//             <Box className="fieldContainerStyles">
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
//                 type="password"
//                 onChange={handleChange}
//                 errorMessage="enter password"
//                 label="Password"
//                 name="password"
//                 variant="outlined"
//                 as={TextField}
//                 size="small"
//               />

//               <ReusableButtonContainer
//                 resetForm={resetForm}
//                 initialValues={initialValues}
//                 content={{
//                   mainBtn: "Login",
//                   navigateBtn: "Sign Up",
//                   onClick: () => {
//                     navigate("/signUp");
//                   },
//                 }}
//               />
//             </Box>
//           </Form>
//         )}
//       </Formik>

//       <UniversalModal
//         modalData={modalData}
//         setModalData={setModalData}
//         showModal={showModal}
//         setShowModal={setShowModal}
//       />
//     </>
//   );
// };

// export default Login;

{
  /* <Box
      sx={{
        position: "relative",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({
          resetForm,
          values,
          isValid,
          touched,
          errors,
          setFieldValue,
          setFieldTouched,
        }) => (
          <Form className="formContainerStyles">
            <h3 className="authHeadingStyles">Login page</h3>

            <Box className="fieldContainerStyles">
              <ReusableTextField
                type="email"
                onChange={handleChange}
                errorMessage="enter email"
                label="Email"
                name="email"
                variant="outlined"
                as={TextField}
                size="small"
              />

              <ReusableTextField
                type="password"
                onChange={handleChange}
                errorMessage="enter password"
                label="Password"
                name="password"
                variant="outlined"
                as={TextField}
                size="small"
              />

              <ReusableButtonContainer
                resetForm={resetForm}
                initialValues={initialValues}
                content={{ mainBtn: "Login" }}
              />
            </Box>
          </Form>
        )}
      </Formik>
    </Box> */
}

{
  /* <Fab
        variant="extended"
        sx={{
    height: "40px",
    minHeight: "40px",
    borderRadius: "20px",
    px: 2,
  }}
        // sx={{
        //   position: "absolute",
        //   right: "20%",
        //   top: "20%",
        //   transform: "translateY(-50%)",
        // }}
        // size={window.innerWidth < 600 ? "small" : "medium"}
      >
        <NavigationIcon sx={{ mr: 1 }} />
        Navigate
      </Fab> */
}
