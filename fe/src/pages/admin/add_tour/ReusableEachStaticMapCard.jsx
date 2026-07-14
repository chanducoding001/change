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
import TourStatistics from "./TourStatistics";
import ReusableDialog from "./ReusableDialog";
import TourVisitSequence from "./TourVisitSequence";
import { nanoid } from "@reduxjs/toolkit";
import useModal from "../../../reusables/useModal";
import UniversalModal from "../../../features/UniversalModal";
import { useDispatch } from "react-redux";
import { deleteTourPlaceApi } from "../../../app/thunkApiCalls";

// (tour.totalDistance / 1000).toFixed(2);

export default function ReusableEachStaticMapCard(props) {
  const id = React.useId();
  const {
    place,
    handleAddPlace,
    handleVisitTour,
    handleDeleteTour,
    // handleDeletePlace,
    // handleModalDeleteTourPlace
  } = props;
  const [visitCount, setVisitCount] = useState(null);
  const [selectedTourPlace, setSelectedTourPlace] = useState({});
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
  useEffect(() => {
    let visitedCount = 0;
    place?.places.forEach((e) => {
      if (e?.visited) {
        visitedCount += 1;
      }
    });
    setVisitCount(visitedCount);
  }, [place]);
  const handlePlaceClick = (clickedPlace) => {};
  // console.log("place static map", place);
  // const handleDeletePlace =
  const handleDeletePlace = async () => {
    setShowModal(false);
    // console.log('delete place',tourPlaceId);
    try {
      const { tourId, placeId } = selectedTourPlace;
      const url = `${import.meta.env.VITE_DELETE_TOUR_PLACE}`
        .replace(":tourId", tourId)
        .replace(":placeId", placeId);
      const result = await dispatch(
        deleteTourPlaceApi({
          url,
          data: [],
        }),
      );
      if (deleteTourPlaceApi.fulfilled.match(result)) {
        // show pop up
        setModalData({
          title: "Delete place",
          content: "Place deleted successfully from the tour!",
        });
        setModalType("success");
      } else if (deleteTourPlaceApi.rejected.match(result)) {
        // show pop up
        setModalData({
          title: "Delete place",
          content: result.payload,
        });
        setModalType("error");
      }
    } catch (error) {
      setModalData({
        title: "Delete place",
        content: error.message,
      });
      setModalType("error");
    }
    setModalAction(null);
    setShowModal(true);
  };
  return (
    <div style={{ margin: "10px 0px" }}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`${id}-panel1-content`}
          id={`${id}-panel1-header`}
        >
          <Typography
            sx={{
              fontWeight: 700,
            }}
            className="tourTitle"
          >
            {place?.name}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box className="topBtnContainersWrapper">
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "10px",
                width: "100%",
              }}
            >
              {/* {place?.status === "running" && ( */}
                <ReusableDialog
                  dialogBtnText="Tour Visited Sequence"
                  dialogTitle={place?.name}
                >
                  <TourVisitSequence place={place} />
                </ReusableDialog>
               {/* )} */}
              <ReusableDialog
                dialogBtnText="Tour Statictics"
                dialogTitle={place?.name}
              >
                <TourStatistics place={place} visitCount={visitCount} />
              </ReusableDialog>
              {[
                {
                  label: "Add Place",
                  onClick: () => handleAddPlace({tourId:place?._id,tourName:place?.name}),
                  key: nanoid(),
                },
                {
                  label: "Visit Tour",
                  onClick: () => handleVisitTour(place?._id),
                  key: nanoid(),
                },
                {
                  label: "Delete Tour",
                  onClick: () => handleDeleteTour(place?._id),
                  key: nanoid(),
                },
              ].map((eachChip) => (
                <Chip
                  key={eachChip.key}
                  variant="outlined"
                  label={eachChip.label}
                  onClick={eachChip.onClick}
                  sx={{
                    borderRadius: "5px",
                    borderColor: "#1976d2",
                  }}
                />
              ))}
            </Box>
          </Box>
          <Box sx={{ display: "flex" }}>
            <Card className="tourPlacesCard">
              <Typography
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  margin: "0 0 5px 0",
                  fontWeight: 600,
                }}
                className="center placesTitle"
              >
                Tour places
              </Typography>
              <Box className="tourPlacesWrapper">
                {place?.places?.map((eachPlace) => (
                  // <Card style={{
                  //   display:'flex',
                  //   flexDirection:'column',
                  //   justifyContent:"space-around",
                  //     borderRadius: "5px",
                  //     width:"48%",
                  //     margin:"1%",
                  //     padding:"20px 0px"
                  //   }}>
                  <React.Fragment key={eachPlace?._id}>
                    <Chip
                      key={eachPlace?._id}
                      // label={eachPlace?.place?.searchQuery?.toUpperCase()}
                      sx={{
                        justifyContent: "space-around",
                        borderRadius: "5px",
                        width: "100%",
                        // width: "48%",
                        margin: "1%",
                        padding: "20px 0px",
                      }}
                      label={
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography variant="body2">
                            {eachPlace.place.searchQuery.toUpperCase()}
                          </Typography>

                          <Chip
                            label={
                              eachPlace?.visited ? "Visited" : "Not Visited"
                            }
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      }
                      onClick={() => handlePlaceClick(eachPlace)}
                      onDelete={() => {
                        setModalData({
                          title: "Delete Place",
                          content: (
                            <>
                              Are you sure you want to delete{" "}
                              <strong>{eachPlace?.place?.name}</strong>?
                            </>
                          ),
                        });
                        setModalAction("delete");
                        setModalType("error");
                        setShowModal(true);
                        setSelectedTourPlace({
                          tourId: place?._id,
                          placeId: eachPlace?._id,
                        });
                        // handleDeletePlace(eachPlace?._id);
                      }}
                      deleteIcon={<DeleteIcon />}
                      variant="outlined"
                      className="eachPlaceChip"
                    />
                  </React.Fragment>
                  // </Card>
                ))}
              </Box>
            </Card>
          </Box>
        </AccordionDetails>
      </Accordion>
      <UniversalModal
        showModal={showModal}
        modalAction={modalAction}
        modalData={modalData}
        modalType={modalType}
        setModalAction={setModalAction}
        setShowModal={setShowModal}
        setModalData={setModalData}
        setModalType={setModalType}
        deleteFunctionReference={handleDeletePlace}
      />
    </div>
  );
}
