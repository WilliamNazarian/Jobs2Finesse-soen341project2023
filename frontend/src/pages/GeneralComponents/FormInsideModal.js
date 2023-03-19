import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { lightBlue } from "@mui/material/colors";
import { useLocation } from "react-router-dom";
//import { Typography } from "@mui/material";

//import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { submittedFormDataActions } from "../../store/submittedFormData";

const styleForFilled = {
  "& div": { bgcolor: lightBlue[200] },
  "& div:hover": { bgcolor: lightBlue[200] },
  "& div.Mui-focused": { bgcolor: lightBlue[100] },
  "& input:-webkit-autofill": { WebkitBoxShadow: "0 0 0 1000px #81d4fa inset" },
};

function FormInsideModal(props) {
  const companyNameRef = useRef(null);
  const numOfPosRef = useRef(null);
  const posOfferedRef = useRef(null);
  const countryRef = useRef(null);
  const addressRef = useRef(null);
  const descriptionRef = useRef(null);

  //const navigate = useNavigate()
  const dispatch = useDispatch();
  const location = useLocation();

  const [checkedArr, setCheckedArr] = useState([]);

  const checkedBoxHandler = (event) => {
    if (checkedArr.find((value) => value === event.target.value)) {
      checkedArr.filter((value) => value !== event.target.value);
    } else {
      setCheckedArr((prevCheckedArr) => [...prevCheckedArr, event.target.value]);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const postFetch = async () => {
      try {
        await fetch("/jobs", {
          method: "POST",
          body: JSON.stringify({
            companyName: companyNameRef.current.value,
            description: descriptionRef.current.value,
            numberOfPositions: numOfPosRef.current.value,
            position: posOfferedRef.current.value,
            country: countryRef.current.value,
            address: addressRef.current.value,
            jobType: checkedArr,
          }),
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {
        console.log(err);
      }
    };
    postFetch();
    props.onSubmitForm();
    if (location.pathname === "/jobs") dispatch(submittedFormDataActions.setSubmittedFormData(true));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <TextField required inputRef={companyNameRef} fullWidth name="companyName" id="companyName" label="Company Name" variant="filled" sx={styleForFilled} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth inputRef={numOfPosRef} id="numOfPos" label="Number Of Positions" name="numOfPos" type="number" variant="filled" sx={styleForFilled} />
        </Grid>
        <Grid item xs={12}>
          <TextField required fullWidth inputRef={posOfferedRef} id="nameOfPos" label="Postion Offered" name="nameOfPos" variant="filled" sx={styleForFilled} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField required fullWidth inputRef={countryRef} name="country" label="Country" id="country" variant="filled" sx={styleForFilled} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField required fullWidth inputRef={addressRef} name="address" label="Address" id="address" variant="filled" sx={styleForFilled} />
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <TextField inputRef={descriptionRef} id="outlined-multiline-static" label="Job Descripton" multiline rows={5} sx={{ ...styleForFilled, width: "300px" }} />
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <FormControlLabel control={<Checkbox value="fullTime" color="primary" onChange={checkedBoxHandler} />} label="Full Time:" labelPlacement="start" />
          <FormControlLabel control={<Checkbox value="partTime" color="success" onChange={checkedBoxHandler} />} label="Part Time:" labelPlacement="start" />
          <FormControlLabel control={<Checkbox value="internship" color="secondary" onChange={checkedBoxHandler} />} label="Internship:" labelPlacement="start" />
        </Grid>
      </Grid>
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Enter Job Post
      </Button>
    </Box>
  );
}

export default FormInsideModal;

// if (
//     values.email &&
//     !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
//   )
//Email Validation
