import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
          speed: 0,
          loading: false,
          isError: false,
          errorMessage: null, // Add an error message field for better debugging
          speedsList: [],
};

// Async thunk to fetch new speed
export const getNewSpeed = createAsyncThunk(
          "speed/getNewSpeed",
          async (values, { rejectWithValue }) => {
                    try {
                              const res = await fetch("http://localhost:8080/api/speed/setSpeed", {
                                        method: "PUT",
                                        headers: {
                                                  "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify(values),
                              });

                              if (!res.ok) {
                                        // If response status is not OK, reject with the response message
                                        const errorData = await res.json();
                                        return rejectWithValue(errorData.message || "Failed to fetch new speed");
                              }

                              return await res.json();
                    } catch (error) {
                              // Reject with the error message in case of network errors
                              return rejectWithValue(error.message || "Something went wrong");
                    }
          }
);

export const speedSlice = createSlice({
          name: "speed",
          initialState,
          reducers: {},
          extraReducers: (builder) => {
                    builder
                              .addCase(getNewSpeed.pending, (state) => {
                                        state.loading = true;
                                        state.isError = false; // Reset error state
                                        state.errorMessage = null; // Clear previous error message
                              })
                              .addCase(getNewSpeed.fulfilled, (state, action) => {
                                        state.loading = false;
                                        state.speed = action.payload.speed; // Update speed from API response
                                        state.speedsList = action.payload.speedsList; // Update speedsList
                              })
                              .addCase(getNewSpeed.rejected, (state, action) => {
                                        state.loading = false;
                                        state.isError = true;
                                        state.errorMessage = action.payload || action.error.message; // Set error message
                                        console.error("Error:", state.errorMessage); // Log error
                              });
          },
});

export default speedSlice.reducer;
