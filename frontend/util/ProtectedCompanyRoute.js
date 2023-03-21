import { Route, Navigate } from "react-router-dom";
import GetAccountType from "../Hooks/Functions/GetAccountType";

function ProtectedCompanyRoute({ component: Component, ...rest }){
  const accountType = GetAccountType()
  return <Route {...rest} element={accountType === "company" ? <Component /> : <Navigate to="/" />} />;
};

export default ProtectedCompanyRoute;
