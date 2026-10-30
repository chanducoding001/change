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
import { inputStyle } from "../../auth/signUp/SignUp";
import { useDispatch } from "react-redux";
import { createBookApi, loginApi } from "../../app/thunkApiCalls";
import { setUser } from "../../app/apiSlicer";

const CreateABook = () => {

  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    title: "",
    content: "",
  });

  const [modalType, setModalType] = useState("info");
  const dispatch = useDispatch();

  const initialValues = {
    bookName: "",
    aboutBook: "",
  };

  const validationSchema = Yup.object({
    bookName: Yup.string().required("Book name is required"),
    aboutBook: Yup.string()
      .required("About book is required"),
  });


  const onSubmit = async (values, { resetForm }) => {
    try {
      setLoading(true);

      // const result = await loginUser(values);
      const createBookResult = await dispatch(
        createBookApi({
          url: `${import.meta.env.VITE_CREATE_BOOK}`,
          data: values,
        }),
      );
      if (createBookApi.fulfilled.match(createBookResult)) {
        // console.log("login", loginResult.payload);
        // const loginUser = loginResult.payload?.user
        // const loginUserRole = loginResult.payload?.user?.role;
        // localStorage.setItem(
        //   "user",
        //   JSON.stringify({
        //     token: loginResult.payload.token,
        //     role: loginResult.payload.user.role,
        //     id: loginResult.payload.user.id,
        //   }),
        // );
        // load the userProfile
        // const profileData = {
        //   ...loginUser
        // };
        // dispatch(setUser(profileData));
        setModalData({
          title: "Book Created Successfully",
          content: "Create Book successful",
        });
        // setRedirectPath(
        //   loginUserRole === ROLES.ADMIN
        //     ? navigationLocations.ADMINDASHBOARD
        //     : navigationLocations.USERDASHBOARD,
        // );
        setModalType("success");

        resetForm();
      }else if(createBookApi.rejected.match(createBookResult)){
        console.log('error',createBookResult.payload);
        
        setModalData({
          title: "Create Book Failed",
          content: createBookResult.payload,
        });
        setModalType("error");
      }
        setShowModal(true);
    } catch (error) {
      setModalType("error");
      setModalData({
        title: "Create Book Failed",
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
                Create a Book
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  textAlign: "center",
                  opacity: 0.8,
                  mb: 2,
                }}
              >
                Fill in the details to create a new book
              </Typography>

              <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)", mb: 3 }} />

              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({ values, errors, touched, handleChange }) => (
                  <Form>
                    {/* BOOK NAME */}
                    <TextField
                      fullWidth
                      name="bookName"
                      label="Book Name"
                      value={values.bookName}
                      onChange={handleChange}
                      margin="normal"
                      error={touched.bookName && Boolean(errors.bookName)}
                      helperText={touched.bookName && errors.bookName       }
                      sx={inputStyle}
                      // sx={{
                      //   input: { color: "white" },
                      //   label: { color: "rgba(255,255,255,0.8)" }
                      // }}
                    />

                    {/* About Book */}
                    <TextField
                      fullWidth
                      name="aboutBook"
                      label="About Book"
                      multiline
                      rows={4}
                      value={values.aboutBook}
                      onChange={handleChange}
                      margin="normal"
                      error={touched.aboutBook && Boolean(errors.aboutBook)}
                      helperText={touched.aboutBook && errors.aboutBook}
                      sx={inputStyle}
                    //   sx={{
                    //     input: { color: "white" },
                    //     label: { color: "rgba(255,255,255,0.8)" }
                    //   }}
                      
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
                        "Create Book"
                      )}
                    </Button>

                    {/* SIGNUP BUTTON */}
                    {/* <Button
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
                    </Button> */}
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
        // navigateLocation={redirectPath}
        modalType={modalType}
        setModalType={setModalType}
      />
    </>
  );
};

export default CreateABook;





// import React from 'react'

// const CreateABook = () => {

//   return (
//     <div>CreateABook</div>
//   )
// }

// export default CreateABook;
