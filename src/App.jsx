import React, { useState } from "react";
import Step1DatabaseName from "./components/Step1DatabaseName";
import Step2AddColumns from "./components/Step2AddColumns";
import Step3Aggregation from "./components/Step3Aggregation";

// const App = () => {
//   const [streamName, setStreamname] = useState("");
//   const [windowType, setWindowtype] = useState("");
//   const [windowSize, setWindowsize] = useState(0);
//   const [windowVelocity, setWindowvelocity] = useState(0);
//   const [streams, setStreams] = useState([]); // Hold all stream names
//   const [goToStep2, setGoToStep2] = useState(false); // Toggle for step 2
//   const [goToStep3, setGoToStep3] = useState(false);

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

//         if (!response.ok) {
//           throw new Error("Failed to submit stream info.");
//         }

//         const result = await response.json(); // Expecting JSON array of streams
//         setStreams(result);
//         setGoToStep2(true); // Go to column creation step
//       } catch (error) {
//         console.error("❌ Error submitting:", error);
//         alert("Error submitting data to backend.");
//       }
//     } else {
//       alert("Please fill in all fields.");
//     }
//   };

// const handleNextStep2 = () => {
//     setGoToStep3(true); // Transition to Step 3 after Step 2
//   };

//   return (
//     <div>
//       {goToStep3 ? (
//         <Step3NextStep />
//       ) : goToStep2 ? (
//         <Step2AddColumns streams={streams} onNext={handleNextStep2} />
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

const App = () => {
  const [streamName, setStreamname] = useState("");
  const [windowType, setWindowtype] = useState("");
  const [windowSize, setWindowsize] = useState(0);
  const [windowVelocity, setWindowvelocity] = useState(0);
  const [streams, setStreams] = useState([]);
  const [goToStep2, setGoToStep2] = useState(false);
  const [goToStep3, setGoToStep3] = useState(false);
  const [columns, setColumns] = useState([]);


  const handleNext = async () => {
    if (streamName && windowType && windowSize && windowVelocity) {
      const payload = {
        streamName,
        windowType,
        windowSize,
        windowVelocity
      };

      try {
        const response = await fetch("http://localhost:8081/ingestion/stream-master", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error("Failed to submit stream info.");
        }

        const result = await response.json();
        setStreams(result);
        setGoToStep2(true); // Go to column creation step
      } catch (error) {
        console.error("Error submitting:", error);
        alert("Error submitting data to backend.");
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  const handleNextStep2 = (selectedColumns) => {
    console.log("Transitioning to Step 3");
    setColumns(selectedColumns);
    setGoToStep3(true); // Transition to Step 3 after Step 2
  };

  return (
    <div>
      {goToStep3 ? (
        <Step3Aggregation streams={streams} columns={columns}/>
      ) : goToStep2 ? (
        <Step2AddColumns streams={streams} onNext={handleNextStep2} />
      ) : (
        <Step1DatabaseName
          streamName={streamName}
          setStreamname={setStreamname}
          windowType={windowType}
          setWindowtype={setWindowtype}
          windowSize={windowSize}
          setWindowsize={setWindowsize}
          windowVelocity={windowVelocity}
          setWindowvelocity={setWindowvelocity}
          onNext={handleNext}
        />
      )}
    </div>
  );
};

export default App;
