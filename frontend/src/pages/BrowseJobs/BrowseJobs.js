import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { List } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

export default function BrowseJobs() {
  const [jobs, setJobs] = useState(null);
  const [clickedJob, setClickedJob] = useState(null);

  const navigate = useNavigate();

  const jobClickHandler = (event) => {
    const fetchData = async () => {
      try {
        const response = await fetch("/getOneJob?" + new URLSearchParams({ postId: event.currentTarget.title }));
        const data = await response.json();
        setClickedJob(JSON.parse(data));
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  };

  const deleteJobHandler = useCallback((event) => {
    const deleteData = async () => {
      try {
        await fetch("/deleteJob", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: event.currentTarget.title }),
        });
      } catch (err) {
        console.log(err);
      }
    };
    deleteData();
    getAllJobs();
    setClickedJob(null);
  }, []);

  const editJobHandler = (event) => {
    navigate({
      pathname: "/jobs/edit",
      search: `?id=${event.currentTarget.title}`,
    });
  };

  const getAllJobs = () => {
    const fetchData = async () => {
      const response = await fetch("/getJobs");
      const newData = await response.json();
      setJobs(JSON.parse(newData));
    };
    fetchData();
  };

  useEffect(() => {
    getAllJobs();
  }, []);

  return (
    <>
      <Box sx={{ width: "360px", bgcolor: deepPurple[100], position: "fixed", top: "68.5px", bottom: "0px", overflowY: "scroll" }}>
        <Box sx={{ textAlign: "center", p: 2, bgcolor: deepPurple[200] }}>
          <Typography component="p" variant="p" sx={{ fontSize: "1.5rem" }}>
            Jobs
          </Typography>
        </Box>
        <List>
          {jobs &&
            jobs.map((job, num) => (
              <Box key={job._id}>
                <ListItem title={job._id} disablePadding onClick={jobClickHandler}>
                  <ListItemButton>
                    <ListItemText primary={`${job.companyName}: ${job.position}`} secondary={job.dateCreated} />
                  </ListItemButton>
                </ListItem>
                <hr key={num} />
              </Box>
            ))}
        </List>
      </Box>
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
            <CardActions>
              <Button title={clickedJob._id} onClick={editJobHandler} variant="contained" color="primary" size="small">
                Edit
              </Button>
              <Button title={clickedJob._id} onClick={deleteJobHandler} variant="contained" color="error" size="small">
                Remove
              </Button>
            </CardActions>
          </Card>
        </Box>
      )}
    </>
  );
}
