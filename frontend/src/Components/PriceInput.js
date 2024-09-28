import React, { useState } from "react";
import { RiWallet3Line } from "react-icons/ri";

const PriceInput = ({ onChange }) => {
  const [price, setPrice] = useState(""); // Use state to manage the input value

  // Handle input change
  const handlePriceChange = (e) => {
    const value = e.target.value;
    setPrice(value); // Update local state
    onChange(value); // Notify parent of the new price value
  };

  return (
    <div className="flex items-center border border-gray-300 rounded-lg p-2 dropdown relative">
      <RiWallet3Line className="dropdown-icon-primary" />
      <input
        type="number"
        value={price}
        onChange={handlePriceChange} // Call handlePriceChange on input change
        placeholder="Enter price"
        className="w-full p-2 focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
};

export default PriceInput;
