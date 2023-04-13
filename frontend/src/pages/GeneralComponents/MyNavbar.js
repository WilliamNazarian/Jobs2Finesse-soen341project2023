import { styled, useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
//import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { ListItemIcon } from "@mui/material";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { deepPurple } from "@mui/material/colors";

import { Link } from "react-router-dom";
import { useState } from "react";
import MyModal from "./MyModal";
import Logo from "./Logo.svg";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

//
//
//
//
//
function MyNavbar() {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [anchorElUser, setAnchorElUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate()

  const accountType = useSelector((state) => state.auth.accountType);
  const firstName = useSelector((state) => state.auth.firstName);
  const lastName = useSelector((state) => state.auth.lastName);

  const closeModalHandler = () => {
    setShowModal(false);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(authActions.logout());
    handleCloseUserMenu();
    navigate('/login');
  };

  return (
    <>
      <MyModal open={showModal} closeModal={closeModalHandler} />
      <AppBar position="static" sx={{ bgcolor: deepPurple[500], margin: "0", padding: 2, "& div": { minHeight: "0px" } }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box component={Link} to="/" sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}>
              <img src={Logo} alt="Logo" width={200} />
            </Box>

            {/* this is the side hamburger */}
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerOpen} edge="start" sx={{ py: "4.5px", mr: 2, ...(open && { display: "hidden" }) }}>
                <MenuIcon />
              </IconButton>
            </Box>

            <Box component={Link} to="/" sx={{ display: { xs: "flex", md: "none", flexGrow: 1 }, mr: 1 }}>
              <img src={Logo} alt="Logo" width={200} />
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, marginRight: "40px" }}>
              <div style={{ marginLeft: "auto" }}>
                {accountType === "company" && (
                  <>
                    <Button onClick={() => setShowModal(true)} sx={{ color: "white", mr: "20px" }}>
                      Add A Posting
                    </Button>
                    <Button component={Link} to="/jobs" sx={{ color: "white", mr: "20px" }}>
                      View My Posted Jobs
                    </Button>
                  </>
                )}
                {accountType !== "company" && (
                  <Button component={Link} to="/jobs" sx={{ color: "white", mr: "20px" }}>
                    View Jobs
                  </Button>
                )}
              </div>
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              {accountType === "guest" && (
                <Button component={Link} to={"/login"} variant="contained" size="medium" sx={{ mt: "1.75px", mb: "1.75px", bgcolor: deepPurple[300], "&:hover": { bgcolor: deepPurple[200] } }}>
                  Sign In
                </Button>
              )}
              {accountType !== "guest" && (
                <>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar sx={{ bgcolor: deepPurple[200], "&:hover": { bgcolor: deepPurple[100] } }}>{`${firstName.charAt(0)}${lastName.charAt(0)}`}</Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu sx={{ mt: "45px" }} id="account-menu"  PaperProps={{  sx: { overflow: 'visible',  mt: 1, '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1, }, '&:before': { content: '""', display: 'block', position: 'absolute', top: 0, right: 14, width: 10, height: 10, bgcolor: 'background.paper', transform: 'translateY(-50%) rotate(45deg)', zIndex: 0, }, }, }} anchorEl={anchorElUser} anchorOrigin={{ vertical: "top", horizontal: "right" }} keepMounted transformOrigin={{ vertical: "top", horizontal: "right" }} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}>
                    <MenuItem onClick={()=>navigate("/student-profile/view")}>
                      <ListItemIcon>
                        <AccountCircleIcon fontSize="small" />
                      </ListItemIcon>
                      View Profile
                    </MenuItem>
                    <MenuItem onClick={()=>navigate("/student-profile/edit")}>
                      <ListItemIcon>
                        <ModeEditIcon fontSize="small" />
                      </ListItemIcon>
                      Edit Profile
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout} >
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer sx={{ width: 240, flexShrink: 0, "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box" } }} variant="persistent" anchor="left" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>{theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}</IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {accountType === "company" && (
            <>
              <ListItem disablePadding>
                <ListItemButton onClick={() => setShowModal(true)}>
                  <ListItemText primary="Add A Posting" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/jobs">
                  <ListItemText primary="View My Posted Jobs" />
                </ListItemButton>
              </ListItem>
            </>
          )}
          {accountType !== "company" && (
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/jobs">
                <ListItemText primary="View My Posted Jobs" />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Drawer>
    </>
  );
}
export default MyNavbar;
