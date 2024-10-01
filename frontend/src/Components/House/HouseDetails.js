import React from "react";
import { BiBed } from "react-icons/bi";

const HouseDetails = ({ type, location, region, bedrooms, mainRegion}) => {
  return (
    <div>
      <div className="mb-4 flex gap-x-2 text-sm">
        <div className="bg-secondary rounded-full text-white px-3">{type}</div>
        <div className="bg-primary rounded-full text-white px-3">For Sale</div>
      </div>
      <div className="text-lg font-semibold text-secondary max-w-[400px]">
        {location}, {region}, {mainRegion}
      </div>
      <div className="flex gap-x-4 my-4">
        <div className="flex items-center text-secondary gap-1">
          <div className="text-[20px]">
            <BiBed />
          </div>
          <div>{bedrooms}</div>
        </div>
      </div>
    </div>
  );
};

export default HouseDetails;
