import React, { useState, useEffect } from 'react';
import { Nav, Tab, Container, Row, Col, Button, Form } from 'react-bootstrap';
import { FaPlus, FaMinus } from 'react-icons/fa';

const availableColumns = ['column1', 'column2', 'column3', 'column4'];

const Dashboard = () => {
  const [timestamp, setTimestamp] = useState(new Date().toLocaleString());
  const [jsonOutput, setJsonOutput] = useState({ timestamp });

  const [selectCols, setSelectCols] = useState([]);
  const [groupByCols, setGroupByCols] = useState([]);
  const [orderByCols, setOrderByCols] = useState([]);
  const [whereClause, setWhereClause] = useState('');
  const [queryResult, setQueryResult] = useState('');
  const [showSelectDropdown, setShowSelectDropdown] = useState(false);

  const handleRefresh = () => {
    const current = new Date().toLocaleString();
    setTimestamp(current);
    setJsonOutput({ timestamp: current });
    console.log('Generated JSON:', jsonOutput);
  };

  const addSelectColumn = (col) => {
    if (!selectCols.includes(col)) {
      setSelectCols([...selectCols, col]);
    }
  };

  const removeSelectColumn = (col) => {
    setSelectCols(selectCols.filter((c) => c !== col));
    setGroupByCols(groupByCols.filter((g) => g !== col));
    setOrderByCols(orderByCols.filter((o) => o.col !== col));
  };

  const addAllColumns = () => {
    setSelectCols([...availableColumns]);
  };

  const deleteAllColumns = () => {
    setSelectCols([]);
    setGroupByCols([]);
    setOrderByCols([]);
  };

  const handleGroupBy = (col) => {
    if (!groupByCols.includes(col)) {
      setGroupByCols([...groupByCols, col]);
    }
  };

  const removeGroupBy = (col) => {
    setGroupByCols(groupByCols.filter((g) => g !== col));
  };

  const removeAllGroupBy = () => {
    setGroupByCols([]);
  };

  const handleOrderBy = (col, order) => {
    const updated = orderByCols.filter((o) => o.col !== col);
    setOrderByCols([...updated, { col, order }]);
  };

  const removeOrderBy = (col) => {
    setOrderByCols(orderByCols.filter((o) => o.col !== col));
  };

  const removeAllOrderBy = () => {
    setOrderByCols([]);
  };

  const handleExecute = () => {
    const queryJSON = {
      SELECT: selectCols,
      GROUP_BY: groupByCols.map((col, index) => ({ col, priority: index + 1 })),
      ORDER_BY: orderByCols,
      WHERE: whereClause,
    };
    console.log('Query JSON:', queryJSON);
    setQueryResult(JSON.stringify(queryJSON, null, 2));
  };

  const resetQuery = () => {
    setSelectCols([]);
    setGroupByCols([]);
    setOrderByCols([]);
    setWhereClause('');
    setQueryResult('');
  };

  const clearWhereClause = () => setWhereClause('');

  return (
    <Container className="mt-4">
      <h1>Dashboard</h1>
      <h3 className="text-secondary">Table Name</h3>

      <Tab.Container defaultActiveKey="window">
        <Nav variant="tabs" className="mb-3">
          <Nav.Item><Nav.Link eventKey="window">Window Results</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="summary">Summary Results</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="queries">Queries</Nav.Link></Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="window">
            <Row>
              <Col>
                <div className="d-flex justify-content-between align-items-center">
                  <h5>Window</h5>
                  <small className="text-muted">{timestamp}</small>
                </div>
                <Form.Control as="textarea" rows={10} value={''} readOnly />
                <div className="mt-3 text-end">
                  <Button onClick={handleRefresh}>Refresh</Button>
                </div>
              </Col>
            </Row>
          </Tab.Pane>

          <Tab.Pane eventKey="summary">
            <h4 className="mb-3">Summary</h4>
            <Row>
              <Col sm="2">
                <Form.Control value="Window 1" readOnly className="mb-3" />
              </Col>
              <Col>
                <p><strong>Query 1</strong></p>
                <Form.Control as="textarea" rows={2} value="SELECT * FROM table;" className="mb-2" readOnly />
                <p><strong>Cumulative Result</strong></p>
                <Form.Control as="textarea" rows={2} value="Result goes here..." readOnly />
              </Col>
            </Row>
            <hr />
          </Tab.Pane>

          <Tab.Pane eventKey="queries">
            <h4 className="mb-4">Queries</h4>

            {/* SELECT */}
            <h5 style={{ fontSize: '1.3rem' }}>SELECT</h5>
            <hr />
            {selectCols.map((col) => (
              <div key={col} className="d-flex align-items-center mb-2">
                <Button variant="danger" size="sm" className="me-2" onClick={() => removeSelectColumn(col)}>
                  <FaMinus />
                </Button>
                <Form.Control value={col} readOnly />
              </div>
            ))}

            {!showSelectDropdown && selectCols.length < availableColumns.length && (
              <div className="mb-3">
                <Button variant="primary" size="sm" onClick={() => setShowSelectDropdown(true)}>
                  <FaPlus className="me-2" /> Add Column
                </Button>
              </div>
            )}

            {showSelectDropdown && (
              <Form.Group className="d-flex align-items-center mb-3">
                <Button variant="secondary" size="sm" disabled className="me-2">
                  <FaPlus />
                </Button>
                <Form.Select
                  onChange={(e) => {
                    if (e.target.value !== "") {
                      addSelectColumn(e.target.value);
                      setShowSelectDropdown(false);
                    }
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>Select column</option>
                  {availableColumns.filter((col) => !selectCols.includes(col)).map((col) => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}

            <div className="d-flex gap-2 mb-4">
              <Button variant="success" size="sm" onClick={addAllColumns}>Add All Columns</Button>
              <Button variant="danger" size="sm" onClick={deleteAllColumns}>Delete All Columns</Button>
            </div>

            {/* GROUP BY */}
<h5 style={{ fontSize: '1.3rem' }}>GROUP BY</h5>
<hr />
{groupByCols.map((col, index) => (
  <div key={col} className="d-flex align-items-center mb-2">
    <Button
      variant="danger"
      size="sm"
      className="me-2"
      onClick={() => setGroupByCols(groupByCols.filter((g) => g !== col))}
    >
      <FaMinus />
    </Button>
    <Form.Control value={col} readOnly className="me-2" />
    <Form.Text muted>Priority {index + 1}</Form.Text>
  </div>
))}

{selectCols
  .filter((col) => !groupByCols.includes(col))
  .map((col) => (
    <Button key={col} variant="outline-secondary" size="sm" className="me-2 mb-2" onClick={() => handleGroupBy(col)}>
      <FaPlus className="me-1" /> {col}
    </Button>
  ))}

{groupByCols.length > 0 && (
  <div className="mb-4 mt-2">
    <Button variant="danger" size="sm" onClick={() => setGroupByCols([])}>Remove All Group By</Button>
  </div>
)}

{/* ORDER BY */}
<h5 style={{ fontSize: '1.3rem' }}>ORDER BY</h5>
<hr />
{orderByCols.map(({ col, order }) => (
  <div key={col} className="d-flex align-items-center mb-2">
    <Button
      variant="danger"
      size="sm"
      className="me-2"
      onClick={() => setOrderByCols(orderByCols.filter((o) => o.col !== col))}
    >
      <FaMinus />
    </Button>
    <Form.Control value={col} readOnly className="me-2" />
    <Form.Select
      value={order}
      onChange={(e) => handleOrderBy(col, e.target.value)}
      className="w-auto"
    >
      <option value="ASC">Ascending</option>
      <option value="DESC">Descending</option>
    </Form.Select>
  </div>
))}

{selectCols
  .filter((col) => !orderByCols.some((o) => o.col === col))
  .map((col) => (
    <Button key={col} variant="outline-secondary" size="sm" className="me-2 mb-2" onClick={() => handleOrderBy(col, 'ASC')}>
      <FaPlus className="me-1" /> {col}
    </Button>
  ))}

{orderByCols.length > 0 && (
  <div className="mb-4 mt-2">
    <Button variant="danger" size="sm" onClick={() => setOrderByCols([])}>Remove All Order By</Button>
  </div>
)}

{/* WHERE */}
<h5 style={{ fontSize: '1.3rem' }}>WHERE</h5>
<hr />
<Form.Control
  type="text"
  className="mb-2"
  value={whereClause}
  onChange={(e) => setWhereClause(e.target.value)}
/>
<Button variant="secondary" size="sm" className="mb-4" onClick={() => setWhereClause('')}>Clear</Button>



            {/* ACTION BUTTONS */}
            <div className="mt-4 mb-4">
              <Button variant="primary" className="me-2" onClick={handleExecute}>Execute</Button>
              <Button variant="warning" onClick={resetQuery}>New Query</Button>
            </div>

            {/* OUTPUT */}
            <h5>Output</h5>
            <Form.Control as="textarea" rows={6} value={queryResult} readOnly className="mb-5" />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default Dashboard;
