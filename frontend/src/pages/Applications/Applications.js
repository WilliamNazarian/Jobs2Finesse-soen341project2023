import { useState, useEffect } from "react";
import { Container, Box, Typography, Accordion, AccordionSummary, AccordionDetails, Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import GetAppIcon from "@mui/icons-material/GetApp";
import { useSearchParams } from "react-router-dom";

//import { saveAs } from "file-saver";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [searchParams] = useSearchParams();
  const token = localStorage.getItem("token");

  const downloadPdfHandler = (application) => {
    window.open(`http://localhost:5000/application/download/${application.appliedJobs.CV}`);
  };

  useEffect(() => {
    const fetchAppliedStudents = async () => {
      try {
        const response = await fetch("/application?" + new URLSearchParams({ jobId: searchParams.get("jobId") }), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setApplications(data.students);
        console.log(data.students);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAppliedStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const interviewEmail = (application) => {
    console.log(application.appliedJobs);
    const subject = encodeURIComponent("Interview Invitation");
    const body = encodeURIComponent(`Dear ${application.firstName} ${application.lastName},\n\nYou have been seclected for an interview at ${application.appliedJobs.job.companyName} for the ${application.appliedJobs.job.position} position. \n Please let us know your availability for an interview.\n\nThank you.`);
    window.open(`mailto:${application.email}?subject=${subject}&body=${body}`);
  };

  const rejectionEmail = (application) => {
    const subject = encodeURIComponent("Job Application Rejection");
    const body = encodeURIComponent(`Dear ${application.firstName} ${application.lastName},\n\nWe appreciate your interest in our company and hope you can consider applying at ${application.appliedJobs.job.companyName} again in the future. However, for now, we have moved on with other applicants who are more qualified for the job.\n\nBest regards.`);
    window.open(`mailto:oananutu@yahoo.com?subject=${subject}&body=${body}`);
  };

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 3 }}>
        <Typography variant="h4">Job Applications</Typography>
      </Box>
      <div>
        {applications &&
          applications.map((application) => (
            <Accordion key={application._id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{`${application.firstName} ${application.lastName}`}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Cover Letter
                </Typography>
                <Typography paragraph>{application.appliedJobs.coverLetter}</Typography>

                <Button sx={{ mb: 2 }} fullWidth variant="contained" startIcon={<GetAppIcon />} onClick={() => downloadPdfHandler(application)}>
                  Download CV
                </Button>

                <Button sx={{ mr: 2 }} onClick={() => interviewEmail(application)} variant="outlined" color="success">
                  Select For interview
                </Button>

                <Button onClick={() => rejectionEmail(application)} variant="outlined" color="error">
                  Reject
                </Button>
              </AccordionDetails>
            </Accordion>
          ))}
      </div>
    </Container>
  );
}

export default Applications;

//   const handleDownloadCV = async (cvPath) => {
//     try {
//       const response = await fetch(cvPath);
//       const blob = await response.blob();
//       saveAs(blob, cvPath.split("/").pop());
//     } catch (err) {
//       console.error("Error downloading CV:", err);
//     }
//   };
