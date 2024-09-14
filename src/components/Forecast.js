import React, { useState } from "react";
import {
  Button,
  Typography,
  TextField,
  Alert,
  Tooltip,
  Stack,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import "./Forecast.css";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import SaveTwoToneIcon from "@mui/icons-material/SaveTwoTone";
import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";

const addWatermarkToImage = (imageData, watermarkText, userName, userPhone) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = `data:image/png;base64,${imageData}`;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = image.width;
      canvas.height = image.height;

      // Draw the image on the canvas
      ctx.drawImage(image, 0, 0);

      // Watermark styles
      ctx.font = "120px Arial"; // Adjust font size as needed
      ctx.fillStyle = "rgba(255, 0, 0, 0.3)"; // Adjust color and transparency
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Number of watermark instances
      const numberOfInstances = 3;
      const stepX = canvas.width / (numberOfInstances + 1);
      const stepY = canvas.height / (numberOfInstances - 1.2);

      for (let i = 0; i < numberOfInstances; i++) {
        const x = (i + 1) * stepX;
        const y = stepY;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((45 * Math.PI) / 180);
        ctx.fillText(watermarkText, 0, 0);
        ctx.restore();
      }

      // Function to draw a rounded rectangle
      const drawRoundedRect = (x, y, width, height, radius) => {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(
          x + width,
          y + height,
          x + width - radius,
          y + height
        );
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
      };

      // Box dimensions and positioning
      const boxPadding = 10;
      const boxWidth = 300;
      const boxHeight = 100;
      const xBox = canvas.width - boxWidth - boxPadding;
      const yBox = canvas.height - boxHeight - boxPadding - 300; // Move the box upward
      const borderRadius = 15; // Set border-radius for the box

      // Draw rounded rectangle background
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      drawRoundedRect(xBox, yBox, boxWidth, boxHeight, borderRadius);
      ctx.fill();

      // Box text style
      ctx.fillStyle = "white";
      ctx.font = "25px Arial"; // Increased font size
      ctx.textAlign = "left";
      ctx.textBaseline = "top";

      // Draw user's name and phone number inside the box
      ctx.fillText(`Name: ${userName}`, xBox + 10, yBox + 10);
      ctx.fillText(`Phone: ${userPhone}`, xBox + 10, yBox + 40);

      // Convert canvas to data URL
      const watermarkedImage = canvas.toDataURL("image/png");

      resolve(watermarkedImage);
    };

    image.onerror = (err) => {
      console.error("Image load error:", err);
      reject(err);
    };
  });
};

