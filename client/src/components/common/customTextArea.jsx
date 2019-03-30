import React from "react";
import { Form, Input } from "antd";

const { TextArea } = Input;

const CustomTextArea = ({ name, label, error, ...rest }) => {
  return (
    <Form.Item
      validateStatus={error ? "error" : null}
      help={error ? error : null}
      label={label}
    >
      <TextArea id={name} name={name} rows="3" placeholder={label} {...rest} />
    </Form.Item>
  );
};

export default CustomTextArea;
