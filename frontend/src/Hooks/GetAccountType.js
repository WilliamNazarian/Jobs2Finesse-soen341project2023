import { useState, useEffect } from "react";

const GetAccountType = () => {
  const [accountType, setAccountType] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch("/auth/checkAccountType", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          setAccountType(data.accountType);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchData();
  }, []);

  return accountType;
};

export default GetAccountType;
