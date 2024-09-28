import React, { useState } from "react";
import editIcon from "../../Assets/edit.svg";
import cancelIcon from "../../Assets/icons-cancel.svg";
import saveIcon from "../../Assets/save_icon.svg";
import axios from "axios";
import { imageToUrl } from "../../utils/ImageToUrl";

// Utility function to convert a date to its quarter
function getQuarterFromDate(dateStr) {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1; // getMonth is 0-based, so add 1
  const quarter = Math.ceil(month / 3); // Q1: Jan-Mar, Q2: Apr-Jun, Q3: Jul-Sep, Q4: Oct-Dec
  return `Q${quarter} ${date.getFullYear()}`;
}

// Function to combine the dates into quarters and calculate the average price for each quarter
function calculateQuarterlyAverages(forecastDates, forecastPrices) {
  const quarterMap = {};

  forecastDates.forEach((date, index) => {
    const quarter = getQuarterFromDate(date);
    const price = forecastPrices[index];

    if (!quarterMap[quarter]) {
      quarterMap[quarter] = [];
    }

    quarterMap[quarter].push({ date, price, index });
  });

  const quarterlyAverages = Object.keys(quarterMap).map((quarter) => {
    const prices = quarterMap[quarter].map((item) => item.price);
    const avgPrice =
      prices.reduce((acc, price) => acc + price, 0) / prices.length;
    return {
      quarter,
      avgPrice: Math.round(avgPrice),
      dates: quarterMap[quarter], // Store dates and indexes for later use
    };
  });

  return quarterlyAverages;
}

const HouseForecastTable = ({
  data,
  setUpdatedImage,
  housedata,
  setImageLoading,
}) => {
  const [isEditing, setIsEditing] = useState(null); // Track which quarter is being edited
  const [editedAvgPrice, setEditedAvgPrice] = useState(""); // Track the edited avg price
  const [loading, setLoading] = useState(false); // Track loading state for saving

  const handleEditClick = (index, avgPrice) => {
    setIsEditing(index); // Set the index of the quarter to be edited
    setEditedAvgPrice(avgPrice); // Set the current avg price in the input field
  };

  const handleSaveClick = async (index, quarterData) => {
    const updatedData = { ...data };
    const datesInQuarter = quarterData.dates;
    const newAvgPrice = Number(editedAvgPrice);

    const newPriceForEachDate = newAvgPrice; // Set the new average price to each date

    datesInQuarter.forEach(({ index }) => {
      updatedData.forecast_price[index] = newPriceForEachDate;
    });

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

  // Calculate the quarterly averages
  const quarterlyData = calculateQuarterlyAverages(
    data.forecast_dates,
    data.forecast_price
  );

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
          {quarterlyData.map((quarter, index) => (
            <tr key={index}>
              <td className="py-2 px-6 border-b font-normal text-secondary border-gray-200">
                {quarter.quarter}
              </td>
              <td className="py-2 px-6 border-b font-normal text-secondary border-gray-200">
                {isEditing === index ? (
                  <input
                    type="number"
                    value={Math.round(editedAvgPrice)}
                    onChange={(e) => setEditedAvgPrice(e.target.value)}
                    className="border border-gray-300 px-2 py-1 rounded w-36"
                  />
                ) : (
                  Math.round(quarter.avgPrice)
                )}
              </td>
              <td className="py-2 pl-12 border-b font-normal text-secondary border-gray-200">
                {isEditing === index ? (
                  <div className="flex flex-row gap-1 ml-4">
                    <button
                      onClick={() => handleSaveClick(index, quarter)}
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
                    onClick={() => handleEditClick(index, quarter.avgPrice)}
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
