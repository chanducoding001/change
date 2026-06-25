import React, { useEffect, useMemo, useState } from "react";

import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import {
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { drawerWidth } from "../pages/common/LayoutFile";
import { useSelector } from "react-redux";

const excludedColumns = ["State", "District", "Subdistt", "Town/Village"];
const defaultSelectedColumns = [
  "State",
  "District",
  "Subdistt",
  "Town/Village",
  "Level",
  "Name",
  "TRU",
  "No_HH",
  "TOT_P",
  "TOT_M",
  "TOT_F",
];
const formatCellValue = (column, value) => {
  if (value === null || value === undefined || value === "") {
    return value;
  }

  // Don't format excluded columns
  if (excludedColumns.includes(column)) {
    return value;
  }

  // Format numeric values and numeric strings
  if (!isNaN(Number(value))) {
    return Number(value).toLocaleString("en-IN");
  }

  return value;
};

const PsuedoTable = ({ data = [] }) => {
  const [page, setPage] = useState(0);
  const {selectedState,selectedDist,selectedSubDist} = useSelector((state)=>state.apiSlicer.censusSelectedSdsd);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [selectedColumns, setSelectedColumns] = useState(defaultSelectedColumns);
  const [filters, setFilters] = useState([
    {
      field: "",
      operator: "=",
      value: "",
    },
  ]);

  //////////////////////////////////////////////////

  const columns = useMemo(() => {
    if (!data.length) return [];

    return Object.keys(data[0]);
  }, [data]);


  useEffect(() => {
  if (columns.length) {
    const defaults = defaultSelectedColumns.filter((col) =>
      columns.includes(col)
    );

    setSelectedColumns(
      defaults.length ? defaults : columns
    );
  }
}, [columns]);

  // useEffect(() => {
  //   if (columns.length) {
  //     setSelectedColumns(columns);
  //   }
  // }, [columns]);

  //////////////////////////////////////////////////

  useEffect(() => {
    setPage(0);
  }, [filters]);

  //////////////////////////////////////////////////

  const updateFilter = (index, key, value) => {
    setFilters((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [key]: value,
            }
          : item,
      ),
    );
  };

  //////////////////////////////////////////////////

  const addFilter = () => {
    setFilters((prev) => [
      ...prev,
      {
        field: "",
        operator: "=",
        value: "",
      },
    ]);
  };

  //////////////////////////////////////////////////

  const removeFilter = (index) => {
    setFilters((prev) => prev.filter((_, i) => i !== index));
  };

  //////////////////////////////////////////////////

  const filteredRows = useMemo(() => {
    return data.filter((row) =>
      filters.every(({ field, operator, value }) => {
        if (!field || value === "") {
          return true;
        }

        const rowValue = row[field];

        const isNumber = !isNaN(Number(rowValue));

        const left = isNumber
          ? Number(rowValue)
          : String(rowValue).toLowerCase();

        const right = isNumber ? Number(value) : String(value).toLowerCase();

        switch (operator) {
          case ">":
            return left > right;

          case "<":
            return left < right;

          case "=":
            return left === right;

          case ">=":
            return left >= right;

          case "<=":
            return left <= right;

          case "!=":
            return left !== right;

          case "contains":
            return String(left).includes(String(right));

          default:
            return true;
        }
      }),
    );
  }, [data, filters]);

  //////////////////////////////////////////////////

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;

    return filteredRows.slice(start, start + rowsPerPage);
  }, [filteredRows, page, rowsPerPage]);

  //////////////////////////////////////////////////

  const statistics = useMemo(() => {
    const population = filteredRows.reduce(
      (sum, row) => sum + Number(row.TOT_P || 0),
      0,
    );

    return {
      rows: filteredRows.length,
      population,
    };
  }, [filteredRows]);

  //////////////////////////////////////////////////

  const downloadTable = () => {
  const doc = new jsPDF("landscape");
  
  const query = filters
    .filter((f) => f.field && f.value)
    .map((f) => `${f.field} ${f.operator} ${f.value}`)
    .join(" AND ");
  const selectedTitle = `${selectedState?.value} - ${selectedDist?.value} - ${selectedSubDist?.value}`
  const title = `Census Report of ${selectedTitle}`;
  doc.setProperties({
    title,
    subject: "Census Data",
    author: "Chandrashekar",
    creator: "Chandrashekar",
  });

  doc.setFontSize(18);
  doc.text(title, 10, 10);

  doc.setFontSize(11);
  doc.text(`Query: ${query || "No Filters"}`, 10, 20);

  autoTable(doc, {
    startY: 30,
    head: [["S.No", ...selectedColumns]],
    body: filteredRows.map((row, index) => [
      index + 1,
      ...selectedColumns.map((c) => formatCellValue(c, row[c])),
    ]),
  });

  doc.save("census-report.pdf");
};

  //////////////////////////////////////////////////

 const downloadRow = (row, serial) => {
  const doc = new jsPDF();

  const selectedTitle = `${selectedState?.value} - ${selectedDist?.value} - ${selectedSubDist?.value}`;
  const title = `Census Report of ${selectedTitle}`;

  doc.setProperties({
    title,
    subject: "Census Data",
    author: "Chandrashekar",
    creator: "Chandrashekar",
  });

  doc.setFontSize(18);
  doc.text(title, 10, 10);

  autoTable(doc, {
    startY: 20,
    body: [
      // ["S.No", serial],
      ...Object.entries(row).map(([key, value]) => [
        key,
        formatCellValue(key, value),
      ]),
    ],
  });

  doc.save(`${row.Name || serial}.pdf`);
};

  //////////////////////////////////////////////////

  return (
    <Paper
      sx={{
        mt: 1,
        p: 2,
        width: "100%",
        // width: `calc(100% - ${drawerWidth}px)`,
        // minWidth: 0,
        // overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      <Grid container spacing={2} mb={2}>
        <Grid size={12}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addFilter}
          >
            Add Filter
          </Button>
        </Grid>

        {filters.map((filter, index) => {
          const used = filters
            .filter((_, i) => i !== index)
            .map((f) => f.field);

          const available = columns.filter(
            (c) => !used.includes(c) || c === filter.field,
          );

          return (
            <React.Fragment key={index}>
              <Grid size={3}>
                <Select
                  fullWidth
                  displayEmpty
                  value={filter.field}
                  onChange={(e) => updateFilter(index, "field", e.target.value)}
                >
                  <MenuItem value="">Select Column</MenuItem>

                  {available.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              <Grid size={2}>
                <Select
                  fullWidth
                  value={filter.operator}
                  onChange={(e) =>
                    updateFilter(index, "operator", e.target.value)
                  }
                >
                  <MenuItem value=">">&gt;</MenuItem>

                  <MenuItem value="<">&lt;</MenuItem>

                  <MenuItem value="=">=</MenuItem>

                  <MenuItem value=">=">&gt;=</MenuItem>

                  <MenuItem value="<=">&lt;=</MenuItem>

                  <MenuItem value="!=">!=</MenuItem>

                  <MenuItem value="contains">contains</MenuItem>
                </Select>
              </Grid>

              <Grid size={2}>
                <TextField
                  fullWidth
                  placeholder="Value"
                  value={filter.value}
                  onChange={(e) => updateFilter(index, "value", e.target.value)}
                />
              </Grid>

              <Grid size={2}>
                <IconButton onClick={() => removeFilter(index)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </React.Fragment>
          );
        })}
      </Grid>
      <Grid size={6} sx={{ marginTop: "10px" }}>
        <FormControl fullWidth>
          <InputLabel>Columns</InputLabel>

          <Select
            multiple
            value={selectedColumns}
            // onChange={(e) => setSelectedColumns(e.target.value)}

            onChange={(e) => {
              const value = e.target.value;
              if (value.length) {
                setSelectedColumns(value);
              }
            }}
            input={<OutlinedInput label="Columns" />}
            renderValue={(selected) => selected.join(", ")}
          >
            {columns.map((column) => (
              <MenuItem key={column} value={column}>
                <Checkbox checked={selectedColumns.includes(column)} />
                <ListItemText primary={column} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Box sx={{ marginTop: "10px" }}>
        <Grid container spacing={2} mb={2}>
          <Grid size={3}>
            <Typography>Rows :{statistics.rows}</Typography>
          </Grid>

          <Grid size={3}>
            <Typography>
              Population :{formatCellValue("pop", statistics.population)}
            </Typography>
          </Grid>

          <Grid size={3}>
            <Button variant="contained" onClick={downloadTable}>
              Download PDF
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          width: "100%",
          overflowX: "auto",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>S.No</TableCell>

                {/* {columns.map((c) => (
                <TableCell key={c}>{c}</TableCell>
              ))} */}
                {selectedColumns.map((c) => (
                  <TableCell key={c}>{c}</TableCell>
                ))}

                <TableCell>PDF</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedRows.map((row, index) => {
                const serial = page * rowsPerPage + index + 1;

                return (
                  <TableRow key={serial}>
                    <TableCell>{serial}</TableCell>

                    {/* {columns.map((c) => (
                    <TableCell key={c}>
                      { row[c] }
                      {formatCellValue(c,row[c])}
                    </TableCell>
                  ))} */}
                    {selectedColumns.map((c) => (
                      <TableCell key={c}>
                        {formatCellValue(c, row[c])}
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => downloadRow(row, serial)}
                      >
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <TablePagination
        component="div"
        count={filteredRows.length}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[25, 50, 100, 250]}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(Number(e.target.value));
          setPage(0);
        }}
      />
    </Paper>
  );
};

export default PsuedoTable;

