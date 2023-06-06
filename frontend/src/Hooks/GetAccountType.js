import { useState, useEffect } from "react";

const useAuth = () => {
  //define two state variables
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accountType, setAccountType] = useState(null);
  //retrieve token from local storage
  const token = localStorage.getItem("token");

  //hook that runs when components mounts and when the token state changes 
  useEffect(() => {
    const checkIfCompany = async () => {
      try {
        //send request with token in header 
        const response = await fetch("/checkIfCompany", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        //if response was a success then set message: success and authentication state to true and account type to company
        //otherwise, authentication state will be set to false and the account type will be student 
        if (data.message === "success") {
          setIsAuthenticated(true);
          setAccountType("company");
        } else {
          setIsAuthenticated(false);
          setAccountType("student");
        }
      } catch (err) {
        console.log(err);
      }
    };

    //if token is present, call checkIfCompany function
    if (token) {
      checkIfCompany();
    }
  }, [token]);

  return { isAuthenticated, accountType };
};

export default useAuth;
