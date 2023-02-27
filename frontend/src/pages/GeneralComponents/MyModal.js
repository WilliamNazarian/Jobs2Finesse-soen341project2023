import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { lightBlue } from "@mui/material/colors";
import { Typography } from "@mui/material";

import FormInsideModal from "./FormInsideModal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: lightBlue[100],
  border: `2px solid ${lightBlue[700]}`,
  boxShadow: 24,
  p: 4,
  borderRadius: "30px"
};

export default function MyModal(props) {

  const closeModalHandler = ()=>{
    props.closeModal();
  }

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={props.open}
        onClose= {props.closeModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={props.open}>
          <Box sx={style}>
            <Typography variant="h5" sx={{textAlign:"center"}}>POST A JOB</Typography>
            <hr style={{marginLeft:"-32px", marginRight:"-32px"}}></hr>
            <FormInsideModal onSubmitForm={closeModalHandler}/>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
