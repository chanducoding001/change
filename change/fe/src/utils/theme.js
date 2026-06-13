import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Poppins, sans-serif",
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: "Poppins, sans-serif",
        },
        "*": {
          fontFamily: "Poppins, sans-serif",
        //   color:'white'
        },
      },
    },
  },
});

export default theme;



// import { createTheme } from "@mui/material/styles";

// const theme = createTheme({
//   typography: {
//     fontFamily: "Poppins, sans-serif",
//   },
// });

// export default theme;