const Forecast = ({ formData }) => {
  const [forecastData, setForecastData] = useState([]);
  const [image, setImage] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [updatedPrices, setUpdatedPrices] = useState([]);
  const [prePrices, setPrePrices] = useState([]);
  const [forecastPrices, setForecastPrices] = useState([]);
  const [forecastDate, setForecastDate] = useState([]);
  const [preDate, setPreDate] = useState([]);
  const [isEditing, setIsEditing] = useState([]);
  const [originalPrices, setOriginalPrices] = useState([]);
  const [error, setError] = useState(null);

  const handlePredict = async () => {
    try {
      const response = await fetch("https://forecast-app-jhchb.ondigitalocean.app/forecast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bedroom: formData.bedroom,
          propertyType: formData.type,
          area: formData.area,
          price: formData.price,
          region: formData.region,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      const areaNumber = Number(formData.area);
      const pricePerSqft = formData.price / areaNumber;

      const updatedForecastData = data.forecast.map((item) => ({
        ...item,
        Price: Math.round((pricePerSqft + (item.Difference || 0)) * areaNumber),
        Difference: item.Difference ? Math.round(item.Difference) : 0,
      }));

      // Add watermark to the image with user's name and phone number
      const watermarkedImage = await addWatermarkToImage(
        data.image,
        "Metropolitan Real Estate",
        "John Doe", // Replace with dynamic user name
        "+1234567890" // Replace with dynamic user phone
      );

      setForecastData(updatedForecastData); // Only set forecastData once
      setUpdatedPrices(
        updatedForecastData.map((item) => Math.round(item.Price))
      );
      setNewImage(data.image);
      setImage(watermarkedImage);
      setPrePrices(data.pre_price);
      setForecastPrices(data.forecast_price);
      setForecastDate(data.forecast_dates);
      setPreDate(data.original_dates);
      setError(null);
    } catch (error) {
      setError(error.message);
      setForecastData([]);
    }
  };

  // Toggle edit mode for a specific price input
  const toggleEditMode = (index) => {
    setIsEditing((prevEditing) => {
      const newEditing = [...prevEditing];
      newEditing[index] = !newEditing[index]; // Toggle the edit mode for the specific index
      return newEditing;
    });
  };

  const handleCancelEdit = (index) => {
    setUpdatedPrices((prevPrices) => {
      const updatedPrices = [...originalPrices];
      return updatedPrices;
    });
    toggleEditMode(index);
  };

  React.useEffect(() => {
    if (forecastData.length > 0) {
      setOriginalPrices(forecastData.map((item) => Math.round(item.Price)));
    }
  }, [forecastData]);

  const handlePriceChange = (index, newPrice) => {
    setUpdatedPrices((prevPrices) => {
      const updatedPrices = [...prevPrices];
      updatedPrices[index] = Math.round(newPrice);
      return updatedPrices;
    });
  };

  const handleUpdateImage = async () => {
    try {
      // Send updated prices to the server to regenerate the image
      const response = await fetch("https://forecast-app-jhchb.ondigitalocean.app/update-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prePrices: prePrices,
          forecastPrices: updatedPrices,
          preDate: preDate,
          forecastDate: forecastDate,
          bedroom: formData.bedroom,
          propertyType: formData.type,
          region: formData.region,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      const watermarkedImage = await addWatermarkToImage(
        data.image,
        "Metropolitan Real Estate",
        "", // Replace with dynamic user name
        "" // Replace with dynamic user phone
      );

      setNewImage(data.image);
      setImage(watermarkedImage);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Stack spacing={{ xs: 3, sm: 6 }} useFlexGap>
      <Button variant="outlined" onClick={handlePredict}>
        Get Forecast
      </Button>
      <Grid2 item="true" xs={12} md={6}>
        <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
          The Forecast Prices
        </Typography>
        {image && (
          <>
            <img
              src={image}
              alt="Forecast plot"
              style={{ marginTop: "20px", width: "100%", height: "auto" }}
            />
            <a
              href={image}
              download="forecast_image.png"
              style={{ textDecoration: "none" }}
            >
              <Button variant="contained" sx={{ mt: 2, mb: 4 }}>
                Download Image
              </Button>
            </a>
          </>
        )}
        {error ? (
          <Alert severity="error">Failed to load resource</Alert>
        ) : (
          forecastData?.map((item, index) => (
            <div key={index} className="main_list">
              <div>
                {new Intl.DateTimeFormat("en-US", {
                  month: "long",
                  year: "numeric",
                }).format(new Date(item.Date))}
              </div>
              {isEditing[index] ? (
                <div className="list">
                  <TextField
                    type="number"
                    value={updatedPrices[index]}
                    onChange={(e) =>
                      handlePriceChange(index, Number(e.target.value))
                    }
                    fullWidth
                  />
                  <div className="icons">
                    <Tooltip title="Update" arrow>
                      <SaveTwoToneIcon
                        variant="outlined"
                        onClick={() => {
                          toggleEditMode(index);
                          handleUpdateImage();
                        }}
                        sx={{ cursor: "pointer" }}
                      />
                    </Tooltip>
                    <Tooltip title="Cancel" arrow>
                      <CancelTwoToneIcon
                        variant="outlined"
                        onClick={() => handleCancelEdit(index)}
                        sx={{ cursor: "pointer" }}
                      />
                    </Tooltip>
                  </div>
                </div>
              ) : (
                <div className="list">
                  <Typography variant="body1">
                    {updatedPrices[index]}
                  </Typography>
                  <Tooltip title="Edit" arrow>
                    <EditTwoToneIcon
                      variant="outlined"
                      onClick={() => toggleEditMode(index)}
                      sx={{ cursor: "pointer" }}
                    />
                  </Tooltip>
                </div>
              )}
            </div>
          ))
        )}
      </Grid2>
    </Stack>
  );
};

export default Forecast;
