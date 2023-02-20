import React, { useEffect, useMemo, useRef, useState } from "react";
import logo from "./logo.svg";
import TeamDisplay from "./TeamDisplay";
import "./App.css";

function App() {

  return (
    <div className="App">
      <TeamDisplay fantasyTeam=""></TeamDisplay>
    </div>
  );
}

export default App;
