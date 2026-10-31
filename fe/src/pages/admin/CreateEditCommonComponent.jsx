import UniversalModal from '../../features/UniversalModal';
import { Box, Button, Card, CardContent, CircularProgress, Container, Divider, TextField, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { inputStyle } from '../../auth/signUp/SignUp';
import NavigateBackComponent from '../../reusables/NavigateBackComponent';

const CreateEditCommonComponent = (props) => {

    const {
            title
            ,subTitle
            ,loading
            ,showModal
            ,setShowModal
            ,modalData
            ,setModalData
            ,modalType
            ,setModalType
            ,initialValues
            ,validationSchema
            ,onSubmit
            ,submitBtnText
            ,navigateLocation
            ,isEdit
        } = props;
  return (
    <>
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
            {isEdit && <NavigateBackComponent btnText="Cancel"/>}
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
                {title}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  textAlign: "center",
                  opacity: 0.8,
                  mb: 2,
                }}
              >
                {subTitle}
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
                        <>
                        {submitBtnText}
                        </>
                      )}
                    </Button>
                  </Form>
                )}
              </Formik>
            </CardContent>
          </Card>
        </Container>
      </Box>

      <UniversalModal
        modalData={modalData}
        setModalData={setModalData}
        showModal={showModal}
        setShowModal={setShowModal}
        navigateLocation={navigateLocation}
        modalType={modalType}
        setModalType={setModalType}
      />
    </>
  )
}

export default CreateEditCommonComponent;