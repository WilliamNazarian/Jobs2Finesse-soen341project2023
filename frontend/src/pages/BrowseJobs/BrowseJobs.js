import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

import { useSelector, useDispatch } from "react-redux";
import { submittedFormDataActions } from "../../store/submittedFormData";
import { useEffect, useState } from "react";
import SideBar from "./ComponentsBrowseJobs/SideBar";

export default function BrowseJobs() {
  const [jobs, setJobs] = useState(null);
  const [clickedJob, setClickedJob] = useState(null);
  const [deletedJob, setDeletedJob] = useState(false);
  const accountType = useSelector((state) => state.auth.accountType);
  const email = useSelector((state) => state.auth.email);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formSubmitted = useSelector((state) => state.submittedFormData.submittedFormData);
  const token = localStorage.getItem("token");

  const jobClickHandler = (event) => {
    const getAJob = async () => {
      try {
        const response = await fetch("/jobs/getAJob?" + new URLSearchParams({ postId: event.currentTarget.title }));
        const data = await response.json();
        setClickedJob(data);
      } catch (err) {
        console.log(err);
      }
    };
    getAJob();
  };

  const getUsersPostedJobs = async (event) => {
    try {
      const response = await fetch("/jobs/getUsersPostedJobs?" + new URLSearchParams({ email: email }), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setJobs(data);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteJobHandler = async (event) => {
    const deleteAJob = async () => {
      try {
        await fetch("/jobs", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: event.currentTarget.title }),
        });
      } catch (err) {
        console.log(err);
      }
    };
    await deleteAJob();
    setClickedJob(null);
    setDeletedJob(!deletedJob);
  };

  const editJobHandler = (event) => {
    navigate({
      pathname: "/jobs/edit",
      search: `?id=${event.currentTarget.title}`,
    });
  };

  const applyHandler = (event) => {
    if (accountType !== "student") {
      window.alert("Create A Student Account To Apply");
      return;
    }
    navigate({
      pathname: "/jobs/apply",
      search: `?id=${event.currentTarget.title}&company-name=${clickedJob.companyName}&position=${clickedJob.position}`,
    });
  };

  const getAllJobs = () => {
    const fetchData = async () => {
      const response = await fetch("/jobs");
      const newData = await response.json();
      setJobs(newData);
    };
    fetchData();
  };

  useEffect(() => {
    if (accountType === "company") getUsersPostedJobs();
    else getAllJobs();
    dispatch(submittedFormDataActions.setSubmittedFormData(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, formSubmitted, deletedJob]);

  return (
    <>
      <SideBar jobs={jobs} OnJobClick={jobClickHandler} />
      {clickedJob && (
        <Box sx={{ ml: "360px", p: { xs: 1, md: 2, lg: 4 } }}>
          <Card sx={{ width: { xs: "100%", md: "500px", lg: "700px" }, m: "auto" }}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} gutterBottom>
                {clickedJob.companyName}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Positions: {clickedJob.numberOfPositions}
              </Typography>
              <Typography variant="h5" component="div">
                {clickedJob.position}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {clickedJob.country}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {clickedJob.address}
              </Typography>
              <Typography variant="body2">{clickedJob.description ? clickedJob.description : "No Description"}</Typography>
            </CardContent>
            <CardActions disableSpacing>
              {accountType === "company" && (
                <>
                  <Button title={clickedJob._id} onClick={editJobHandler} variant="contained" color="primary" size="small">
                    Edit
                  </Button>
                  <Button title={clickedJob._id} sx={{ ml: "10px" }} onClick={deleteJobHandler} variant="contained" color="error" size="small">
                    Remove
                  </Button>
                  <Button title={clickedJob._id} sx={{ ml: "auto" }} variant="contained" color="success" size="small" onClick={(event) => navigate({ pathname: "/jobs/applications", search: `?jobId=${event.currentTarget.title}` })}>
                    View Applications
                  </Button>
                </>
              )}
              {accountType !== "company" && (
                <Button title={clickedJob._id} onClick={applyHandler} variant="contained" color="primary" size="medium">
                  Apply
                </Button>
              )}
            </CardActions>
          </Card>
        </Box>
      )}
    </>
  );
}
