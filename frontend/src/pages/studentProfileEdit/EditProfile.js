import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { authActions } from "../../store/auth";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";

const EditProfile = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [firstName, setFirstName] = useState(auth.firstName);
  const [lastName, setLastName] = useState(auth.lastName);
  const [email, setEmail] = useState(auth.email);
  const [oldPassword, setOldPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [informationChanged, setInformationChanged] = useState(null);

  const submitHandler = async (event) => {
    event.preventDefault()
    try {
      const response = await fetch("/auth/editUserInfo", {
        method: "PUT",
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          oldPassword: oldPassword,
          newPassword: newPassword,
        }),
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      console.log(data.message)
      if (data.message === "Incorrect"){
        setInformationChanged(false)
        setTimeout(() => {
          setInformationChanged(null);
        }, 3000);
        return;
      } 
      setInformationChanged(true);
      dispatch(authActions.setCredential({ firstName: firstName, lastName: lastName, email: email, accountType: auth.accountType }));
      setInformationChanged(true);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      console.log(err);
    }
  };



  return (
    <>
      <Box component="form" onSubmit={submitHandler} sx={{ px: { lg: 30, md: 10, sm: 7, xs: 4 }, pt: 10 }}>
        <Typography variant="h6" sx={{ mb: 5 }}>
          Editing User Profile:
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField required id="firstName" name="firstName" label="First Name" fullWidth variant="standard" onChange={(e) => setFirstName(e.target.value)} defaultValue={auth.firstName} />
          </Grid>
          <Grid item xs={12}>
            <TextField required id="lastName" name="lastName" label="Last Name" fullWidth variant="standard" onChange={(e) => setLastName(e.target.value)} defaultValue={auth.lastName} />
          </Grid>
          <Grid item xs={12}>
            <TextField id="email" name="email" label="Email" fullWidth variant="standard" onChange={(e) => setEmail(e.target.value)} defaultValue={auth.email} />
          </Grid>
          <Grid item xs={12}>
            <TextField required type="password" id="oldPassword" name="oldPassword" label="Old Password" fullWidth variant="standard" onChange={(e) => setOldPassword(e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField required type="password" id="newPassword" name="newPassword" label="New Password (password can remain same)" fullWidth variant="standard" onChange={(e) => setNewPassword(e.target.value)} />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2, width: "75%", mx: "auto" }}>
              Edit Profile
            </Button>
          </Grid>
        </Grid>
      </Box>
      {informationChanged === true && (
        <Stack sx={{ width: "80%", m: "auto" }} spacing={2}>
          <Alert severity="success">
            <AlertTitle>Success</AlertTitle>
              You Successfully Changed Your Information — <strong>You Will Be Redirected To The Home Page</strong>
          </Alert>
        </Stack>
      )}
      {informationChanged === false && (
        <Stack sx={{ width: "80%", m: "auto" }} spacing={2}>
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
              Password Is Incorrect — <strong>Try Again</strong>
          </Alert>
        </Stack>
      )}
    </>
  );
};

export default EditProfile;
