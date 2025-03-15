import React from "react";
import "../index.css";

const Home = () => {
  return (
    <div>
      <h1>Football Weight Loss League</h1>
      <button onClick={() => console.log(players)}>Log Weight</button>
      <h1 className="text-3xl font-bold text-blue-500">Tailwind is Working!</h1>
      <p>Loaded</p>
    </div>
  );
};

export default Home;
