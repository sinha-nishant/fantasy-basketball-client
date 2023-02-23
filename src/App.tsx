import Summary from "./Summary";
import "./App.css";
import {useLayoutEffect, useState } from "react";

export interface Player {
  Name: string;
  "Fantasy Team": string;
  PTS: number;
  BLK: number;
  STL: number;
  TO: number;
  REB: number;
  FGA: number;
  FGM: number;
  "3PTA": number;
  "3PTM": number;
  AST: number;
}

function App() {
  const [ready, setReady] = useState<boolean>(false);
  const [players, setPlayers] = useState<Array<Player>>([]);
  const [error, setError] = useState(null);

  const fantasyTeams: Array<string> = [
    "Lil Nish",
    "Shenanigans Fc",
    "We believe In the 'lac",
    "Dhruv All Stars",
    "Paid Board Men",
    "Sap Squad"
  ];

  const ENDPOINT = process.env.REACT_APP_ENDPOINT;

  useLayoutEffect(() => {
    console.log("trying to fetch")
    fetch(`https://${ENDPOINT}.lambda-url.us-east-1.on.aws/`)
      .then((res) => res.json())
      .then(
        (result) => {
          console.log("result ", result)
          setPlayers(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setError(error);
          console.log(error)
        }
      );
  }, [ENDPOINT]);

  console.log("past fetch");

  //TODO: create page with agg stats from each team
  return players.length===0 ? (
    <div className="App">
      Loading
    </div>
  ) : (
    <div className="App">
      <Summary fantasyTeams={fantasyTeams} players={players}></Summary>
    </div>
  );
}

export default App;
