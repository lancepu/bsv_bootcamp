import React from "react";
import { Form, Select } from "antd";

const { Option } = Select;

const CustomSelect = ({ name, label, options, error, onChange, ...rest }) => {
  return (
    <Form.Item
      validateStatus={error ? "error" : null}
      help={error ? error : null}
      label={label}
    >
      <Select onChange={(value, event) => onChange(value, event)} {...rest}>
        {options.map(opt => (
          <Option key={opt.id} value={opt.id} name={name}>
            {opt.name}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export default CustomSelect;
