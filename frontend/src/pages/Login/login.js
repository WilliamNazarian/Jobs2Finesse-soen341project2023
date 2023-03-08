import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { Link as RouterLink } from "react-router-dom";
import Logo from "../GeneralComponents/Logo.svg";
import { deepPurple } from "@mui/material/colors";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth";

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function Login() {
  const [loginError, setLoginError] = useState("success");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/postlogin", {
      method: "POST",
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    setLoginError(data.message);
    if (data.message === "success"){
      //localStorage.setItem('jwtToken', data.jwtToken);
      dispatch(authActions.setCredential({firstName: data.firstName, lastName: data.lastName, email: data.email}))
      navigate("/");
    } 
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            paddingTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <RouterLink to="/">
            <img src={Logo} alt="Logo" width={200} style={{ display: "box", margin: "10px 0 30px", padding: "10px", borderRadius: "15px", backgroundColor: deepPurple[100] }} />
          </RouterLink>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField required fullWidth id="email" label="Email Address" name="email" autoComplete="email" />
              </Grid>
              <Grid item xs={12} sx={{ mb: 3 }}>
                <TextField required fullWidth name="password" label="Password" type="password" id="password" autoComplete="new-password" />
              </Grid>
            </Grid>
            {loginError !== "success" && (
              <Typography color="error" sx={{ p: 1, textAlign: "center" }}>
                {loginError}
              </Typography>
            )}
            <Button type="submit" fullWidth variant="contained" sx={{ mb: 2 }}>
              Login
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/signup" variant="body2">
                  Don't have an account? Sign up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
