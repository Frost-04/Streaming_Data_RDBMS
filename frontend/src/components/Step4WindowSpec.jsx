import React from "react";

const Step4WindowSpec = ({ windowSpec, setWindowSpec, onBack, onNext }) => {
  const handleTypeChange = (e) => {
    setWindowSpec({
      type: e.target.value,
      value: "",
      measure: "",
      velocity: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWindowSpec((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Step 4: Window Specification</h2>

      <label className="block mb-2 font-medium">Window Type</label>
      <select
        value={windowSpec.type}
        onChange={handleTypeChange}
        name="type"
        className="w-full mb-4 p-2 border rounded"
      >
        <option value="">-- Select --</option>
        <option value="time">Time Based</option>
        <option value="count">Count Based</option>
      </select>

      {windowSpec.type === "time" && (
        <>
          <label className="block mb-2 font-medium">Time Measure</label>
          <select
            value={windowSpec.measure}
            name="measure"
            onChange={handleInputChange}
            className="w-full mb-4 p-2 border rounded"
          >
            <option value="">-- Select --</option>
            <option value="seconds">Seconds</option>
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="days">Days</option>
          </select>

          <label className="block mb-2 font-medium">Time Value</label>
          <input
            type="number"
            name="value"
            value={windowSpec.value}
            onChange={handleInputChange}
            className="w-full mb-4 p-2 border rounded"
            placeholder="Enter time value"
          />
        </>
      )}

      {windowSpec.type === "count" && (
        <>
          <label className="block mb-2 font-medium">Number of Records</label>
          <input
            type="number"
            name="value"
            value={windowSpec.value}
            onChange={handleInputChange}
            className="w-full mb-4 p-2 border rounded"
            placeholder="Enter record count"
          />
        </>
      )}

      <label className="block mb-2 font-medium">Velocity</label>
      <input
        type="number"
        name="velocity"
        value={windowSpec.velocity}
        onChange={handleInputChange}
        className="w-full mb-4 p-2 border rounded"
        placeholder="Enter velocity"
      />

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Finish
        </button>
      </div>
    </div>
  );
};

export default Step4WindowSpec;
