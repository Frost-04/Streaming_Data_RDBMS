import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedStream, setSelectedStream] = useState("");

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
      <div className="bg-white p-5 rounded shadow" style={{ width: "400px" }}>
        <h2 className="text-center text-primary mb-4">Login</h2>
        <form>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

           {/* Added Stream Name dropdown */}
           <div className="mb-3">
            <label className="form-label">Stream Name</label>
            <select
              className="form-control"
              value={selectedStream}
              onChange={(e) => setSelectedStream(e.target.value)}
            >
              <option value="" disabled>Select a stream</option>
              <option value="stream1">stream1</option>
              <option value="stream2">stream2</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => onLogin(username, password,selectedStream)}
            className="btn btn-primary w-100"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
