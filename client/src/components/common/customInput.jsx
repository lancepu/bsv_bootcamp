import React from "react";
import { Form, Input } from "antd";

// Using Ref forwarding to forward the ref to parent element, parent element can then create reference to this. Used for focusing the input item after form submit and initial form load
const CustomInput = React.forwardRef(
  (
    {
      name,
      label,
      error,
      type,
      prefix,
      value,
      onChange,
      disabled,
      onPressEnter
    },
    ref
  ) => {
    return (
      <Form.Item
        validateStatus={error ? "error" : null}
        help={error ? error : null}
        label={label}
      >
        <Input
          id={name}
          name={name}
          placeholder={label}
          ref={ref}
          type={type}
          prefix={prefix}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onPressEnter={onPressEnter}
        />
      </Form.Item>
    );
  }
);

export default CustomInput;
