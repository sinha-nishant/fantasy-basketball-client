import React, { useEffect, useMemo, useRef, useState } from "react";
import logo from "./logo.svg";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-balham.css";

interface FantasyTeam {
    fantasyTeam: string;
}

export default function TeamDisplay({fantasyTeam}:FantasyTeam) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  const [columnDefs] = useState([
    { field: "Name", checkboxSelection: true, minWidth: 200 },
    { field: "Fantasy Team", minWidth: 150},
    { field: "PTS" },
    { field: "BLK" },
    { field: "STL" },
    { field: "TO" },
    { field: "REB" },
    { field: "FGA" },
    { field: "FGM" },
    { field: "3PTA" },
    { field: "3PTM" },
    { field: "AST" },
  ]);

  const gridRef = useRef(null);

  useEffect(() => {
    fetch(
      "https://pl7wfzdcfy2pn3hpb6yasvquwe0vxlfa.lambda-url.us-east-1.on.aws/"
    )
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);
          setIsLoaded(true);
          setItems(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  // access API from event object
  const onGridReady = (e: {
    api: { sizeColumnsToFit: () => void };
    columnApi: { resetColumnState: () => void };
  }) => {
    e.api.sizeColumnsToFit();
    e.columnApi.resetColumnState();
  };

  return (
    <div className="TeamDisplay">
      <div
        className="ag-theme-balham"
        style={{ height: "90vh", width: "90%", margin: "auto" }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={items}
          columnDefs={columnDefs}
          rowSelection={"multiple"}
          onGridReady={onGridReady}
          groupSelectsChildren={true}
        ></AgGridReact>
      </div>
    </div>
  );
}
