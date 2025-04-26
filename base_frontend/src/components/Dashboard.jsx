import React,{useEffect} from 'react';
import { Tab, Nav, Container, Button, Navbar, NavDropdown } from 'react-bootstrap';
import WindowResults from './WindowResults';
import SummaryResults from './SummaryResults';
// import axios from 'axios';

import Queries from "./Queries.jsx"

const Dashboard = ({ streamId ,streamName}) => {
  useEffect(() => {
    console.log("Received streamId in Dashboard:", streamId);
  }, [streamId]);
  
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

        <Tab.Container defaultActiveKey="window">
          <Nav variant="tabs" className="mb-3">
            <Nav.Item><Nav.Link eventKey="window">Window Results</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="summary">Summary Results</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="Queries">Queries</Nav.Link></Nav.Item>
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="window">
              <WindowResults streamId={streamId}   />
            </Tab.Pane>

            <Tab.Pane eventKey="summary">
              <SummaryResults  streamId={streamId}/>
              </Tab.Pane>
            <Tab.Pane eventKey="Queries">
              <Queries streamId={streamId} />
            </Tab.Pane>
            
          </Tab.Content>
        </Tab.Container>
      </Container>
    </div>
  );
};

export default Dashboard;
