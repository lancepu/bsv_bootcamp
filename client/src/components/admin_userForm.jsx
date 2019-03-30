import React, { Component } from "react";
import { getRoles } from "./../services/roleService";
import userService from "./../services/userService";
import auth from "../services/authService";
import {
  Card,
  Row,
  Col,
  message,
  Table,
  Select,
  Button,
  Empty,
  Switch,
  Input
} from "antd";

const Option = Select.Option;
const currentUser = auth.getCurrentUser();

class UsersForm extends Component {
  state = {
    data: {},
    roles: [],
    users: [],
    userData: [],
    selectedUser: []
  };

  columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Role", dataIndex: "role", key: "role" },
    {
      title: "Change Password",
      dataIndex: "changePassword",
      key: "changePassword"
    },
    { title: "Status", dataIndex: "enabled", key: "enabled" },
    { title: "", dataIndex: "action", key: "action" }
  ];

  async componentDidMount() {
    const { data: roles } = await getRoles();
    const { data: users } = await userService.getAllUser();
    const filteredUsers = users.filter(u => u.id !== currentUser.id);
    this.setState({
      roles,
      users,
      userData: filteredUsers
    });
  }

  handleSelectChange = value => {
    const data = { ...this.state.data };
    data.role_id = value;
    this.setState({ data });
  };

  handleSwitch = checked => {
    const data = { ...this.state.data };
    data.enabled = checked;
    this.setState({ data });
  };

  handleUserSelect = value => {
    let selectedUser = this.state.userData.filter(u => u.id === value);
    selectedUser = this.generateTableData(selectedUser);
    let data = { ...this.state.data };
    data = {};
    this.setState({ data, selectedUser });
  };

  handleTextChange = e => {
    const data = { ...this.state.data };
    data.newPassword = e.target.value;
    this.setState({ data });
  };

  generateButton = userId => {
    return (
      <Button type="primary" onClick={this.handleSubmit} id={userId}>
        Submit
      </Button>
    );
  };

  generateSwitch = enabled => {
    return (
      <Switch
        checkedChildren="Enabled"
        unCheckedChildren="Disabled"
        defaultChecked={enabled}
        onChange={this.handleSwitch}
      />
    );
  };

  generateTextBox = () => {
    return (
      <Input
        placeholder="New Password"
        type="password"
        onChange={this.handleTextChange}
      />
    );
  };

  generateSelect = (currentOption, options) => {
    return (
      <Select
        defaultValue={currentOption}
        style={{ width: 120 }}
        onChange={this.handleSelectChange}
      >
        {options.map(r => (
          <Option key={r.id}>{r.name}</Option>
        ))}
      </Select>
    );
  };

  generateTableData = userArray => {
    const userData = [];
    for (let i = 0; i < userArray.length; i++) {
      let setData = {
        id: userArray[i].id,
        name: userArray[i].name,
        role: this.generateSelect(userArray[i].Role.name, this.state.roles),
        changePassword: this.generateTextBox(),
        enabled: this.generateSwitch(userArray[i].enabled),
        action: this.generateButton(userArray[i].id)
      };
      userData.push(setData);
    }
    return userData;
  };

  handleSubmit = async e => {
    const data = { ...this.state.data };
    data.id = e.target.id;
    this.setState({ data });
    try {
      if (data.newPassword) {
        const response = await userService.adminUpdatePassword(data);
        message.success(response.data, 5);
      }
      if (data.hasOwnProperty("enabled")) {
        const response = await userService.adminUpdateStatus(data);
        message.success(response.data, 5);
      }
      if (data.hasOwnProperty("role_id")) {
        const response = await userService.adminUpdateRole(data);
        message.success(response.data, 5);
      }
      // refresh the user information without refreshing the page
      const { data: users } = await userService.getAllUser();
      const filteredUsers = users.filter(u => u.id !== currentUser.id);
      this.setState({ userData: filteredUsers });
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        message.error(ex.response.data, 5);
      }
    }
  };

  render() {
    const { userData, selectedUser } = this.state;
    return (
      <Row type="flex" justify="space-around" align="middle">
        <Col sm={24} lg={18}>
          <Card
            title={
              <Row type="flex" justify="space-around" align="middle">
                <Col sm={12} lg={12} align="left">
                  User Accounts
                </Col>
                <Col sm={12} lg={12} align="right">
                  <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Select a user"
                    optionFilterProp="children"
                    onChange={this.handleUserSelect}
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {userData.map(u => (
                      <Option value={u.id} key={u.id}>
                        {u.name}
                      </Option>
                    ))}
                  </Select>
                </Col>
              </Row>
            }
          >
            {selectedUser.length !== 0 ? (
              <Table
                pagination={false}
                rowKey={selectedUser => selectedUser.id}
                dataSource={selectedUser}
                columns={this.columns}
              />
            ) : (
              <Empty description={<span>Please select a user</span>} />
            )}
          </Card>
        </Col>
      </Row>
    );
  }
}

export default UsersForm;
