import React from "react";
import { useSelector } from "react-redux";
import { Box, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';

const UserProfile = () => {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();



  return (

      <Paper elevation={3} sx={{pl:4, pt:5, pb:5, borderRadius: 2, bgcolor: "#c5cae9", width:"80%", m:"auto", mt:"5%" }}>
        <Typography variant="h4" gutterBottom >
          User Profile
        </Typography>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          First Name: <Typography variant="body1" component="span">{auth.firstName}</Typography>
        </Typography>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Last Name: <Typography variant="body1" component="span">{auth.lastName}</Typography>
        </Typography>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Email: <Typography variant="body1" component="span">{auth.email}</Typography>
        </Typography>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Account Type: <Typography variant="body1" component="span">{auth.accountType}</Typography>
        </Typography>
        <Box mt={2}>
          <IconButton onClick={()=> navigate("/student-profile/edit")} sx={{backgroundColor:"lightGrey", pl:3, pr:3}} aria-label="edit profile">
            <EditIcon />
          </IconButton>
        </Box>
      </Paper>
  );
};

export default UserProfile;