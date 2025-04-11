import React from "react";

const Step4WindowSpec = ({ windowSpec, setWindowSpec, onBack, onNext }) => {
  const handleTypeChange = (e) => {
    setWindowSpec({
      type: e.target.value,
      value: "",
      measure: "",
      velocity: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWindowSpec((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f2f5",
        position: "relative",
      }}
    >
      {/* Status bar */}
      <div className="position-absolute top-0 start-0 w-100 p-3 bg-white shadow-sm">
        <div className="d-flex justify-content-center gap-4">
          <span className="text-muted">Step 1</span>
          <span className="text-muted">Step 2</span>
          <span className="text-muted">Step 3</span>
          <span className="fw-bold text-primary">Step 4</span>
        </div>
      </div>

      {/* Card */}
      <div
        className="bg-white shadow-lg rounded p-5"
        style={{ width: "500px", maxHeight: "90vh", overflowY: "auto" }}
      >
        <h2 className="text-center text-primary fw-bold mb-4">
          Step 4: Window Specification
        </h2>

        {/* Window Type */}
        <div className="mb-3">
          <label className="form-label fw-medium">Window Type</label>
          <select
            value={windowSpec.type}
            onChange={handleTypeChange}
            name="type"
            className="form-select"
          >
            <option value="">-- Select --</option>
            <option value="time">Time Based</option>
            <option value="count">Count Based</option>
          </select>
        </div>

        {/* Time Based Options */}
        {windowSpec.type === "time" && (
          <>
            <div className="mb-3">
              <label className="form-label fw-medium">Time Measure</label>
              <select
                value={windowSpec.measure}
                name="measure"
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">-- Select --</option>
                <option value="seconds">Seconds</option>
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-medium">Size</label>
              <input
              type="number"
              name="value"
              min="1"
              value={windowSpec.value}
              onChange={handleInputChange}
              onKeyDown={(e) => {
              if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
              }}
              className="w-full mb-4 p-2 border rounded"
              placeholder={
              windowSpec.type === "time"
              ? "Enter time value"
              : "Enter record count"
              }
              />

            </div>
          </>
        )}

        {/* Count Based Options */}
        {windowSpec.type === "count" && (
          <div className="mb-3">
            <label className="form-label fw-medium">Size</label>
            <input
              type="number"
              name="value"
              value={windowSpec.value}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Enter record count"
            />
          </div>
        )}

        {/* Velocity */}
        <div className="mb-3">
          <label className="form-label fw-medium">Velocity</label>
          <input
            type="number"
           name="velocity"
           min="1"
            value={windowSpec.velocity}
             onChange={handleInputChange}
              onKeyDown={(e) => {
             if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
              }}
              className="w-full mb-4 p-2 border rounded"
             placeholder="Enter velocity"
          />

        </div>

        {/* Buttons */}
        <div className="d-flex justify-content-between mt-4">
          <button
            onClick={onBack}
            className="btn btn-secondary"
          >
            ← Back
          </button>
          <button
            onClick={onNext}
            className="btn btn-success"
          >
            Finish →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step4WindowSpec;
