import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";
import HouseImage from "./HouseImage";
import HouseDetails from "./HouseDetails";
import HouseForecastTable from "./HouseForecastTable";
import GeneratePDFComponent from "../../utils/GeneratePDFComponent";
import { useGetUserQuery } from "../../slices/usersApiSlice";

const House = ({ house = {}, data = [] }) => {
  const {
    type,
    location,
    bedrooms,
    area,
    plotArea,
    price,
    region,
    imageStandard,
    imageStory,
    mainRegion,
    email,
  } = house || {}; // Fallback to an empty object if house is undefined

  const [selectedImage, setSelectedImage] = useState("standard"); // Lifted state
  const [updatedImages, setUpdatedImage] = useState({
    imageStandard: "", // New image standard format
    imageStory: "", // New image story format
  });
  const [imageLoading, setImageLoading] = useState(false);
  const [showPDF, setShowPDF] = useState(false); // New state to show the PDF option

  const userInfo = useSelector((state) => state.auth.userInfo);
  const { data: user } = useGetUserQuery(userInfo?._id, {
    skip: !userInfo?._id,
  });

  return (
    <div>
      <div className="bg-white shadow-1 p-5 rounded-xl w-full max-w-[400px] lg:max-w-[700px] mx-auto hover:shadow-2xl transition md:max-w-[600px] sm:max-w-[500px] ">
        {imageLoading ? (
          <div className="flex justify-center items-center w-full h-[400px]">
            <CircularProgress />
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center mb-6">
            <HouseImage
              imageStandard={updatedImages.imageStandard || imageStandard}
              imageStory={updatedImages.imageStory || imageStory}
              selectedImage={selectedImage} // Pass selectedImage as a prop
              setSelectedImage={setSelectedImage} // Pass setSelectedImage to update it
              imageLoading={imageLoading}
              showPDF={showPDF} // Pass showPDF state to control button display
              setShowPDF={setShowPDF} // Pass function to toggle PDF view
              type={type}
              location={location}
              bedrooms={bedrooms}
              area={area}
              plotArea={plotArea}
            />
            {showPDF && (
              <GeneratePDFComponent
                user={user}
                selectedImage={selectedImage}
                updatedImages={updatedImages}
                imageStandard={imageStandard}
                imageStory={imageStory}
                type={type}
                location={location}
                bedrooms={bedrooms}
                area={area}
                plotArea={plotArea}
                mainRegion={mainRegion}
                region={region}
                email={email}
              />
            )}
          </div>
        )}

        <HouseDetails
          type={type}
          location={location}
          region={region}
          bedrooms={bedrooms}
          area={area}
          plotArea={plotArea}
          price={price}
          mainRegion={mainRegion}
          unitArea={area}
        />
      </div>

      <HouseForecastTable
        data={data}
        housedata={house}
        setUpdatedImage={setUpdatedImage}
        setImageLoading={setImageLoading}
      />
    </div>
  );
};

export default House;
