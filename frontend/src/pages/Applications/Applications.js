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
    console.log(application.appliedJobs[0].CV);
    window.open(`http://localhost:5000/application/download/${application.appliedJobs[0].CV}`);
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
                <Typography paragraph>{application.appliedJobs[0].coverLetter}</Typography>
                <Button fullWidth variant="contained" startIcon={<GetAppIcon />} onClick={() => downloadPdfHandler(application)}>
                  Download CV
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
