import React from "react";

const Home = ({ onNewUser, onReturningUser }) => {
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
        <h1 className="display-4 text-primary mb-4">Welcome to Stream Configuration</h1>
        <p className="lead text-muted mb-4">Choose an option below to get started</p>

        <div className="d-flex justify-content-center gap-4">
          <button
            onClick={onNewUser}
            className="btn btn-success btn-lg"
          >
            New User
          </button>
          <button
            onClick={onReturningUser}
            className="btn btn-info btn-lg"
          >
            Returning User
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
