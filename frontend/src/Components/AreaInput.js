import React, { useState } from "react";
import { RiLayoutGridLine } from "react-icons/ri"; // Assuming you use a different icon for area

const AreaInput = ({ onChange }) => {
  const [area, setArea] = useState(""); // Use state to manage the input value for area

  // Handle input change
  const handleAreaChange = (e) => {
    const value = e.target.value;
    setArea(value); // Update local state
    onChange(value); // Notify parent of the new area value
  };

  return (
    <div className="flex items-center border border-gray-300 rounded-lg p-2 dropdown relative">
      <RiLayoutGridLine className="dropdown-icon-primary" />
      <input
        type="number"
        value={area}
        onChange={handleAreaChange} // Call handleAreaChange on input change
        placeholder="Enter area (sq ft)"
        className="w-full p-2 focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
};

export default AreaInput;
