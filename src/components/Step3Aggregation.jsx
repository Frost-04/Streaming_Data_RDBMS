import React, { useState } from "react";

const Step3Aggregation = ({ streams, columns, onNext }) => {
  const [selectedStream, setSelectedStream] = useState("");
  const [selectedColumnId, setSelectedColumnId] = useState("");
  const [aggFunction, setAggFunction] = useState("");
  const [savedAggregation, setSavedAggregation] = useState(false);

  const aggFunctions = ["Minimum", "Maximum", "Average", "Sum"];  
  console.log("All columns:", columns);

  const handleSubmit = async () => {
    console.log("Selected Stream:", selectedStream);
  console.log("Selected Column ID:", selectedColumnId);
  console.log("Streams:", streams);
  console.log("Columns:", columns);
  
  const stream = streams.find((s) => s.streamId === Number(selectedStream));
  const column = columns.find((col) => col.streamColId === Number(selectedColumnId));
  
  console.log("Stream data:", stream);
  console.log("Column data:", column);
  
    if (!stream || !column) {
      alert("Please select a valid stream and column.");
      return;
    }

    const payload = {
      stream: {
        streamId: stream.streamId,
      },
      streamCol: {
        streamColId: column.streamColId,
      },
      aggFunction:aggFunction,
    };

    try {
      const response = await fetch("http://localhost:8081/ingestion/stream-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save aggregation function.");
      }

      const resultText = await response.text();
      console.log("Aggregation function saved:", resultText);
      alert("Aggregation function saved successfully!");
      setSavedAggregation(true);
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save aggregation function: " + err.message);
    }
  };

  const filteredColumns = columns.filter(
    (col) => Number(col.streamId) === Number(selectedStream)
  );

  const handleNext = () => {
    if (!savedAggregation) {
      alert("Please save the aggregation before proceeding.");
      return;
    }
    onNext(); // Call onNext from parent when ready to move to next step
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
          <span className="fw-bold text-primary">Step 3</span>
        </div>
      </div>

      <div
        className="bg-white p-4 rounded shadow"
        style={{ width: "700px", minHeight: "600px" }}
      >
        <h2 className="text-primary mb-4 text-center">Step 3: Select Aggregation</h2>

        <div className="mb-4">
          <label className="form-label fw-bold">Select Stream</label>
          <select
            value={selectedStream}
            onChange={(e) => {
              setSelectedStream(e.target.value);
              setSelectedColumnId(""); // Reset column selection when stream changes
            }}
            className="form-select"
            style={{ padding: "12px", fontSize: "16px" }}
          >
            <option value="">-- Select Stream --</option>
            {streams.map((stream) => (
              <option key={stream.streamId} value={stream.streamId}>
                {stream.streamName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="form-label fw-bold">Select Column</label>
          <select
            value={selectedColumnId}
            onChange={(e) => setSelectedColumnId(e.target.value)}
            disabled={!selectedStream}
            className="form-select"
            style={{ padding: "12px", fontSize: "16px" }}
          >
            <option value="">-- Select Column --</option>
            {filteredColumns.map((col) => (
              // <option key={col.streamColId} value={col.streamColId}>
              //   {col.colName}
              // </option>
              <option key={col.streamColId} value={col.streamColId}>
  {col.streamColName?.trim() || `Column ${col.streamColId}`}
</option>

            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="form-label fw-bold">Aggregation Function</label>
          <select
            value={aggFunction}
            onChange={(e) => setAggFunction(e.target.value)}
            className="form-select"
            style={{ padding: "12px", fontSize: "16px" }}
          >
            <option value="">-- Select Aggregation Function --</option>
            {aggFunctions.map((agg) => (
              <option key={agg} value={agg}>
                {agg}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="btn btn-success w-100 mt-4"
          onClick={handleSubmit}
        >
          Save Aggregation
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

export default Step3Aggregation;
