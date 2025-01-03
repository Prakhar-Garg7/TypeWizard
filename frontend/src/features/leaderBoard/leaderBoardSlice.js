import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
          mySpeed: 0,
          myRank: 0,
          myName: "User",
          loading: false,
          isError: false,
          errorMessage: null, // Add an error message field for better debugging
          playersList: [],
};

// Async thunk to fetch new speed
export const getLeaderBoard = createAsyncThunk(
          "leaderBoard/getLeaderBoard",
          async (values, { rejectWithValue }) => {
                    try {
                              const res = await fetch(`http://localhost:8080/api/leaderBoard/getLeaderBoard/${values.id}`, {
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

export const leaderBoardSlice = createSlice({
          name: "leaderBoard",
          initialState,
          reducers: {},
          extraReducers: (builder) => {
                    builder
                              .addCase(getLeaderBoard.pending, (state) => {
                                        state.loading = true;
                                        state.isError = false; // Reset error state
                                        state.errorMessage = null; // Clear previous error message
                              })
                              .addCase(getLeaderBoard.fulfilled, (state, action) => {
                                        state.loading = false;
                                        state.mySpeed = action.payload.mySpeed; // Update speed from API response
                                        state.myRank = action.payload.myRank; // Update speed from API response
                                        state.myName = action.payload.myName; // Update speed from API response
                                        state.playersList = action.payload.playersList; // Update speedsList
                              })
                              .addCase(getLeaderBoard.rejected, (state, action) => {
                                        state.loading = false;
                                        state.isError = true;
                                        state.errorMessage = action.payload || action.error.message; // Set error message
                                        console.error("Error:", state.errorMessage); // Log error
                              });
          },
});

export default leaderBoardSlice.reducer;
