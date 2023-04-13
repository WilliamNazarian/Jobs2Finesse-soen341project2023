import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/login";
import MyNavbar from "./pages/GeneralComponents/MyNavbar";
import SignUp from "./pages/signUp/signUp";
import BrowseJobs from "./pages/BrowseJobs/BrowseJobs";
import { deepPurple } from "@mui/material/colors";
import EditJob from "./pages/EditJobs/EditJob";
import Apply from "./pages/Apply/Apply";
import Applications from "./pages/Applications/Applications";
import ViewProfile from "./pages/studentProfileView/ViewProfile";
import EditProfile from "./pages/studentProfileEdit/EditProfile";
import { useDispatch } from "react-redux";
import { authActions } from "./store/auth";
import jwt_decode from "jwt-decode"
import { useEffect } from "react";
//import ProtectedRoute from "./components/ProtectedRoute";
//<ProtectedRoute path="/dashboard" element={<Dashboard />} />

function App() {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwt_decode(token);
        const user = {
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          email: decoded.email,
          accountType: decoded.accountType,
        };
        dispatch(authActions.setCredential(user));
      } catch (error) {
        console.error("Error decoding JWT token:", error);
      }
    }
  }, [dispatch]);
  //put it in useeffect so it only works when page is reloaded


  return (
    <>
      <div style={{ backgroundColor: deepPurple[50], minHeight: "100vh", height: "100%" }}>
        {location.pathname !== "/login" && location.pathname !== "/signup" && <MyNavbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/jobs" element={<BrowseJobs />} />
          <Route path="/jobs/edit" element={<EditJob />} />
          <Route path="/jobs/apply" element={<Apply />} />
          <Route path="/jobs/applications" element={<Applications />} />
          <Route path="/student-profile/view" element={<ViewProfile />} />
          <Route path="/student-profile/edit" element={<EditProfile />} />
        </Routes>
      </div>
    </>
  );
}

//add loader that verifies the backend b4 any page render

export default App;
//Paul editing
//will editing
//Ziad editing
//Sana editing
//Omar editing
//Sana Again
//please work
//Cleopatr Aliak's commit
