import { Typography } from "@mui/material";

function Home() {
  return (
    <>
      <Typography
        variant="h2"
        sx={{
          marginTop: 10,
          fontWeight: 700,
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        Welcome to Jobs2Finesse
      </Typography>
      <Typography
        variant="h4"
        sx={{
          marginTop: 2,
          fontWeight: 500,
          textAlign: "center",
        }}
      >
        Find Your Dream Job Today!
      </Typography>
    </>
  );
}

export default Home;
