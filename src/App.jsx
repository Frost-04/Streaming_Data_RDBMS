// import React, { useState } from "react";
// import Step1DatabaseName from "./components/Step1DatabaseName";
// import Step2AddColumns from "./components/Step2AddColumns";
// import Step3Aggregation from "./components/Step3Aggregation";
// import Step4DataSource from "./components/Step4DataSource";

// const App = () => {
//   const [streamName, setStreamname] = useState("");
//   const [windowType, setWindowtype] = useState("");
//   const [windowSize, setWindowsize] = useState(0);
//   const [windowVelocity, setWindowvelocity] = useState(0);
//   const [streams, setStreams] = useState([]);
//   const [goToStep2, setGoToStep2] = useState(false);
//   const [goToStep3, setGoToStep3] = useState(false);
//   const [columns, setColumns] = useState([]);
//   const [streamId, setStreamId] = useState(null);  // New state to store streamId


//   const handleNext = async () => {
//     if (streamName && windowType && windowSize && windowVelocity) {
//       const payload = {
//         streamName,
//         windowType,
//         windowSize,
//         windowVelocity
//       };

//       try {
//         const response = await fetch("http://localhost:8081/ingestion/stream-master", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json"
//           },
//           body: JSON.stringify(payload)
//         });
//         console.log(payload);

//         if (!response.ok) {
//           throw new Error("Failed to submit stream info.");
//         }

//         const result = await response.json();
//         setStreams(result);
//         if (result && result.streamId) {
//           setStreamId(result.streamId); // Ensure streamId is set correctly
//         }
//         setGoToStep2(true); // Go to column creation step
//       } catch (error) {
//         console.error("Error submitting:", error);
//         alert("Error submitting data to backend.");
//       }
//     } else {
//       alert("Please fill in all fields.");
//     }
//   };

//   const handleNextStep2 = (selectedColumns) => {
//     console.log("Transitioning to Step 3");
//     setColumns(selectedColumns);
//     setGoToStep3(true); // Transition to Step 3 after Step 2
//   };
//   console.log(goToStep2, goToStep3); // Add a log to check if states are being set

//   return (
//     <div>
//       {goToStep3 ? (
//         <Step3Aggregation columns={columns}/>
//       ) : goToStep2 ? (
//         <Step2AddColumns streamId={streamId} onNext={handleNextStep2} />
//       ) : (
//         <Step1DatabaseName
//           streamName={streamName}
//           setStreamname={setStreamname}
//           windowType={windowType}
//           setWindowtype={setWindowtype}
//           windowSize={windowSize}
//           setWindowsize={setWindowsize}
//           windowVelocity={windowVelocity}
//           setWindowvelocity={setWindowvelocity}
//           onNext={handleNext}
//         />
//       )}
      
//     </div>
//   );
// };

// export default App;


import React, { useState } from "react";
import Step1DatabaseName from "./components/Step1DatabaseName";
import Step2AddColumns from "./components/Step2AddColumns";
import Step3Aggregation from "./components/Step3Aggregation";

const App = () => {
  const [streamName, setStreamname] = useState("");
  const [windowType, setWindowtype] = useState("");
  const [windowSize, setWindowsize] = useState(0);
  const [windowVelocity, setWindowvelocity] = useState(0);
  const [dataSourceType, setDataSourceType] = useState(""); // new
  const [dataSourcePath, setDataSourcePath] = useState("");
  const [streams, setStreams] = useState([]);
  const [columns, setColumns] = useState([]);
  const [streamId, setStreamId] = useState(null);  // New state to store streamId
  const [currentStep, setCurrentStep] = useState(1); // Manage steps using this state

  const handleNextStep1 = async () => {
    if (streamName && windowType && windowSize && windowVelocity && dataSourceType && dataSourcePath) {
      const payload = {
        streamName,
        windowType,
        windowSize,
        windowVelocity,
        dataSourceType,
        dataSourcePath,
      };

      try {
        const response = await fetch("http://localhost:8081/ingestion/stream-master", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });
        console.log("Payload to be sent:", payload);
        if (!response.ok) {
          throw new Error("Failed to submit stream info.");
        }

        const result = await response.json();
        setStreams(result);
        if (result && result.streamId) {
          setStreamId(result.streamId); // Ensure streamId is set correctly
        }
        setCurrentStep(2); // Transition to Step 2
      } catch (error) {
        console.error("Error submitting:", error);
        alert("Error submitting data to backend.");
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  const handleNextStep2 = (selectedColumns) => {
    setColumns(selectedColumns);
    setCurrentStep(3); // Transition to Step 3 after Step 2
  };

  const handleNextStep3 = async () => {
    try {
      // Hit the create-table API on Step 3
      const response = await fetch(`http://localhost:8081/api/tables/create-table/${streamId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create table.");
      }

      // If successful
      alert("Table created successfully!");
      setCurrentStep(4); // You can optionally reset state or redirect after creation
    } catch (error) {
      console.error("Error creating table:", error);
      alert("Error creating table.");
    }
  };


  return (
    <div>
      {currentStep === 1 && (
        <Step1DatabaseName
          streamName={streamName}
          setStreamname={setStreamname}
          windowType={windowType}
          setWindowtype={setWindowtype}
          windowSize={windowSize}
          setWindowsize={setWindowsize}
          windowVelocity={windowVelocity}
          setWindowvelocity={setWindowvelocity}
          dataSourceType={dataSourceType}
          setDataSourceType={setDataSourceType}
          dataSourcePath={dataSourcePath}
          setDataSourcePath={setDataSourcePath}
          onNext={handleNextStep1}
        />
      )}
      {currentStep === 2 && (
        <Step2AddColumns
          streamId={streamId}
          onNext={handleNextStep2}
        />
      )}
      {currentStep === 3 && (
  <Step3Aggregation
  columns={columns}
  onNext={handleNextStep3} // Call the handleNextStep3 when "Next" is clicked
  />
)}

    </div>
  );
};

export default App;
