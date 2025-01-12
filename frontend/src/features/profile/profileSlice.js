import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
          loading: false,
          isError: false,
          errorMessage: null, 
          friends: [],
          users: [],
};

// Async thunk to fetch new speed
export const getProfile = createAsyncThunk(
          "leaderBoard/getProfile",
          async (values, { rejectWithValue }) => {
                    try {
                              const res = await fetch(`http://localhost:8080/api/profile/getProfile/${values.id}`, {
                                        method: "GET",
                                        headers: {
                                                  "Content-Type": "application/json",
                                        },
                              });

                              if (!res.ok) {
                                        // If response status is not OK, reject with the response message
                                        const errorData = await res.json();
                                        return rejectWithValue(errorData.message || "Failed to fetch leaderboard");
                              }

                              return await res.json();
                    } catch (error) {
                              // Reject with the error message in case of network errors
                              return rejectWithValue(error.message || "Something went wrong");
                    }
          }
);

export const profileSlice = createSlice({
          name: "profile",
          initialState,
          reducers: {},
          extraReducers: (builder) => {
                    builder
                              .addCase(getProfile.pending, (state) => {
                                        state.loading = true;
                                        state.isError = false; // Reset error state
                                        state.errorMessage = null; // Clear previous error message
                              })
                              .addCase(getProfile.fulfilled, (state, action) => {
                                        state.loading = false;
                                        state.friends = action.payload.friends;
                                        state.users = action.payload.allUsers;
                              })
                              .addCase(getProfile.rejected, (state, action) => {
                                        state.loading = false;
                                        state.isError = true;
                                        state.errorMessage = action.payload || action.error.message; // Set error message
                                        console.error("Error:", state.errorMessage); // Log error
                              });
          },
});

export default profileSlice.reducer;
