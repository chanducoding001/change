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