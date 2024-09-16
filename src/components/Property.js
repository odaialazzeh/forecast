import React from "react";
import { NumericFormat } from "react-number-format";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import { MenuItem, Select, TextField } from "@mui/material";
import { styled } from "@mui/system";

// Styled Grid component for form layout
const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

const Property = ({ formData, onFormDataChange }) => {
  const handleChange = (field) => (event) => {
    onFormDataChange({ [field]: event.target.value });
  };

  const handlePriceChange = (values) => {
    // Update the raw value for price and pass it to the parent component
    onFormDataChange({ price: values.value });
  };

  const handleAreaChange = (values) => {
    // Update the raw value for area and pass it to the parent component
    onFormDataChange({ area: values.value });
  };
  return (
    <Grid container spacing={3}>
      <FormGrid item xs={12} md={6}>
        <FormLabel required>Bedroom</FormLabel>
        <Select
          value={formData?.bedroom}
          onChange={handleChange("bedroom")}
          placeholder="Choose Bedroom"
        >
          <MenuItem value={"4"}>4 Bedrooms</MenuItem>
          <MenuItem value={"5"}>5 Bedrooms</MenuItem>
          <MenuItem value={"6"}>6 Bedrooms</MenuItem>
          <MenuItem value={"7"}>7 Bedrooms</MenuItem>
        </Select>
      </FormGrid>
      <FormGrid item xs={12} md={6}>
        <FormLabel required>Type</FormLabel>
        <Select value={formData?.type} onChange={handleChange("type")}>
          <MenuItem value={"Villa"}>Villa</MenuItem>
        </Select>
      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel required>City</FormLabel>
        <Select value={formData?.city} onChange={handleChange("city")}>
          <MenuItem value={"Abu Dhabi"}>Abu Dhabi</MenuItem>
        </Select>
      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel required>Region</FormLabel>
        <Select value={formData?.region} onChange={handleChange("region")}>
          <MenuItem value={"HIDD Al Saadiyat"}>HIDD Al Saadiyat</MenuItem>
        </Select>
      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel required>Price</FormLabel>
        <NumericFormat
          value={formData.price || ""}
          thousandSeparator={true}
          onValueChange={handlePriceChange}
          customInput={TextField}
          placeholder="Enter Price"
          size="small"
        />
      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel required>Area(Sqft)</FormLabel>
        <NumericFormat
          value={formData.area || ""}
          thousandSeparator={true}
          onValueChange={handleAreaChange}
          customInput={TextField}
          placeholder="Enter Area"
          size="small"
        />
      </FormGrid>
    </Grid>
  );
};

export default Property;
