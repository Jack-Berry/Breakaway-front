import React from "react";
import "../index.css";
import Fixtures from "./Fixtures";
import League from "./League";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-screen">
      <League />
      <Fixtures />
    </div>
  );
};

export default Home;
