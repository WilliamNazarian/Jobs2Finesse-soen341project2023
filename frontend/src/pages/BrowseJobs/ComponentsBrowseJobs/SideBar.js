import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { List } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import Typography from "@mui/material/Typography";


export default function SideBar(props) {
  return (
    <Box sx={{ width: "360px", bgcolor: deepPurple[100], position: "fixed", top: "72px", bottom: "0px", overflowY: "scroll" }}>
      <Box sx={{ textAlign: "center", p: 2, bgcolor: deepPurple[200] }}>
        <Typography component="p" variant="p" sx={{ fontSize: "1.5rem" }}>
          Jobs
        </Typography>
      </Box>
      <List>
        {props.jobs &&
          props.jobs.map((job, num) => (
            <Box key={job._id}>
              <ListItem title={job._id} disablePadding onClick={(event)=>props.OnJobClick(event)}>
                <ListItemButton>
                  <ListItemText primary={`${job.companyName}: ${job.position}`} secondary={job.dateCreated} />
                </ListItemButton>
              </ListItem>
              <hr key={num} />
            </Box>
          ))}
      </List>
    </Box>
  );
}
