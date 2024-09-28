import React from "react";
import { BiBed, BiArea } from "react-icons/bi";

const HouseDetails = ({ type, location, region, bedrooms, area, price }) => {
  return (
    <div>
      <div className="mb-4 flex gap-x-2 text-sm">
        <div className="bg-secondary rounded-full text-white px-3">{type}</div>
        <div className="bg-primary rounded-full text-white px-3">For Sale</div>
      </div>
      <div className="text-lg font-semibold text-secondary max-w-[260px]">
        {location}, {region}
      </div>
      <div className="flex gap-x-4 my-4">
        <div className="flex items-center text-secondary gap-1">
          <div className="text-[20px]">
            <BiBed />
          </div>
          <div>{bedrooms}</div>
        </div>
        <div className="flex items-center text-secondary gap-1">
          <div className="text-[20px]">
            <BiArea />
          </div>
          <div>{area} sqft</div>
        </div>
      </div>
      <div className="text-lg font-semibold text-secondary mb-4">
        {price} AED
      </div>
    </div>
  );
};

export default HouseDetails;
