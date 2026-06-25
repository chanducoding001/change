import { createSlice } from "@reduxjs/toolkit";
import { loadingStates, requestStates, handleApiCases } from "./appUtils";
import {
  allInformationsApi,
  allUsersApi,
  allWorkApi,
  changePasswordApi,
  createDashboardApi,
  createInformationApi,
  createWorkApi,
  deleteDashboardApi,
  deleteInformationApi,
  deleteWorkApi,
  getAllDashboardsApi,
  getCensusAllStatesApi,
  getCensusDistrictsByStateApi,
  getCensusStateApi,
  getCensusSubDistsByStateDistApi,
  getCensusVillagesByStateDistSubDistApi,
  getMainDashboardApi,
  getProfileApi,
  getUserMainDashboardApi,
  loginApi,
  modifyDashboardApi,
  modifyInformationApi,
  modifyWorkApi,
  removeCurrentProfilePhotoApi,
  setMainDashboardApi,
  signupApi,
  updateProfileApi,
} from "./thunkApiCalls";

const censusStateOptions = [
  {
    label: "ANDHRA PRADESH",
    value: import.meta.env.VITE_AP_STATE_CODE,
    // value: "ANDHRA PRADESH",
    State: import.meta.env.VITE_AP_STATE_CODE,
  },
];
const censusSelectedSdsdOptions = {
  selectedState:{},
  selectedDist:{},
  selectedSubDist:{},
}

const initialState = {
  signUp: requestStates,
  login: requestStates,

  createDashboard: requestStates,
  getAllDashboards: requestStates,
  updateDashboard: requestStates,
  deleteDashboard: requestStates,
  setMainDashboard: requestStates,
  getMainDashboard: requestStates,
  getUserMainDashboard: requestStates,

  getCensusAllStates:requestStates,
  getCensusDistrictsByState:requestStates,
  getCensusSubDistsByStateDist:requestStates,
  getCensusVillagesByStateDistSubDist:requestStates,

  getCensusState: requestStates,

  getProfile: requestStates,
  updateProfile: requestStates,
  removeCurrentProfilePhoto:requestStates,
  changePassword: requestStates,
  allUsers: requestStates,
  createWork: requestStates,
  allWorks: requestStates,
  updateWork: requestStates,
  deleteWork: requestStates,
  createInformation: requestStates,
  allInformations: requestStates,
  updateInformation: requestStates,
  deleteInformation: requestStates,
  userProfile: {},
  censusDataStateOptions:censusStateOptions,
  censusSelectedSdsd:censusSelectedSdsdOptions
};

