import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Alert, CircularProgress } from "@mui/material";
import PropertyDropdown from "./PropertyDropdown";
import BedroomDropdown from "./BedroomDropdown";
import PriceInput from "./PriceInput";
import AreaInput from "./AreaInput";
import { RiSearch2Line, RiMapPinLine } from "react-icons/ri";
import locationData from "../Assets/abu_dhabi_sub_areas.json";
import modelData from "../Assets/model_data.json";
import House from "./House/House";
import { imageToUrl } from "../utils/ImageToUrl";

const Search = () => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [propertyType, setPropertyType] = useState(""); // State for Property type
  const [bedrooms, setBedrooms] = useState(""); // State for Bedrooms
  const [price, setPrice] = useState(""); // State for Price
  const [area, setArea] = useState(""); // State for Area
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [houseData, setHouseData] = useState(null); // State for the house data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false); // State to track errors
  const [model, setModel] = useState([]);

  const userInfo = useSelector((state) => state.auth.userInfo);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    if (value === "") {
      setSuggestions([]);
      return;
    }

    // Flatten the location data to create a list of regions, sub-regions, and areas
    const allLocations = Object.entries(locationData).flatMap(
      ([region, subLocations]) => {
        return Object.entries(subLocations).flatMap(([subRegion, areas]) => {
          if (areas.length > 0) {
            // Return an object with the area as the name and the full path (region and sub-region)
            return areas.map((area) => ({
              name: area,
              path: subRegion,
              fullPath: `${region}, ${subRegion}, ${area}`, // Used for filtering
            }));
          } else {
            // If there are no areas, just return the sub-region as the name
            return {
              name: subRegion,
              path: `${region}`,
              fullPath: `${region} ${subRegion}`, // Used for filtering
            };
          }
        });
      }
    );

    // Filter suggestions based on whether the input matches any part of the region, sub-region, or area
    const filteredSuggestions = allLocations.filter((location) =>
      location.fullPath.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestions(filteredSuggestions);
  };

  // Handle location selection
  const handleLocationSelect = (location, region) => {
    setInputValue(location);
    setSelectedLocation(location);
    setSelectedRegion(region);
    setSuggestions([]);
  };

  const handleSearch = async () => {
    if (
      propertyType &&
      selectedLocation &&
      selectedRegion &&
      bedrooms &&
      price &&
      area
    ) {
      setLoading(true);
      try {
        const house = {
          userId: userInfo._id,
          type: propertyType,
          location: selectedLocation,
          region: selectedRegion,
          bedrooms: bedrooms,
          area: area,
          price: price,
          email: userInfo.email,
        };

        // Fetch the images from the forecast API
        const response = await fetch(
          "https://forecastmetro-app-uxtiu.ondigitalocean.app/forecast",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              bedroom: bedrooms,
              propertyType: propertyType,
              area: area,
              price: price,
              location: selectedLocation,
              region: selectedRegion,
              email: userInfo.email,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Handle both standard and story image formats
        const standardImageUrl = await imageToUrl(data.image_standard);
        const storyImageUrl = await imageToUrl(data.image_story);

        setHouseData({
          ...house,
          imageStandard: standardImageUrl,
          imageStory: storyImageUrl,
          data: data,
        });
      } catch (error) {
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 10000);
      } finally {
        setLoading(false); // Stop loading after search is done
      }
    } else {
      alert("Please fill in all fields");
    }
  };

  useEffect(() => {
    // Load data from JSON and transform it into a simple array
    const transformedData = [];
    Object.keys(modelData).forEach((key) => {
      transformedData.push(...modelData[key]);
    });
    setModel(transformedData);
  }, []);

  return (
    <>
      <div className="relative px-[30px] py-6 -mb-4 max-w-[1170px] mx-auto flex flex-col lg:flex-row justify-between gap-4 lg:gap-x-3 lg:shadow-1 bg-white rounded-lg">
        <div className="relative w-full z-50">
          <input
            type="search"
            className="dropdown-btn w-full text-left flex items-center justify-between"
            id="exampleSearch"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Search For Location"
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() =>
                    handleLocationSelect(suggestion.name, suggestion.path)
                  }
                  className="cursor-pointer hover:bg-gray-200 px-3 py-2 flex items-start gap-2"
                >
                  <div className="flex flex-row gap-3 justify-center items-center">
                    <RiMapPinLine className="text-gray-400 text-xl" />
                    <div>
                      <div className="text-base">{suggestion.name}</div>
                      <div className="text-sm text-gray-500">
                        {suggestion.fullPath}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="px-[30px] py-6 max-w-[1170px] mx-auto flex flex-col lg:flex-row justify-between gap-4 lg:gap-x-3 relative lg:-top-4 lg:shadow-md bg-white rounded-lg">
        <PropertyDropdown onChange={setPropertyType} />
        <BedroomDropdown onChange={setBedrooms} />
        <PriceInput onChange={setPrice} />
        <AreaInput onChange={setArea} />

        <button
          onClick={handleSearch}
          className="bg-primary hover:bg-secondary transition w-full lg:max-w-[162px] h-16 rounded-lg flex justify-center items-center text-white text-lg"
        >
          <RiSearch2Line />
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center w-full h-[400px]">
          <CircularProgress />
        </div>
      ) : error ? (
        <Alert severity="warning" className="m-4">
          {model.filter(
            (property) =>
              property.name === selectedLocation &&
              property.type === propertyType
          ).length === 0 ? (
            <p>
              No available data for {propertyType} in {selectedLocation}.
            </p>
          ) : (
            <div className="flex flex-row flex-wrap gap-2">
              <p>
                <span>The available data for a</span> {propertyType}{" "}
                <span>in</span> {selectedLocation} <span>are for:</span>
              </p>
              <div className="flex flex-row gap-1">
                {model
                  .filter(
                    (property) =>
                      property.name === selectedLocation &&
                      property.type === propertyType
                  )
                  .map((property, index) => (
                    <p key={index}>
                      {property.bedroom}
                      <span>,</span>
                    </p>
                  ))}
              </div>
              <p>Bedroom(s)</p>
            </div>
          )}
        </Alert>
      ) : (
        <div className="pt-16">
          {houseData && (
            <House
              house={houseData}
              imageStandard={houseData.imageStandard}
              imageStory={houseData.imageStory}
              data={houseData.data}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Search;
