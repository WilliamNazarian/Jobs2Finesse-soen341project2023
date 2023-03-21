import React, { useState } from "react";
import { TextField, Button, Grid, Typography, Input } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { useSearchParams } from "react-router-dom";

function Apply() {
  const [file, setFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");

  const [searchParams] = useSearchParams();

  const handleFileUpload = (event) => {
    console.log(event.target.files[0]);
    setFile(event.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container sx={{ p: 10 }} spacing={3}>
        <Grid item xs={12}>
          <Typography  variant="h5"  gutterBottom>
            {searchParams.get("company-name")}
          </Typography>
          <Typography sx={{color: "#424242"}} variant="h6" gutterBottom>
            {`Position: ${searchParams.get("position")}`}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" component="label" endIcon={<CloudUploadIcon />}>
            Upload File
            <Input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} style={{ display: "none" }} />
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
  );
}

export default Apply;
