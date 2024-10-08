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
  return {
    quarter: `Q${quarter} ${date.getFullYear()}`,
    year: date.getFullYear(),
    fullDate: dateStr,
  };
}

function getMonthFromDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString("default", { month: "long", year: "numeric" });
}
// Function to combine the dates into quarters and calculate the average price for each quarter
function calculateQuarterlyAverages(forecastDates, prices, cutoffQuarter) {
  const quarterMap = {};

  // Define the cutoff date (Q2 2023)
  const cutoffYear = 2023;
  const cutoffQuarterNum = 2; // Q2

  forecastDates.forEach((date, index) => {
    const { quarter, year } = getQuarterFromDate(date);
    const price = prices[index];

    // Only include data from Q2 2023 onward
    const dateQuarter = Math.ceil((new Date(date).getMonth() + 1) / 3);
    if (
      year > cutoffYear ||
      (year === cutoffYear && dateQuarter >= cutoffQuarterNum)
    ) {
      if (!quarterMap[quarter]) {
        quarterMap[quarter] = [];
      }

      quarterMap[quarter].push({ date, price, index });
    }
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
  const [isEditingForecast, setIsEditingForecast] = useState(null); // Track which quarter is being edited for forecast prices
  const [isEditingPre, setIsEditingPre] = useState(null); // Track which quarter is being edited for pre prices
  const [editedAvgForecastPrice, setEditedAvgForecastPrice] = useState(""); // Track the edited avg forecast price
  const [editedAvgPrePrice, setEditedAvgPrePrice] = useState(""); // Track the edited avg pre price
  const [loading, setLoading] = useState(false); // Track loading state for saving
  const [priceType, setPriceType] = useState(""); // Track selected price type (forecast or pre)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Toggle the custom dropdown

  const handleEditForecastClick = (index, avgPrice) => {
    setIsEditingForecast(index); // Set the index of the quarter to be edited for forecast prices
    setEditedAvgForecastPrice(avgPrice); // Set the current avg forecast price in the input field
  };

  const handleEditPreClick = (index, avgPrice) => {
    setIsEditingPre(index); // Set the index of the quarter to be edited for pre prices
    setEditedAvgPrePrice(avgPrice); // Set the current avg pre price in the input field
  };

  const handleSaveClick = async (index, quarterData, type) => {
    const updatedData = { ...data };
    const datesInQuarter = quarterData.dates;
    const newPrice = Number(
      type === "forecast" ? editedAvgForecastPrice : editedAvgPrePrice
    );

    if (type === "forecast") {
      updatedData.forecast_price[quarterData] = newPrice;
      setIsEditingForecast(null);
    } // Exit edit mode for forecast prices
    else {
      datesInQuarter.forEach(({ index }) => {
        updatedData.pre_price[index] = newPrice;
      });
      setIsEditingPre(null);
    } // Exit edit mode for pre prices

    // Call the API to update the image with the new prices
    try {
      setLoading(true);
      setImageLoading(true);
      const response = await axios.post(
        "https://forecastmetro-app-uxtiu.ondigitalocean.app/update-image",
        {
          prePrices: updatedData.pre_price,
          forecastPrices: updatedData.forecast_price,
          preDate: data.original_dates, // Keep the original dates as quarters
          forecastDate: data.forecast_dates, // Send updated forecast dates in months
          bedroom: housedata.bedrooms,
          propertyType: housedata.type,
          location: housedata.location,
          email: housedata.email,
        }
      );

      const standardImageUrl = await imageToUrl(response.data.image_standard);
      const storyImageUrl = await imageToUrl(response.data.image_story);

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

  const handleCancelClick = (type) => {
    if (type === "forecast")
      setIsEditingForecast(null); // Exit edit mode for forecast prices
    else setIsEditingPre(null); // Exit edit mode for pre prices
  };

  const quarterlyPreData = calculateQuarterlyAverages(
    data.original_dates,
    data.pre_price
  );

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (value) => {
    setPriceType(value); // Update price type
    setIsDropdownOpen(false); // Close dropdown
  };

  const forecastData = data.forecast_dates
    .filter((date) => new Date(date) >= new Date("2024-10-01")) // Filter dates from November 2024 onward
    .slice(0, 3) // Take only the first 3 dates
    .map((date, index) => ({
      month: getMonthFromDate(date),
      price: data.forecast_price[data.forecast_dates.indexOf(date)], // Get the price corresponding to the date
      index: data.forecast_dates.indexOf(date), // Get the correct index of the date
    }));

  return (
    <div className="flex flex-col flex-grow bg-white my-4 shadow-1 p-5 rounded-xl w-full max-w-[400px] lg:max-w-[700px] mx-auto hover:shadow-2xl transition md:max-w-[600px] sm:max-w-[500px]">
      {/* Custom dropdown for selecting price type */}
      <div className="mb-4 relative">
        <label htmlFor="price-type" className="font-bold mr-4 text-secondary">
          Select Data To Edit:
        </label>
        <div
          className="border p-2 rounded bg-gray-100 text-secondary cursor-pointer flex justify-between items-center"
          onClick={toggleDropdown}
        >
          {priceType === ""
            ? "Select Type"
            : priceType === "forecast"
            ? "Forecast in Months"
            : "Original in Quarters"}
          <span className="ml-2">▼</span>{" "}
        </div>

        {isDropdownOpen && (
          <ul className="absolute left-0 z-10 w-full mt-2 bg-white border border-gray-300 rounded shadow-lg">
            <li
              className="p-2 cursor-pointer text-secondary hover:bg-primary hover:text-white"
              onClick={() => handleOptionClick("")}
            >
              Select Type
            </li>
            <li
              className="p-2 cursor-pointer text-secondary hover:bg-primary hover:text-white"
              onClick={() => handleOptionClick("forecast")}
            >
              Forecast in Months
            </li>
            <li
              className="p-2 cursor-pointer text-secondary hover:bg-primary hover:text-white"
              onClick={() => handleOptionClick("pre")}
            >
              Original in Quarters
            </li>
          </ul>
        )}
      </div>

      {/* Conditional Rendering: Show Forecast Price Table */}
      {priceType === "forecast" && (
        <>
          <table className="w-full table-fixed rounded-lg overflow-hidden mb-8">
            <thead>
              <tr className="bg-primary">
                <th className="w-1/3 py-[12px] px-6 text-left text-white font-bold uppercase">
                  Month
                </th>
                <th className="w-1/3 py-[12px] px-6 text-left text-white font-bold uppercase">
                  Price
                </th>
                <th className="w-1/3 py-[12px] pl-16 text-left text-white font-bold uppercase">
                  Edit
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {forecastData.map((monthData, index) => (
                <tr key={index}>
                  <td className="py-2 px-6 border-b font-normal text-secondary border-gray-200">
                    {monthData.month}
                  </td>
                  <td className="py-2 px-6 border-b font-normal text-secondary border-gray-200">
                    {isEditingForecast === index ? (
                      <input
                        type="number"
                        value={Math.round(editedAvgForecastPrice)}
                        onChange={(e) =>
                          setEditedAvgForecastPrice(e.target.value)
                        }
                        className="border border-gray-300 px-2 py-1 rounded w-36"
                      />
                    ) : (
                      Math.round(monthData.price)
                    )}
                  </td>
                  <td className="py-2 pl-12 border-b font-normal text-secondary border-gray-200">
                    {isEditingForecast === index ? (
                      <div className="flex flex-row gap-3 ml-4">
                        <button
                          onClick={() =>
                            handleSaveClick(index, monthData.index, "forecast")
                          }
                          disabled={loading}
                        >
                          <div className="relative group">
                            <img src={saveIcon} alt="save" />
                            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full text-gray-700 bg-white px-2 py-1 text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              Save
                            </span>
                          </div>
                        </button>
                        <button onClick={() => handleCancelClick("forecast")}>
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
                          handleEditForecastClick(index, monthData.price)
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
        </>
      )}

      {/* Conditional Rendering: Show Pre Price Table */}
      {priceType === "pre" && (
        <>
          <table className="w-full table-fixed rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-primary">
                <th className="w-1/3 py-[12px] px-6 text-left text-white font-bold uppercase">
                  Quarter
                </th>
                <th className="w-1/3 py-[12px] px-6 text-left text-white font-bold uppercase">
                  Price
                </th>
                <th className="w-1/3 py-[12px] px-6 pl-16 text-left text-white font-bold uppercase">
                  Edit
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {quarterlyPreData.map((quarter, index) => (
                <tr key={index}>
                  <td className="py-2 px-6 border-b font-normal text-secondary border-gray-200">
                    {quarter.quarter}
                  </td>
                  <td className="py-2 px-6 border-b font-normal text-secondary border-gray-200">
                    {isEditingPre === index ? (
                      <input
                        type="number"
                        value={Math.round(editedAvgPrePrice)}
                        onChange={(e) => setEditedAvgPrePrice(e.target.value)}
                        className="border border-gray-300 px-2 py-1 rounded w-36"
                      />
                    ) : (
                      Math.round(quarter.avgPrice)
                    )}
                  </td>
                  <td className="py-2 pl-12 border-b font-normal text-secondary border-gray-200">
                    {isEditingPre === index ? (
                      <div className="flex flex-row gap-3 ml-4">
                        <button
                          onClick={() => handleSaveClick(index, quarter, "pre")}
                          disabled={loading}
                        >
                          <div className="relative group">
                            <img src={saveIcon} alt="save" />
                            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full text-gray-700 bg-white px-2 py-1 text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              Save
                            </span>
                          </div>
                        </button>
                        <button onClick={() => handleCancelClick("pre")}>
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
                          handleEditPreClick(index, quarter.avgPrice)
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
        </>
      )}
    </div>
  );
};

export default HouseForecastTable;
