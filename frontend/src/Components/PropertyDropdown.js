import React, { useState } from "react";
import {
  RiHome5Line,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiCloseLine,
} from "react-icons/ri";
import { Menu, MenuItem, MenuButton, MenuItems } from "@headlessui/react";

const PropertyDropdown = ({ onChange }) => {
  const [property, setProperty] = useState("Select Property");
  const [isOpen, setIsOpen] = useState(false);

  const properties = ["Villa", "Townhouse", "Apartment", "Duplex"];

  // Function to handle the property selection
  const handlePropertySelect = (option) => {
    setProperty(option);
    onChange(option); // Pass the selected option to the parent component
    setIsOpen(false); // Close the dropdown after selection
  };

  // Function to toggle the dropdown open/close
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Function to reset the property selection
  const resetProperty = (e) => {
    e.stopPropagation(); // Prevent dropdown from closing when resetting
    setProperty("Select Property");
    onChange(""); // Reset the value in the parent component
  };

  return (
    <Menu as="div" className="dropdown relative">
      <MenuButton
        onClick={toggleDropdown} // Toggle the dropdown open/close
        className="dropdown-btn w-full text-left flex items-center justify-between"
      >
        <div className="flex items-center">
          <RiHome5Line className="dropdown-icon-primary" />
          <div className="ml-2 text-[15px] font-medium leading-tight">
            {property}
          </div>
        </div>
        <div className="flex items-center">
          {property !== "Select Property" && (
            <RiCloseLine
              className="text-primary ml-2 cursor-pointer"
              onClick={resetProperty} // Reset the property selection
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
        <MenuItems className="dropdown-menu mt-2 p-2 rounded-lg shadow-md bg-white">
          {properties.map((option, index) => (
            <MenuItem
              as="li"
              key={index}
              className="cursor-pointer hover:bg-primary hover:text-white transition px-4 py-1 rounded-lg"
              onClick={() => handlePropertySelect(option)}
            >
              {option}
            </MenuItem>
          ))}
        </MenuItems>
      )}
    </Menu>
  );
};

export default PropertyDropdown;
