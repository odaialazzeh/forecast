import React, { useState } from "react";
import {
  RiHome5Line,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiCloseLine,
} from "react-icons/ri";
import { Menu } from "@headlessui/react";

const PropertyDropdown = ({ onChange }) => {
  const [property, setProperty] = useState("Select Property");
  const [isOpen, setIsOpen] = useState(false);

  const properties = ["Villa", "Townhouse", "Apartment", "Duplex"];

  // Function to handle the property selection
  const handlePropertySelect = (option) => {
    setProperty(option);
    onChange(option); // Pass the selected option to the parent component
    setIsOpen(false); // Close the dropdown
  };

  return (
    <Menu as="div" className="dropdown relative">
      <Menu.Button
        onClick={() => setIsOpen(!isOpen)}
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
              className="text-red-500 ml-2 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation(); // Prevent dropdown from closing
                setProperty("Select Property");
                onChange(""); // Reset the value in the parent component as well
              }}
            />
          )}
          {isOpen ? (
            <RiArrowUpSLine className="dropdown-icon-secondary ml-2" />
          ) : (
            <RiArrowDownSLine className="dropdown-icon-secondary ml-2" />
          )}
        </div>
      </Menu.Button>
      {isOpen && (
        <Menu.Items className="dropdown-menu">
          {properties.map((option, index) => (
            <Menu.Item
              as="li"
              key={index}
              className="cursor-pointer hover:text-primary transition px-4 py-0"
              onClick={() => handlePropertySelect(option)}
            >
              {option}
            </Menu.Item>
          ))}
        </Menu.Items>
      )}
    </Menu>
  );
};

export default PropertyDropdown;
