import React from "react";
import { Tab, Nav, Container, Button, Navbar } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import WindowResults from "./WindowResults";
import SummaryResults from "./SummaryResults";
import Queries from "./Queries.jsx";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    streamId,
    streamName,
    columns,
    aggregatedColumns
  } = location.state || {};
  console.log("Received streamId in Dashboard:", streamId);
  console.log("Received streamName in Dashboard:", streamName);       
  console.log("Received columns in Dashboard:", columns);
  console.log("Received aggregatedcolumns in Dashboard:", aggregatedColumns);

  // Logout function
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8085/api/stop-insertion", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to stop insertion.");
      }

      alert("Successfully logged out!");
      navigate("/"); // Redirect to the home page
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Failed to log out. Please try again.");
    }
  };
  const handleStartIngestion = async () => {
    try {
      const response = await fetch("http://localhost:8085/api/insert-batched", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ stream_id: streamId })
      });
  
      if (!response.ok) {
        throw new Error("Failed to start ingestion.");
      }
  
      alert("Ingestion started successfully!");
    } catch (error) {
      console.error("Error starting ingestion:", error);
      alert("Failed to start ingestion. Please try again.");
    }
  };
  

  return (
    <div>
      {/* Navbar with Blue Color */}
      <Navbar bg="primary" variant="dark">
        <Container>
          <Navbar.Brand href="#home">Stream Dashboard</Navbar.Brand>
          <Nav className="ml-auto">
            <Nav.Item>
              <Nav.Link>{streamName}</Nav.Link>
            </Nav.Item>
            <Nav.Item>
        <Button
          variant="outline-light"
          size="sm"
          onClick={handleStartIngestion}
          className="ms-3"
        >
          Start Ingestion
        </Button>
      </Nav.Item>
            <Nav.Item>
              <Button
                variant="outline-light"
                size="sm"
                onClick={handleLogout}
                className="ms-3"
              >
                Logout
              </Button>
            </Nav.Item>
          </Nav>
        </Container>
      </Navbar>

      {/* Main Content Area */}
      <Container className="mt-4">
        <Tab.Container defaultActiveKey="window">
          <Nav variant="tabs" className="mb-3">
            <Nav.Item>
              <Nav.Link eventKey="window">Window Results</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="summary">Summary Results</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="Queries">Queries</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="window">
              <WindowResults streamId={streamId} />
            </Tab.Pane>

            <Tab.Pane eventKey="summary">
              <SummaryResults streamId={streamId} 
              aggregatedcolumns={aggregatedColumns}/>
            </Tab.Pane>
            <Tab.Pane eventKey="Queries">
              <Queries
                streamId={streamId}
                columns={columns}
                streamName={streamName}
              />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
    </div>
  );
};

export default Dashboard;
