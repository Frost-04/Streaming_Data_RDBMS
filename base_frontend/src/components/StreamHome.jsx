// import React, { useEffect, useState } from "react";

// const StreamHome = ({ setStreamId, setStreamname, setColumns, setCurrentStep }) => {
//   const [streams, setStreams] = useState([]);

//   useEffect(() => {
//     const fetchStreams = async () => {
//       try {
//         const response = await fetch("http://localhost:8083/ingestion/stream-master");
//         const data = await response.json();
//         setStreams(data);
//       } catch (error) {
//         console.error("Error fetching streams:", error);
//         alert("Failed to fetch streams.");
//       }
//     };

//     fetchStreams();
//   }, []);

//   const handleStreamClick = (stream) => {
//     setStreamId(stream.streamId);
//     setStreamname(stream.streamName);
//     setColumns(stream.columns || []); // You can fetch actual columns here if needed
//     setCurrentStep(5); // Go to Dashboard
//   };

//   return (
//     <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow">
//       <h1 className="text-2xl font-bold mb-6 text-center">Available Streams</h1>
      
//       {streams.length > 0 ? (
//         <ul className="space-y-2">
//           {streams.map((stream) => (
//             <li
//               key={stream.streamId}
//               onClick={() => handleStreamClick(stream)}
//               className="cursor-pointer p-3 bg-gray-100 rounded hover:bg-blue-100"
//             >
//               {stream.streamName}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p className="text-gray-500">No streams found.</p>
//       )}

//       <div className="text-center mt-6">
//         <button
//           onClick={() => setCurrentStep(1)}
//           className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
//         >
//           Create New Stream
//         </button>
//       </div>
//     </div>
//   );
// };

// export default StreamHome;

import React, { useEffect, useState } from "react";
import { Container, Card, Button, ListGroup, Navbar, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


const StreamHome = ({ setStreamId, setStreamname, setColumns}) => {
  const [streams, setStreams] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const response = await fetch("http://localhost:8083/ingestion/stream-master");
        const data = await response.json();
        setStreams(data);
      } catch (err) {
        console.error("Error fetching streams:", err);
        setError("Failed to fetch streams. Please try again later.");
      }
    };

    fetchStreams();
  }, []);

  const handleStreamClick = (stream) => {
    setStreamId(stream.streamId);
    setStreamname(stream.streamName);
    setColumns(stream.columns || []);
   // setCurrentStep(5); // Move to Dashboard
   navigate("/dashboard"); // Navigate to the dashboard

  };

  return (
    <>
      {/* Navbar */}
      <Navbar bg="primary" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand>Stream Selection</Navbar.Brand>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container>
        <Card className="shadow-lg">
          <Card.Body>
            <Card.Title className="text-center text-primary mb-4">
              Available Streams
            </Card.Title>

            {error && (
              <Alert variant="danger" className="text-center">
                {error}
              </Alert>
            )}

            {streams.length > 0 ? (
              <ListGroup>
                {streams.map((stream) => (
                  <ListGroup.Item
                    action
                    key={stream.streamId}
                    onClick={() => handleStreamClick(stream)}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <span>{stream.streamName}</span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p className="text-muted text-center">No streams available.</p>
            )}

            <div className="text-center mt-4">
              <Button
                variant="primary"
                onClick={() => navigate("/step1")}
              >
                + Create New Stream
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default StreamHome;
