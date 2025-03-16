import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updatePitchScores } from "../store/resultsSlice";

const teamMapping = {
  Red: 1,
  Blue: 2,
  Green: 3,
  Black: 4,
};

const teamColors = {
  1: "text-red-500",
  2: "text-blue-500",
  3: "text-green-500",
  4: "text-black",
};

const LogPitch = () => {
  const dispatch = useDispatch();
  const fixtures = useSelector((state) => state.league.fixtures);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [matchScores, setMatchScores] = useState({});

  // Get unique weeks
  const uniqueWeeks = [...new Set(fixtures.map((fixture) => fixture.week))];

  // Get fixtures for the selected week (two matches)
  const selectedFixture = fixtures.find(
    (fixture) => fixture.week === selectedWeek
  );

  const handleScoreChange = (week, matchIndex, team, value) => {
    setMatchScores((prev) => ({
      ...prev,
      [`${week}-${matchIndex}`]: {
        ...prev[`${week}-${matchIndex}`],
        [team]: value,
      },
    }));
  };

  const handleSubmit = () => {
    if (!selectedFixture) return;

    const pitchResults = {};

    selectedFixture.matches.forEach((match, index) => {
      const matchKey = `${selectedFixture.week}-${index}`;
      const matchData = matchScores[matchKey];

      if (
        matchData?.homeScore !== undefined &&
        matchData?.awayScore !== undefined
      ) {
        // **Convert team names to numeric team IDs**
        const homeTeamId = teamMapping[match.home];
        const awayTeamId = teamMapping[match.away];

        if (!homeTeamId || !awayTeamId) {
          console.error(
            `Invalid team names in fixture: ${match.home}, ${match.away}`
          );
          return;
        }

        pitchResults[homeTeamId] = matchData.homeScore;
        pitchResults[awayTeamId] = matchData.awayScore;
      }
    });

    dispatch(
      updatePitchScores({
        week: selectedFixture.week,
        results: pitchResults, // Store scores under **numeric team IDs**
      })
    );

    console.log(" Final Pitch Scores Submitted:", pitchResults);
    setMatchScores({});
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Log Pitch Results</h1>

      {/* Week Selector Dropdown */}
      <div className="text-center mb-4">
        <label className="font-semibold mr-2">Select Week:</label>
        <select
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
          className="p-2 border rounded"
        >
          {uniqueWeeks.map((week) => (
            <option key={week} value={week}>
              Week {week}
            </option>
          ))}
        </select>
      </div>

      {selectedFixture ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="border border-gray-300 px-4 py-2">Date</th>
                <th className="border border-gray-300 px-4 py-2">Time</th>
                <th className="border border-gray-300 px-4 py-2">Home Team</th>
                <th className="border border-gray-300 px-4 py-2">Score</th>
                <th className="border border-gray-300 px-4 py-2">Away Team</th>
                <th className="border border-gray-300 px-4 py-2">Score</th>
              </tr>
            </thead>
            <tbody>
              {selectedFixture.matches.map((match, index) => {
                const matchKey = `${selectedFixture.week}-${index}`;
                const homeScore = matchScores[matchKey]?.homeScore || "";
                const awayScore = matchScores[matchKey]?.awayScore || "";

                const homeTeamId = teamMapping[match.home];
                const awayTeamId = teamMapping[match.away];

                return (
                  <tr key={matchKey} className="odd:bg-white even:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">
                      {selectedFixture.date}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {match.time}
                    </td>
                    <td
                      className={`border border-gray-300 px-4 py-2 font-bold ${teamColors[homeTeamId]}`}
                    >
                      {match.home}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="number"
                        className="w-16 p-1 border rounded text-center"
                        placeholder="0"
                        value={homeScore}
                        onChange={(e) =>
                          handleScoreChange(
                            selectedFixture.week,
                            index,
                            "homeScore",
                            parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </td>
                    <td
                      className={`border border-gray-300 px-4 py-2 font-bold ${teamColors[awayTeamId]}`}
                    >
                      {match.away}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="number"
                        className="w-16 p-1 border rounded text-center"
                        placeholder="0"
                        value={awayScore}
                        onChange={(e) =>
                          handleScoreChange(
                            selectedFixture.week,
                            index,
                            "awayScore",
                            parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-red-500">
          No matches found for this week.
        </p>
      )}

      <div className="text-center mt-6">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Submit Results
        </button>
      </div>
    </div>
  );
};

export default LogPitch;
