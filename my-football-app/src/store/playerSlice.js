import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  players: [],
};

const playerSlice = createSlice({
  name: "players",
  initialState,
  reducers: {
    setPlayers: (state, action) => {
      state.players = action.payload;
    },
  },
});

export const { setPlayers } = playerSlice.actions;
export default playerSlice.reducer;
