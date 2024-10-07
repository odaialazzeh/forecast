import React, { useState, useEffect } from "react";
import {
  RiHome5Line,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiCloseLine,
} from "react-icons/ri";
import { Menu, MenuItem, MenuItems, MenuButton } from "@headlessui/react";

const PropertyDropdown = ({ onChange, reset }) => {
  const [property, setProperty] = useState("Select Property");

  const properties = ["Villa", "Townhouse", "Apartment", "Duplex"];

  // Function to handle the property selection
  const handlePropertySelect = (option) => {
    setProperty(option);
    onChange(option); // Pass the selected option to the parent component
  };

  // Reset the property dropdown when reset from parent is empty
  useEffect(() => {
    if (reset === "") {
      setProperty("Select Property");
    }
  }, [reset]); // Respond to changes in propertyType immediately

  // Function to reset the property selection manually
  const resetProperty = (e) => {
    e.stopPropagation(); // Prevent dropdown from closing when resetting
    setProperty("Select Property");
    onChange(""); // Reset the value in the parent component
  };

  return (
    <Menu as="div" className="dropdown relative w-full">
      <MenuButton className="dropdown-btn w-full text-left flex items-center justify-between">
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
              onClick={resetProperty} // Reset the property selection manually
            />
          )}
          <MenuItems>
            {({ open }) => (
              <>
                {open ? (
                  <RiArrowUpSLine className="dropdown-icon-secondary ml-2" />
                ) : (
                  <RiArrowDownSLine className="dropdown-icon-secondary ml-2" />
                )}
              </>
            )}
          </MenuItems>
        </div>
      </MenuButton>

      <MenuItems className="dropdown-menu mt-2 p-2 rounded-lg shadow-md bg-white">
        {properties.map((option, index) => (
          <MenuItem key={index}>
            {({ active }) => (
              <li
                className={`cursor-pointer hover:bg-primary hover:text-white transition px-4 pt-1 rounded-lg ${
                  active ? "bg-primary text-white" : ""
                }`}
                onClick={() => handlePropertySelect(option)}
              >
                {option}
              </li>
            )}
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
};

export default PropertyDropdown;
