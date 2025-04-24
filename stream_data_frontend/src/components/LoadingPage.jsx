import React from "react";
import { Spinner } from "react-bootstrap";

const LoadingPage = () => {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
      }}
    >
      <div className="text-center">
        <h1 className="text-primary mb-4">Loading...</h1>
        <Spinner animation="border" variant="primary" />
      </div>
    </div>
  );
};

export default LoadingPage;
