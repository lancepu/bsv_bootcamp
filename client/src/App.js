import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Logout from "./components/common/logout";
import NavBar from "./components/navbar";
import NotFound from "./components/notFound";
import Sample from "./components/sampleForm";
import verifyForm from "./components/verifyForm";
import LoginForm from "./components/loginForm";
import RegisterForm from "./components/registerForm";
import SubmitForm from "./components/submitForm";
import PasswordChangeForm from "./components/passwordChangeForm";
import PPVForm from "./components/ppvForm";
import ProtectedRoute from "./components/common/protectedRoute";
import auth from "./services/authService";
import Profile from "./components/profile";
import SamplePrint from "./components/samplePrint";
import SampleReport from "./components/sampleReport";
import UsersForm from "./components/admin_userForm";
import { Layout } from "antd";
import "./App.css";
import Test from "./components/test";

const { Content } = Layout;

class App extends Component {
  state = {};

  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });
  }

  render() {
    const { user } = this.state;

    return (
      <React.Fragment>
        <NavBar user={user} />
        <Content style={{ padding: "25px" }}>
          <Switch>
            <Route path="/test" component={Test} />
            <Route path="/login" component={LoginForm} />
            <Route path="/logout" component={Logout} />
            <ProtectedRoute
              allowedRoles={[]}
              path="/changePassword"
              component={PasswordChangeForm}
            />
            <ProtectedRoute
              allowedRoles={[]}
              path="/sample/report"
              component={SampleReport}
            />
            <ProtectedRoute
              allowedRoles={[]}
              path="/profile"
              component={Profile}
            />
            <ProtectedRoute
              allowedRoles={["Admin"]}
              path="/register"
              component={RegisterForm}
            />
            <ProtectedRoute
              allowedRoles={["Admin"]}
              path="/users"
              component={UsersForm}
            />
            <ProtectedRoute
              allowedRoles={[]}
              path="/sample/submit"
              component={SubmitForm}
            />
            <ProtectedRoute
              allowedRoles={["Admin", "Technologist"]}
              path="/sample/verify"
              component={verifyForm}
            />
            <ProtectedRoute
              allowedRoles={["Admin", "Technologist"]}
              path="/sample/ppv"
              component={PPVForm}
            />
            <ProtectedRoute
              allowedRoles={["Admin", "Technologist"]}
              path="/sample/print"
              component={SamplePrint}
            />
            <ProtectedRoute
              allowedRoles={[]}
              path="/sample"
              component={Sample}
            />
            <Route path="/not-found" component={NotFound} />
            <Redirect from="/" exact to="/sample/submit" />
            <Redirect to="not-found" />
          </Switch>
        </Content>
      </React.Fragment>
    );
  }
}

export default App;
