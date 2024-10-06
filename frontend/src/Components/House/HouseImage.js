import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaImage, FaMobileAlt, FaFilePdf } from "react-icons/fa"; // Import PDF icon
import { BsThreeDotsVertical } from "react-icons/bs";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAddRecordMutation } from "../../slices/recordApiSlice";

const HouseImage = ({
  imageStandard,
  imageStory,
  selectedImage,
  setSelectedImage,
  setShowPDF,
  showPDF,
  bedrooms, // New prop
  type, // New prop
  location, // New prop
  area, // New prop
  plotArea, // New prop
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIconBoxVisible, setIsIconBoxVisible] = useState(false);

  const [addRecord] = useAddRecordMutation();

  const userInfo = useSelector((state) => state.auth.userInfo);

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/400";
  };

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleImageSelection = (format) => {
    if (format === "pdf") {
      setShowPDF(true);
      setSelectedImage("standard");
    } else {
      setSelectedImage(format);
      setShowPDF(false);
    }
    setIsIconBoxVisible(false);
  };

  const toggleIconBox = () => {
    setIsIconBoxVisible((prev) => !prev);
  };

  const handleCustomDownload = async () => {
    const bedroomText =
      bedrooms === "studio" ? "studio" : `${bedrooms} bedroom(s)`;
    const plotAreaText = plotArea ? `and plot area ${plotArea} sqft` : "";
    const additionalText = `Past 18 months, Upcoming 6 months for ${bedroomText} ${type} in ${location} with Built up area ${area} sqft ${plotAreaText}`;

    // Create a canvas
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // Create an image element to draw on the canvas
    const img = new Image();
    img.crossOrigin = "anonymous"; // Avoid CORS issues with downloading the image
    img.src = selectedImage === "standard" ? imageStandard : imageStory;

    img.onload = async () => {
      // Set canvas dimensions to match the image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image on the canvas
      context.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Set text properties
      context.font = "40px Arial";
      context.fillStyle = "black";
      context.strokeStyle = "white";
      context.lineWidth = 2;

      // Measure the width of the text to center it
      const textWidth = context.measureText(additionalText).width;
      const x = (canvas.width - textWidth) / 2; // X-coordinate to center the text
      const y = 50; // Y-coordinate for the text (near the top of the image)

      // Add centered text overlay on the image
      context.strokeText(additionalText, x, y); // Add a black stroke to the text for contrast
      context.fillText(additionalText, x, y); // Fill the text with white color

      // Convert the canvas to a data URL and trigger the download
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/jpeg");
      link.download = "house-image.jpg"; // Name for the downloaded file
      link.click();

      // Add record mutation
      const recordData = {
        user: userInfo._id,
        type,
        location,
        bedrooms,
        area,
      };

      try {
        await addRecord(recordData);
        console.log("Record successfully added");
      } catch (error) {
        console.error("Error adding record:", error);
      }
    };

    img.onerror = () => {
      console.error("Failed to load image for download.");
    };
  };

  return (
    <>
      <div className="relative flex justify-center cursor-pointer h-72 mb-8">
        <div className="absolute top-0 -right-4">
          <IconButton onClick={toggleIconBox}>
            <BsThreeDotsVertical className="text-black" />
          </IconButton>
        </div>
        <img
          className={`mx-auto rounded-lg ${
            selectedImage === "story" ? "w-56" : "w-full"
          }`}
          src={selectedImage === "standard" ? imageStandard : imageStory}
          alt="House"
          onError={handleImageError}
          onClick={handleImageClick}
        />

        {isIconBoxVisible && (
          <div className="absolute top-10 right-2 bg-gray-200 p-2 rounded-lg shadow-lg flex gap-2">
            <IconButton
              onClick={() => handleImageSelection("standard")}
              className={`text-black ${
                selectedImage === "standard" ? "text-primary" : ""
              }`}
            >
              <FaImage />
            </IconButton>
            <IconButton
              onClick={() => handleImageSelection("story")}
              className={`text-black ${
                selectedImage === "story" ? "text-primary" : ""
              }`}
            >
              <FaMobileAlt />
            </IconButton>
            <IconButton
              onClick={() => handleImageSelection("pdf")}
              className={`text-black ${showPDF ? "text-primary" : ""}`}
            >
              <FaFilePdf />
            </IconButton>
          </div>
        )}
      </div>
      <div className="text-center mb-4">
        {showPDF ? (
          ""
        ) : (
          <button
            onClick={handleCustomDownload}
            className="bg-primary text-white py-2 px-4 shadow-sm rounded-lg hover:bg-secondary transition"
          >
            Download Image
          </button>
        )}
      </div>
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="relative">
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <img
            src={selectedImage === "standard" ? imageStandard : imageStory}
            alt="House Full View"
            className="w-full h-auto"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HouseImage;
