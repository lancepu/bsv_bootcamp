import React from "react";
import { NavLink } from "react-router-dom";
import { Layout, Menu, Icon } from "antd";

const { Header } = Layout;
const SubMenu = Menu.SubMenu;

const NavBar = ({ user }) => {
  return (
    <Header className="header">
      <div className="logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={user ? ["user"] : ["login"]}
        style={{ lineHeight: "64px" }}
      >
        {!user && (
          <Menu.Item key="login" style={{ float: "right" }}>
            <NavLink className="nav-link" to="/login">
              Login
            </NavLink>
          </Menu.Item>
        )}

        {/* Current Logged In User Menu */}
        {user && (
          <SubMenu
            key="user"
            style={{ float: "right" }}
            title={
              <span>
                <Icon type="user" />
                <span>{user.name}</span>
              </span>
            }
          >
            <Menu.Item key="profile">
              <NavLink className="nav-link" to="/profile">
                Profile
              </NavLink>
            </Menu.Item>
            <Menu.Item key="logout">
              <NavLink className="nav-link" to="/logout">
                Logout
              </NavLink>
            </Menu.Item>
          </SubMenu>
        )}

        {/* Report Menu */}
        {user && (
          <SubMenu
            key="report"
            style={{ float: "left" }}
            title={
              <span>
                <Icon type="file-search" />
                <span>Report</span>
              </span>
            }
          >
            <Menu.Item key="sampleList">
              {" "}
              <NavLink className="nav-link" to="/sample/report">
                Sample List
              </NavLink>
            </Menu.Item>
          </SubMenu>
        )}

        {/* Accessioner Menu */}
        {user && (
          <SubMenu
            key="accessioner"
            style={{ float: "left" }}
            title={
              <span>
                <Icon type="user" />
                <span>Accessioner</span>
              </span>
            }
          >
            <Menu.Item key="sampleSubmit">
              {" "}
              <NavLink className="nav-link" to="/sample/submit">
                Sample Submit
              </NavLink>
            </Menu.Item>
          </SubMenu>
        )}

        {/* Technologist Menu */}
        {user && user.Role.name !== "Accessioner" && (
          <SubMenu
            key="technologist"
            style={{ float: "left" }}
            title={
              <span>
                <Icon type="user" />
                <span>Technologist</span>
              </span>
            }
          >
            <Menu.Item key="sampleVerify">
              <NavLink className="nav-link" to="/sample/verify">
                Sample Verify
              </NavLink>
            </Menu.Item>
            <Menu.Item key="samplePPV">
              <NavLink className="nav-link" to="/sample/ppv">
                PPV
              </NavLink>
            </Menu.Item>
            <Menu.Item key="sample">
              <NavLink className="nav-link" to="/sample">
                Sample
              </NavLink>
            </Menu.Item>
            <Menu.Item key="samplePrint">
              <NavLink className="nav-link" to="/sample/print">
                Print
              </NavLink>
            </Menu.Item>
          </SubMenu>
        )}

        {/* Admin Menu */}
        {user && user.Role.name === "Admin" && (
          <SubMenu
            key="admin"
            style={{ float: "left" }}
            title={
              <span>
                <Icon type="user" />
                <span>Admin</span>
              </span>
            }
          >
            <Menu.Item key="createUser">
              {" "}
              <NavLink className="nav-link" to="/register">
                New User
              </NavLink>
            </Menu.Item>
            <Menu.Item key="adminUser">
              {" "}
              <NavLink className="nav-link" to="/users">
                Users
              </NavLink>
            </Menu.Item>
          </SubMenu>
        )}
      </Menu>
    </Header>
  );
};

export default NavBar;
