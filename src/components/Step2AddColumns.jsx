import React, { useState, useEffect } from "react";

const Step2AddColumns = ({ streams,onNext }) => {
  const [selectedStream, setSelectedStream] = useState("");
  const [columns, setColumns] = useState([
    { colName: "", dataType: "", isPrimaryKey: false },
  ]);
  const [savedColumns, setSavedColumns] = useState([]);  // Track saved columns

  const sqlDataTypes = [
    "INT",
    "VARCHAR",
    "TEXT",
    "FLOAT",
    "DOUBLE",
    "DATE",
    "BOOLEAN",
    "CHAR",
    "BIGINT",
    "DECIMAL",
  ];

  // useEffect to trigger when selectedStream changes
  useEffect(() => {
    if (selectedStream) {
      console.log("Selected Stream ID:", selectedStream);
    }
  }, [selectedStream]); // Dependency on selectedStream

  const handleColumnChange = (index, field, value) => {
    const updated = [...columns];
    updated[index][field] = value;
    setColumns(updated);
  };

  const handleDeleteColumn = (index) => {
    const updated = columns.filter((_, i) => i !== index);
    setColumns(updated);
  };

  const handleSaveColumn = async (index) => {
    const column = columns[index];

    if (!column.colName || !column.dataType) {
      alert("Column name and data type are required.");
      return;
    }

    const payload = {
      stream: {
        streamId: Number(selectedStream), // Send the streamId based on selectedStream
      },
      streamColName: column.colName,
      streamColDataType: column.dataType,
    };

    try {
      const response = await fetch("http://localhost:8081/ingestion/stream-col", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save column.");
      }

      const resultText = await response.text();
      console.log("Column saved:", resultText);
      alert("Column saved successfully!");

      // Mark this column as saved by adding it to the savedColumns state
      setSavedColumns((prevSaved) => [
        ...prevSaved,
        { ...column, streamId: selectedStream },
      ]);
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save column: " + err.message);
    }
  };

  // const handleNext = () => {
  //   console.log('Saved Columns:', savedColumns); // Check saved columns
  //   if (savedColumns.length === columns.length) {
  //     onNext(savedColumns); // Call onNext function from parent
  //     console.log("Proceeding to the next step");
  //   } else {
  //     alert("Please save all columns before proceeding.");
  //   }
  // };
  const handleNext = async () => {
    console.log('Saved Columns:', savedColumns); // Check saved columns
  
    if (savedColumns.length === columns.length) {
      try {
        const response = await fetch("http://localhost:8081/ingestion/stream-col");
        if (!response.ok) {
          throw new Error("Failed to fetch all columns");
        }
        const allColumns = await response.json();
        console.log("Fetched all columns from DB:", allColumns);
  
        onNext(allColumns); // send all entries to parent
      } catch (err) {
        console.error("Fetch failed:", err);
        alert("Failed to fetch all columns: " + err.message);
      }
    } else {
      alert("Please save all columns before proceeding.");
    }
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
      <div className="position-absolute top-0 start-0 w-100 p-3 bg-white shadow-sm">
        <div className="d-flex justify-content-center gap-4">
          <span className="fw-bold text-primary">Step 2</span>
        </div>
      </div>

      <div
        className="bg-white p-4 rounded shadow"
        style={{ width: "700px", minHeight: "600px" }}
      >
        <h2 className="text-primary mb-4 text-center">Step 2: Add Columns</h2>

        <div className="mb-4">
          <label className="form-label fw-bold">Select Stream</label>
          <select
            value={selectedStream}
            onChange={(e) => setSelectedStream(e.target.value)} // Update selectedStream on change
            className="form-select"
            style={{ padding: "12px", fontSize: "16px" }}
          >
            <option value="">-- Select Stream --</option>
            {streams && streams.length > 0 ? (
              streams.map((stream) => (
                <option key={stream.streamId} value={stream.streamId}> {/* use streamId as value */}
                  {stream.streamName}
                </option>
              ))
            ) : (
              <option disabled>No streams available</option>
            )}
          </select>
        </div>

        {columns.map((column, index) => (
          <div
            key={index}
            className="mb-3"
            style={{
              backgroundColor: savedColumns.includes(index) ? "#d4edda" : "transparent", // Green shade for saved rows
              transition: "background-color 0.3s",
            }}
          >
            <div className="d-flex gap-3 align-items-center flex-wrap">
              <input
                type="text"
                value={column.colName}
                onChange={(e) => handleColumnChange(index, "colName", e.target.value)}
                className="form-control"
                placeholder="Column Name"
                style={{ fontSize: "16px", padding: "12px", flex: "1" }}
              />
              <select
                value={column.dataType}
                onChange={(e) => handleColumnChange(index, "dataType", e.target.value)}
                className="form-select"
                style={{ fontSize: "16px", padding: "12px", flex: "1" }}
              >
                <option value="">-- Select Data Type --</option>
                {sqlDataTypes.map((dt) => (
                  <option key={dt} value={dt}>
                    {dt}
                  </option>
                ))}
              </select>
              <label style={{ flexShrink: 0 }}>
                <input
                  type="checkbox"
                  checked={column.isPrimaryKey}
                  onChange={(e) =>
                    handleColumnChange(index, "isPrimaryKey", e.target.checked)
                  }
                  style={{ marginRight: "4px" }}
                />
                PK
              </label>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleDeleteColumn(index)}
              >
                Delete
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={() => handleSaveColumn(index)}
              >
                Save
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-secondary w-100 mt-3"
          onClick={() =>
            setColumns([...columns, { colName: "", dataType: "", isPrimaryKey: false }])
          }
        >
          ➕ Add Column
        </button>

        <button
          type="button"
          className="btn btn-primary w-100 mt-4"
          onClick={handleNext}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Step2AddColumns;
