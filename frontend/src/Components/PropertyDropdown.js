import React, { useState, useEffect } from "react";
import {
  RiHome5Line,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiCloseLine,
} from "react-icons/ri";
import { Menu, MenuItem, MenuItems, MenuButton } from "@headlessui/react";

const PropertyDropdown = ({
  onChange,
  reset,
  availablePropertyTypes,
  resetBedrooms,
  resetArea,
}) => {
  const [property, setProperty] = useState("Select Property Type");

  // Function to handle the property selection
  const handlePropertySelect = (option) => {
    setProperty(option);
    onChange(option); // Pass the selected option to the parent component
    resetBedrooms(); // Reset bedrooms when property type is selected
    resetArea(); // Reset area when property type is selected
  };

  useEffect(() => {
    if (reset === "") {
      setProperty("Select Property Type");
    }
  }, [reset]);

  // Function to reset the property selection
  const resetProperty = (e) => {
    e.stopPropagation(); // Prevent dropdown from closing when resetting
    setProperty("Select Property Type");
    onChange(""); // Notify the parent component of the reset
    resetBedrooms(); // Reset bedrooms when property type is reset
    resetArea(); // Reset area when property type is reset
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
          {property !== "Select Property Type" && (
            <RiCloseLine
              className="text-primary ml-2 cursor-pointer"
              onClick={resetProperty} // Reset the property selection
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

      <MenuItems className="dropdown-menu mt-1 p-4">
        <div className="flex flex-col gap-2 justify-start">
          {availablePropertyTypes.length === 0 ? (
            <div className="px-4 py-2 text-gray-500">No Types Available</div>
          ) : (
            availablePropertyTypes.map((option, index) => (
              <MenuItem key={index}>
                {({ active }) => (
                  <li
                    className={`cursor-pointer px-4 pt-4 ${
                      active ? "text-primary" : ""
                    }`}
                    onClick={() => handlePropertySelect(option)}
                  >
                    {option}
                  </li>
                )}
              </MenuItem>
            ))
          )}
        </div>
      </MenuItems>
    </Menu>
  );
};

export default PropertyDropdown;
