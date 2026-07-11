import React from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  IconButton,
  Chip,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import RoomIcon from "@mui/icons-material/Room";

const TourNodeList = ({
  nodes,
  setNodes,
  selectedNode,
  setSelectedNode,
}) => {

  //----------------------------------------------

  const removeNode = (id) => {
    setNodes((prev) =>
      prev.filter((node) => node.id !== id)
    );

    if (selectedNode?.id === id) {
      setSelectedNode(null);
    }
  };

  //----------------------------------------------

  const moveUp = (index) => {
    if (index === 0) return;

    const list = [...nodes];

    [list[index - 1], list[index]] = [
      list[index],
      list[index - 1],
    ];

    setNodes(list);
  };

  //----------------------------------------------

  const moveDown = (index) => {
    if (index === nodes.length - 1) return;

    const list = [...nodes];

    [list[index], list[index + 1]] = [
      list[index + 1],
      list[index],
    ];

    setNodes(list);
  };

  //----------------------------------------------

  return (
    <Box>

      <Typography
        variant="h6"
        gutterBottom
      >
        Tour Places
      </Typography>

      <Stack spacing={2}>

        {nodes.length === 0 && (
          <Typography
            color="text.secondary"
          >
            No places added.
          </Typography>
        )}

        {nodes.map((node, index) => (

          <Paper
            key={node.id}
            elevation={
              selectedNode?.id === node.id
                ? 6
                : 1
            }
            sx={{
              p: 2,
              cursor: "pointer",
              border:
                selectedNode?.id === node.id
                  ? "2px solid #1976d2"
                  : "1px solid #ddd",
            }}
            onClick={() =>
              setSelectedNode(node)
            }
          >

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
            >

              <Box>

                <Typography
                  fontWeight={700}
                >
                  {index + 1}.{" "}
                  {node.village_name}
                </Typography>

                <Typography
                  variant="body2"
                >
                  {node.sub_district_name}
                </Typography>

                <Typography
                  variant="body2"
                >
                  {node.district_name}
                </Typography>

                <Typography
                  variant="body2"
                >
                  {node.state_name}
                </Typography>

                <Chip
                  size="small"
                  sx={{ mt: 1 }}
                  icon={<RoomIcon />}
                  label="Village"
                  color="primary"
                />

              </Box>

              <Stack>

                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    moveUp(index);
                  }}
                  disabled={index === 0}
                >
                  <KeyboardArrowUpIcon />
                </IconButton>

                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    moveDown(index);
                  }}
                  disabled={
                    index ===
                    nodes.length - 1
                  }
                >
                  <KeyboardArrowDownIcon />
                </IconButton>

                <IconButton
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNode(node.id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>

              </Stack>

            </Stack>

          </Paper>

        ))}

      </Stack>

    </Box>
  );
};

export default TourNodeList;