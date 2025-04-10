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
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Step 2: Schema Design</h2>

      {tables.map((table, tableIndex) => (
        <div key={tableIndex} className="mb-6 border p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <input
              type="text"
              placeholder="Table Name"
              className="border p-2 w-full"
              value={table.name}
              onChange={(e) =>
                handleTableChange(tableIndex, "name", e.target.value)
              }
            />
            <button
              className="ml-2 text-red-500 hover:text-red-700"
              onClick={() => handleRemoveTable(tableIndex)}
            >
              🗑 Remove Table
            </button>
          </div>

          {table.columns.map((column, colIndex) => (
            <div key={colIndex} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Column Name"
                className="border p-2 flex-1"
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
                className="border p-2"
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
                className="border p-2"
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
                  className="border p-2"
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
                className="text-red-500 hover:text-red-700"
                onClick={() => handleRemoveColumn(tableIndex, colIndex)}
              >
                🗑
              </button>
            </div>
          ))}

          <button
            className="text-sm text-blue-600 mt-2 hover:underline"
            onClick={() => handleAddColumn(tableIndex)}
          >
            ➕ Add Column
          </button>
        </div>
      ))}

      <button
        className="text-sm text-blue-600 mb-4 hover:underline"
        onClick={handleAddTable}
      >
        ➕ Add Table
      </button>

      <div className="flex justify-between mt-4">
        <button
          onClick={onBack}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          ⬅ Back
        </button>
        <button onClick={onNext}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step2SchemaDesign;
