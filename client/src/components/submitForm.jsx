import React from "react";
import CustomForm from "./common/customForm";
import Sample from "../services/sampleService";
import auth from "../services/authService";
import { getSpecimen } from "../services/specimenService";
import { getLab } from "./../services/labService";
import { Row, Col, Card, Form, message, Radio, Spin } from "antd";
import {
  molecularSampleSubmitSchema,
  biochemSampleSubmitSchema
} from "../utils/schemaMaster";

class SubmitForm extends CustomForm {
  state = {
    data: { labno: "", specimen: "", user: "", lab: "" },
    errors: {},
    specimens: [],
    labs: [],
    schema: biochemSampleSubmitSchema
  };

  async componentDidMount() {
    const { data: specimens } = await getSpecimen();
    const { data: labs } = await getLab();
    const data = { ...this.state.data };
    const user = auth.getCurrentUser();
    data.user = user.id;
    //always set the first element in the returned array as the default lab
    data.lab = labs[0].id;
    this.setState({ specimens, labs, data });
  }

  doSubmit = async () => {
    try {
      const { data } = this.state;
      // call the server
      await Sample.submitSample(data);
      message.success("Successfully Submitted");
      // clear the form for the next submit
      const clearData = { ...this.state.data };
      clearData.labno = "";
      this.setState({ data: clearData });
    } catch (ex) {
      if ((ex.response && ex.response.status === 404) || 400) {
        message.error(ex.response.data, 5);
        const clearData = { ...this.state.data };
        clearData.labno = "";
        this.setState({ data: clearData });
      }
    }
  };

  handleRadioChange = ({ target }) => {
    let schema = {};
    const data = { ...this.state.data };
    switch (target.value) {
      case 2:
        schema = molecularSampleSubmitSchema;
        data.lab = target.value;
        break;
      case 1:
        schema = biochemSampleSubmitSchema;
        data.lab = target.value;
        break;
      default:
        schema = biochemSampleSubmitSchema;
    }
    this.setState({ schema, data });
  };

  render() {
    const { labs } = this.state;
    if (labs.length === 0) {
      return (
        <Row type="flex" justify="space-around" align="middle">
          <Col sm={24} lg={24} align="middle" style={{ padding: "25px" }}>
            <Spin spinning={true} />
          </Col>
        </Row>
      );
    } else {
      return (
        <Row type="flex" justify="space-around" align="middle">
          <Col sm={24} lg={8}>
            <Card
              title={
                <Row type="flex" justify="space-around" align="middle">
                  <Col sm={12} lg={12} align="left">
                    Sample Submission
                  </Col>
                  <Col sm={12} lg={12} align="right">
                    <Radio.Group defaultValue={labs[0].id} buttonStyle="solid">
                      {labs.map(l => (
                        <Radio.Button
                          key={l.id}
                          value={l.id}
                          onChange={this.handleRadioChange}
                        >
                          {l.name}
                        </Radio.Button>
                      ))}
                    </Radio.Group>
                  </Col>
                </Row>
              }
            >
              <Form onSubmit={this.handleSubmit} className="login-form">
                {this.renderInput("labno", "Lab Number", "text")}
                {this.renderSelect(
                  "specimen",
                  "Specimen",
                  this.state.specimens
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
}

export default SubmitForm;
