import React from "react";
import CustomForm from "./common/customForm";
import Sample from "../services/sampleService";
import auth from "../services/authService";
import { getType } from "./../services/typeService";
import { getTransparency } from "./../services/transparencyService";
import { getSampleColor } from "./../services/sampleColorService";
import { ppvSchema } from "./../utils/schemaMaster";
import { Row, Col, Card, Form, message, Spin } from "antd";

class PPVForm extends CustomForm {
  constructor(props) {
    super(props);
    this.labnoRef = React.createRef();
  }

  state = {
    data: {
      labno: "",
      postprocessComment: "",
      postprocessVolume: "",
      sampleColor: 1,
      transparency: 1,
      type: "",
      user: ""
    },
    errors: {},
    transparency: [],
    sampleColors: [],
    types: [],
    schema: ppvSchema,
    loading: false,
    ppvUser: ""
  };

  async componentDidMount() {
    const { data: types } = await getType();
    const { data: transparency } = await getTransparency();
    const { data: sampleColors } = await getSampleColor();
    const data = { ...this.state.data };
    const user = auth.getCurrentUser();
    data.user = user.id;
    this.labnoRef.current.focus();
    this.setState({ types, transparency, sampleColors, data });
  }

  doSubmit = async () => {
    try {
      const { data } = this.state;
      // call the server
      await Sample.ppvSample(data);
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
    const clearData = { ...this.state.data };
    clearData.labno = "";
    clearData.sampleColor = 1;
    clearData.transparency = 1;
    clearData.type = "";
    clearData.postprocessComment = "";
    clearData.postprocessVolume = "";
    this.setState({ data: clearData });
    try {
      this.setState({ loading: true });
      const sample = await Sample.getSample(e.currentTarget.value);
      const data = { ...this.state.data };
      // POPULATE THE FIELDS WITH DATA IN DATABASE, OR USE THE INFORMATION STORED IN THE STATE
      if (sample.data.labno) data.labno = sample.data.labno;
      if (sample.data.postprocess_comment)
        data.postprocessComment = sample.data.postprocess_comment;
      if (sample.data.postprocess_volume)
        data.postprocessVolume = sample.data.postprocess_volume;
      if (sample.data.sample_color_id)
        data.sampleColor = sample.data.sample_color_id;
      if (sample.data.transparency_id)
        data.transparency = sample.data.transparency_id;
      if (sample.data.type_id) data.type = sample.data.type_id;
      let ppvUser;
      !sample.data.ppv_user
        ? (ppvUser = "")
        : (ppvUser = sample.data.ppv_user.name);
      this.setState({ data, ppvUser, loading: false });
    } catch (ex) {
      if ((ex.response && ex.response.status === 404) || 400) {
        message.error(ex.response.data, 3);
      }
      this.setState({ loading: false });
    }
  };

  render() {
    const { loading, ppvUser } = this.state;
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
                      Post-Processing Verification
                    </Col>
                  </Row>
                  <Row type="flex" justify="space-around" align="middle">
                    <Col
                      sm={24}
                      lg={24}
                      style={!ppvUser ? { color: "Red" } : null}
                    >
                      {`PPV by: ${!ppvUser ? "Not PPV" : ppvUser}`}
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
                "labno",
                null,
                false,
                this.handleEnter,
                this.labnoRef
              )}
              {this.renderSelect(
                "sampleColor",
                "Sample Color",
                this.state.sampleColors
              )}
              {this.renderSelect(
                "transparency",
                "Transparency",
                this.state.transparency
              )}
              {this.renderSelect("type", "Type", this.state.types)}
              {this.renderInput(
                "postprocessVolume",
                "Post-Process Volume",
                "number"
              )}
              {this.renderTextArea("postprocessComment", "Comment")}
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

export default PPVForm;