const apiSlicer = createSlice({
  name: "api slicer",
  initialState,
  reducers: {
    setSelectedSdsd: (state, action) => {
  const key = Object.keys(action.payload)[0];
  const value = action.payload[key];

  state.censusSelectedSdsd[key] = value;

  if (key === "selectedState") {
    state.getCensusDistrictsByState = requestStates;
    state.getCensusVillagesByStateDistSubDist = requestStates;
    state.censusSelectedSdsd.selectedDist = {};
    state.censusSelectedSdsd.selectedSubDist = {};
  }

  if (key === "selectedDist") {
    state.getCensusSubDistsByStateDist = requestStates;
    state.getCensusVillagesByStateDistSubDist = requestStates;
    state.censusSelectedSdsd.selectedSubDist = {};
  }
},
    // setSelectedSdsd:(state,action)=>{
    //   state.censusSelectedSdsd = {
    //     ...state.censusSelectedSdsd,...action.payload
    //   }
    // },
    setUser: (state, action) => {
      state.userProfile = action.payload;
    },
    removeProfilePhoto:(state,action)=>{
      state.userProfile = {...state.userProfile,profilePhoto:null}
    },
    pushIntoAllInfo: (state, action) => {

      state.allInformations?.data?.data?.unshift(action.payload);
    },
    updateOneInAllInfo: (state, action) => {
      const list = state.allInformations.data?.data;
      if (!Array.isArray(list)) return;
      state.allInformations.data.data = list.map((item) =>
        item._id === action.payload._id ? { ...item, ...action.payload } : item,
      );
    },
    deleteOneInAllInfo: (state, action) => {
      const id = action.payload;

      state.allInformations.data.data = (
        state.allInformations.data.data || []
      ).filter((item) => item._id !== id);
    },
    pushIntoAllWorks: (state, action) => {
      state.allWorks?.data?.data?.unshift(action.payload);
    },
    updateOneInAllWorks: (state, action) => {
      const list = state.allWorks.data?.data;
      if (!Array.isArray(list)) return;
      state.allWorks.data.data = list.map((item) =>
        item._id === action.payload._id ? { ...item, ...action.payload } : item,
      );
    },
    deleteOneInAllWorks: (state, action) => {
      const id = action.payload;

      state.allWorks.data.data = (state.allWorks.data.data || []).filter(
        (item) => item._id !== id,
      );
    },

    pushIntoAllDashboards: (state, action) => {
      state.getAllDashboards?.data?.data?.unshift(action.payload);
    },
    updateOneInAllDashboards: (state, action) => {
      const updatedDashboard = action.payload;

      const list = state.getAllDashboards?.data?.data;

      if (Array.isArray(list)) {
        state.getAllDashboards.data.data = list.map((item) =>
          item._id === updatedDashboard._id
            ? {
                ...item,
                ...updatedDashboard,
              }
            : item,
        );
      }

      const currentMain = state.getMainDashboard?.data?.data;

      if (currentMain && currentMain._id === updatedDashboard._id) {
        state.getMainDashboard.data.data = {
          ...currentMain,
          ...updatedDashboard,
        };
      }
    },

    updateMainDashboard: (state, action) => {
      const dashboard = action.payload?.data;

      if (!dashboard) return;

      // Update main dashboard if current main dashboard
      // belongs to same dashboard type
      if (
        state.getMainDashboard?.data?.data?.dashboardFor ===
        dashboard.dashboardFor
      ) {
        state.getMainDashboard.data.data = dashboard;
      }

      const dashboards = state.getAllDashboards?.data?.data;

      if (Array.isArray(dashboards)) {
        state.getAllDashboards.data.data = dashboards.map((item) => {
          if (item.dashboardFor !== dashboard.dashboardFor) {
            return item;
          }

          return {
            ...item,
            isDefault: item._id === dashboard._id,
          };
        });
      }
    },
    deleteOneInAllDashboards: (state, action) => {
      const id = action.payload;

      state.getAllDashboards.data.data = (
        state.getAllDashboards.data.data || []
      ).filter((item) => item._id !== id);
    },
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
  extraReducers: (builder) => {
    handleApiCases(builder, signupApi, "signUp");
    handleApiCases(builder, loginApi, "login");

    handleApiCases(builder, getCensusAllStatesApi, "getCensusAllStates");
    handleApiCases(builder, getCensusDistrictsByStateApi, "getCensusDistrictsByState");
    handleApiCases(builder, getCensusSubDistsByStateDistApi, "getCensusSubDistsByStateDist");
    handleApiCases(builder, getCensusVillagesByStateDistSubDistApi, "getCensusVillagesByStateDistSubDist");

    handleApiCases(builder, getCensusStateApi, "getCensusState");

    handleApiCases(builder, createDashboardApi, "createDashboard");
    handleApiCases(builder, getAllDashboardsApi, "getAllDashboards");
    handleApiCases(builder, modifyDashboardApi, "updateDashboard");
    handleApiCases(builder, deleteDashboardApi, "deleteDashboard");
    handleApiCases(builder, setMainDashboardApi, "setMainDashboard");
    handleApiCases(builder, getMainDashboardApi, "getMainDashboard");
    handleApiCases(builder, getUserMainDashboardApi, "getUserMainDashboard");

    handleApiCases(builder, getProfileApi, "getProfile");
    handleApiCases(builder, removeCurrentProfilePhotoApi, "removeCurrentProfilePhoto");
    handleApiCases(builder, updateProfileApi, "updateProfile");
    handleApiCases(builder, changePasswordApi, "changePassword");
    handleApiCases(builder, allUsersApi, "allUsers");
    handleApiCases(builder, createWorkApi, "createWork");
    handleApiCases(builder, allWorkApi, "allWorks");
    handleApiCases(builder, modifyWorkApi, "updateWork");
    handleApiCases(builder, deleteWorkApi, "deleteWork");
    handleApiCases(builder, createInformationApi, "createInformation");
    handleApiCases(builder, allInformationsApi, "allInformations");
    handleApiCases(builder, modifyInformationApi, "updateInformation");
    handleApiCases(builder, deleteInformationApi, "deleteInformation");
  },
});

export default apiSlicer.reducer;
export const {
  setSelectedSdsd,
  setUser,
  removeProfilePhoto,
  pushIntoAllInfo,
  updateOneInAllInfo,
  deleteOneInAllInfo,
  pushIntoAllWorks,
  updateOneInAllWorks,
  deleteOneInAllWorks,
  pushIntoAllDashboards,
  updateOneInAllDashboards,
  updateMainDashboard,
  deleteOneInAllDashboards,
} = apiSlicer.actions;
