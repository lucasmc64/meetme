import React from "react";
import { Route, Redirect } from "react-router-dom";

import { UserContext } from "../contexts/UserContext";

const ProtectedRoute = (props) => {
  const { isLogged } = React.useContext(UserContext);

  if (isLogged === true) return <Route {...props} />;
  else if (isLogged === false) return <Redirect to="/login" />;
  else return null;
};

export default ProtectedRoute;
