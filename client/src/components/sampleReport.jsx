import React, { Component } from "react";
import moment from "moment";
import Sample from "../services/sampleService";
import _ from "lodash";
import { getLab } from "./../services/labService";
import {
  Card,
  Row,
  Col,
  message,
  Table,
  Spin,
  Button,
  Radio,
  DatePicker
} from "antd";

const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";
const listDateFormat = "YYYY-MM-DD hh:mm";
const currentTime = moment();
const tomorrow = moment().add(1, "days");

class SampleReport extends Component {
  state = {
    data: [],
    loading: false,
    selectedRowKeys: [],
    labs: [],
    selectedLab: "",
    dateRange: [
      moment().format(dateFormat),
      moment()
        .add(1, "days")
        .format(dateFormat)
    ],
    sortedInfo: null,
    filteredInfo: null,
    submitUserList: [],
    verifyUserList: [],
    ppvUserList: [],
    prefixList: []
  };

  async componentDidMount() {
    try {
      const { data: labs } = await getLab();
      const selectedLab = labs[0].id;
      this.setState({ labs, selectedLab });
    } catch (ex) {
      message.error(ex, 5);
    }
  }

  handleSampleList = async () => {
    const { selectedLab, dateRange } = this.state;
    const queryString = `?startdate=${dateRange[0]}&enddate=${
      dateRange[1]
    }&lab=${selectedLab}`;
    this.setState({ loading: true });
    try {
      const { data } = await Sample.querySample(queryString);
      this.setData(data);
      this.setState({ loading: false });
    } catch (ex) {
      if ((ex.response && ex.response.status === 404) || 400)
        message.error(ex.response.data, 3);
      this.setState({ loading: false });
    }
  };

  handleDateChange = (field, value) => {
    this.setState({ dateRange: value });
  };

  handleRadioChange = ({ target }) => {
    this.setState({ selectedLab: target.value });
  };

  setData = data => {
    let setData = [];
    let submitUserList = [];
    let verifyUserList = [];
    let ppvUserList = [];
    let prefixList = [];
    for (let i = 0; i < data.length; i++) {
      let submitUser = "";
      let verifyUser = "";
      let ppvUser = "";
      let prefix = "";
      data[i].submit_user !== null
        ? (submitUser = data[i].submit_user.name)
        : (submitUser = " ");
      data[i].verify_user !== null
        ? (verifyUser = data[i].verify_user.name)
        : (verifyUser = " ");
      data[i].ppv_user !== null
        ? (ppvUser = data[i].ppv_user.name)
        : (ppvUser = " ");

      // GET THE FIRST 3 DIGITS OF THE LABNO AS THE PREFIX
      prefix = data[i].labno.substring(0, 3);

      submitUserList.push(submitUser);
      verifyUserList.push(verifyUser);
      ppvUserList.push(ppvUser);
      prefixList.push(prefix);

      let sample = {
        labno: data[i].labno,
        submitUser: submitUser,
        verifyUser: verifyUser,
        ppvUser: ppvUser,
        updated: moment(data[i].updated_at).format(listDateFormat)
      };
      setData.push(sample);
    }

    // GET THE UNIQUE VALUES ONLY
    submitUserList = _.union(submitUserList);
    verifyUserList = _.union(verifyUserList);
    ppvUserList = _.union(ppvUserList);
    prefixList = _.union(prefixList);

    this.setState({
      data: setData,
      submitUserList,
      verifyUserList,
      ppvUserList,
      prefixList,
      filteredInfo: null,
      sortedInfo: null
    });
  };

  handleTableChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter
    });
  };

  handleClearAll = () => {
    this.setState({
      filteredInfo: null,
      sortedInfo: null
    });
  };

  createFilterList = list => {
    let filter = [];
    for (let i = 0; i < list.length; i++) {
      let item = {
        text: list[i] === " " ? "Blank" : list[i],
        value: list[i]
      };
      filter.push(item);
    }

    return filter;
  };

  render() {
    const {
      data,
      loading,
      labs,
      submitUserList,
      verifyUserList,
      ppvUserList,
      prefixList
    } = this.state;
    let { sortedInfo, filteredInfo } = this.state;
    // const rowSelection = {
    //   selectedRowKeys,
    //   onChange: this.handleSelectChange
    // };
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const submitFilter = this.createFilterList(submitUserList);
    const verifyFilter = this.createFilterList(verifyUserList);
    const ppvFilter = this.createFilterList(ppvUserList);
    const prefixFilter = this.createFilterList(prefixList);
    const columns = [
      {
        title: "Lab Number",
        dataIndex: "labno",
        key: "labno",
        filters: prefixFilter,
        filteredValue: filteredInfo.labno || null,
        onFilter: (value, record) => record.labno.includes(value)
      },
      {
        title: "Submitted By",
        dataIndex: "submitUser",
        key: "submitUser",
        filters: submitFilter,
        filteredValue: filteredInfo.submitUser || null,
        onFilter: (value, record) => record.submitUser === value,
        sorter: (a, b) => a.submitUser.length - b.submitUser.length,
        sortOrder: sortedInfo.columnKey === "submitUser" && sortedInfo.order
      },
      {
        title: "Verified By",
        dataIndex: "verifyUser",
        key: "verifyUser",
        filters: verifyFilter,
        filteredValue: filteredInfo.verifyUser || null,
        onFilter: (value, record) => record.verifyUser === value,
        sorter: (a, b) => a.verifyUser.length - b.verifyUser.length,
        sortOrder: sortedInfo.columnKey === "verifyUser" && sortedInfo.order
      },
      {
        title: "PPV By",
        dataIndex: "ppvUser",
        key: "ppvUser",
        filters: ppvFilter,
        filteredValue: filteredInfo.ppvUser || null,
        onFilter: (value, record) => record.ppvUser === value,
        sorter: (a, b) => a.ppvUser.length - b.ppvUser.length,
        sortOrder: sortedInfo.columnKey === "ppvUser" && sortedInfo.order
      },
      { title: "Updated On", dataIndex: "updated", key: "updated" }
    ];

    return (
      <Row type="flex" justify="space-around" align="middle">
        <Col sm={24} lg={8}>
          <Card
            title={
              <Row type="flex" justify="space-around" align="middle">
                <Col sm={12} lg={12} align="left">
                  Sample List
                </Col>
                {labs.length !== 0 && (
                  <Col sm={12} lg={12} align="right">
                    <Radio.Group defaultValue={labs[0].id} buttonStyle="solid">
                      {labs.map(l => (
                        <Radio.Button
                          key={l.id}
                          value={l.id}
                          text={l.name}
                          onChange={this.handleRadioChange}
                        >
                          {l.name}
                        </Radio.Button>
                      ))}
                    </Radio.Group>
                  </Col>
                )}
              </Row>
            }
          >
            <Row type="flex" justify="space-around" align="middle">
              <Col sm={12} lg={12} align="left">
                <RangePicker
                  defaultValue={[
                    moment(currentTime, dateFormat),
                    moment(tomorrow, dateFormat)
                  ]}
                  format={dateFormat}
                  onChange={this.handleDateChange}
                />
              </Col>
              <Col sm={12} lg={12} align="right">
                <Button type="primary" onClick={this.handleSampleList}>
                  Search
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col sm={24} lg={24} align="middle" style={{ padding: "25px" }}>
          <Spin spinning={loading} />
        </Col>

        {data.length !== 0 && (
          <Col sm={24} lg={24} align="middle" style={{ padding: "25px" }}>
            <Row type="flex" justify="space-around" align="middle">
              <Col sm={6} lg={6} align="right" style={{ padding: "10px" }}>
                <Button type="danger" onClick={this.handleClearAll}>
                  Clear Filters
                </Button>
              </Col>
            </Row>
            <Table
              //rowSelection={rowSelection}
              rowKey={data => data.labno}
              dataSource={data}
              columns={columns}
              size="small"
              onChange={this.handleTableChange}
            />
          </Col>
        )}
      </Row>
    );
  }
}

export default SampleReport;
