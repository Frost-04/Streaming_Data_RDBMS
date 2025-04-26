import React from "react";

const InputMonitor = ({ streamId, onReady }) => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Monitoring Input Stream</h2>
      <p>Stream ID: {streamId}</p>
      <p>Monitoring has started. You can proceed when you're ready.</p>

      <button
        onClick={onReady}
        style={{
          padding: "10px 20px",
          marginTop: "20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default InputMonitor;
