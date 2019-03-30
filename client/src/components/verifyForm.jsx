import React from "react";
import CustomForm from "./common/customForm";
import Sample from "../services/sampleService";
import auth from "../services/authService";
import { getTubeColor } from "./../services/tubeColorService";
import { getVisualInspect } from "./../services/visualInspectService";
import { verifyFormSchema } from "../utils/schemaMaster";
import { Row, Col, Card, Form, message, Spin } from "antd";

class VerifyForm extends CustomForm {
  constructor(props) {
    super(props);
    this.labnoRef = React.createRef();
  }

  state = {
    data: {
      labno: "",
      preprocessComment: "",
      preprocessVolume: 6,
      tubeColor: 1,
      visualInspect: 1,
      user: ""
    },
    errors: {},
    tubeColors: [],
    visualInspect: [],
    schema: verifyFormSchema,
    loading: false,
    verifyUser: ""
  };

  async componentDidMount() {
    const { data: tubeColors } = await getTubeColor();
    const { data: visualInspect } = await getVisualInspect();
    const data = { ...this.state.data };
    const user = auth.getCurrentUser();
    data.user = user.id;
    this.labnoRef.current.focus();
    this.setState({ tubeColors, visualInspect, data });
  }

  doSubmit = async () => {
    try {
      const { data } = this.state;
      // call the server
      await Sample.verifySample(data);
      message.success("Successfully Submitted");
      // clear the form for the next submit
      const clearData = { ...this.state.data };
      clearData.labno = "";
      this.setState({ data: clearData });
      this.labnoRef.current.focus();
    } catch (ex) {
      if ((ex.response && ex.response.status === 404) || 400) {
        message.error(ex.response.data, 5);
      }
    }
  };

  handleEnter = async e => {
    e.preventDefault();
    console.log(this.labnoRef.current.value);
    const clearData = { ...this.state.data };
    clearData.labno = "";
    //clearData.tubeColor = "";
    clearData.visualInspect = 1;
    clearData.preprocessComment = "";
    clearData.preprocessVolume = 6;
    this.setState({ data: clearData });
    try {
      this.setState({ loading: true });
      const sample = await Sample.getSample(e.currentTarget.value);
      const data = { ...this.state.data };
      // POPULATE THE FIELDS WITH DATA IN DATABASE, OR USE THE INFORMATION STORED IN THE STATE
      if (sample.data.labno) data.labno = sample.data.labno;
      if (sample.data.preprocess_comment)
        data.preprocessComment = sample.data.preprocess_comment;
      if (sample.data.preprocess_volume)
        data.preprocessVolume = sample.data.preprocess_volume;
      if (sample.data.tube_color_id) data.tubeColor = sample.data.tube_color_id;
      if (sample.data.visual_inspect_id)
        data.visualInspect = sample.data.visual_inspect_id;
      let verifyUser;
      !sample.data.verify_user
        ? (verifyUser = "")
        : (verifyUser = sample.data.verify_user.name);
      this.setState({ data, verifyUser, loading: false });
    } catch (ex) {
      if ((ex.response && ex.response.status === 404) || 400) {
        message.error(ex.response.data, 3);
      }
      this.setState({ loading: false });
    }
  };

  render() {
    const { loading, verifyUser } = this.state;
    return (
      <Row type="flex" justify="space-around" align="middle">
        <Col sm={24} lg={24} align="middle" style={{ padding: "25px" }}>
          <Spin spinning={loading} />
        </Col>
        <Col sm={24} lg={8}>
          <Card
            title={
              <Row type="flex" justify="space-around" align="middle">
                <Col sm={24} lg={24}>
                  <Row type="flex" justify="space-around" align="middle">
                    <Col sm={24} lg={24}>
                      Sample Verification
                    </Col>
                  </Row>
                  <Row type="flex" justify="space-around" align="middle">
                    <Col
                      sm={24}
                      lg={24}
                      style={!verifyUser ? { color: "Red" } : null}
                    >
                      {`Verified by: ${
                        !verifyUser ? "Not Verfied" : verifyUser
                      }`}
                    </Col>
                  </Row>
                </Col>
              </Row>
            }
          >
            <Form onSubmit={this.handleSubmit} className="login-form">
              {this.renderInput(
                "labno",
                "Lab Number",
                "text",
                null,
                false,
                this.handleEnter,
                this.labnoRef
              )}
              {this.renderSelect(
                "tubeColor",
                "Tube Color",
                this.state.tubeColors
              )}
              {this.renderSelect(
                "visualInspect",
                "Visual Inspect",
                this.state.visualInspect
              )}
              {this.renderInput(
                "preprocessVolume",
                "Pre-Process Volume",
                "number"
              )}
              {this.renderTextArea("preprocessComment", "Comment")}
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

export default VerifyForm;
