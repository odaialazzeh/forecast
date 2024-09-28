import React, { useState } from "react";
import { CircularProgress } from "@mui/material";
import HouseImage from "./HouseImage";
import HouseDetails from "./HouseDetails";
import HouseForecastTable from "./HouseForecastTable";
import { useAddRecordMutation } from "../../slices/recordApiSlice";

const House = ({ house, data }) => {
  const {
    type,
    location,
    bedrooms,
    area,
    price,
    region,
    imageStandard,
    imageStory,
    userId,
    email,
  } = house;

  const [selectedImage, setSelectedImage] = useState("standard");
  const [updatedImages, setUpdatedImage] = useState({
    imageStandard: "", // New image standard format
    imageStory: "", // New image story format
  });
  const [imageLoading, setImageLoading] = useState(false);

  const [addRecord, { isLoading: loadingAdd, isError, error }] =
    useAddRecordMutation();

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
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            imageLoading={imageLoading} // Pass the imageLoading state to the HouseImage component
          />
        )}

        <HouseDetails
          type={type}
          location={location}
          region={region}
          bedrooms={bedrooms}
          area={area}
          price={price}
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
