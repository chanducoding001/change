import {
  addPlaceInTourApi,
  createTourApi,
  deleteTourApi,
  deleteTourPlaceApi,
  deleteTourUnresolvedPlaceApi,
  getAllToursApi,
  getATourByIdApi,
  startATourApi,
  syncATourApi,
} from "./thunkApiCalls";
import { createSlice } from "@reduxjs/toolkit";
import { handleApiCases, requestStates } from "./appUtils";

const initialState = {
  createTourState: requestStates,
  getAllToursState: requestStates,
  getATourByIdState: requestStates,
  startATourState: requestStates,
  syncATourState: requestStates,
  deleteTourState: requestStates,
  deleteTourPlaceState: requestStates,
  deleteTourUnresolvedPlaceState: requestStates,
  addPlaceInTourState: requestStates,
  allTours: [],
  unresolvedPlaces: [],
  runningTourData: {},
  isTourRunning: null,
  tourName: "",
};
const mapSlicer = createSlice({
  name: "api slicer",
  initialState,
  reducers: {
    crudAllTours: (state, action) => {
      const { type, data } = action.payload;
      if (type === "allTours") {
        state.allTours = data;
      }
    },
    fetchUnResolvedPlacesFromTourId: (state, action) => {
      const requiredTour = state.allTours.find(
        (tour) => tour._id === action.payload,
      );

      state.unresolvedPlaces = requiredTour?.unresolvedPlaces || [];
    },
    addPlaceInTour: (state, action) => {
      const updatedTour = action.payload;
      console.log("inside add place", { updatedTour });

      const index = state.allTours.findIndex(
        (tour) => tour._id === updatedTour._id,
      );
      if (index !== -1) {
        state.allTours[index] = updatedTour;
      }
    },
    containRunningTourData: (state, action) => {
      state.runningTourData = action.payload;
    },
    isTourRunning: (state, action) => {
      state.isTourRunning = action.payload;
    },
    getTourName: (state, action) => {
      const tourId = action.payload;
      const required = state.allTours?.find((tour) => tour._id === tourId);
      state.tourName = required?.name;
    },
    updateResolvedPlacesInTour: (state, action) => {
      state.unresolvedPlaces = action.payload;
    },
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
  extraReducers: (builder) => {
    handleApiCases(builder, createTourApi, "createTourState");
    handleApiCases(builder, getAllToursApi, "getAllToursState");
    handleApiCases(builder, getATourByIdApi, "getATourByIdState");
    handleApiCases(builder, startATourApi, "startATourState");
    handleApiCases(builder, syncATourApi, "syncATourState");
    handleApiCases(builder, deleteTourApi, "deleteTourState");
    handleApiCases(builder, deleteTourPlaceApi, "deleteTourPlaceState");
    handleApiCases(builder, addPlaceInTourApi, "addPlaceInTourState");
    handleApiCases(
      builder,
      deleteTourUnresolvedPlaceApi,
      "deleteTourUnresolvedPlaceState",
    );
  },
});

export default mapSlicer.reducer;
export const {
  fetchUnResolvedPlacesFromTourId,
  crudAllTours,
  addPlaceInTour,
  containRunningTourData,
  isTourRunning,
  getTourName,
  updateResolvedPlacesInTour
} = mapSlicer.actions;
