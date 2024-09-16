import * as React from "react";
import Grid from "@mui/material/Grid2";
import {
  Stepper,
  StepLabel,
  Step,
  CssBaseline,
  Button,
  Box,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import Property from "./components/Property";
import getCheckoutTheme from "./theme/getCheckoutTheme";
import Info from "./components/Info";
import Forecast from "./components/Forecast";
import InfoMobile from "./components/InfoMobile";
import logo from "./Assets/logo.svg";

export default function Checkout() {
  const steps = ["Data", "Forecast"];

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <Property
            formData={formData}
            onFormDataChange={handleFormDataChange}
          />
        );
      case 1:
        return <Forecast formData={formData} />;
      default:
        throw new Error("Unknown step");
    }
  }

  const checkoutTheme = createTheme(getCheckoutTheme());
  const [activeStep, setActiveStep] = React.useState(0);
  const [formData, setFormData] = React.useState({
    bedroom: "",
    type: "",
    city: "",
    region: "",
    price: "",
    area: "",
  });

  const handleFormDataChange = (newData) => {
    setFormData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <ThemeProvider theme={checkoutTheme}>
      <CssBaseline enableColorScheme />
      <Grid container sx={{ height: { xs: "100%", sm: "100dvh" } }}>
        <Box
          sx={{ display: { sm: "flex", md: "none" }, margin: "1rem 0 0 1rem" }}
        >
          <InfoMobile
            style={{
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
        </Box>
        <Grid
          size={{ xs: 12, sm: 3, lg: 3 }}
          sx={{
            display: { xs: "none", md: "flex", lg: "flex" },
            flexDirection: "column",
            backgroundColor: "background.paper",
            borderRight: { sm: "none", md: "1px solid" },
            borderColor: { sm: "none", md: "divider" },
            alignItems: "center",
            pt: 16,
            px: 10,
            gap: 2,
          }}
        >
          <div style={{ margin: "-6rem 0 0 0" }}>
            <img src={logo} style={{ width: "180px" }} alt="logo" />
          </div>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              width: "100%",
              maxWidth: 500,
            }}
          >
            <Info />
          </Box>
        </Grid>
        <Grid
          size={{ sm: 12, md: 7, lg: 8 }}
          sx={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "100%",
            width: "100%",
            backgroundColor: { xs: "transparent", sm: "background.default" },
            alignItems: "start",
            pt: { xs: 6, sm: 16 },
            px: { xs: 2, sm: 10 },
            gap: { xs: 4, md: 8 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: { sm: "space-between", md: "flex-end" },
              alignItems: "center",
              width: "100%",
              maxWidth: { sm: "100%", md: 600 },
            }}
          >
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "flex-end",
                flexGrow: 1,
              }}
            >
              <Stepper
                id="desktop-stepper"
                activeStep={activeStep}
                sx={{ width: "100%", height: 40 }}
              >
                {steps.map((label) => (
                  <Step
                    sx={{
                      ":first-of-type": { pl: 0 },
                      ":last-of-type": { pr: 0 },
                    }}
                    key={label}
                  >
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              width: "100%",
              maxWidth: { sm: "100%", md: 600 },
              maxHeight: "720px",
              gap: { xs: 5, md: "none" },
            }}
          >
            <Stepper
              id="mobile-stepper"
              activeStep={activeStep}
              alternativeLabel
              sx={{ display: { sm: "flex", md: "none" } }}
            >
              {steps.map((label) => (
                <Step
                  sx={{
                    ":first-of-type": { pl: 0 },
                    ":last-of-type": { pr: 0 },
                    "& .MuiStepConnector-root": { top: { xs: 6, sm: 12 } },
                  }}
                  key={label}
                >
                  <StepLabel
                    sx={{
                      ".MuiStepLabel-labelContainer": { maxWidth: "70px" },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            <React.Fragment>
              {getStepContent(activeStep)}
              <Box
                sx={[
                  {
                    display: "flex",
                    flexDirection: { xs: "column-reverse", sm: "row" },
                    alignItems: "end",
                    flexGrow: 1,
                    gap: 1,
                    pb: { xs: 12, sm: 0 },
                    mt: { xs: 2, sm: 0 },
                    mb: "60px",
                  },
                  activeStep !== 0
                    ? { justifyContent: "space-between" }
                    : { justifyContent: "flex-end" },
                ]}
              >
                {activeStep === 1 ? (
                  <Button
                    startIcon={<ChevronLeftRoundedIcon />}
                    onClick={handleBack}
                    variant="outlined"
                    sx={{ width: { xs: "100%", sm: "fit-content" } }}
                  >
                    Previous
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    endIcon={<ChevronRightRoundedIcon />}
                    onClick={handleNext}
                    sx={{ width: { xs: "100%", sm: "fit-content" } }}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </React.Fragment>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
