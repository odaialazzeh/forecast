import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  FormLabel,
  FormControl,
  TextField,
  Stack,
  Alert,
} from "@mui/material";
import MuiCard from "@mui/material/Card";
import "./SignIn.css";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import logo from "../../Assets/logo.svg";
import ForgotPassword from "./ForgotPassword";
import getSignInTheme from "./theme/getSignInTheme";
import { useLoginMutation } from "../../slices/usersApiSlice";
import { setCredentials } from "../../slices/authSlice";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "100%",
  padding: 20,
  backgroundImage:
    "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
  backgroundRepeat: "no-repeat",
  ...theme.applyStyles("dark", {
    backgroundImage:
      "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
  }),
}));

const SignIn = () => {
  const SignInTheme = createTheme(getSignInTheme());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res, rememberMe }));
      navigate(redirect);
    } catch (err) {
      setErrorMessage(
        err?.data?.message || err?.error || "An unexpected error occurred"
      );
      setTimeout(() => setErrorMessage(false), 2000);
    }
  };

  return (
    <div className="sign-in">
      <ThemeProvider theme={SignInTheme}>
        <CssBaseline enableColorScheme />
        <SignInContainer direction="column" justifyContent="space-between">
          <Card variant="outlined">
            <img src={logo} style={{ width: "180px" }} alt="logo"></img>
            <h1 className="w-full text-3xl text-start font-medium text-secondary">
              Sign in
            </h1>

            <Box
              component="form"
              onSubmit={submitHandler}
              noValidate
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                gap: 2,
              }}
            >
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <TextField
                  id="email"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                  sx={{ ariaLabel: "email" }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl>
                {/* <div className="flex justify-between">
                  <label htmlFor="password" className="text-base">
                    Password
                  </label>
                  <button
                    onClick={(e) => {
                      e.preventDefault(); // Prevent form submission
                      handleClickOpen();
                    }}
                    className="text-sm self-baseline text-secondary font-medium hover:underline"
                  >
                    Forgot your password?
                  </button>
                </div> */}
                <FormLabel htmlFor="password">Password</FormLabel>
                <TextField
                  name="password"
                  placeholder="••••••"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="primary"
                  />
                }
                label="Remember me"
              />
              <ForgotPassword open={open} handleClose={handleClose} />
              <button
                type="submit"
                className="bg-primary hover:bg-secondary shadow-sm transition w-full lg:max-w-[162px] h-12 rounded-lg flex justify-center items-center text-white text-lg"
              >
                Sign in
              </button>
              {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            </Box>
          </Card>
        </SignInContainer>
      </ThemeProvider>
    </div>
  );
};

export default SignIn;
