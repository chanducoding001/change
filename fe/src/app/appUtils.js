import axios from "axios";
import { localUser } from "../utils/utils";

export const baseUrlInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

baseUrlInstance.interceptors.request.use((config) => {
  const { token } = localUser() || {};

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const loadingStates = {
  IDLE: "idle",
  PENDING: "pending",
  FULFILLED: "fulfilled",
  REJECTED: "rejected"
};
export const requestStates = {
  loading: loadingStates?.IDLE,
  data: [],
  error: null
};

export const handleApiCases = (builder, api, stateField) => {
  builder
    .addCase(api.pending, (state) => {
      state[stateField].loading = loadingStates.PENDING;
    })
    .addCase(api.fulfilled, (state, action) => {
      state[stateField].loading = loadingStates.FULFILLED;
      state[stateField].data = action.payload;
      state[stateField].error = null;
    })
    .addCase(api.rejected, (state, action) => {
      state[stateField].loading = loadingStates.REJECTED;
      state[stateField].data = [];
      state[stateField].error = action.payload;
    });
};
