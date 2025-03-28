import React, { useState } from "react";
import "../presentation/WindowType.css"; 

const WindowType = () => {
  const [windowType, setWindowType] = useState("");
  const [size, setSize] = useState("");
  const [velocity, setVelocity] = useState("");
  const [count, setCount] = useState("");
  const [timePeriod, setTimePeriod] = useState("");

  return (
    <div className="page-container">
      <div className="form-container">
        <h2>Configure Window Type</h2>

        <label>Size:</label>
        <input
          type="number"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          placeholder="Enter size"
        />

        <label>Velocity:</label>
        <input
          type="number"
          value={velocity}
          onChange={(e) => setVelocity(e.target.value)}
          placeholder="Enter velocity"
        />

        <div className="radio-group">
          <label>
            <input
              type="radio"
              value="count"
              checked={windowType === "count"}
              onChange={() => setWindowType("count")}
            />
            Count-Based
          </label>
          <label>
            <input
              type="radio"
              value="time"
              checked={windowType === "time"}
              onChange={() => setWindowType("time")}
            />
            Time-Based
          </label>
        </div>

        {windowType === "count" && (
          <div className="conditional-input">
            <label>Count:</label>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              placeholder="Enter count"
            />
          </div>
        )}

        {windowType === "time" && (
          <div className="conditional-input">
            <label>Time Period (seconds):</label>
            <input
              type="number"
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              placeholder="Enter time period"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WindowType;
