import { createSlice } from "@reduxjs/toolkit";
import { HealthEvents } from "./health-events";

interface HealthState {
  isHealthy: boolean;
  timestamp: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: HealthState = {
  isHealthy: false,
  timestamp: "",
  isLoading: false,
  error: null,
};

const healthSlice = createSlice({
  name: "health",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(HealthEvents.loadHealthRequested, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(HealthEvents.loadHealthSuccess, (state, action) => {
        state.isLoading = false;
        state.isHealthy = action.payload.status === "healthy";
        state.timestamp = action.payload.timestamp;
      })
      .addCase(HealthEvents.loadHealthFailure, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      });
  },
});

export const healthReducer = healthSlice.reducer;

export const selectHealthState = (state: { health: HealthState }) =>
  state.health;
export const selectIsHealthy = (state: { health: HealthState }) =>
  state.health.isHealthy;
export const selectHealthTimestamp = (state: { health: HealthState }) =>
  state.health.timestamp;
export const selectHealthIsLoading = (state: { health: HealthState }) =>
  state.health.isLoading;
