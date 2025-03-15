import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { updateTeamScores } from "../store/teamSlice"; // Ensure you have this Redux action

const teamColors = {
  1: "Red",
  2: "Blue",
  3: "Green",
  4: "Black",
};

const LogWeights = () => {
  const dispatch = useDispatch();
  const players = useSelector((state) => state.players.players);

  const [playerUpdates, setPlayerUpdates] = useState({});

  const sortedPlayers = [...players].sort((a, b) => a.teamId - b.teamId);

  const handleUpdate = (playerId, key, value) => {
    setPlayerUpdates((prev) => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [key]: value,
      },
    }));
  };

  const handleMilestoneCheck = (playerId) => {
    const updates = playerUpdates[playerId] || {};
    const newWeight = updates.newWeight;
    if (!newWeight) return;

    const updatedPlayer = players.find((p) => p.id === playerId);
    if (!updatedPlayer) return;

    let milestoneHit = false;

    if (Array.isArray(updatedPlayer.milestoneWeights)) {
      for (let milestone of updatedPlayer.milestoneWeights) {
        if (newWeight <= milestone && !playerUpdates[playerId]?.milestone) {
          milestoneHit = true;
          alert(`${updatedPlayer.name} has hit a milestone! 🎉`);
          break;
        }
      }
    }

    if (
      typeof updatedPlayer.BMI_Target === "number" &&
      newWeight <= updatedPlayer.BMI_Target &&
      !playerUpdates[playerId]?.milestone
    ) {
      milestoneHit = true;
      alert(`${updatedPlayer.name} has hit a healthy BMI! 🎉`);
    }

    setPlayerUpdates((prev) => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        milestone: milestoneHit,
      },
    }));
  };

  const handleSubmit = () => {
    const teamResults = {};

    sortedPlayers.forEach((player) => {
      const updates = playerUpdates[player.id] || {};
      const newWeight = updates.newWeight;
      const tracking = updates.tracking || false;
      const milestone = updates.milestone || false;

      if (!newWeight) return;

      const weightChange = parseFloat((newWeight - player.weight).toFixed(1));

      if (!teamResults[player.teamId]) {
        teamResults[player.teamId] = {
          teamId: player.teamId,
          lostWeightCount: 0,
          maintainedWeightCount: 0,
          gainedWeightCount: 0,
          trackedCount: 0,
          ownGoalCount: 0,
          milestoneCount: 0,
          goals: 0,
          totalScore: 0, // ✅ New total score field
        };
      }

      if (weightChange < 0) teamResults[player.teamId].lostWeightCount++;
      if (weightChange === 0)
        teamResults[player.teamId].maintainedWeightCount++;
      if (weightChange > 0) teamResults[player.teamId].gainedWeightCount++;
      if (tracking) teamResults[player.teamId].trackedCount++;
      if (milestone) teamResults[player.teamId].milestoneCount++;

      if (newWeight > player.seasonStartWeight) {
        teamResults[player.teamId].ownGoalCount++;
      }
    });

    Object.keys(teamResults).forEach((teamId) => {
      let { lostWeightCount, trackedCount, ownGoalCount, milestoneCount } =
        teamResults[teamId];

      if (lostWeightCount >= 3) teamResults[teamId].goals += 1;
      if (lostWeightCount >= 5) teamResults[teamId].goals += 2;
      if (lostWeightCount >= 7) teamResults[teamId].goals += 3;

      if (trackedCount >= 1 && trackedCount <= 3)
        teamResults[teamId].goals += 1;
      if (trackedCount >= 4 && trackedCount <= 6)
        teamResults[teamId].goals += 2;
      if (trackedCount >= 7) teamResults[teamId].goals += 3;

      teamResults[teamId].goals += milestoneCount * 3;

      // ✅ Calculate totalScore (all goals minus own goals)
      teamResults[teamId].totalScore = teamResults[teamId].goals - ownGoalCount;
    });

    console.log("Final Team Results:", teamResults);

    dispatch(updateTeamScores(teamResults));

    setPlayerUpdates({});
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        Log Player Weights
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="border border-gray-300 px-4 py-2">Player</th>
              <th className="border border-gray-300 px-4 py-2">Team</th>
              <th className="border border-gray-300 px-4 py-2">
                Current Weight (kg)
              </th>
              <th className="border border-gray-300 px-4 py-2">
                New Weight (kg)
              </th>
              <th className="border border-gray-300 px-4 py-2">Tracking</th>
              <th className="border border-gray-300 px-4 py-2">Change</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player) => {
              const updates = playerUpdates[player.id] || {};
              const newWeight = updates.newWeight || "";
              const weightChange = newWeight
                ? (newWeight - player.weight).toFixed(1)
                : null;
              const changeColor =
                weightChange < 0
                  ? "text-green-500"
                  : weightChange > 0
                  ? "text-red-500"
                  : "";

              return (
                <tr key={player.id} className="odd:bg-white even:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">
                    {player.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {teamColors[player.teamId] || "Unknown"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {player.weight}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="number"
                      className="w-full p-1 border rounded"
                      placeholder="Enter weight"
                      value={newWeight}
                      onChange={(e) =>
                        handleUpdate(
                          player.id,
                          "newWeight",
                          parseFloat(e.target.value) || ""
                        )
                      }
                      onBlur={() => handleMilestoneCheck(player.id)}
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={updates.tracking || false}
                      onChange={() =>
                        handleUpdate(player.id, "tracking", !updates.tracking)
                      }
                      className="w-5 h-5"
                    />
                  </td>
                  <td
                    className={`border border-gray-300 px-4 py-2 font-bold ${changeColor}`}
                  >
                    {weightChange !== null
                      ? weightChange > 0
                        ? `+${weightChange}`
                        : weightChange
                      : "--"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Submit Weights
        </button>
      </div>
    </div>
  );
};

export default LogWeights;
