import * as React from "react";
import "./addTour.css";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import { Box, Card, Chip, Stack } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";

const distanceInKm = (distance)=>{
    const d = (distance/1000).toFixed(2);
    return d+" km"
}
// (tour.totalDistance / 1000).toFixed(2);

export default function ReusableEachStaticMapCard(props) {
  const id = React.useId();
  const {
    place,
    handleAddPlace,
    handleVisitTour,
    handleDeleteTour,
    handleDeletePlace,
  } = props;
  const [visitCount, setVisitCount] = useState(null);

  useEffect(() => {
    let visitedCount = 0;
    place?.places.forEach((e) => {
      if (e?.visited) {
        visitedCount += 1;
      }
    });
    setVisitCount(visitedCount);
  }, [place]);

  return (
    <div style={{ margin: "10px 0px" }}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`${id}-panel1-content`}
          id={`${id}-panel1-header`}
        >
          <Typography className="tourTitle">{place?.name}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box className="topBtnContainersWrapper">
            <Box className="center topBtnContainers">
              <Chip
                label={`Total Places : ${place?.places?.length}`}
                variant="outlined"
              />
              <Chip label={`Visited : ${visitCount}`} variant="outlined" />
              <Chip
                label={`Tour Status : ${place?.status}`}
                variant="outlined"
              />
              <Chip
                label={`Distance bw places : ${distanceInKm(place?.totalDistance)}`}
                variant="outlined"
              />
              <Chip
                label={`Total Distance from CL : not available`}
                variant="outlined"
              />
              <Chip
                label={`Remaining Distance from CL : not available`}
                variant="outlined"
              />
            </Box>
            <Box className="center topBtnContainers">
              <Chip
                className="clickableChips"
                label="Add Place"
                variant="outlined"
                onClick={() => handleAddPlace(place?._id)}
              />
              <Chip
                className="clickableChips"
                label="Visit Tour"
                variant="outlined"
                onClick={() => handleVisitTour(place?._id)}
              />
              <Chip
                className="clickableChips"
                label="Delete Tour"
                variant="outlined"
                onClick={() => handleDeleteTour(place?._id)}
              />
            </Box>
          </Box>
          <Box sx={{ display: "flex" }}>
            <Card className="tourPlacesCard">
              <Typography className="center placesTitle">
                Tour places
              </Typography>
              <Box className="tourPlacesWrapper">
                {place?.places?.map((eachPlace) => (
                  <Chip
                    key={eachPlace?._id}
                    // label={eachPlace?.place?.searchQuery?.toUpperCase()}
                    label={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography variant="body2">
                          {eachPlace.place.searchQuery.toUpperCase()}
                        </Typography>

                        <Chip
                          label={eachPlace?.visited ? "Visited" : "Not Visited"}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    }
                    onDelete={() => handleDeletePlace(eachPlace?._id)}
                    deleteIcon={<DeleteIcon />}
                    variant="outlined"
                    className="eachPlaceChip"
                  />
                ))}
              </Box>
            </Card>
          </Box>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
