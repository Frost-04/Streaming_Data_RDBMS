import React from "react";
import DataStructure from "./components/pages/DataStructure";
import DataSource from "./components/pages/DataSource";
import WindowType from "./components/pages/WindowType";
import Queries from "./components/pages/Queries";

function App() {
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Data Structure Page</h1>
      <DataStructure />
      <h1>Data Source Page</h1>
      <DataSource />
      <h1 style={{ textAlign: "center" }}>Window Type Page</h1>
      <WindowType />
      <h1 style={{ textAlign: "center" }}>Queries</h1>
      <Queries />
    </div>
  );
}

export default App;
