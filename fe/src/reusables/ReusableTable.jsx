import React, { useMemo, useState } from "react";
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
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import PersonIcon from "@mui/icons-material/Person";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { NavLink, useNavigate } from "react-router-dom";
import { navigationLocations } from "../utils/utils";
import { callKeys } from "../pages/admin/CreateInfoWork";
import UniversalModal from "../features/UniversalModal";
import useModal from "./useModal";
import { useDispatch } from "react-redux";
import { deleteBookApi } from "../app/thunkApiCalls";
import { deleteTheBook } from "../app/apiSlicer";

export default function ReusableTable({
  rows = [],
  tableHeadRowCells = [],
  columns = [],
  onDelete,
  census = false,
  type
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    showModal,
    modalData,
    modalType,
    modalAction,
    setModalAction,
    setShowModal,
    setModalData,
    setModalType,
  } = useModal();
  const [deletingBookId,setDeletingBookId] = useState('');
  const handleFilterChange = (column, value) => {
    setFilters((prev) => ({
      ...prev,
      [column]: value,
    }));
    setPage(0);
  };

  const filteredRows = useMemo(() => {
    return rows
      .filter((row) =>
        columns.some((column) => {
          if (column === "delete" || column === "profilePhoto") return false;

          return String(row[column] ?? "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        }),
      )
      .filter((row) => {
        return Object.entries(filters).every(([column, value]) => {
          if (!value) return true;

          return String(row[column]) === String(value);
        });
      });
  }, [rows, columns, searchTerm, filters]);

  const paginatedRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const getUniqueCount = (field) => {
    if (!rows.length) return 0;

    return new Set(rows.map((r) => r[field]).filter(Boolean)).size;
  };

  const stats = {
    states: getUniqueCount("State"),
    districts: getUniqueCount("District"),
    subDistricts: getUniqueCount("Subdistt"),
    villages: getUniqueCount("Village"),
    total: filteredRows.length,
  };

  const downloadTablePdf = () => {
    const doc = new jsPDF();

    const pdfColumns = columns.filter(
      (c) => c !== "delete" && c !== "profilePhoto",
    );

    const body = filteredRows.map((row) =>
      pdfColumns.map((column) => row[column] ?? ""),
    );

    autoTable(doc, {
      head: [pdfColumns],
      body,
    });

    doc.save("census-data.pdf");
  };

  const downloadRowPdf = (row) => {
    const doc = new jsPDF();

    const pdfColumns = columns.filter(
      (c) => c !== "delete" && c !== "profilePhoto",
    );

    const body = [pdfColumns.map((column) => row[column] ?? "")];

    autoTable(doc, {
      head: [pdfColumns],
      body,
    });

    doc.save(`record-${Date.now()}.pdf`);
  };
  
  const onDeleteClickTheBook = (row)=>{
    // console.log('row',row);
    
    setShowModal(true);
    setModalAction('delete');
    setModalData({
      title:'Delete the Book?',
      content:'Are you sure you want to delete the book?'
    });
    setDeletingBookId(row?.id);
  }
  const deleteBookReference = async ()=>{
    try {
      const bookId = deletingBookId;
      // console.log('book id',bookId);
      const deleteBookResult = await dispatch(deleteBookApi({
        url:`${import.meta.env.VITE_BOOK_PUT_DELETE}/${bookId}`,
        data:{}
      }));
    if(deleteBookApi.fulfilled.match(deleteBookResult)){
      const deletedBook = deleteBookResult.payload?.data;
      // console.log('deleted book',deletedBook);
      dispatch(deleteTheBook(deletedBook?.bookId));
      setModalData({
        title:'Deleted!',
        content:'Deleted the book successfully!'
      });
      setModalType('success');
      setModalAction('');
    }else if(deleteBookApi.rejected.match(deleteBookResult)){
      setModalData({
        title:'Deletion failed',
        content:deleteBookResult.payload.message
      });
      setModalType('error');
    }  
    setShowModal(true);
    } catch (error) {
      setModalData({
        title:'Deletion failed',
        content:error.message
      });
      setModalType('error');
      setShowModal(true);

    }
  }
  return (
    <>
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
      }}
    >
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

              {tableHeadRowCells.map((header, index) => (
                <TableCell
                  key={header}
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#90E0EF",
                    color: "#0077B6",
                  }}
                >
                  {census &&
                  columns[index] !== "delete" &&
                  columns[index] !== "profilePhoto" ? (
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                        }}
                      >
                        {header}
                      </Typography>

                      <Select
                        size="small"
                        displayEmpty
                        fullWidth
                        value={filters[columns[index]] || ""}
                        onChange={(e) =>
                          handleFilterChange(columns[index], e.target.value)
                        }
                      >
                        <MenuItem value="">All</MenuItem>

                        {[
                          ...new Set(
                            rows.map((r) => r[columns[index]]).filter(Boolean),
                          ),
                        ].map((value) => (
                          <MenuItem key={value} value={value}>
                            {value}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                  ) : (
                    header
                  )}
                </TableCell>
              ))}

              {census && (
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#90E0EF",
                    color: "#0077B6",
                  }}
                >
                  <IconButton onClick={downloadTablePdf}>
                    <DownloadIcon />
                  </IconButton>
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row, index) => (
                <TableRow key={row.id || row.email || index} hover>
                  <TableCell align="center">
                    {page * rowsPerPage + index + 1}
                  </TableCell>

                  {columns.map((column) => (
                    <TableCell key={column} align="center">
                      {column === "delete" ? (
                        <IconButton
                          color="error"
                          onClick={() => {
                            onDelete?.(row)
                            if(type===callKeys.BOOK){
                              onDeleteClickTheBook(row);
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      ) : (column === "edit") ? (
                      <>
                        <IconButton onClick={()=>{
                          if(type===callKeys.BOOK){
                            // console.log('row',row);
                            const editingBookDetails = {
                              bookId:row?.id,
                              bookName:row?.bookName,
                              aboutBook:row?.aboutBook
                            };
                             navigate(navigationLocations.EDITBOOK, {
                              state: editingBookDetails,
                            });
                          }
                        }}>
                          <EditIcon/>
                        </IconButton>
                      </>
                      )
                      :column === "profilePhoto" ? (
                        <Avatar
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
                      ) : column === "actions" ?(
                        <NavLink to={navigationLocations.DISPLAYTHEBOOK.replace(":bookId", row.id)}>
                          Open Book
                        </NavLink>
                      ): (
                        row[column]
                      )}
                    </TableCell>
                    ))}

                  {census && (
                    <TableCell align="center">
                      <IconButton onClick={() => downloadRowPdf(row)}>
                        <DownloadIcon />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 2}
                  align="center"
                  sx={{
                    py: 3,
                  }}
                >
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {census && (
          <Box
            sx={{
              pl: 2,
              display: "flex",
              gap: 3,
              flexWrap: "wrap",
            }}
          >
            <Typography variant="body2">States: {stats.states}</Typography>

            <Typography variant="body2">
              Districts: {stats.districts}
            </Typography>

            <Typography variant="body2">
              Subdistricts: {stats.subDistricts}
            </Typography>

            <Typography variant="body2">Villages: {stats.villages}</Typography>

            <Typography variant="body2">Records: {stats.total}</Typography>
          </Box>
        )}

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
      </Box>
    </Paper>
    <UniversalModal
      showModal={showModal}
      modalData={modalData}
      modalType={modalType}
      modalAction={modalAction}
      setModalAction={setModalAction}
      setShowModal={setShowModal}
      setModalData={setModalData}
      setModalType={setModalType}
      deleteFunctionReference={deleteBookReference}
    />
    </>
  );
}
