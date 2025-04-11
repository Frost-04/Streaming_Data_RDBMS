import React from "react";

const Step1DatabaseName = ({ databaseName, setDatabaseName, onNext }) => {
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
      {/* Status bar */}
      <div className="position-absolute top-0 start-0 w-100 p-3 bg-white shadow-sm">
        <div className="d-flex justify-content-center gap-4">
          <span className="fw-bold text-primary">Step 1</span>
          <span className="text-muted">Step 2</span>
          <span className="text-muted">Step 3</span>
          <span className="text-muted">Step 4</span>
        </div>
      </div>

      {/* Center Card */}
      <div className="bg-white p-4 rounded shadow" style={{ width: "500px", minHeight: "300px" }}>
        <h2 className="text-primary mb-4 text-center">Step 1: Database Info</h2>

        <div className="mb-3">
          <label className="form-label fw-bold">Database Name</label>
          <input
            type="text"
            value={databaseName}
            onChange={(e) => setDatabaseName(e.target.value)}
            className="form-control"
            placeholder="Enter your database name"
          />
        </div>

        <button
          onClick={onNext}
          disabled={!databaseName.trim()}
          className="btn btn-primary w-100"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Step1DatabaseName;
