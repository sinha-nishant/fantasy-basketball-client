import { useEffect, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-balham.css";

interface Player {
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

interface SummaryData {
  "Fantasy Team": string;
  PTS: number;
  AST: number;
  BLK: number;
  STL: number;
  REB: number;
  AFG: number;
  ATO: number;
}

interface FantasyTeams {
  fantasyTeams: Array<string>;
}

export default function Summary(fantasyTeams: FantasyTeams) {
  const [error, setError] = useState(null);
  const [summaries, setSummaries] = useState<Array<object>>([]);

  const [columnDefs] = useState([
    { field: "Fantasy Team", minWidth: 150 },
    { field: "PTS" },
    { field: "AST" },
    { field: "BLK" },
    { field: "STL" },
    { field: "REB" },
    { field: "AFG" },
    { field: "ATO" },
  ]);

  const gridRef = useRef(null);
  const ENDPOINT = process.env.REACT_APP_ENDPOINT;

  function getSummaries(fantasyTeams: FantasyTeams, players: Array<Player>) {
    let summaries: any[] = [];
    fantasyTeams.fantasyTeams.forEach((fantasyTeam) => {
      const teamPlayers = getPlayersInTeam(fantasyTeam, players);
      let PTS = 0;
      let AST = 0;
      let BLK = 0;
      let STL = 0;
      let TO = 0;
      let REB = 0;
      let FGA = 0;
      let FGM = 0;
      let ThreeAtt = 0;
      let ThreeMade = 0;
      teamPlayers.forEach((player) => {
        PTS += player.PTS;
        AST += player.AST;
        BLK += player.BLK;
        STL += player.STL;
        TO += player.TO;
        REB += player.REB;
        FGA += player.FGA;
        FGM += player.FGM;
        ThreeAtt += player["3PTA"];
        ThreeMade += player["3PTM"];
      });

      let ATO = AST / TO;
      let AFG = (100 * (1.5 * ThreeMade + (FGM - ThreeMade))) / FGA;

      let summary: any = {
        PTS: PTS,
        AST: AST,
        BLK: BLK,
        STL: TO,
        REB: REB,
        AFG: AFG,
        ATO: ATO,
      };
      for (const key in summary) {
        summary[key] = +summary[key].toFixed(3);
      }
      summary["Fantasy Team"] = fantasyTeam;
      summaries.push(summary);
    });

    return summaries;
  }

  function getPlayersInTeam(fantasyTeam: string, players: Array<Player>) {
    return players.filter((player) => {
      return player["Fantasy Team"] === fantasyTeam;
    });
  }

  useEffect(() => {
    fetch(`https://${ENDPOINT}.lambda-url.us-east-1.on.aws/`)
      .then((res) => res.json())
      .then(
        (result) => {
          setSummaries(getSummaries(fantasyTeams, result));
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setError(error);
        }
      );
  }, [ENDPOINT, fantasyTeams]);

  // access API from event object
  const onGridReady = (e: {
    api: { sizeColumnsToFit: () => void };
    columnApi: { resetColumnState: () => void };
  }) => {
    e.api.sizeColumnsToFit();
    e.columnApi.resetColumnState();
  };

  return (
    <div className="Summary">
      <div
        className="ag-theme-balham"
        style={{ height: "90vh", width: "90%", margin: "auto" }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={summaries}
          columnDefs={columnDefs}
          rowSelection={"multiple"}
          onGridReady={onGridReady}
        ></AgGridReact>
      </div>
    </div>
  );
}
