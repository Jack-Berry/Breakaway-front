import React, { useState } from "react";
import { useSelector } from "react-redux";

const teamColors = {
  1: "text-red-500",
  2: "text-blue-500",
  3: "text-green-500",
  4: "text-black",
};

const tabOptions = ["Combined", "Pitch", "Weight"];

const League = () => {
  const [activeTab, setActiveTab] = useState("Combined");
  const results = useSelector((state) => state.results.results);
  const fixtures = useSelector((state) => state.league.fixtures);

  // Extract data for the selected tab (GW-wise)
  const standings = {};
  const matchResults = [];

  Object.keys(results).forEach((gw) => {
    const gameWeekData = results[gw].find((entry) => entry.type === activeTab);

    if (gameWeekData) {
      // Collect team scores
      Object.entries(gameWeekData.data).forEach(([teamId, score]) => {
        const teamNum = parseInt(teamId);
        if (!standings[teamNum]) {
          standings[teamNum] = { teamId: teamNum, points: 0 };
        }
        standings[teamNum].points += score;
      });

      // Collect match results
      matchResults.push({
        week: gw,
        data: gameWeekData.data,
      });
    }
  });

  // Sort teams by total points descending
  const sortedStandings = Object.values(standings).sort(
    (a, b) => b.points - a.points
  );

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Tabs for League Selection */}
      <div className="flex justify-center mb-4 space-x-4">
        {tabOptions.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-lg ${
              activeTab === tab
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab} League
          </button>
        ))}
      </div>

      {/* League Table */}
      <div className="overflow-x-auto">
        <h2 className="text-2xl font-semibold text-center mb-2">
          {activeTab} League Table
        </h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="border border-gray-300 px-4 py-2">Position</th>
              <th className="border border-gray-300 px-4 py-2">Team</th>
              <th className="border border-gray-300 px-4 py-2">Points</th>
            </tr>
          </thead>
          <tbody>
            {sortedStandings.map((team, index) => (
              <tr key={team.teamId} className="odd:bg-white even:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">
                  {index + 1}
                </td>
                <td
                  className={`border border-gray-300 px-4 py-2 font-bold ${
                    teamColors[team.teamId]
                  }`}
                >
                  Team {team.teamId}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {team.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Match Results */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-center mb-2">
          {activeTab} Match Results
        </h2>
        {matchResults.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="border border-gray-300 px-4 py-2">
                    Game Week
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Fixture</th>
                  <th className="border border-gray-300 px-4 py-2">Score</th>
                </tr>
              </thead>
              <tbody>
                {matchResults.map(({ week, data }) => {
                  const fixture = fixtures.find(
                    (fix) => `GW${fix.week}` === week
                  );

                  return fixture
                    ? fixture.matches.map((match, index) => (
                        <tr
                          key={`${week}-${index}`}
                          className="odd:bg-white even:bg-gray-100"
                        >
                          <td className="border border-gray-300 px-4 py-2">
                            {week}
                          </td>
                          <td
                            className={`border border-gray-300 px-4 py-2 font-bold`}
                          >
                            {match.home} vs {match.away}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {data[teamMapping[match.home]] ?? "-"} -{" "}
                            {data[teamMapping[match.away]] ?? "-"}
                          </td>
                        </tr>
                      ))
                    : null;
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No results recorded for {activeTab} League yet.
          </p>
        )}
      </div>
    </div>
  );
};

// Map team names to numeric team IDs for results lookup
const teamMapping = {
  Red: 1,
  Blue: 2,
  Green: 3,
  Black: 4,
};

export default League;
