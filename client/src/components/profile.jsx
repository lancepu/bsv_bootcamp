import React, { Component } from "react";
import auth from "../services/authService";
import { Button, Icon, Card, Row, Col } from "antd";

class Profile extends Component {
  state = {};
  render() {
    const user = auth.getCurrentUser();
    return (
      <Row type="flex" justify="space-around" align="middle">
        <Col sm={24} lg={8}>
          <Card title={user.name}>
            <h3>{`Role: ${user.Role.name}`}</h3>
            <Button type="danger" href="/changePassword">
              <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
              Change Password
            </Button>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default Profile;
