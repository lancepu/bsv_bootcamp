import React from "react";
import auth from "../../services/authService";
import { Route, Redirect } from "react-router-dom";
import { message } from "antd";

const ProtectedRoute = ({
  allowedRoles,
  path,
  component: Component,
  render,
  ...rest
}) => {
  const user = auth.getCurrentUser();
  return (
    <Route
      {...rest}
      render={props => {
        // Make sure user has logged in
        if (!user)
          return (
            <Redirect
              // we are passing an additional property to the login page, which is state
              to={{ pathname: "/login", state: { from: props.location } }}
            />
          );
        // Make user user account is enabled
        else if (!user.enabled) {
          message.error("Account Disabled");
          return <Redirect to={"/"} />;
        }
        // Make sure user does not need to change password
        else if (!user.password_change_date) {
          if (path !== "/changePassword")
            return <Redirect to={"/changePassword"} />;
        }
        // Make sure user's role is part of the allowed roles
        else if (
          allowedRoles.length !== 0 &&
          allowedRoles.indexOf(user.Role.name) === -1
        ) {
          message.error("Unauthorized!");
          return <Redirect to={"/"} />;
        }
        return Component ? <Component {...props} /> : render(props);
      }}
    />
  );
};

export default ProtectedRoute;
