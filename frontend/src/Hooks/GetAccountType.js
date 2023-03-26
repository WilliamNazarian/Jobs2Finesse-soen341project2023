import { useState, useEffect } from "react";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accountType, setAccountType] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkIfCompany = async () => {
      try {
        const response = await fetch("/checkIfCompany", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
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

    if (token) {
      checkIfCompany();
    }
  }, [token]);

  return { isAuthenticated, accountType };
};

export default useAuth;