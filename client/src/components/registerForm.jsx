import React from "react";
import CustomForm from "./common/customForm";
import userService from "../services/userService";
import { getRoles } from "./../services/roleService";
import { registerFormSchema } from "../utils/schemaMaster";
import { Row, Col, Card, Form, message } from "antd";

class RegisterForm extends CustomForm {
  state = {
    data: { email: "", password: "", name: "", role: "" },
    errors: {},
    roles: [],
    schema: registerFormSchema
  };

  async componentDidMount() {
    const { data: roles } = await getRoles();
    this.setState({ roles });
  }

  doSubmit = async () => {
    // call the server
    try {
      await userService.register(this.state.data);
      message.success("User registered", 5);
      const data = { ...this.state.data };
      data.email = "";
      data.password = "";
      data.name = "";
      data.role = "";
      this.setState({ data });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        message.error(ex.response.data, 5);
      }
    }
  };

  render() {
    return (
      <Row type="flex" justify="space-around" align="middle">
        <Col sm={24} lg={8}>
          <Card title="User Registration">
            <Form onSubmit={this.handleSubmit} className="login-form">
              {this.renderInput("email", "Email")}
              {this.renderInput("password", "Password", "password")}
              {this.renderInput("name", "Name")}
              {this.renderSelect("role", "Role", this.state.roles)}
              {this.renderButton("Register", null, {
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

export default RegisterForm;
