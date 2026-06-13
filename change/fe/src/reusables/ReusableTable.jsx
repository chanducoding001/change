import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Box,
  Avatar,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import { getOptimizedImage, optimizeImage } from "../utils/utils";

export default function ReusableTable({
  rows = [],
  tableHeadRowCells = [],
  columns = [],
  onDelete,
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchTerm, setSearchTerm] = React.useState("");

  // console.log("rows",rows);
  
  // Search Filter
  const filteredRows = rows.filter((row) =>
    columns.some((column) => {
      if (column === "delete") return false;

      const value = row[column];

      return String(value || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    }),
  );

  // Pagination
  const paginatedRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      {/* Search Bar */}
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          size="small"
          label="Search..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
        />
      </Box>

      <TableContainer>
        <Table>
          {/* Header */}
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#90E0EF",
                  color: "#0077B6",
                }}
              >
                S.No
              </TableCell>

              {tableHeadRowCells.map((header) => (
                <TableCell
                  key={header}
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#90E0EF",
                    color: "#0077B6",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* Body */}
          <TableBody>
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row, index) => (
                <TableRow
                  key={row.id || row.email || index}
                  hover
                  sx={{
                    "&:nth-of-type(odd)": {
                      backgroundColor: "#F8FAFC",
                    },
                    "&:hover": {
                      backgroundColor: "#E2E8F0",
                    },
                  }}
                >
                  <TableCell align="center">
                    {page * rowsPerPage + index + 1}
                  </TableCell>

                  {columns.map((column) => (
                    <TableCell key={column} align="center">
                      {column === "delete" ? (
                        <IconButton
                          color="error"
                          onClick={() => onDelete?.(row)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      ) : column === "profilePhoto" ? (
                        <Avatar
                          // src={row?.prfilePhoto?.secure_url}
                          // src={optimizeImage(row?.prfilePhoto?.secure_url,100,100)}
                          src={row.profilePhoto || ""}
                          alt={row.name}
                          sx={{
                            width: 40,
                            height: 40,
                            margin: "0 auto",
                          }}
                        >
                          <PersonIcon />
                        </Avatar>
                      ) : (
                        row[column]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  align="center"
                  sx={{ py: 3 }}
                >
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredRows.length}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 15, 20]}
        onPageChange={(event, newPage) => {
          setPage(newPage);
        }}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />
    </Paper>
  );
}

// import React from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TablePagination,
//   TableRow,
//   Paper,
//   IconButton,
// } from "@mui/material";

// import DeleteIcon from "@mui/icons-material/Delete";

// export default function ReusableTable({
//   rows = [],
//   tableHeadRowCells = [],
//   columns = [],
//   onDelete,
// }) {
//   const [page, setPage] = React.useState(0);
//   const [rowsPerPage, setRowsPerPage] = React.useState(5);

//   const paginatedRows = rows.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage
//   );

//   return (
//     <Paper sx={{ width: "100%", overflow: "hidden" }}>
//       <TableContainer>
//         <Table>

//           {/* Header */}
//           <TableHead>
//             <TableRow>

//               <TableCell
//                 align="center"
//                 sx={{
//                   fontWeight: "bold",
//                   backgroundColor: "#90E0EF",
//                   color: "#0077B6",
//                 }}
//               >
//                 S.No
//               </TableCell>

//               {tableHeadRowCells.map((header) => (
//                 <TableCell
//                   key={header}
//                   align="center"
//                   sx={{
//                     fontWeight: "bold",
//                     backgroundColor: "#90E0EF",
//                     color: "#0077B6",
//                   }}
//                 >
//                   {header}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>

//           {/* Body */}
//           <TableBody>
//             {paginatedRows.map((row, index) => (
//               <TableRow
//                 key={row.id || row.email || index}
//                 hover
//                 sx={{
//                   "&:nth-of-type(odd)": {
//                     backgroundColor: "#F8FAFC",
//                   },
//                   "&:hover": {
//                     backgroundColor: "#E2E8F0",
//                   },
//                 }}
//               >
//                 {/* Serial Number */}
//                 <TableCell align="center">
//                   {page * rowsPerPage + index + 1}
//                 </TableCell>

//                 {/* Dynamic Columns */}
//                 {columns.map((column) => (
//                   <TableCell key={column} align="center">
//                     {column === "delete" ? (
//                       <IconButton
//                         color="error"
//                         onClick={() => onDelete?.(row)}
//                       >
//                         <DeleteIcon />
//                       </IconButton>
//                     ) : (
//                       row[column]
//                     )}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))}
//           </TableBody>

//         </Table>
//       </TableContainer>

//       {/* Pagination */}
//       <TablePagination
//         component="div"
//         count={rows.length}
//         page={page}
//         rowsPerPage={rowsPerPage}
//         rowsPerPageOptions={[5, 10, 15, 20]}
//         onPageChange={(event, newPage) => {
//           setPage(newPage);
//         }}
//         onRowsPerPageChange={(event) => {
//           setRowsPerPage(parseInt(event.target.value, 10));
//           setPage(0);
//         }}
//       />
//     </Paper>
//   );
// }

// import React from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TablePagination,
//   TableRow,
//   Paper,
//   IconButton,
// } from "@mui/material";

// import DeleteIcon from "@mui/icons-material/Delete";

// export default function ReusableTable({
//   rows = [],
//   tableHeadRowCells = [],
//   columns = [],
//   onDelete,
// }) {
//   const [page, setPage] = React.useState(0);
//   const [rowsPerPage, setRowsPerPage] = React.useState(5);

//   const paginatedRows = rows.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage
//   );

//   return (
//     <Paper sx={{ width: "100%" }}>
//       <TableContainer>
//         <Table>

//           <TableHead>
//             <TableRow>
//               {tableHeadRowCells.map((header) => (
//                 <TableCell
//                   key={header}
//                   align="center"
//                   sx={{
//                     fontWeight: "bold",
//                     backgroundColor: "#90E0EF",
//                     color: "#0077B6",
//                   }}
//                 >
//                   {header}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {paginatedRows.map((row, index) => (
//               <TableRow key={index} hover>
//                 {columns.map((column) => (
//                   <TableCell key={column} align="center">
//                     {column === "delete" ? (
//                       <IconButton
//                         color="error"
//                         onClick={() => onDelete?.(row)}
//                       >
//                         <DeleteIcon />
//                       </IconButton>
//                     ) : (
//                       row[column]
//                     )}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))}
//           </TableBody>

//         </Table>
//       </TableContainer>

//       <TablePagination
//         component="div"
//         count={rows.length}
//         page={page}
//         rowsPerPage={rowsPerPage}
//         onPageChange={(e, newPage) => setPage(newPage)}
//         onRowsPerPageChange={(e) => {
//           setRowsPerPage(Number(e.target.value));
//           setPage(0);
//         }}
//       />
//     </Paper>
//   );
// }

// import React from "react";
// import { styled } from "@mui/material/styles";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell, { tableCellClasses } from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import TablePagination from "@mui/material/TablePagination";
// import Paper from "@mui/material/Paper";
// import IconButton from "@mui/material/IconButton";
// import Collapse from "@mui/material/Collapse";
// import Box from "@mui/material/Box";

// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
// import DeleteIcon from "@mui/icons-material/Delete";

// // ================= STYLE =================
// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     backgroundColor: "#90E0EF",
//     color: "#0077B6",
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: 14,
//     color: "#102A43",
//     textAlign: "center",
//   },
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   "&:nth-of-type(odd)": {
//     backgroundColor: "#F8FAFC",
//   },
//   "&:hover": {
//     backgroundColor: "#E2E8F0",
//   },
//   "&:last-child td, &:last-child th": {
//     border: 0,
//   },
// }));

// // ================= DATA =================
// const tableHeadRowCells = [
//   "Name",
//   "Email",
//   "Mobile",
//   "Contribution",
//   "Amount to Pay",
//   "Amount Paid",
//   "Delete",
// ];

// function createData(name, email, mobile, contribution, amountToPay, amountPaid) {
//   return {
//     name,
//     email,
//     mobile,
//     contribution,
//     amountToPay,
//     amountPaid,
//   };
// }

// const initialRows = [
//   createData("Fransisco", "as@gmail.com", "9876543210", 1000, 1000, 0),
//   createData("John", "john@gmail.com", "9876500000", 2000, 1500, 500),
// ];

// // ================= ROW =================
// function Row({ row, onDelete }) {
//   const [open, setOpen] = React.useState(false);

//   return (
//     <>
//       <TableRow hover>

//         {/* Expand column */}
//         <TableCell align="center" sx={{ width: 60 }}>
//           <IconButton size="small" onClick={() => setOpen(!open)}>
//             {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
//           </IconButton>
//         </TableCell>

//         <TableCell align="center">{row.name}</TableCell>
//         <TableCell align="center">{row.email}</TableCell>
//         <TableCell align="center">{row.mobile}</TableCell>
//         <TableCell align="center">{row.contribution}</TableCell>
//         <TableCell align="center">{row.amountToPay}</TableCell>
//         <TableCell align="center">{row.amountPaid}</TableCell>

//         {/* Delete */}
//         <TableCell align="center">
//           <IconButton color="error" onClick={() => onDelete(row.email)}>
//             <DeleteIcon />
//           </IconButton>
//         </TableCell>
//       </TableRow>

//       {/* Collapse Row */}
//       <TableRow>
//         <TableCell colSpan={8} sx={{ padding: 0 }}>
//           <Collapse in={open} timeout="auto" unmountOnExit>
//             <Box sx={{ margin: 2, padding: 2, backgroundColor: "#F1F5F9" }}>
//               <strong>Details</strong>
//               <div>Email: {row.email}</div>
//               <div>Mobile: {row.mobile}</div>
//               <div>Contribution: {row.contribution}</div>
//             </Box>
//           </Collapse>
//         </TableCell>
//       </TableRow>
//     </>
//   );
// }

// // ================= MAIN =================
// export default function ReusableTable() {
//   const [rows, setRows] = React.useState(initialRows);
//   const [page, setPage] = React.useState(0);
//   const [rowsPerPage, setRowsPerPage] = React.useState(5);

//   const handleDelete = (email) => {
//     setRows((prev) => prev.filter((item) => item.email !== email));
//   };

//   const paginatedRows = rows.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage
//   );

//   return (
//     <Paper sx={{ width: "100%", overflow: "hidden" }}>

//       <TableContainer>
//         <Table sx={{ minWidth: 700 }}>

//           {/* HEADER */}
//           <TableHead>
//             <TableRow sx={{ backgroundColor: "#90E0EF" }}>

//               <TableCell align="center" sx={{ width: 60 }} />

//               {tableHeadRowCells.map((cell) => (
//                 <TableCell
//                   key={cell}
//                   align="center"
//                   sx={{
//                     fontWeight: "bold",
//                     color: "#0077B6",
//                   }}
//                 >
//                   {cell}
//                 </TableCell>
//               ))}

//             </TableRow>
//           </TableHead>

//           {/* BODY */}
//           <TableBody>
//             {paginatedRows.map((row) => (
//               <Row key={row.email} row={row} onDelete={handleDelete} />
//             ))}
//           </TableBody>

//         </Table>
//       </TableContainer>

//       {/* PAGINATION */}
//       <TablePagination
//         component="div"
//         count={rows.length}
//         page={page}
//         onPageChange={(e, newPage) => setPage(newPage)}
//         rowsPerPage={rowsPerPage}
//         onRowsPerPageChange={(e) => {
//           setRowsPerPage(parseInt(e.target.value, 10));
//           setPage(0);
//         }}
//         rowsPerPageOptions={[5, 10, 15]}
//       />

//     </Paper>
//   );
// }

// import React from "react";
// import { styled } from "@mui/material/styles";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell, { tableCellClasses } from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import TablePagination from "@mui/material/TablePagination";
// import Paper from "@mui/material/Paper";
// import IconButton from "@mui/material/IconButton";
// import Collapse from "@mui/material/Collapse";
// import Box from "@mui/material/Box";

// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
// import DeleteIcon from "@mui/icons-material/Delete";

// // ================= Styled =================
// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     backgroundColor: "#90E0EF",
//     color: "#0077B6",
//     fontWeight: "bold",
//   },
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: 14,
//     color: "#102A43",
//   },
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   "&:nth-of-type(odd)": {
//     backgroundColor: "#F8FAFC",
//   },
//   "&:hover": {
//     backgroundColor: "#E2E8F0",
//   },
//   "&:last-child td, &:last-child th": {
//     border: 0,
//   },
// }));

// // ================= DATA =================
// const tableHeadRowCells = [
//   "Name",
//   "Email",
//   "Mobile",
//   "Contribution",
//   "Amount to Pay",
//   "Amount Paid",
//   "Delete",
// ];

// function createData(name, email, mobile, contribution, amountToPay, amountPaid) {
//   return {
//     name,
//     email,
//     mobile,
//     contribution,
//     amountToPay,
//     amountPaid,
//   };
// }

// const initialRows = [
//   createData("Fransisco", "as@gmail.com", "9876543210", 1000, 1000, 0),
//   createData("John", "john@gmail.com", "9876500000", 2000, 1500, 500),
// ];

// // ================= ROW =================
// function Row({ row, onDelete }) {
//   const [open, setOpen] = React.useState(false);

//   return (
//     <>
//       <StyledTableRow hover>

//         {/* Expand */}
//         <TableCell sx={{ width: 50 }}>
//           <IconButton size="small" onClick={() => setOpen(!open)}>
//             {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
//           </IconButton>
//         </TableCell>

//         <TableCell>{row.name}</TableCell>
//         <TableCell>{row.email}</TableCell>
//         <TableCell>{row.mobile}</TableCell>
//         <TableCell align="right">{row.contribution}</TableCell>
//         <TableCell align="right">{row.amountToPay}</TableCell>
//         <TableCell align="right">{row.amountPaid}</TableCell>

//         {/* Delete */}
//         <TableCell align="center">
//           <IconButton color="error" onClick={() => onDelete(row.email)}>
//             <DeleteIcon />
//           </IconButton>
//         </TableCell>
//       </StyledTableRow>

//       {/* Collapse */}
//       <TableRow>
//         <TableCell colSpan={8} sx={{ padding: 0 }}>
//           <Collapse in={open} timeout="auto" unmountOnExit>
//             <Box sx={{ margin: 2, padding: 2, backgroundColor: "#F1F5F9" }}>
//               <strong>Details</strong>
//               <div>Email: {row.email}</div>
//               <div>Mobile: {row.mobile}</div>
//               <div>Contribution: {row.contribution}</div>
//             </Box>
//           </Collapse>
//         </TableCell>
//       </TableRow>
//     </>
//   );
// }

// // ================= MAIN =================
// export default function ReusableTable() {
//   const [rows, setRows] = React.useState(initialRows);

//   const [page, setPage] = React.useState(0);
//   const [rowsPerPage, setRowsPerPage] = React.useState(5);

//   const handleDelete = (email) => {
//     setRows((prev) => prev.filter((item) => item.email !== email));
//   };

//   const paginatedRows = rows.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage
//   );

//   return (
//     <Paper sx={{ width: "100%", overflow: "hidden" }}>

//       <TableContainer>
//         <Table sx={{ minWidth: 700 }}>

//           {/* HEADER */}
//           <TableHead>
//             <TableRow sx={{ backgroundColor: "#90E0EF" }}>
//               <TableCell sx={{ width: 50 }} />

//               {tableHeadRowCells.map((cell) => (
//                 <StyledTableCell key={cell}>
//                   {cell}
//                 </StyledTableCell>
//               ))}
//             </TableRow>
//           </TableHead>

//           {/* BODY */}
//           <TableBody>
//             {paginatedRows.map((row) => (
//               <Row
//                 key={row.email}
//                 row={row}
//                 onDelete={handleDelete}
//               />
//             ))}
//           </TableBody>

//         </Table>
//       </TableContainer>

//       {/* PAGINATION */}
//       <TablePagination
//         component="div"
//         count={rows.length}
//         page={page}
//         onPageChange={(e, newPage) => setPage(newPage)}
//         rowsPerPage={rowsPerPage}
//         onRowsPerPageChange={(e) => {
//           setRowsPerPage(parseInt(e.target.value, 10));
//           setPage(0);
//         }}
//         rowsPerPageOptions={[5, 10, 15]}
//       />

//     </Paper>
//   );
// }

// import React from "react";
// import { styled } from "@mui/material/styles";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell, { tableCellClasses } from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import TablePagination from "@mui/material/TablePagination";
// import Paper from "@mui/material/Paper";
// import IconButton from "@mui/material/IconButton";
// import Collapse from "@mui/material/Collapse";
// import Box from "@mui/material/Box";

// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// // ================= Styled Table Cells =================
// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     backgroundColor: "#90E0EF",
//     color: "#0077B6",
//     fontWeight: "bold",
//   },
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: 14,
//     color: "#102A43",
//   },
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   "&:nth-of-type(odd)": {
//     backgroundColor: "#F8FAFC",
//   },
//   "&:hover": {
//     backgroundColor: "#E2E8F0",
//   },
//   "&:last-child td, &:last-child th": {
//     border: 0,
//   },
// }));

// // ================= Sample Data =================
// // function createData(name, calories, fat, carbs, protein) {
// //   return {
// //     name,
// //     calories,
// //     fat,
// //     carbs,
// //     protein,
// //     history: [
// //       { date: "2026-01-01", amount: 120 },
// //       { date: "2026-01-02", amount: 200 },
// //     ],
// //   };
// // }

// // const rows = [
// //   createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
// //   createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
// //   createData("Eclair", 262, 16.0, 24, 6.0),
// //   createData("Cupcake", 305, 3.7, 67, 4.3),
// //   createData("Gingerbread", 356, 16.0, 49, 3.9),
// //   createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
// //   createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
// //   createData("Eclair", 262, 16.0, 24, 6.0),
// //   createData("Cupcake", 305, 3.7, 67, 4.3),
// //   createData("Gingerbread", 356, 16.0, 49, 3.9),
// // ];

// // ================= Collapsible Row =================
// function Row({ row }) {
//   const [open, setOpen] = React.useState(false);

//   return (
//     <>
//       <TableRow hover>

//         {/* Expand Button */}
//         <TableCell sx={{ width: 50 }}>
//           <IconButton size="small" onClick={() => setOpen(!open)}>
//             {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
//           </IconButton>
//         </TableCell>

//         <TableCell>{row.name}</TableCell>
//         <TableCell align="right">{row.calories}</TableCell>
//         <TableCell align="right">{row.fat}</TableCell>
//         <TableCell align="right">{row.carbs}</TableCell>
//         <TableCell align="right">{row.protein}</TableCell>
//       </TableRow>

//       {/* Collapse Row */}
//       <TableRow>
//         <TableCell colSpan={6} sx={{ padding: 0 }}>
//           <Collapse in={open} timeout="auto" unmountOnExit>
//             <Box
//               sx={{
//                 margin: 2,
//                 padding: 2,
//                 backgroundColor: "#F1F5F9",
//                 borderRadius: 2,
//               }}
//             >
//               <strong>History</strong>

//               {row.history.map((h, i) => (
//                 <Box key={i}>
//                   {h.date} — {h.amount}
//                 </Box>
//               ))}
//             </Box>
//           </Collapse>
//         </TableCell>
//       </TableRow>
//     </>
//   );
// }

// // ================= Main Component =================
// export default function ReusableTable(props) {
//   const [page, setPage] = React.useState(0);
//   const [rowsPerPage, setRowsPerPage] = React.useState(5);
//   const {rows,createData,tableHeadRowCells} = props;
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const paginatedRows = rows.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage
//   );

//   return (
//     <Paper sx={{ width: "100%", overflow: "hidden" }}>

//       <TableContainer>
//         <Table sx={{ minWidth: 700 }}>

//           {/* HEADER */}
//           <TableHead>
//             <TableRow sx={{ backgroundColor: "#90E0EF"}}>

//               {/* Empty column for collapse icon */}
//               <TableCell sx={{ width: 50 }} />

//               {/* <StyledTableCell>Dessert</StyledTableCell>
//               <StyledTableCell align="right">Calories</StyledTableCell>
//               <StyledTableCell align="right">Fat (g)</StyledTableCell>
//               <StyledTableCell align="right">Carbs (g)</StyledTableCell>
//               <StyledTableCell align="right">Protein (g)</StyledTableCell> */}
//               {
//                 tableHeadRowCells.map((eachCell,index)=>(
//                     <StyledTableCell key={eachCell}>{eachCell}</StyledTableCell>
//                 ))
//               }

//             </TableRow>
//           </TableHead>

//           {/* BODY */}
//           <TableBody>
//             {paginatedRows.map((row) => (
//               <Row key={row.name} row={row} />
//             ))}
//           </TableBody>

//         </Table>
//       </TableContainer>

//       {/* PAGINATION */}
//       <TablePagination
//         component="div"
//         count={rows.length}
//         page={page}
//         onPageChange={handleChangePage}
//         rowsPerPage={rowsPerPage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//         rowsPerPageOptions={[5, 10, 15]}
//       />

//     </Paper>
//   );
// }
