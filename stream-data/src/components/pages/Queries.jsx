import React, { useState } from "react";
import "../presentation/Queries.css";

const Queries = () => {
  const [selectedAggregate, setSelectedAggregate] = useState(""); // Aggregate function
  const [queryOutput, setQueryOutput] = useState(""); // Output box

  // Generate SQL query
  const handleRunQuery = () => {
    if (!selectedAggregate) {
      alert("Please select an aggregate function.");
      return;
    }
    setQueryOutput(`SELECT ${selectedAggregate} FROM my_table;`);
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h2>Query Builder</h2>

        {/* Aggregate Function Dropdown */}
        <label>Aggregate Function:</label>
        <select value={selectedAggregate} onChange={(e) => setSelectedAggregate(e.target.value)}>
          <option value="">Select Function</option>
          <option value="SUM">SUM</option>
          <option value="AVG">AVG</option>
          <option value="MAX">MAX</option>
          <option value="MIN">MIN</option>
          <option value="COUNT">COUNT</option>
        </select>

        {/* Hardcoded Checkboxes */}
        <h3>Columns:</h3>
        <div className="column-list">
          <label><input type="checkbox" /> Column 1</label>
          <label><input type="checkbox" /> Column 2</label>
          <label><input type="checkbox" /> Column 3</label>
          <label><input type="checkbox" /> Column 4</label>
        </div>

        {/* Output Box */}
        <h3>Generated Query:</h3>
        <textarea className="output-box" value={queryOutput} readOnly />

        {/* Run Button */}
        <button onClick={handleRunQuery}>Run</button>
      </div>
    </div>
  );
};

export default Queries;

