import { useLayoutEffect, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-balham.css";
import { Player } from "./App";

interface Props {
  fantasyTeams: Array<string>;
  players: Array<Player>;
}

export default function Summary({ fantasyTeams, players }: Props) {
  console.log("players in summary ", players);

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
    { field: "TO" },
  ]);

  const gridRef = useRef(null);

  function getSummaries(
    fantasyTeams: Props["fantasyTeams"],
    players: Props["players"]
  ) {
    console.log(fantasyTeams);
    console.log(players);
    let summaries: any[] = [];
    fantasyTeams.forEach((fantasyTeam) => {
      const teamPlayers = getPlayersInTeam(fantasyTeam, players);
      let PTS = 0;
      let AST = 0;
      let BLK = 0;
      let STL = 0;
      let TO = 0;
      let REB = 0;
      let FGA = 0;
      let FGM = 0;
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
        ThreeMade += player["3PTM"];
      });

      let ATO = AST / TO;
      let AFG = (100 * (1.5 * ThreeMade + (FGM - ThreeMade))) / FGA;

      let summary: any = {
        PTS: PTS,
        AST: AST,
        BLK: BLK,
        STL: STL,
        REB: REB,
        AFG: AFG,
        ATO: ATO,
        TO: TO,
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

  const onGridReady = (e: {
    api: { sizeColumnsToFit: () => void };
    columnApi: { resetColumnState: () => void };
  }) => {
    e.api.sizeColumnsToFit();
    e.columnApi.resetColumnState();
  };

  const test = null;

  useLayoutEffect(() => {
    setSummaries(getSummaries(fantasyTeams, players));
  }, []);

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
