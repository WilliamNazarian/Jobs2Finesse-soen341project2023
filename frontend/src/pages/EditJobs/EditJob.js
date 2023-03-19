import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Button } from "@mui/material";
import { Box } from "@mui/system";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function EditJob() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const [editData, setEditData] = useState(null);
  const [checkedArr, setCheckedArr] = useState([]);

  const checkboxHandler = (event) => {
    if (checkedArr.find((value) => value === event.target.value)) {
      checkedArr.filter((value) => value !== event.target.value);
    } else {
      setCheckedArr((prevCheckedArr) => [...prevCheckedArr, event.target.value]);
    }
  };

 
  const submitEditHandler = async (event) => {
    event.preventDefault();
    const newArr = [];
    for (const job of ["internship", "fullTime", "partTime"]) {
      let count = 0;
      count = editData.jobType.find((value) => value === job) !== undefined ? count + 1 : count;
      count = checkedArr.find((value) => value === job) !== undefined ? count + 1 : count;
      if (count === 1) newArr.push(job);
    }
    setCheckedArr(newArr);
    const formData = new FormData(event.currentTarget);
    const myFetch = async() => {
      try {
        await fetch("/jobs", {
          method: "PUT",
          body: JSON.stringify({
            _id: searchParams.get("id"),
            companyName: formData.get("companyName"),
            numberOfPositions: formData.get("numOfPos"),
            position: formData.get("position"),
            country: formData.get("country"),
            address: formData.get("address"),
            jobType: newArr,
            description: formData.get("description"),
          }),
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {
        console.log(err);
      }
    };
    myFetch();
    navigate("/jobs");
  };

  const getJob = useCallback(() => {
    fetch("/jobs/getAJob?" + new URLSearchParams({ postId: searchParams.get("id") }))
      .then((response) => response.json())
      .then((data) => setEditData(JSON.parse(data)));
  }, [searchParams]);

  useEffect(() => {
    getJob();
  }, [getJob]);

  return (
    <Box component="form" onSubmit={submitEditHandler} sx={{ px: { lg: 30, md: 10, sm: 7, xs: 4 }, pt: 10 }}>
      {editData && (
        <>
          <Typography variant="h6" sx={{ mb: 5 }}>
            Editing Job ID: {editData._id}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField required id="companyName" name="companyName" label="Company Name" fullWidth variant="standard" defaultValue={editData.companyName} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField required id="numOfPos" type="number" name="numOfPos" label="Number Of Positions" fullWidth variant="standard" defaultValue={editData.numberOfPositions} />
            </Grid>
            <Grid item xs={12}>
              <TextField required id="position" name="position" label="Position Offered" fullWidth variant="standard" defaultValue={editData.position} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField required id="country" name="country" label="Country" fullWidth variant="standard" defaultValue={editData.country} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField required id="address" name="address" label="Address" fullWidth variant="standard" defaultValue={editData.address} />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center", mt: 3 }}>
              <TextField id="outlined-multiline-static" label="Job Descripton" name="description" defaultValue={editData.description} multiline rows={8} sx={{ width: "80%" }} />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <FormControlLabel control={<Checkbox value="fullTime" name="jobType" color="primary" onChange={checkboxHandler} defaultChecked={editData.jobType.find((value) => value === "fullTime") !== undefined ? true : false} />} label="Full Time:" labelPlacement="start" />
              <FormControlLabel control={<Checkbox value="partTime" name="jobType" color="success" onChange={checkboxHandler} defaultChecked={editData.jobType.find((value) => value === "partTime") !== undefined ? true : false} />} label="Part Time:" labelPlacement="start" />
              <FormControlLabel control={<Checkbox value="internship" name="jobType" color="secondary" onChange={checkboxHandler} defaultChecked={editData.jobType.find((value) => value === "internship") !== undefined ? true : false} />} label="Internship:" labelPlacement="start" />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2, width: "75%", mx: "auto" }}>
                Edit Job Post
              </Button>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}
