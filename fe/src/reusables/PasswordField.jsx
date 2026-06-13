import React from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const PasswordField = ({
  label,
  name,
  value,
  show,
  onChange,
  toggle,
  disabled,
  helperText
}) => {
  return (
    <TextField
      fullWidth
      label={label}
      name={name}
      type={show ? "text" : "password"}
      value={value}
      onChange={onChange}
      margin="normal"
      variant="outlined"
      helperText={helperText}
      disabled={disabled}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => toggle(name)}
              edge="end"
              size="small"
              type="button"
            >
              {show ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  );
};

export default PasswordField;





// import React from "react";
// import {
//   TextField,
//   InputAdornment,
//   IconButton
// } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";

// const PasswordField = ({
//   label,
//   name,
//   value,
//   show,
//   onChange,
//   toggle,
//   disabled,
//   helperText
// }) => {
//   return (
//     <TextField
//       fullWidth
//       label={label}
//       name={name}
//       type={show ? "text" : "password"}
//       value={value}
//       onChange={onChange}
//       margin="normal"
//       variant="outlined"
//       helperText={helperText}
//       disabled={disabled}
//       slotProps={{
//         input: {
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
//         }
//       }}
//       sx={{
//         "& .MuiOutlinedInput-root": {
//           transition: "all 0.3s ease",
//           "&:hover fieldset": {
//             borderColor: "#667eea"
//           },
//           "&.Mui-focused fieldset": {
//             borderColor: "#667eea"
//           }
//         }
//       }}
//     />
//   );
// };

// export default PasswordField;



// const PasswordField = ({
//   label,
//   name,
//   value,
//   show,
//   onChange,
//   toggle,
//   disabled,
//   helperText
// }) => {
//   return (
//     <TextField
//       fullWidth
//       label={label}
//       name={name}
//       type={show ? "text" : "password"}
//       value={value}
//       onChange={onChange}
//       margin="normal"
//       variant="outlined"
//       helperText={helperText}
//       disabled={disabled}
//       InputProps={{
//         endAdornment: (
//           <InputAdornment position="end">
//             <IconButton
//               onClick={() => toggle(name)}
//               edge="end"
//               size="small"
//               tabIndex={-1}
//             >
//               {show ? <VisibilityOff /> : <Visibility />}
//             </IconButton>
//           </InputAdornment>
//         )
//       }}
//       sx={{
//         "& .MuiOutlinedInput-root": {
//           transition: "all 0.3s ease",
//           "&:hover fieldset": {
//             borderColor: "#667eea"
//           },
//           "&.Mui-focused fieldset": {
//             borderColor: "#667eea"
//           }
//         }
//       }}
//     />
//   );
// };

// export default PasswordField;