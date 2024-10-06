import React from "react";
import { BiBed, BiArea } from "react-icons/bi";

const HouseDetails = ({
  type,
  location,
  region,
  bedrooms,
  mainRegion,
  unitArea,
  plotArea,
}) => {
  return (
    <div>
      <div className="mb-4 flex gap-x-2 text-sm">
        <div className="bg-secondary rounded-full text-white px-3">{type}</div>
        <div className="bg-primary rounded-full text-white px-3">For Sale</div>
      </div>
      <div className="text-lg font-semibold text-secondary max-w-[400px]">
        {location}, {region}, {mainRegion}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2 my-4">
        <div className="flex items-center text-secondary gap-1">
          <div className="text-[20px]">
            <BiBed />
          </div>
          <div>{bedrooms}</div>
        </div>
        <span className=" text-secondary">|</span>
        <div className="flex items-center text-secondary gap-1">
          <div className="text-[20px]">
            <BiArea />
          </div>
          <span className="text-[15px]">Built Up : </span>
          <div>{unitArea} sqft</div>
        </div>
        <span className=" text-secondary">|</span>
        <div className="flex items-center text-secondary gap-1">
          <div className="text-[20px]">
            <BiArea />
          </div>
          <span className="text-[15px]">Plot : </span>
          {plotArea ? (
            <div>{plotArea} sqft</div>
          ) : (
            <span className=" text-secondary">Na</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default HouseDetails;
