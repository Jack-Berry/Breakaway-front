import React from "react";
import "../index.css";
import Fixtures from "./Fixtures";
import League from "./League";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-screen">
      <h1 className="text-3xl font-bold text-red-700">
        Football Weight Loss League
      </h1>
      <League />
      <Fixtures />
    </div>
  );
};

export default Home;
