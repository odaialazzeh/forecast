import React, { useState, useEffect } from "react";
import { RiArrowDownSLine, RiArrowUpSLine, RiCloseLine } from "react-icons/ri";
import { BiArea } from "react-icons/bi";
import { Menu, MenuItem, MenuItems, MenuButton } from "@headlessui/react";

const UnitAreaDropdown = ({ unitAreas = [], onChange }) => {
  const [unitArea, setUnitArea] = useState("Select Area");

  // Reset the unit area when the parent resets the value (unitAreas change or unitArea is cleared)
  useEffect(() => {
    if (!unitAreas.length) {
      setUnitArea("Select Area");
    }
  }, [unitAreas]);

  // Function to handle the unit area selection
  const handleUnitAreaSelect = (option) => {
    setUnitArea(option);
    onChange(option); // Pass the selected unit area to the parent component
  };

  // Function to reset the dropdown and selected area
  const resetUnitArea = (e) => {
    e.stopPropagation(); // Prevent the dropdown from closing on reset
    setUnitArea("Select Area");
    onChange(""); // Reset the value in the parent component
  };

  return (
    <Menu as="div" className="dropdown relative w-full">
      <MenuButton className="dropdown-btn w-full text-left flex items-center justify-between">
        <div className="flex items-center">
          <BiArea className="dropdown-icon-primary" />
          <div className="ml-2 text-[15px] font-medium leading-tight">
            {unitArea}
          </div>
        </div>
        <div className="flex items-center">
          {unitArea !== "Select Area" && (
            <RiCloseLine
              className="text-primary ml-2 cursor-pointer"
              onClick={resetUnitArea} // Reset the unit area
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
        {unitAreas.length === 0 ? (
          <div className="px-4 py-2 text-gray-500">No Areas Available</div>
        ) : (
          unitAreas.map((option, index) => (
            <MenuItem key={index}>
              {({ active }) => (
                <li
                  className={`cursor-pointer px-4 ${
                    active ? "text-primary" : ""
                  }`}
                  onClick={() => handleUnitAreaSelect(option)}
                >
                  {option} sq.ft.
                </li>
              )}
            </MenuItem>
          ))
        )}
      </MenuItems>
    </Menu>
  );
};

export default UnitAreaDropdown;
