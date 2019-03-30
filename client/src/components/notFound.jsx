import React, { Component } from "react";
import { Empty } from "antd";

class NotFound extends Component {
  render() {
    return (
      <Empty
        image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
        description={<span>Oops, looks like 404</span>}
      />
    );
  }
}

export default NotFound;
