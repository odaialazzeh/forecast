import React, { useState } from "react";
import { FaImage, FaMobileAlt } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const HouseImage = ({
  imageStandard,
  imageStory,
  handleDownload,
  loadingAdd,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("standard");
  const [isIconBoxVisible, setIsIconBoxVisible] = useState(false);

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
    setSelectedImage(format);
    setIsIconBoxVisible(false); // Close the icon box after selection
  };

  const toggleIconBox = () => {
    setIsIconBoxVisible((prev) => !prev);
  };

  return (
    <>
      <div className="relative flex justify-center cursor-pointer h-72 mb-8 ">
        <div className="absolute top-0 -right-4">
          <IconButton onClick={toggleIconBox}>
            <BsThreeDotsVertical className="text-black" />
          </IconButton>
        </div>
        <img
          className="mx-auto rounded-lg"
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
          </div>
        )}
      </div>
      <div className="text-center mb-4">
        <button
          onClick={handleDownload}
          className="bg-primary text-white py-2 px-4 shadow-sm rounded-lg hover:bg-secondary transition"
        >
          {loadingAdd ? "Processing..." : "Download Image"}
        </button>
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
