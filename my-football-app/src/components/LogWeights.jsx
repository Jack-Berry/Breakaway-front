import React, { useState } from "react";
import { useSelector } from "react-redux";

const teamColors = {
  1: "Red",
  2: "Blue",
  3: "Green",
  4: "Black",
};

const LogWeights = () => {
  const players = useSelector((state) => state.players.players); // Get players from Redux store
  const [weights, setWeights] = useState({}); // Store new weights

  // Sort players by teamId
  const sortedPlayers = [...players].sort((a, b) => a.teamId - b.teamId);

  // Handle weight input
  const handleWeightChange = (playerId, newWeight) => {
    setWeights((prev) => ({
      ...prev,
      [playerId]: newWeight,
    }));
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
              <th className="border border-gray-300 px-4 py-2">Change</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player) => {
              const currentWeight = player.weight;
              const newWeight = weights[player.id] || "";
              const weightChange = newWeight
                ? (newWeight - currentWeight).toFixed(1)
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
                    {currentWeight}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="number"
                      className="w-full p-1 border rounded"
                      placeholder="Enter weight"
                      value={newWeight}
                      onChange={(e) =>
                        handleWeightChange(
                          player.id,
                          parseFloat(e.target.value) || ""
                        )
                      }
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
    </div>
  );
};

export default LogWeights;
