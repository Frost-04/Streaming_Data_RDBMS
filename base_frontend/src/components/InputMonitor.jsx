import React, { useState } from "react";

const InputMonitor = ({ streamId, onReady }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const handleLoadData = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8085/api/insert-batched", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ stream_id:streamId })
      });

      if (!response.ok) {
        throw new Error("Failed to load data");
      }

      setDataLoaded(true);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Monitoring Input Stream</h2>
      <p style={styles.subtitle}>
        Monitoring has started. You can proceed when you're ready.
      </p>

      <div style={styles.buttonGroup}>
        <button
          onClick={handleLoadData}
          disabled={dataLoaded || isLoading}
          style={{
            ...styles.button,
            backgroundColor: dataLoaded ? "#6c757d" : "#28a745"
          }}
        >
          {isLoading ? "Loading..." : dataLoaded ? "Data Loaded" : "Load Data"}
        </button>

        <button
          onClick={onReady}
          style={{ ...styles.button, backgroundColor: "#007bff" }}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    maxWidth: "500px",
    margin: "0 auto",
    textAlign: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
  },
  title: {
    marginBottom: "10px",
    fontSize: "24px",
    color: "#343a40"
  },
  subtitle: {
    marginBottom: "30px",
    fontSize: "16px",
    color: "#6c757d"
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  button: {
    padding: "12px 20px",
    fontSize: "16px",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }
};

export default InputMonitor;


// export default InputMonitor;

// import React from "react";
// import { Spinner } from "react-bootstrap";

// const LoadingPage = () => {
//   return (
//     <div
//       style={{
//         height: "100vh",
//         width: "100vw",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: "#f8f9fa",
//       }}
//     >
//       <div className="text-center">
//         <h1 className="text-primary mb-4">Loading...</h1>
//         <Spinner animation="border" variant="primary" />
//       </div>
//     </div>
//   );
// };

// export default LoadingPage;
