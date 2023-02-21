import TeamRoster from "./TeamRoster";
import Summary from "./Summary";
import "./App.css";

const fantasyTeams: Array<string> = ["Lil Nish", "Shenanigans Fc"];

function App() {
  //TODO: create page with agg stats from each team
  return (
    <div className="App">
      <Summary fantasyTeams={fantasyTeams}></Summary>
    </div>
  );
}

export default App;
