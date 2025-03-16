import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fixtures: [],
};

const leagueSlice = createSlice({
  name: "fixtures",
  initialState,
  reducers: {
    setFixtures: (state, action) => {
      state.fixtures = action.payload;
    },
  },
});

export const { setFixtures } = leagueSlice.actions;
export default leagueSlice.reducer;
