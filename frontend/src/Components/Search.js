import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Alert, CircularProgress } from "@mui/material";
import PropertyDropdown from "./PropertyDropdown";
import BedroomDropdown from "./BedroomDropdown";
import UnitAreaDropdown from "./AreaDropdown";
import { RiMapPinLine } from "react-icons/ri";
import locationData from "../Assets/abu_dhabi_sub_areas.json";
import averagePrice from "../Assets/average_price.json";
import House from "./House/House";
import { imageToUrl } from "../utils/ImageToUrl";

const Search = () => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [propertyType, setPropertyType] = useState(""); // State for Property type
  const [bedrooms, setBedrooms] = useState(""); // State for Bedrooms
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [mainRegion, setMainRegion] = useState("");
  const [unitArea, setUnitArea] = useState(""); // State for Unit Area
  const [availableUnitAreas, setAvailableUnitAreas] = useState([]);
  const [plotArea, setPlotArea] = useState([]);
  const [houseData, setHouseData] = useState(null); // State for the house data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false); // State to track errors
  const [model, setModel] = useState([]);
  const [availablePropertyTypes, setAvailablePropertyTypes] = useState([]);
  const [availableBedrooms, setAvailableBedrooms] = useState([]);

  const userInfo = useSelector((state) => state.auth.userInfo);

  const resetArea = () => {
    setUnitArea(""); // Reset the Unit Area state
    setAvailableUnitAreas([]); // Optionally reset available unit areas if necessary
  };
  const resetBedrooms = () => {
    setBedrooms(""); // Reset the Unit Area state
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    if (value === "") {
      setSuggestions([]);
      return;
    }

    const allLocations = Object.entries(locationData).flatMap(
      ([region, subLocations]) => {
        return Object.entries(subLocations).flatMap(([subRegion, areas]) => {
          if (areas.length > 0) {
            return areas.map((area) => ({
              name: area,
              path: subRegion,
              mainRegion: region,
              fullPath: `${region}, ${subRegion}, ${area}`, // Used for filtering
            }));
          } else {
            return {
              name: subRegion,
              path: `${region}`,
              mainRegion: region,
              fullPath: `${region}, ${subRegion}`, // Used for filtering
            };
          }
        });
      }
    );

    const filteredSuggestions = allLocations.filter((location) =>
      location.fullPath.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestions(filteredSuggestions);
  };

  const handleLocationSelect = (location, region, main) => {
    // Reset dropdown states before updating location
    setPropertyType(""); // Reset PropertyDropdown
    setBedrooms("");
    setUnitArea(""); // Reset UnitAreaDropdown

    setHouseData(null);

    // Now proceed to update location-related states
    setInputValue(location);
    setSelectedLocation(location);
    setSelectedRegion(region);
    setMainRegion(main);
    setSuggestions([]);

    // Reset the unit area and available areas when a new location is selected
    setAvailableUnitAreas([]); // Clear unit areas
  };

  useEffect(() => {
    if (selectedLocation) {
      const filteredPropertyTypes = Object.keys(averagePrice).filter(
        (propertyType) => averagePrice[propertyType][selectedLocation]
      );
      setAvailablePropertyTypes(filteredPropertyTypes);
    } else {
      setAvailablePropertyTypes([]); // Reset if no location is selected
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (propertyType && selectedLocation) {
      const bedroomsForLocation = Object.keys(
        averagePrice?.[propertyType]?.[selectedLocation] || {}
      ).map((bedroom) => bedroom.replace(" Bedrooms", ""));
      setAvailableBedrooms(bedroomsForLocation);
    } else {
      setAvailableBedrooms([]); // Reset if no property type or location is selected
    }
  }, [propertyType, selectedLocation]);

  useEffect(() => {
    if (propertyType && bedrooms && selectedLocation) {
      const key = bedrooms === "studio" ? "studio" : `${bedrooms} Bedrooms`;
      const data =
        averagePrice?.[propertyType]?.[selectedLocation]?.[key] || [];

      // Ensure data is iterable (an array) before mapping
      const unitAreas = Array.isArray(data)
        ? data.map((item) => item.unit_area)
        : [];
      const plotAreas = Array.isArray(data)
        ? data.map((item) => item.plot_area ?? null)
        : [];

      setAvailableUnitAreas(unitAreas);
      setPlotArea(plotAreas);
    }
  }, [propertyType, bedrooms, selectedLocation]);

  // Validate when propertyType, bedrooms, and location are selected
  useEffect(() => {
    if (propertyType && bedrooms && selectedLocation) {
      const selectedModelData =
        averagePrice[propertyType]?.[selectedLocation]?.[
          bedrooms === "studio" ? "studio" : `${bedrooms} Bedrooms`
        ];

      if (!selectedModelData) {
        setError(true);
      } else {
        setError(false);
      }
    }
  }, [propertyType, bedrooms, selectedLocation]);

  const handleSearch = async () => {
    if (
      propertyType &&
      selectedLocation &&
      selectedRegion &&
      bedrooms &&
      unitArea
    ) {
      try {
        const selectedModelData = averagePrice[propertyType]?.[
          selectedLocation
        ]?.[bedrooms === "studio" ? "studio" : `${bedrooms} Bedrooms`]?.find(
          (item) =>
            item.unit_area === parseInt(unitArea) &&
            item.plot_area === parseInt(plotArea)
        );

        if (!selectedModelData) {
          throw new Error("No matching data found");
        }

        setError(false);
        setLoading(true);

        const house = {
          userId: userInfo._id,
          type: propertyType,
          location: selectedLocation,
          region: selectedRegion,
          mainRegion: mainRegion,
          bedrooms: bedrooms,
          area: selectedModelData.unit_area,
          plotArea: selectedModelData.plot_area,
          price: selectedModelData.price,
          email: userInfo.email,
        };

        const response = await fetch(
          "https://flask-app-6shfu.ondigitalocean.app/forecast",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              bedroom: bedrooms,
              propertyType: propertyType,
              area: selectedModelData.unit_area,
              price: selectedModelData.price,
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
        setLoading(false);
      }
    } else {
      alert("Please fill in all fields");
    }
  };

  const handleClearInput = () => {
    setInputValue("");
    setSelectedLocation(""); // Reset location selection
  };

  console.log(bedrooms);

  return (
    <>
      <div className="relative px-[30px] py-6 -mb-4 max-w-[1170px] mx-auto flex flex-col lg:flex-col justify-between gap-4 lg:gap-x-3 lg:shadow-1 bg-white rounded-lg">
        <div className=" w-full max-w-[1170px]">
          <div className="w-full z-50">
            <div className="relative flex flex-row items-center justify-center gap-0 w-full">
              <input
                type="text"
                className="dropdown-btn w-full text-left flex items-center justify-between pr-8" // Add padding-right to avoid overlap with the 'x' button
                id="exampleSearch"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Search For Location"
              />
              {selectedLocation && (
                <button
                  type="button"
                  onClick={handleClearInput}
                  className="absolute top-[22px] right-[3.2rem] text-primary text-[0.8rem] font-bold"
                >
                  ✕
                </button>
              )}
            </div>
            {suggestions.length > 0 && (
              <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() =>
                      handleLocationSelect(
                        suggestion.name,
                        suggestion.path,
                        suggestion.mainRegion
                      )
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

        <div className="max-w-[1170px] w-full  flex flex-col lg:flex-row justify-between gap-4 lg:gap-x-3 bg-white rounded-lg">
          <PropertyDropdown
            onChange={setPropertyType}
            reset={propertyType}
            availablePropertyTypes={availablePropertyTypes}
            resetArea={() => resetArea()}
            resetBedrooms={() => resetBedrooms()}
          />

          <BedroomDropdown
            onChange={setBedrooms}
            reset={bedrooms}
            resetArea={() => resetArea()}
            availableBedrooms={availableBedrooms}
          />
          <UnitAreaDropdown
            unitAreas={availableUnitAreas}
            onChange={(selectedUnitArea) => setUnitArea(selectedUnitArea)}
          />
          <button
            onClick={handleSearch}
            className="bg-primary hover:bg-secondary transition w-full lg:max-w-[162px] h-16 rounded-lg flex justify-center items-center text-white text-lg"
          >
            Get Forecast
          </button>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center w-full h-[400px]">
          <CircularProgress />
        </div>
      ) : error ? (
        <Alert severity="warning" className="mx-10 my-8 xl:mx-40 xl:my-10">
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
                No available data for {bedrooms} Bedroom(s) {propertyType} in{" "}
                {selectedLocation}.
              </p>
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
