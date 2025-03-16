import { configureStore } from "@reduxjs/toolkit";
import playerReducer from "./playerSlice";
import leagueReducer from "./leagueSlice";
import resultsReducer from "./resultsSlice";

export const store = configureStore({
  reducer: {
    players: playerReducer,
    league: leagueReducer,
    results: resultsReducer,
  },
});

export default store;
