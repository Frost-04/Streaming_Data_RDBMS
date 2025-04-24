import React from "react";

const Step2SchemaDesign = ({ tables, setTables, onBack, onNext }) => {
  const handleAddTable = () => {
    setTables([
      ...tables,
      {
        name: "",
        columns: [
          { name: "", datatype: "VARCHAR", key: "None", foreignKeyRef: "" },
        ],
      },
    ]);
  };

  const handleRemoveTable = (index) => {
    const newTables = tables.filter((_, i) => i !== index);
    setTables(newTables);
  };

  const handleTableChange = (index, key, value) => {
    const newTables = [...tables];
    newTables[index][key] = value;
    setTables(newTables);
  };

  const handleAddColumn = (tableIndex) => {
    const newTables = [...tables];
    newTables[tableIndex].columns.push({
      name: "",
      datatype: "VARCHAR",
      key: "None",
      foreignKeyRef: "",
    });
    setTables(newTables);
  };

  const handleRemoveColumn = (tableIndex, colIndex) => {
    const newTables = [...tables];
    newTables[tableIndex].columns.splice(colIndex, 1);
    setTables(newTables);
  };

  const handleColumnChange = (tableIndex, colIndex, key, value) => {
    const newTables = [...tables];
    newTables[tableIndex].columns[colIndex][key] = value;
    setTables(newTables);
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
        position: "relative",
      }}
    >
      {/* Step Progress Bar */}
      <div className="position-absolute top-0 start-0 w-100 p-3 bg-white shadow-sm">
        <div className="d-flex justify-content-center gap-4">
          <span className="text-muted">Step 1</span>
          <span className="fw-bold text-primary">Step 2</span>
          <span className="text-muted">Step 3</span>
          <span className="text-muted">Step 4</span>
        </div>
      </div>

      {/* Schema Design Card */}
      <div className="bg-white p-4 rounded shadow" style={{ width: "90%", maxWidth: "900px", maxHeight: "90vh", overflowY: "auto" }}>
        <h2 className="text-primary mb-4 text-center">Step 2: Schema Design</h2>

        {tables.map((table, tableIndex) => (
          <div key={tableIndex} className="mb-4 border p-3 rounded">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <input
                type="text"
                placeholder="Table Name"
                className="form-control me-2"
                value={table.name}
                onChange={(e) =>
                  handleTableChange(tableIndex, "name", e.target.value)
                }
              />
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => handleRemoveTable(tableIndex)}
              >
                🗑 Remove Table
              </button>
            </div>

            {table.columns.map((column, colIndex) => (
              <div key={colIndex} className="d-flex align-items-center mb-2 gap-2">
                <input
                  type="text"
                  placeholder="Column Name"
                  className="form-control"
                  value={column.name}
                  onChange={(e) =>
                    handleColumnChange(
                      tableIndex,
                      colIndex,
                      "name",
                      e.target.value
                    )
                  }
                />
                <select
                  className="form-select"
                  value={column.datatype}
                  onChange={(e) =>
                    handleColumnChange(
                      tableIndex,
                      colIndex,
                      "datatype",
                      e.target.value
                    )
                  }
                >
                  <option>VARCHAR</option>
                  <option>INT</option>
                  <option>BOOLEAN</option>
                  <option>DATE</option>
                  <option>FLOAT</option>
                </select>
                <select
                  className="form-select"
                  value={column.key}
                  onChange={(e) =>
                    handleColumnChange(
                      tableIndex,
                      colIndex,
                      "key",
                      e.target.value
                    )
                  }
                >
                  <option>None</option>
                  <option>Primary</option>
                  <option>Foreign</option>
                </select>
                {column.key === "Foreign" && (
                  <input
                    type="text"
                    placeholder="Refers to table.column"
                    className="form-control"
                    value={column.foreignKeyRef}
                    onChange={(e) =>
                      handleColumnChange(
                        tableIndex,
                        colIndex,
                        "foreignKeyRef",
                        e.target.value
                      )
                    }
                  />
                )}
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleRemoveColumn(tableIndex, colIndex)}
                >
                  🗑
                </button>
              </div>
            ))}

            <button
              className="btn btn-link text-primary p-0"
              onClick={() => handleAddColumn(tableIndex)}
            >
              ➕ Add Column
            </button>
          </div>
        ))}

        <button
          className="btn btn-link text-primary mb-3 p-0"
          onClick={handleAddTable}
        >
          ➕ Add Table
        </button>

        <div className="d-flex justify-content-between mt-4">
          <button onClick={onBack} className="btn btn-primary">
            ⬅ Back
          </button>
          <button onClick={onNext} className="btn btn-primary">
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step2SchemaDesign;
