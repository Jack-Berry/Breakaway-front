import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPlayers } from "./store/playerSlice";
import { setFixtures } from "./store/leagueSlice";
import { loadFakeResults } from "./store/resultsSlice";
import playerData from "./fakeData/fake_players.json";
import fixtureData from "./fakeData/fake_fixtures.json";
import resultData from "./fakeData/fake_results.json";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import LogWeights from "./components/LogWeights";
import LogPitch from "./components/LogPitch";

const App = () => {
  const dispatch = useDispatch();
  const players = useSelector((state) => state.players.players);

  useEffect(() => {
    // Simulate an API call with a timeout
    setTimeout(() => {
      dispatch(setPlayers(playerData));
      dispatch(setFixtures(fixtureData));
      dispatch(loadFakeResults(resultData));
    }, 500); // Simulated delay
  }, [dispatch]);

  if (players == null || players.length === 0) {
    return (
      <div>
        <p>Loading player data...</p>
      </div>
    );
  }

  return (
    <div>
      <nav className="p-4 bg-red-400 flex flex-row justify-between">
        <Link to="/" className="text-white text-xl">
          Home
        </Link>{" "}
        |{" "}
        <Link to="/player-weights" className="text-white text-xl">
          Add Player Weights
        </Link>{" "}
        |{" "}
        <Link to="/pitch-results" className="text-white text-xl">
          Add Pitch Results
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/player-weights" element={<LogWeights />} />
        <Route path="/pitch-results" element={<LogPitch />} />
      </Routes>
    </div>
  );
};

export default App;
