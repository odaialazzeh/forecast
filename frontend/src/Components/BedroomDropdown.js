import React, { useState } from "react";
import {
  RiHotelBedLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiCloseLine,
} from "react-icons/ri";
import { Menu, MenuItem, MenuButton, MenuItems } from "@headlessui/react";

const BedroomDropdown = ({ onChange }) => {
  const [bedroom, setBedroom] = useState("Select Bedroom");
  const [isOpen, setIsOpen] = useState(false);

  const bedrooms = ["Studio", "1", "2", "3", "4", "5", "6", "7"];

  // Function to handle bedroom selection
  const handleBedroomSelect = (option) => {
    setBedroom(option);
    onChange(option); // Notify parent of selected value
    setIsOpen(false); // Close the dropdown after selection
  };

  // Function to toggle the dropdown open/close
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Function to reset the bedroom selection
  const resetBedroom = (e) => {
    e.stopPropagation(); // Prevent dropdown from closing
    setBedroom("Select Bedroom");
    onChange(""); // Notify parent of reset value
  };

  return (
    <Menu as="div" className="dropdown relative">
      <MenuButton
        onClick={toggleDropdown} // Toggle the dropdown open/close
        className="dropdown-btn w-full text-left flex items-center justify-between"
      >
        <div className="flex items-center">
          <RiHotelBedLine className="dropdown-icon-primary" />
          <div className="ml-2 text-[15px] font-medium leading-tight">
            {bedroom}
          </div>
        </div>
        <div className="flex items-center">
          {bedroom !== "Select Bedroom" && (
            <RiCloseLine
              className="text-red-500 ml-2 cursor-pointer"
              onClick={resetBedroom} // Reset the bedroom selection
            />
          )}
          {isOpen ? (
            <RiArrowUpSLine className="dropdown-icon-secondary ml-2" />
          ) : (
            <RiArrowDownSLine className="dropdown-icon-secondary ml-2" />
          )}
        </div>
      </MenuButton>
      {isOpen && (
        <MenuItems className="dropdown-menu mt-2 p-4">
          <div className="flex flex-wrap gap-1 justify-start">
            {bedrooms.map((option, index) => (
              <MenuItem
                as="div"
                key={index}
                className="cursor-pointer hover:bg-primary text-center text-white bg-gray-500 transition px-4 py-2 w-14 h-10 flex items-center justify-center rounded-lg"
                onClick={() => handleBedroomSelect(option)}
              >
                {option}
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      )}
    </Menu>
  );
};

export default BedroomDropdown;
