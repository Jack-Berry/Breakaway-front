import React from "react";
import "../index.css";
import Fixtures from "./Fixtures";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-screen">
      <h1 className="text-3xl font-bold text-red-700">
        Football Weight Loss League
      </h1>
      <p>Loaded</p>
      <Fixtures />
    </div>
  );
};

export default Home;
