import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  results: {},
};

const resultsSlice = createSlice({
  name: "results",
  initialState,
  reducers: {
    updateWeightScores: (state, action) => {
      const { week, results } = action.payload;

      if (!state.results[`GW${week}`]) {
        state.results[`GW${week}`] = [];
      }

      // Remove old weight entry if exists
      state.results[`GW${week}`] = state.results[`GW${week}`].filter(
        (entry) => entry.type !== "Weight"
      );

      // Convert team IDs to strings for consistency
      const formattedResults = {};
      Object.keys(results).forEach((team) => {
        formattedResults[String(team)] = results[team];
      });

      // Add new weight entry
      state.results[`GW${week}`].push({
        type: "Weight",
        data: formattedResults,
      });

      // **Recalculate Combined Score**
      updateCombinedScore(state, week);
    },

    updatePitchScores: (state, action) => {
      const { week, results } = action.payload;

      if (!week || typeof week !== "number") {
        console.error("⚠️ Pitch scores are missing a valid week!");
        return;
      }

      if (!state.results[`GW${week}`]) {
        state.results[`GW${week}`] = [];
      }

      // Remove old pitch entry if exists
      state.results[`GW${week}`] = state.results[`GW${week}`].filter(
        (entry) => entry.type !== "Pitch"
      );

      // Convert team IDs to strings for consistency
      const formattedResults = {};
      Object.keys(results).forEach((team) => {
        formattedResults[String(team)] = results[team];
      });

      // Add new pitch entry
      state.results[`GW${week}`].push({
        type: "Pitch",
        data: formattedResults,
      });

      // **Recalculate Combined Score**
      updateCombinedScore(state, week);
    },
    // **NEW ACTION: Load Fake Results at Startup**
    loadFakeResults: (state, action) => {
      state.results = action.payload;
    },
  },
});

// **Helper function to calculate Combined Score**
const updateCombinedScore = (state, week) => {
  const weekData = state.results[`GW${week}`];

  if (!weekData) return;

  const weightEntry = weekData.find((entry) => entry.type === "Weight");
  const pitchEntry = weekData.find((entry) => entry.type === "Pitch");

  if (!weightEntry || !pitchEntry) return;

  const weightData = weightEntry.data;
  const pitchData = pitchEntry.data;

  const combinedData = {};

  // Ensure weightData keys match pitchData keys
  Object.keys(pitchData).forEach((team) => {
    const weightGoals = weightData?.[team]?.goals || 0;
    const pitchGoals = pitchData?.[team] || 0;
    combinedData[team] = weightGoals + pitchGoals;
  });

  // Remove old Combined Score if exists
  state.results[`GW${week}`] = state.results[`GW${week}`].filter(
    (entry) => entry.type !== "Combined"
  );

  // Add new Combined Score
  state.results[`GW${week}`].push({ type: "Combined", data: combinedData });
};

export const { updateWeightScores, updatePitchScores, loadFakeResults } =
  resultsSlice.actions;
export default resultsSlice.reducer;
