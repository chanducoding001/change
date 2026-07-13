import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrlInstance } from "./appUtils";

export const createApiThunk = (
  typePrefix,
  method,
) => {
  return createAsyncThunk(
    typePrefix,
    async ({url,data}, { rejectWithValue }) => {
      try {
        const response = await baseUrlInstance({
          method,
          url,
          data,
        });

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
          error.message
        );
      }
    }
  );
};

export const signupApi = createApiThunk("Sign Up","POST");
export const loginApi = createApiThunk("Login","POST");
export const getProfileApi = createApiThunk("Get Profile details","GET");

export const getCensusAllStatesApi = createApiThunk("Get Census all States","GET");
export const getCensusDistrictsByStateApi = createApiThunk("Get Census all Dists by state","GET");
export const getCensusSubDistsByStateDistApi = createApiThunk("Get Census all Sub-Dists by state dist","GET");
export const getCensusVillagesByStateDistSubDistApi = createApiThunk("Get Census all vills by state dist sub-dist","GET");

export const getStateLGDAllStatesApi = createApiThunk("Get State LGD all States","GET");
export const getStateLGDDistrictsByStateApi = createApiThunk("Get State LGD all Dists by state","GET");
export const getStateLGDSubDistsByStateDistApi = createApiThunk("Get State LGD all Sub-Dists by state dist","GET");
export const getStateLGDVillagesByStateDistSubDistApi = createApiThunk("Get State LGD all vills by state dist sub-dist","GET");

export const getCensusStateApi = createApiThunk("Get Census state","GET");

export const createTourApi = createApiThunk("Create Tour","POST");
export const addPlaceInTourApi = createApiThunk("Add Place in Tour","POST");
export const getAllToursApi = createApiThunk("Get all Tours","GET");
export const getATourByIdApi = createApiThunk("Get a Tour","GET");
export const startATourApi = createApiThunk("Start a Tour","PUT");
export const syncATourApi = createApiThunk("Sync a Tour","PUT");
export const deleteTourApi = createApiThunk("Delete Tour","DELETE");
export const deleteTourPlaceApi = createApiThunk("Delete Tour Place","DELETE");
export const deleteTourUnresolvedPlaceApi = createApiThunk("Delete Tour Unresolved Place","DELETE");


export const createDashboardApi = createApiThunk("Create dashboard","POST");
export const getAllDashboardsApi = createApiThunk("Get All dashboards","GET");
export const modifyDashboardApi = createApiThunk("Modify dashboard","PUT");
export const deleteDashboardApi = createApiThunk("Delete dashboard","DELETE");
export const setMainDashboardApi = createApiThunk("Set main dashboard","PUT");
export const getMainDashboardApi = createApiThunk("Get main dashboard","GET");
export const getUserMainDashboardApi = createApiThunk("Get user main dashboard","GET");

export const removeCurrentProfilePhotoApi = createApiThunk("Remove current profile photo","DELETE");
export const updateProfileApi = createApiThunk("Modify Profile","PUT");
export const changePasswordApi = createApiThunk("Modify Password","PUT");

export const allUsersApi = createApiThunk("Get all users","GET");

export const createWorkApi = createApiThunk("Create work","POST");
export const allWorkApi = createApiThunk("Get all works","GET");
export const modifyWorkApi = createApiThunk("Modify work","PUT");
export const deleteWorkApi = createApiThunk("Delete work","DELETE");

export const createPersonalWorkApi = createApiThunk("Create personal work","POST");
export const allPersonalWorkApi = createApiThunk("Get all personal works","GET");
export const modifyPersonalWorkApi = createApiThunk("Modify personal work","PUT");
export const deletePersonalWorkApi = createApiThunk("Delete personal work","DELETE");

export const createInformationApi = createApiThunk("Create Information","POST");
export const allInformationsApi = createApiThunk("Get all Informations","GET");
export const modifyInformationApi = createApiThunk("Modify Information","PUT");
export const deleteInformationApi = createApiThunk("Delete Information","DELETE");






// export const createApiThunk = (
//   typePrefix,
//   method,
//   endpoint
// ) => {
//   return createAsyncThunk(
//     typePrefix,
//     async (payload, { rejectWithValue }) => {
//       try {
//         const response = await baseUrlInstance({
//           method,
//           url: endpoint,
//           data: payload,
//         });

//         return response.data;
//       } catch (error) {
//         return rejectWithValue(
//           error.response?.data?.message ||
//           error.message
//         );
//       }
//     }
//   );
// };




// export const getProfileApi = createApiThunk("Get Profile details","GET",import.meta.env.VITE_GET_PROFILE_URL);
// export const modifyAdminDashboardApi = createApiThunk("Modify admin dashboard","PUT",import.meta.env.VITE_MODIFY_ADMIN_DASHBOARD);
// export const modifyUserDashboardApi = createApiThunk("Modify user dashboard","PUT",import.meta.env.VITE_MODIFY_USER_DASHBOARD);
// export const updateProfileApi = createApiThunk("Modify Profile","PUT",import.meta.env.VITE_UPDATE_PROFILE);
// export const changePasswordApi = createApiThunk("Modify Password","PUT",import.meta.env.VITE_UPDATE_PASSWORD);
// export const allUsersApi = createApiThunk("Get all users","GET",import.meta.env.VITE_ALL_USERS);
// export const createWorkApi = createApiThunk("Create work","POST",import.meta.env.VITE_CREATE_WORK);
// export const allWorkApi = createApiThunk("Get all works","GET",import.meta.env.VITE_ALL_WORK);
// export const modifyWorkApi = createApiThunk("Modify work","PUT",import.meta.env.VITE_MODIFY_WORK);
// export const deleteWorkApi = createApiThunk("Delete work","DELETE",import.meta.env.VITE_DELETE_WORK);
// export const createInformationApi = createApiThunk("Create Information","POST",import.meta.env.VITE_CREATE_Information);
// export const allInformationsApi = createApiThunk("Get all Informations","GET",import.meta.env.VITE_ALL_Information);
// export const modifyInformationApi = createApiThunk("Modify Information","PUT",import.meta.env.VITE_MODIFY_Information);
// export const deleteInformationApi = createApiThunk("Delete Information","DELETE",import.meta.env.VITE_DELETE_Information);