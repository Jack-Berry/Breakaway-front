import React from "react";
import { useSelector } from "react-redux";

const Fixtures = () => {
  const fixtures = useSelector((state) => state.league.fixtures);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Fixtures</h2>

      {fixtures.length === 0 ? (
        <p className="text-center">Loading fixtures...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="border border-gray-300 px-4 py-2">Week</th>
                <th className="border border-gray-300 px-4 py-2">Date</th>
                <th className="border border-gray-300 px-4 py-2">Time</th>
                <th className="border border-gray-300 px-4 py-2">Match</th>
              </tr>
            </thead>
            <tbody>
              {fixtures.map((week) =>
                week.matches.map((match, index) => (
                  <tr
                    key={`${week.week}-${index}`}
                    className="odd:bg-white even:bg-gray-100"
                  >
                    {index === 0 && (
                      <td
                        rowSpan={week.matches.length}
                        className="border border-gray-300 px-4 py-2 font-bold text-center bg-gray-100"
                      >
                        {week.week}
                      </td>
                    )}
                    {index === 0 && (
                      <td
                        rowSpan={week.matches.length}
                        className="border border-gray-300 px-4 py-2 font-bold text-center bg-gray-100"
                      >
                        {week.date}
                      </td>
                    )}
                    <td className="border border-gray-300 px-4 py-2">
                      {match.time}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {match.home} <span className="font-bold">vs</span>{" "}
                      {match.away}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Fixtures;
