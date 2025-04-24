import React, { useState } from 'react';
import { Tab, Nav, Container, Button, Navbar, NavDropdown } from 'react-bootstrap';
import WindowResults from './WindowResults';
import SummaryResults from './SummaryResults';
//import queries from "./queries.jsx"

const Dashboard = ({ streamId ,streamName}) => {
  const [timestamp, setTimestamp] = useState(new Date().toLocaleString());

  const handleRefresh = () => {
    const current = new Date().toLocaleString();
    setTimestamp(current);
    console.log('Refreshed Timestamp:', current);
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
          </Nav>
        </Container>
      </Navbar>

      {/* Main Content Area */}
      <Container className="mt-4">
        {/* <h1>Dashboard</h1>
        <h3 className="text-secondary">Table Name</h3> */}

        {/* Tab Container */}
        <Tab.Container defaultActiveKey="window">
          <Nav variant="tabs" className="mb-3">
            <Nav.Item><Nav.Link eventKey="window">Window Results</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="summary">Summary Results</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="queries">Queries</Nav.Link></Nav.Item>
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="window">
              <WindowResults streamId={streamId} timestamp={timestamp} handleRefresh={handleRefresh} />
            </Tab.Pane>

            <Tab.Pane eventKey="summary">
              <SummaryResults />
            <Tab.Pane eventKey="queries">
              <WindowResults streamId={streamId} />
            </Tab.Pane>
            
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
    </div>
  );
};

export default Dashboard;
