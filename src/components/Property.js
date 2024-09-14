import * as React from "react";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid2";
import OutlinedInput from "@mui/material/OutlinedInput";
import { MenuItem, Select } from "@mui/material";
import { styled } from "@mui/system";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

const Property = ({ formData, onFormDataChange }) => {
  const handleChange = (field) => (event) => {
    onFormDataChange({ [field]: event.target.value });
  };

  return (
    <Grid container spacing={3}>
      <FormGrid size={{ xs: 12, md: 6 }}>
        <FormLabel required>Bedroom</FormLabel>
        <Select
          value={formData?.bedroom}
          onChange={handleChange("bedroom")}
          placeholder="Choose Bedroom"
        >
          <MenuItem value={"4"}>4 Bedrooms</MenuItem>
        </Select>
      </FormGrid>
      <FormGrid size={{ xs: 12, md: 6 }}>
        <FormLabel required>Type</FormLabel>
        <Select value={formData?.type} onChange={handleChange("type")}>
          <MenuItem value={"Villa"}>Villa</MenuItem>
        </Select>
      </FormGrid>
      <FormGrid size={{ xs: 6 }}>
        <FormLabel required>City</FormLabel>
        <Select value={formData?.city} onChange={handleChange("city")}>
          <MenuItem value={"Abu Dhabi"}>Abu Dhabi</MenuItem>
        </Select>
      </FormGrid>
      <FormGrid size={{ xs: 6 }}>
        <FormLabel required>Region</FormLabel>
        <Select value={formData?.region} onChange={handleChange("region")}>
          <MenuItem value={"HIDD Al Saadiyat"}>HIDD Al Saadiyat</MenuItem>
        </Select>
      </FormGrid>
      <FormGrid size={{ xs: 6 }}>
        <FormLabel required>Price</FormLabel>
        <OutlinedInput
          value={formData?.price}
          onChange={handleChange("price")}
          placeholder="Enter Price"
          size="small"
        />
      </FormGrid>
      <FormGrid size={{ xs: 6 }}>
        <FormLabel required>Area</FormLabel>
        <OutlinedInput
          value={formData?.area}
          onChange={handleChange("area")}
          placeholder="Enter Area"
          size="small"
        />
      </FormGrid>
    </Grid>
  );
};

export default Property;
