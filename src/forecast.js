import React, { useState } from "react";
import "./Forecast.css"; // Import the CSS file

function Forecast() {
  const [forecastData, setForecastData] = useState([]);
  const [error, setError] = useState(null);
  const [bedroom, setBedroom] = useState("3");
  const [propertyType, setPropertyType] = useState("townhouse");
  const [price, setPrice] = useState("");
  const [area, setArea] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handlePredict = async () => {
    try {
      const response = await fetch("https://flask-jndu.onrender.com/forecast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bedroom: bedroom,
          propertyType: propertyType,
          area: area,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Ensure `area` is converted to a number if it is not already
      const areaNumber = Number(area);
      const pricePerSqft = price / areaNumber;

      // Calculate price based on area
      const updatedForecastData = data.map((item) => ({
        ...item,
        Price: (pricePerSqft + (item.Difference || 0)) * areaNumber,
        Difference: item.Difference ? item.Difference : 0,
      }));

      setForecastData(updatedForecastData);
      setError(null);
    } catch (error) {
      setError(error.message);
      setForecastData([]);
    }
  };

  const handleSendMessage = () => {
    if (phoneNumber && forecastData.length > 0) {
      // Encode the message for URL
      const message = forecastData
        .map(
          (item) =>
            `${new Date(
              item.Date
            ).toLocaleDateString()}: Price: ${item.Price.toLocaleString(
              undefined,
              {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              }
            )} AED`
        )
        .join("\n");
      // Additional message
      const additionalMessage =
        "Please get in touch with us if you are interested.";

      // Combine the forecast results with the additional message
      const fullMessage = `${message}\n\n${additionalMessage}`;

      const encodedMessage = encodeURIComponent(fullMessage);
      const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      window.open(url, "_blank");
    } else {
      alert("Please enter a phone number and generate forecast results first.");
    }
  };

  return (
    <div className="container">
      <h1 className="title">Forecast</h1>
      <div className="form-container">
        <label className="label">
          Bedroom:
          <select
            value={bedroom}
            onChange={(e) => setBedroom(e.target.value)}
            className="select"
          >
            <option value="3">3 Bedroom</option>
            <option value="2">2 Bedroom</option>
          </select>
        </label>
        <label className="label">
          Property Type:
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="select"
          >
            <option value="townhouse">Townhouse</option>
            <option value="apartment">Apartment</option>
          </select>
        </label>
        <label className="label">
          Price:
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter property price"
            className="input"
          />
        </label>
        <label className="label">
          Area (sqft):
          <input
            type="number"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Enter property area"
            className="input"
          />
        </label>
        <button onClick={handlePredict} className="button">
          Get Forecast
        </button>
      </div>

      {error && <p className="error">{error}</p>}
      {forecastData.length > 0 && (
        <div className="results">
          <h2 className="results-title">Forecast Results:</h2>
          <p>Please get in touch with us if you are interested</p>
          <ul className="list">
            {forecastData.map((item, index) => (
              <li key={index} className="list-item">
                {new Date(item.Date).toLocaleDateString()}:
                {` Price: ${item.Price.toLocaleString(undefined, {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })} AED`}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div style={{ margin: "2rem 0 0 0" }}>
        <label className="label">
          Phone Number:
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number with country code"
            className="input"
          />
        </label>
        <button onClick={handleSendMessage} className="button">
          Send via WhatsApp
        </button>
      </div>
    </div>
  );
}

export default Forecast;
