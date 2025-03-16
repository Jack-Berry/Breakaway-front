import React, { useState } from "react";
import { useSelector } from "react-redux";

const teamNames = {
  1: "Red",
  2: "Blue",
  3: "Green",
  4: "Black",
};

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

  // Initialize standings
  const standings = {
    1: {
      teamId: 1,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDiff: 0,
      points: 0,
    },
    2: {
      teamId: 2,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDiff: 0,
      points: 0,
    },
    3: {
      teamId: 3,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDiff: 0,
      points: 0,
    },
    4: {
      teamId: 4,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDiff: 0,
      points: 0,
    },
  };

  let matchResults = [];

  Object.keys(results).forEach((gw) => {
    const gameWeekData = results[gw].find((entry) => entry.type === activeTab);

    if (gameWeekData) {
      const fixture = fixtures.find((fix) => `GW${fix.week}` === gw);

      if (fixture) {
        fixture.matches.forEach(({ home, away }) => {
          const homeId = teamMapping[home];
          const awayId = teamMapping[away];

          const homeData = gameWeekData.data[homeId] ?? {};
          const awayData = gameWeekData.data[awayId] ?? {};

          const homeScore =
            activeTab === "Weight" ? homeData.totalScore ?? 0 : homeData ?? 0;
          const awayScore =
            activeTab === "Weight" ? awayData.totalScore ?? 0 : awayData ?? 0;

          // Update match stats
          standings[homeId].played += 1;
          standings[awayId].played += 1;
          standings[homeId].goalsFor += homeScore;
          standings[awayId].goalsFor += awayScore;
          standings[homeId].goalsAgainst += awayScore;
          standings[awayId].goalsAgainst += homeScore;

          // Calculate match outcome
          if (homeScore > awayScore) {
            standings[homeId].points += 3;
            standings[homeId].wins += 1;
            standings[awayId].losses += 1;
          } else if (homeScore < awayScore) {
            standings[awayId].points += 3;
            standings[awayId].wins += 1;
            standings[homeId].losses += 1;
          } else {
            standings[homeId].points += 1;
            standings[awayId].points += 1;
            standings[homeId].draws += 1;
            standings[awayId].draws += 1;
          }

          // Store match results properly
          matchResults.push({
            week: gw.replace("GW", ""),
            homeId,
            awayId,
            homeName: home,
            awayName: away,
            homeScore,
            awayScore,
          });
        });
      }
    }
  });

  // Calculate goal difference
  Object.values(standings).forEach((team) => {
    team.goalDiff = team.goalsFor - team.goalsAgainst;
  });

  // Sort teams by points, then goal difference, then goals scored
  const sortedStandings = Object.values(standings).sort(
    (a, b) =>
      b.points - a.points || b.goalDiff - a.goalDiff || b.goalsFor - a.goalsFor
  );

  // Reverse match results for most recent first
  matchResults = matchResults.reverse();

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4 text-red-700">
        Football Weight Loss League
      </h1>

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
              <th className="border border-gray-300 px-4 py-2">Team</th>
              <th className="border border-gray-300 px-4 py-2">P</th>
              <th className="border border-gray-300 px-4 py-2">W</th>
              <th className="border border-gray-300 px-4 py-2">D</th>
              <th className="border border-gray-300 px-4 py-2">L</th>
              <th className="border border-gray-300 px-4 py-2">F</th>
              <th className="border border-gray-300 px-4 py-2">A</th>
              <th className="border border-gray-300 px-4 py-2">GD</th>
              <th className="border border-gray-300 px-4 py-2">PTS</th>
            </tr>
          </thead>
          <tbody>
            {sortedStandings.map((team) => (
              <tr key={team.teamId} className="odd:bg-white even:bg-gray-100">
                <td
                  className={`border border-gray-300 px-4 py-2 font-bold ${
                    teamColors[team.teamId]
                  }`}
                >
                  {teamNames[team.teamId]}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {team.played}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {team.wins}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {team.draws}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {team.losses}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {team.goalsFor}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {team.goalsAgainst}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {team.goalDiff}
                </td>
                <td className="border border-gray-300 px-4 py-2 font-bold">
                  {team.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Match Results Table */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-center mb-2">
          {activeTab} Match Results
        </h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="border border-gray-300 px-4 py-2">Week</th>
              <th className="border border-gray-300 px-4 py-2">Fixture</th>
              <th className="border border-gray-300 px-4 py-2">Score</th>
            </tr>
          </thead>
          <tbody>
            {matchResults.map(
              ({ week, homeName, awayName, homeScore, awayScore }) => (
                <tr
                  key={`${week}-${homeName}-${awayName}`}
                  className="odd:bg-white even:bg-gray-100"
                >
                  <td className="border border-gray-300 px-4 py-2">
                    Week {week}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {homeName} vs {awayName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {homeScore} - {awayScore}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const teamMapping = { Red: 1, Blue: 2, Green: 3, Black: 4 };

export default League;
