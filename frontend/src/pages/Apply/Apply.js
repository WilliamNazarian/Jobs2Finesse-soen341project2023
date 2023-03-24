import React, { useState } from "react";
import { TextField, Button, Grid, Typography, Input } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";

import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

function Apply() {
  const [file, setFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [applied, setApplied] = useState(false);

  const [searchParams] = useSearchParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate()

  const handleFileUpload = (event) => {
    console.log(event.target.files[0]);
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("CV", file);
    formData.append("coverLetter", coverLetter);
    formData.append("jobId", searchParams.get("id"));

    try {
      const response = await fetch("/application", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      setApplied(true);

      setTimeout(() => {
        navigate("/jobs");
      }, 3000);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Grid container sx={{ p: 10 }} spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              {searchParams.get("company-name")}
            </Typography>
            <Typography sx={{ color: "#424242" }} variant="h6" gutterBottom>
              {`Position: ${searchParams.get("position")}`}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" component="label" endIcon={<CloudUploadIcon />}>
              Upload CV
              <Input type="file" accept="application/pdf" onChange={handleFileUpload} style={{ display: "none" }} />
            </Button>
            {file && <span style={{ marginLeft: "10px" }}>{file.name}</span>}
          </Grid>
          <Grid item xs={12}>
            <TextField id="cover-letter" label="Cover Letter" multiline rows={10} value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} fullWidth required />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
      <Stack sx={{ width: "80%", m: "auto" }} spacing={2}>
        {applied && (
          <Alert severity="success">
            <AlertTitle>Success</AlertTitle>
            You successfully applied to this job — <strong>you will be redirected to jobs page</strong>
          </Alert>
        )}
      </Stack>
    </>
  );
}

export default Apply;
