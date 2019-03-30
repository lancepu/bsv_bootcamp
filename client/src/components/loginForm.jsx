import React from "react";
import CustomForm from "./common/customForm";
import auth from "../services/authService";
import { Redirect } from "react-router-dom";
import { loginSchema } from "./../utils/schemaMaster";
import { Form, Icon, Card, Row, Col, message } from "antd";

class LoginForm extends CustomForm {
  state = {
    data: { email: "", password: "" },
    errors: {},
    schema: loginSchema
  };

  doSubmit = async () => {
    const { data } = this.state;
    try {
      // call the server
      await auth.login(data.email, data.password);
      // do a full reload of application to make the jwt user display correctly
      const { state } = this.props.location;
      window.location = state ? state.from.pathname : "/";
    } catch (ex) {
      if ((ex.response && ex.response.status === 400) || 401) {
        message.error(ex.response.data, 5);
        data.password = "";
        this.setState({ data });
      }
    }
  };

  render() {
    if (auth.getCurrentUser()) return <Redirect to="/" />;
    return (
      <Row type="flex" justify="space-around" align="middle">
        <Col sm={24} lg={8}>
          <Card title="Login">
            <Form onSubmit={this.handleSubmit} className="login-form">
              {this.renderInput(
                "email",
                "Email",
                "text",
                <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />,
                false,
                true
              )}
              {this.renderInput(
                "password",
                "Password",
                "password",
                <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
              )}
              {this.renderButton("Login", null, {
                type: "primary",
                htmlType: "submit",
                block: true
              })}
            </Form>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default LoginForm;
