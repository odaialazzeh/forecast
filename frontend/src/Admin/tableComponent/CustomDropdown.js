import React, { useState, useEffect, useRef } from "react";

const CustomDropdown = ({
  headerGroups,
  selectedColumn,
  handleColumnChange,
  resetToggle,
}) => {
  const [isOpen, setIsOpen] = useState(false); // Dropdown open/close state
  const [selectedOption, setSelectedOption] = useState(
    selectedColumn || "Select to Filter"
  ); // Track selected option

  const dropdownRef = useRef(null); // Ref for dropdown

  // Toggle dropdown open/close
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Handle option selection
  const handleOptionClick = (columnId, columnName) => {
    setSelectedOption(columnName); // Update selected option display
    handleColumnChange(columnId); // Call the parent handler to apply the filter
    setIsOpen(false); // Close dropdown after selection
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false); // Close the dropdown
      }
    };

    // Add event listener to detect outside clicks
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Cleanup event listener on unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Reset the selected option when resetToggle changes
  useEffect(() => {
    setSelectedOption("Select to Filter");
  }, [resetToggle]);

  return (
    <div ref={dropdownRef} className="relative inline-block w-48">
      {" "}
      {/* Adjust width here */}
      {/* Dropdown Button */}
      <div
        className="border p-2 rounded bg-gray-100 cursor-pointer"
        onClick={toggleDropdown}
      >
        {selectedOption}
        <span className="ml-2">&#9662;</span> {/* Dropdown arrow */}
      </div>
      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute left-0 z-10 w-full mt-2 bg-white border border-gray-300 rounded shadow-lg">
          <ul className="max-h-48 overflow-auto">
            <li
              key="default"
              className="p-2 cursor-pointer hover:bg-primary hover:text-white"
              onClick={() => handleOptionClick("", "Select to Filter")}
            >
              Select to Filter
            </li>
            {headerGroups[0].headers.map((column) => (
              <li
                key={column.id}
                className="p-2 cursor-pointer hover:bg-primary hover:text-white"
                onClick={() =>
                  handleOptionClick(column.id, column.render("Header"))
                }
              >
                {column.render("Header")}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
