import React, { Component } from "react";
import Joi from "joi-browser";
import CustomInput from "./customInput";
import CustomSelect from "./customSelect";
import CustomTextArea from "./customTextArea";
import { Button } from "antd";

class CustomForm extends Component {
  state = {
    data: {},
    errors: {}
  };

  validate = () => {
    const options = { abortEarly: false };
    const result = Joi.validate(this.state.data, this.state.schema, options);
    if (!result.error) return null;

    const errors = {};
    for (let item of result.error.details) {
      // in the result.error.details array, there's a path variable with the name of the input, so eg. => errors['username'],
      // then assign the message to errors['usermae'] property of the errors object
      errors[item.path[0]] = item.message;
    }
    return errors;
    // check if there are any errors in the errors object, if not return null, if yes, return the errors object
    //return Object.keys(errors).length === 0 ? null : errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    //this finds the schema of the name in the overall schema above and create a sub-schema
    const schema = { [name]: this.state.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  handleSubmit = e => {
    e.preventDefault();
    // form validation
    const errors = this.validate();
    //set the State to errors object or if null, return an empty object {}
    this.setState({ errors: errors || {} });
    if (errors) return;
    this.doSubmit();
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];
    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data, errors });
  };

  handleSelect = (value, e) => {
    const input = { name: e.props.name, value };
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];
    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data, errors });
  };

  renderButton(label, readOnly = null, { ...rest }) {
    return (
      <Button disabled={readOnly ? readOnly : this.validate()} {...rest}>
        {label}
      </Button>
    );
  }

  //text is the default value of type
  renderInput(
    name,
    label,
    type = "text",
    prefix = null,
    readOnly = false,
    onPressEnter = null,
    ref = null
  ) {
    const { data, errors } = this.state;
    return (
      <CustomInput
        name={name}
        label={label}
        error={errors[name]}
        type={type}
        prefix={prefix}
        value={data[name]}
        onChange={this.handleChange}
        disabled={readOnly}
        onPressEnter={onPressEnter}
        ref={ref}
      />
    );
  }

  renderTextArea(name, label, type = "text", readOnly = false) {
    const { data, errors } = this.state;
    return (
      <CustomTextArea
        type={type}
        name={name}
        label={label}
        value={data[name]}
        onChange={this.handleChange}
        error={errors[name]}
        disabled={readOnly}
      />
    );
  }

  renderSelect(name, label, options, readOnly = false) {
    const { data, errors } = this.state;
    return (
      <CustomSelect
        name={name}
        label={label}
        value={data[name]}
        options={options}
        onChange={this.handleSelect}
        error={errors[name]}
        disabled={readOnly}
      />
    );
  }
}

export default CustomForm;
