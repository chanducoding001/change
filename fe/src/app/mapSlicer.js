import { addPlaceInTourApi, createTourApi, deleteTourApi, getAllToursApi, getATourByIdApi, startATourApi, syncATourApi } from "./thunkApiCalls";
import { createSlice } from "@reduxjs/toolkit";
import { handleApiCases, requestStates } from "./appUtils";


const initialState = {
    createTourState:requestStates,
    getAllToursState:requestStates,
    getATourByIdState:requestStates,
    startATourState:requestStates,
    syncATourState:requestStates,
    deleteTourState:requestStates,
    addPlaceInTourState:requestStates,
    allTours:[],
    unresolvedPlaces:[],
    runningTourData:{}
}
const mapSlicer = createSlice({
  name: "api slicer",
  initialState,
  reducers: {
    crudAllTours:(state,action)=>{
        const {type,data} = action.payload;
        if(type==='allTours'){
            state.allTours = data;
        }
    },
    fetchUnResolvedPlacesFromTourId: (state, action) => {
      
        const requiredTour = state.allTours.find(
            (tour) => tour._id === action.payload
        );
        
        state.unresolvedPlaces =  requiredTour?.unresolvedPlaces || [];
    },
    addPlaceInTour: (state, action) => {

      const updatedTour = action.payload;
      console.log('inside add place',{updatedTour});
      
      const index = state.allTours.findIndex(
          (tour) => tour._id === updatedTour._id
      );
      if (index !== -1) {
          state.allTours[index] = updatedTour;
      }
    },
    containRunningTourData:(state,action)=>{
      state.runningTourData = action.payload;
    }
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
  extraReducers:(builder)=>{
    handleApiCases(builder, createTourApi, "createTourState");
    handleApiCases(builder, getAllToursApi, "getAllToursState");
    handleApiCases(builder, getATourByIdApi, "getATourByIdState");
    handleApiCases(builder, startATourApi, "startATourState");
    handleApiCases(builder, syncATourApi, "syncATourState");
    handleApiCases(builder, deleteTourApi, "deleteTourState");
    handleApiCases(builder, addPlaceInTourApi, "addPlaceInTourState");
  },

});




export default mapSlicer.reducer;
export const {fetchUnResolvedPlacesFromTourId,
  crudAllTours,
  addPlaceInTour,
  containRunningTourData
} = mapSlicer.actions;


