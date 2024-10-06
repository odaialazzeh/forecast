import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";
import HouseImage from "./HouseImage";
import HouseDetails from "./HouseDetails";
import HouseForecastTable from "./HouseForecastTable";
import GeneratePDFComponent from "../../utils/GeneratePDFComponent";
import { useAddRecordMutation } from "../../slices/recordApiSlice";
import { useGetUserQuery } from "../../slices/usersApiSlice";

const House = ({ house = {}, data = [] }) => {
  // Add default empty object for house and data

  // Destructure the house properties, but ensure house is not undefined
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
    userId,
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

  const [addRecord, { isLoading: loadingAdd, isError, error }] =
    useAddRecordMutation();

  const userInfo = useSelector((state) => state.auth.userInfo);
  const { data: user } = useGetUserQuery(userInfo?._id, {
    skip: !userInfo?._id,
  });

  const handleDownload = async () => {
    try {
      const recordData = {
        user: userId,
        type,
        location,
        bedrooms,
        area,
        price,
      };
      await addRecord(recordData);

      const link = document.createElement("a");

      let imageToDownload;
      let filename;

      // Use the selected image from state
      if (selectedImage === "standard") {
        imageToDownload = updatedImages.imageStandard || imageStandard;
        filename = updatedImages.imageStandard
          ? "house_updated_image_standard.jpg"
          : "house_standard_image.jpg";
      } else if (selectedImage === "story") {
        imageToDownload = updatedImages.imageStory || imageStory;
        filename = updatedImages.imageStory
          ? "house_updated_image_story.jpg"
          : "house_story_image.jpg";
      }

      link.href = imageToDownload;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error adding record:", error);
    }
  };

  return (
    <div>
      <div className="bg-white shadow-1 p-5 rounded-xl w-full max-w-[400px] lg:max-w-[700px] mx-auto hover:shadow-2xl transition md:max-w-[600px] sm:max-w-[500px]">
        {imageLoading ? (
          <div className="flex justify-center items-center w-full h-[400px]">
            <CircularProgress />
          </div>
        ) : (
          <HouseImage
            imageStandard={updatedImages.imageStandard || imageStandard}
            imageStory={updatedImages.imageStory || imageStory}
            handleDownload={handleDownload}
            loadingAdd={loadingAdd}
            selectedImage={selectedImage} // Pass selectedImage as a prop
            setSelectedImage={setSelectedImage} // Pass setSelectedImage to update it
            imageLoading={imageLoading}
            showPDF={showPDF} // Pass showPDF state to control button display
            setShowPDF={setShowPDF} // Pass function to toggle PDF view
          />
        )}

        {/* Conditionally render the Generate PDF button */}
        <div className="ml-52">
          {showPDF && (
            <GeneratePDFComponent
              user={user}
              selectedImage={selectedImage}
              updatedImages={updatedImages}
              imageStandard={imageStandard}
              imageStory={imageStory}
              email={email}
            />
          )}
        </div>

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
      {isError && (
        <div className="text-red-500">Error adding record: {error.message}</div>
      )}
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
