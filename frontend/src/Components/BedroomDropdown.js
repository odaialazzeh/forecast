import React, { useState, useEffect } from "react";
import {
  RiHotelBedLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiCloseLine,
} from "react-icons/ri";
import { Menu, MenuItem, MenuItems, MenuButton } from "@headlessui/react";

const BedroomDropdown = ({ onChange, reset }) => {
  const [bedroom, setBedroom] = useState("Select Bedroom");

  const bedrooms = ["Studio", "1", "2", "3", "4", "5", "6", "7"];

  // Function to handle bedroom selection
  const handleBedroomSelect = (option) => {
    setBedroom(option);
    onChange(option); // Notify parent of selected value
  };

  useEffect(() => {
    if (reset === "") {
      setBedroom("Select Bedroom");
    }
  }, [reset]);

  // Function to reset the bedroom selection
  const resetBedroom = (e) => {
    e.stopPropagation(); // Prevent dropdown from closing
    setBedroom("Select Bedroom");
    onChange(""); // Notify parent of reset value
  };

  return (
    <Menu as="div" className="dropdown relative w-full">
      <MenuButton className="dropdown-btn w-full text-left flex items-center justify-between">
        <div className="flex items-center">
          <RiHotelBedLine className="dropdown-icon-primary" />
          <div className="ml-2 text-[15px] font-medium leading-tight">
            {bedroom}
          </div>
        </div>
        <div className="flex items-center">
          {bedroom !== "Select Bedroom" && (
            <RiCloseLine
              className="text-primary ml-2 cursor-pointer"
              onClick={resetBedroom} // Reset the bedroom selection
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

      <MenuItems className="dropdown-menu mt-2 p-4">
        <div className="flex flex-wrap gap-1 justify-start">
          {bedrooms.map((option, index) => (
            <MenuItem key={index}>
              {({ active }) => (
                <div
                  className={`cursor-pointer text-center text-white transition px-4 py-2 w-14 h-10 flex items-center justify-center rounded-lg ${
                    active ? "bg-primary" : "bg-gray-500"
                  }`}
                  onClick={() => handleBedroomSelect(option)}
                >
                  {option}
                </div>
              )}
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  );
};

export default BedroomDropdown;
