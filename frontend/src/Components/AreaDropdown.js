import React, { useState } from "react";
import { RiArrowDownSLine, RiArrowUpSLine, RiCloseLine } from "react-icons/ri";
import { BiArea } from "react-icons/bi";
import { Menu, MenuItem, MenuButton, MenuItems } from "@headlessui/react";

const UnitAreaDropdown = ({ unitAreas = [], onChange }) => {
  const [unitArea, setUnitArea] = useState("Select Area");
  const [isOpen, setIsOpen] = useState(false);

  // Function to handle the unit area selection
  const handleUnitAreaSelect = (option) => {
    setUnitArea(option);
    onChange(option); // Pass the selected unit area to the parent component
    setIsOpen(false); // Close the dropdown after selecting an option
  };

  // Function to toggle the dropdown open/close
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev); // Toggle the state to open/close dropdown
  };

  // Function to reset the dropdown and selected area
  const resetUnitArea = (e) => {
    e.stopPropagation(); // Prevent the dropdown from closing on reset
    setUnitArea("Select Area");
    onChange(""); // Reset the value in the parent component
  };

  return (
    <Menu as="div" className="dropdown relative">
      <MenuButton
        onClick={toggleDropdown} // Toggle dropdown open/close
        className="dropdown-btn w-full text-left flex items-center justify-between"
      >
        <div className="flex items-center">
          <BiArea className="dropdown-icon-primary" />
          <div className="ml-2 text-[15px] font-medium leading-tight">
            {unitArea}
          </div>
        </div>
        <div className="flex items-center">
          {unitArea !== "Select Area" && (
            <RiCloseLine
              className="text-red-500 ml-2 cursor-pointer"
              onClick={resetUnitArea} // Reset the unit area
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
        <MenuItems className="dropdown-menu absolute w-full bg-white shadow-md rounded-lg py-2">
          {unitAreas.length === 0 ? (
            <MenuItem as="li" className="px-4 py-2 text-gray-500">
              No unit areas available
            </MenuItem>
          ) : (
            unitAreas.map((option, index) => (
              <MenuItem
                as="li"
                key={index}
                className="cursor-pointer hover:text-primary transition px-4 py-2"
                onClick={() => handleUnitAreaSelect(option)}
              >
                {option} sq.ft.
              </MenuItem>
            ))
          )}
        </MenuItems>
      )}
    </Menu>
  );
};

export default UnitAreaDropdown;
