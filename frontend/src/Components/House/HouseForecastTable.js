import React, { useState } from "react";
import editIcon from "../../Assets/edit.svg";
import cancelIcon from "../../Assets/icons-cancel.svg";
import saveIcon from "../../Assets/save_icon.svg";
import axios from "axios";
import { imageToUrl } from "../../utils/ImageToUrl";

const HouseForecastTable = ({
  data,
  getQuarterFromDate,
  setUpdatedImage,
  housedata,
  setImageLoading,
}) => {
  const [isEditing, setIsEditing] = useState(null); // Track which row is being edited
  const [editedPrice, setEditedPrice] = useState(""); // Track the edited price
  const [loading, setLoading] = useState(false); // Track loading state for saving

  const handleEditClick = (index, price) => {
    setIsEditing(index); // Set the index of the row to be edited
    setEditedPrice(price); // Set the current price in the input field
  };

  const handleSaveClick = async (index) => {
    const updatedData = { ...data };
    updatedData.forecast_price[index] = Number(editedPrice);
    setIsEditing(null); // Exit edit mode

    // Call the API to update the image with the new forecast price
    try {
      setLoading(true);
      setImageLoading(true);
      const response = await axios.post("http://127.0.0.1:5000/update-image", {
        prePrices: data.pre_price,
        forecastPrices: updatedData.forecast_price,
        preDate: data.original_dates,
        forecastDate: data.forecast_dates,
        bedroom: housedata.bedrooms,
        propertyType: housedata.type,
        location: housedata.location,
        email: housedata.email, // Include the email if needed for watermark
      });

      // Convert base64 image to URL
      const standardImageUrl = await imageToUrl(response.data.image_standard);
      const storyImageUrl = await imageToUrl(response.data.image_story);

      // Pass the URL to the parent component
      setUpdatedImage({
        imageStandard: standardImageUrl,
        imageStory: storyImageUrl,
      });
    } catch (error) {
      console.error("Error updating the image:", error);
    } finally {
      setLoading(false);
      setImageLoading(false);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(null); // Exit edit mode without saving
  };

  return (
    <div className="bg-white my-8 shadow-1 p-5 rounded-xl w-full max-w-[400px] lg:max-w-[700px] mx-auto hover:shadow-2xl transition md:max-w-[600px] sm:max-w-[500px]">
      <table className="w-full table-fixed rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-primary">
            <th className="w-1/4 py-4 px-6 text-left text-white font-bold uppercase">
              Quarter
            </th>
            <th className="w-1/4 py-4 px-6 text-left text-white font-bold uppercase">
              Forecast Price
            </th>
            <th className="w-1/4 py-4 px-6 text-left text-white font-bold uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {data.forecast_dates.map((date, index) => (
            <tr key={index}>
              <td className="py-4 px-6 border-b font-normal text-secondary border-gray-200">
                {getQuarterFromDate(date)}
              </td>
              <td className="py-4 px-6 border-b font-normal text-secondary border-gray-200">
                {isEditing === index ? (
                  <input
                    type="number"
                    value={Math.round(editedPrice)}
                    onChange={(e) => setEditedPrice(e.target.value)}
                    className="border border-gray-300 px-2 py-1 rounded w-32"
                  />
                ) : (
                  Math.round(data.forecast_price[index])
                )}
              </td>
              <td className="py-4 px-6 border-b font-normal text-secondary border-gray-200">
                {isEditing === index ? (
                  <div className="flex flex-row gap-3">
                    <button
                      onClick={() => handleSaveClick(index)}
                      disabled={loading} // Disable button while saving
                    >
                      <div className="relative group">
                        <img src={saveIcon} alt="save" />
                        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full text-gray-700 bg-white px-2 py-1 text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Save
                        </span>
                      </div>
                    </button>
                    <button onClick={handleCancelClick}>
                      <div className="relative group">
                        <img src={cancelIcon} alt="cancel" />
                        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full text-gray-700 bg-white px-2 py-1 text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Cancel
                        </span>
                      </div>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() =>
                      handleEditClick(index, data.forecast_price[index])
                    }
                    className="ml-5 pt-1"
                  >
                    <div className="relative group">
                      <img src={editIcon} alt="edit" />
                      <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full text-gray-700 bg-white px-2 py-1 text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Edit
                      </span>
                    </div>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HouseForecastTable;
