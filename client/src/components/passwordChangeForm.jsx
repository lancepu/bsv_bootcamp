import React from "react";
import CustomForm from "./common/customForm";
import { updatePassword } from "../services/userService";
import { passwordChangeSchema } from "./../utils/schemaMaster";
import { Form, Icon, Card, Row, Col, message } from "antd";

class PasswordChangeForm extends CustomForm {
  state = {
    data: { password: "", newPassword: "" },
    errors: {},
    schema: passwordChangeSchema
  };

  doSubmit = async () => {
    try {
      const { data } = this.state;
      // call the server
      await updatePassword(data);
      // do a full reload of application to make the jwt user display correctly
      window.location = "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        message.error(ex.response.data, 5);
        const { data } = this.state;
        data.password = "";
        data.newPassword = "";
        this.setState({ data });
      }
    }
  };

  render() {
    return (
      <Row type="flex" justify="space-around" align="middle">
        <Col sm={24} lg={8}>
          <Card title="Change Password">
            <Form onSubmit={this.handleSubmit} className="login-form">
              {this.renderInput(
                "password",
                "Password",
                "password",
                <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
              )}
              {this.renderInput(
                "newPassword",
                "New Password",
                "password",
                <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
              )}
              {this.renderButton("Submit", null, {
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

export default PasswordChangeForm;
