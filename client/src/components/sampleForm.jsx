import React from "react";
//import Joi from "joi-browser";
import Sample from "../services/sampleService";
import Moment from "react-moment";
import { getSpecimen } from "../services/specimenService";
import { getTubeColor } from "./../services/tubeColorService";
import { getVisualInspect } from "./../services/visualInspectService";
import { getType } from "./../services/typeService";
import { getTransparency } from "./../services/transparencyService";
import { getSampleColor } from "./../services/sampleColorService";
import CustomForm from "./common/customForm";
import { Form, Card, Row, Col, message, Input, Spin, Switch } from "antd";
import {
  sampleFormSchema
  //biochemSearchSampleSchema
} from "./../utils/schemaMaster";

class SampleForm extends CustomForm {
  state = {
    errors: {},
    searchQuery: "",
    loading: false,
    readOnly: true,
    specimens: [],
    tubeColors: [],
    visualInspect: [],
    transparency: [],
    sampleColors: [],
    types: [],
    schema: sampleFormSchema,
    submitUser: "",
    verifyUser: "",
    ppvUser: ""
  };

  async componentDidMount() {
    const { data: specimens } = await getSpecimen();
    const { data: tubeColors } = await getTubeColor();
    const { data: visualInspect } = await getVisualInspect();
    const { data: types } = await getType();
    const { data: transparency } = await getTransparency();
    const { data: sampleColors } = await getSampleColor();
    this.setState({
      specimens,
      tubeColors,
      visualInspect,
      types,
      transparency,
      sampleColors
    });
  }

  handleSearchBarChange = ({ currentTarget }) => {
    this.setState({ searchQuery: currentTarget.value });
  };

  handleSwitch = () => {
    this.setState({
      readOnly: !this.state.readOnly
    });
  };

  handleSearch = async ({ key, currentTarget }) => {
    if (key === "Enter") {
      const obj = { labno: currentTarget.value };
      try {
        this.setState({ loading: true });
        const sample = await Sample.getSample(obj.labno);
        const data = {
          id: sample.data.id,
          labno: sample.data.labno,
          preprocessComment: sample.data.preprocess_comment,
          preprocessVolume: sample.data.preprocess_volume,
          postprocessComment: sample.data.postprocess_comment,
          postprocessVolume: sample.data.postprocess_volume,
          specimen: sample.data.specimen_id,
          sampleColor: sample.data.sample_color_id,
          tubeColor: sample.data.tube_color_id,
          transparency: sample.data.transparency_id,
          visualInspect: sample.data.visual_inspect_id,
          type: sample.data.type_id,
          created: sample.data.created_at
        };
        const submitUser = sample.data.submit_user.name;
        let verifyUser;
        let ppvUser;
        !sample.data.verify_user
          ? (verifyUser = "")
          : (verifyUser = sample.data.verify_user.name);
        !sample.data.ppv_user
          ? (ppvUser = "")
          : (ppvUser = sample.data.ppv_user.name);
        this.setState({
          data,
          submitUser,
          verifyUser,
          ppvUser,
          searchQuery: "",
          loading: false
        });
      } catch (ex) {
        if ((ex.response && ex.response.status === 404) || 400) {
          message.error(ex.response.data, 3);
        }
        this.setState({ loading: false, searchQuery: "" });
      }
    }
  };

  doSubmit = async () => {
    this.setState({ loading: true });
    try {
      const { data } = this.state;
      // call the server
      await Sample.editSample(data);
      message.success("Successfully Updated");
      this.setState({ readOnly: true, loading: false });
    } catch (ex) {
      if ((ex.response && ex.response.status === 404) || 400) {
        message.error(ex.response.data, 5);
      }
      this.setState({ loading: false });
    }
  };

  render() {
    const {
      searchQuery,
      data,
      submitUser,
      verifyUser,
      ppvUser,
      loading,
      readOnly
    } = this.state;
    return (
      <Row type="flex" justify="space-around" align="middle">
        <Col sm={24} lg={8}>
          <Card title="Sample Search">
            <Input
              allowClear
              placeholder="Sample ID"
              onKeyPress={event => this.handleSearch(event)}
              onChange={event => this.handleSearchBarChange(event)}
              value={searchQuery}
              autoFocus
            />
          </Card>
        </Col>

        <Col sm={24} lg={24} align="middle" style={{ padding: "25px" }}>
          <Spin spinning={loading} />
        </Col>
        {data && (
          <Col sm={24} lg={8} style={{ padding: "25px" }}>
            <Card
              title={
                <Row type="flex" justify="space-around" align="middle">
                  <Col sm={6} lg={6}>
                    <Row type="flex" justify="space-around" align="middle">
                      <Col sm={24} lg={24}>
                        {data.labno}
                      </Col>
                    </Row>
                    <Row type="flex" justify="space-around" align="middle">
                      <Col sm={24} lg={24}>
                        <Moment format="YYYY-MM-DD hh:mm A">
                          {data.created}
                        </Moment>
                      </Col>
                    </Row>
                    <Row type="flex" justify="space-around" align="middle">
                      <Col sm={24} lg={24}>
                        {`Submit by: ${submitUser}`}
                      </Col>
                    </Row>
                    <Row type="flex" justify="space-around" align="middle">
                      <Col sm={24} lg={24}>
                        {`Verified by: ${
                          !verifyUser ? "Not Verfied" : verifyUser
                        }`}
                      </Col>
                    </Row>
                    <Row type="flex" justify="space-around" align="middle">
                      <Col sm={24} lg={24}>
                        {`PPV by: ${!ppvUser ? "Not PPV" : ppvUser}`}
                      </Col>
                    </Row>
                  </Col>
                  <Col sm={18} lg={18} style={{ float: "right" }}>
                    <Switch
                      checkedChildren="Stop Edit"
                      unCheckedChildren="Start Edit"
                      defaultChecked={false}
                      checked={!readOnly}
                      style={{ float: "right", margin: "10px" }}
                      onClick={this.handleSwitch}
                    />
                  </Col>
                </Row>
              }
            >
              <Form onSubmit={this.handleSubmit} className="login-form">
                {this.renderSelect(
                  "specimen",
                  "Specimen",
                  this.state.specimens,
                  readOnly
                )}
                {this.renderSelect(
                  "tubeColor",
                  "Tube Color",
                  this.state.tubeColors,
                  readOnly
                )}
                {this.renderSelect(
                  "visualInspect",
                  "Visual Inspect",
                  this.state.visualInspect,
                  readOnly
                )}
                {this.renderInput(
                  "preprocessVolume",
                  "Pre-Process Volume",
                  "number",
                  null,
                  readOnly
                )}
                {this.renderTextArea(
                  "preprocessComment",
                  "Comment",
                  "text",
                  readOnly
                )}
                {this.renderSelect(
                  "sampleColor",
                  "Sample Color",
                  this.state.sampleColors,
                  readOnly
                )}
                {this.renderSelect(
                  "transparency",
                  "Transparency",
                  this.state.transparency,
                  readOnly
                )}
                {this.renderSelect("type", "Type", this.state.types, readOnly)}
                {this.renderInput(
                  "postprocessVolume",
                  "Post-Process Volume",
                  "number",
                  null,
                  readOnly
                )}
                {this.renderTextArea(
                  "postprocessComment",
                  "Comment",
                  "text",
                  readOnly
                )}
                {this.renderButton("Submit", readOnly, {
                  type: "primary",
                  htmlType: "submit",
                  block: true
                })}
              </Form>
            </Card>
          </Col>
        )}
      </Row>
    );
  }
}

export default SampleForm;
