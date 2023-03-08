import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Logo from "../GeneralComponents/Logo.svg"
import { deepPurple } from "@mui/material/colors";

import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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

export default function SignUp() {
  const navigate = useNavigate();

  const [firstNameErr, setFirstNameErr] = useState(false);
  const [lastNameErr, setLastNameErr] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [passwordErr, setPasswordErr] = useState(false);
  //
  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    let count = 0;

    if (formData.get("firstName") === "") {
      setFirstNameErr(true);
      count++;
    } else setFirstNameErr(false);
    if (formData.get("lastName") === "") {
      setLastNameErr(true);
      count++;
    } else setLastNameErr(false);
    if (!emailRegex.test(formData.get("email"))) {
      setEmailErr(true);
      count++;
    } else setEmailErr(false);
    if (!passwordRegex.test(formData.get("password"))) {
      setPasswordErr(true);
      count++;
    } else setPasswordErr(false);

    if (count !== 0) return;

    const myFetch = async () => {
      try {
        const response = await fetch("/postuser", {
          method: "POST",
          body: JSON.stringify({
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            email: formData.get("email"),
            password: formData.get("password"),
          }),
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        
        if (data.emailExists){
          setEmailExists(true);
        } 
        else{
          setEmailExists(false);
          navigate("/login");
        } 
      } catch (err) {
        console.log(err);
      }
    };
    myFetch();
    
  };

  return (
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
        <RouterLink to="/"><img src={Logo} alt="Logo" width={200} style={{display:"box", margin: "10px 0 30px", padding:"10px", borderRadius:"15px", backgroundColor:deepPurple[100]}}/></RouterLink>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid sx={{mb:3}} container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField required name="firstName" fullWidth id="firstName" label="First Name" type="text" error={firstNameErr} helperText={firstNameErr ? "Value Required" : null} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField required fullWidth id="lastName" label="Last Name" name="lastName" type="text" error={lastNameErr} helperText={lastNameErr ? "Value Required" : null} />
            </Grid>
            <Grid item xs={12}>
              <TextField required fullWidth id="email" label="Email Address" name="email" type="email" error={emailErr} helperText={emailErr ? "invalid Email" : null} />
            </Grid>
            <Grid item xs={12}>
              <TextField required fullWidth name="password" label="Password" type="password" id="password" error={passwordErr} helperText={passwordErr ? "Invalid Password" : null} />
            </Grid>
          </Grid>
          {emailExists && <Typography sx={{ p: 1, color: "red", textAlign:"center" }}>User Already Exists</Typography>}
          <Button type="submit" fullWidth variant="contained" sx={{ mb: 2 }}>
            Sign Up
          </Button>
          <Typography sx={{color:"#455a64", fontSize: "12px"}}>Password Requirements:<br/>- At least 8 characters<br/>- Must contain 1 letter<br/>- Must contain 1 number<br/>- Must contain 1 special character</Typography>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
          
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
}
