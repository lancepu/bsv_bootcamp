import React, { Component } from "react";
import moment from "moment";
import Sample from "../services/sampleService";
import _ from "lodash";
import { generateZebraTemplate } from "./../utils/generateZebraTemplate";
import { getLab } from "./../services/labService";
import {
  Card,
  Row,
  Col,
  message,
  Input,
  Table,
  Spin,
  Button,
  Modal,
  Select,
  Radio
} from "antd";

const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const browserPrintNotFound =
  "An error occured while attempting to connect to your Zebra Printer. You may not have Zebra Browser Print installed, or it may not be running. Install Zebra Browser Print, or start the Zebra Browser Print Service, and try again.";

class SamplePrint extends Component {
  state = {
    data: [],
    searchQuery: "",
    loading: false,
    selectedRowKeys: [],
    selectedPrinter: null,
    printerList: null,
    modalVisible: false,
    zebraPrintQuantity: "2",
    labs: [],
    selectedLab: ""
  };

  columns = [
    { title: "Lab Number", dataIndex: "labno", key: "labno" },
    { title: "First Name", dataIndex: "firstName", key: "firstName" },
    { title: "Last Name", dataIndex: "lastName", key: "lastName" },
    { title: "DOB", dataIndex: "dob", key: "dob" },
    { title: "Received", dataIndex: "received", key: "received" }
  ];

  async componentDidMount() {
    try {
      await this.initializePrinter();
      const { data: labs } = await getLab();
      const selectedLab = labs[0].name;
      this.setState({ labs, selectedLab });
    } catch (ex) {
      message.error(ex, 5);
    }
  }

  initializePrinter = () => {
    return new Promise((resolve, reject) => {
      window.BrowserPrint.getDefaultDevice(
        "printer",
        printer => {
          if (printer && printer.connection) {
            this.setState({ selectedPrinter: printer });
          }
          window.BrowserPrint.getLocalDevices(
            printers => {
              if (printers !== undefined) {
                this.setState({ printerList: printers });
                resolve();
              } else {
                reject("No Zebra printers found");
              }
            },
            undefined,
            "printer"
          );
        },
        () => reject(browserPrintNotFound)
      );
    });
  };

  printComplete = () => {
    message.success("Labels printed successfully");
  };

  printError = () => {
    message.error(
      "Error occured, please make sure you selected a correct functional Zebra printer and Browser Print is running",
      5
    );
  };

  delay = () => {
    return new Promise(resolve => setTimeout(resolve, 100));
  };

  handleZebraPrint = async () => {
    const {
      selectedPrinter,
      data,
      zebraPrintQuantity,
      selectedLab
    } = this.state;
    // GENERATE THE ZEBRA CODES FOR EACH OBJECT IN THE ARRAY AND STORE THEM INTO A NEW ARRAY
    const zebraData = data.map(d =>
      generateZebraTemplate(d, zebraPrintQuantity, selectedLab)
    );

    // HAVE TO USE THE FOR LOOP FOR ITEMS TO RUN IN SEQUENCE
    for (const data of zebraData) {
      // INTRODUCE A SLIGHT DELAY BETWEEN EACH PRINT FOR THE PRINTER TO PRINT IN SEQUENCE OF THE SCAN
      await this.delay();
      selectedPrinter.send(data, this.printComplete, this.printError);
    }
  };

  handleZebraPrintQuantityChange = ({ target }) => {
    this.setState({ zebraPrintQuantity: target.value });
  };

  handleZebraModal = () => {
    this.setState({ modalVisible: true });
  };

  handleModalCancel = () => {
    this.setState({
      modalVisible: false
    });
  };

  handleDelete = () => {
    const { data, selectedRowKeys } = this.state;
    const filteredData = data.filter(
      d => selectedRowKeys.indexOf(d.labno) === -1
    );
    this.setState({ data: filteredData, selectedRowKeys: [] });
  };

  handleSelectChange = selected => {
    this.setState({ selectedRowKeys: selected });
  };

  handlePrinterSelectChange = selected => {
    // Get the full information of the printer from the printerList
    const selectedPrinter = this.state.printerList.filter(
      p => p.uid === selected
    );
    // Set the selectedPrinter to the new printer
    this.setState({ selectedPrinter: selectedPrinter[0] });
  };

  handleSearchBarChange = ({ currentTarget }) => {
    this.setState({ searchQuery: currentTarget.value });
  };

  setData = data => {
    const setData = {
      labno: data.labNo,
      firstName: data.hasOwnProperty("patient") ? data.patient.firstName : "",
      lastName: data.hasOwnProperty("patient") ? data.patient.lastName : "",
      dob: data.hasOwnProperty("patient") ? data.patient.dob : "",
      received: data.hasOwnProperty("receiveDate") ? data.receiveDate : "",
      quantity: 2
    };
    this.setState({
      // concats the new data into the data array
      data: [...this.state.data, setData]
    });
  };

  handleSearch = async ({ key, currentTarget }) => {
    if (key === "Enter") {
      const obj = { labno: currentTarget.value.toUpperCase() };
      if (_.some(this.state.data, { labno: obj.labno })) {
        this.setState({ searchQuery: "" });
        return message.error("Sample alredy scanned");
      }
      try {
        this.setState({ loading: true });
        const { data } = await Sample.printSample(obj.labno);
        this.setData(data);
        this.setState({ searchQuery: "", loading: false });
      } catch (ex) {
        //don't add if sample is not in BSV database
        if (ex.response && ex.response.status === 404) {
          message.error(ex.response.data, 3);
        } else if (ex.response && ex.response.status === 400) {
          // this is for if there's trouble connecting to the API to get data, store the lab number as data
          this.setData({ labNo: obj.labno });
        }
        this.setState({ searchQuery: "", loading: false });
      }
    }
  };

  handleBradyPrint = async () => {
    this.setState({ loading: true });
    const filename = `SamplePrint_${moment().format("YYYYMMDDhhmmss")}.csv`;
    const data = [...this.state.data];
    const printData = data.map(d =>
      _.pick(d, ["labno", "firstName", "lastName", "quantity"])
    );
    try {
      const response = await Sample.printCSV(filename, printData);
      message.success(response.data);
      this.setState({ loading: false });
    } catch {
      message.error("error");
      this.setState({ loading: false });
    }
  };

  handleRetryZebraConnection = async () => {
    this.setState({ loading: true });
    try {
      await this.initializePrinter();
      this.setState({ loading: false });
    } catch (ex) {
      message.error(ex, 5);
      this.setState({ loading: false });
    }
  };

  handleRadioChange = ({ target }) => {
    this.setState({ selectedLab: target.text });
  };

  render() {
    const {
      searchQuery,
      data,
      loading,
      selectedRowKeys,
      modalVisible,
      selectedPrinter,
      printerList,
      zebraPrintQuantity,
      labs
    } = this.state;
    const rowSelection = { selectedRowKeys, onChange: this.handleSelectChange };
    const hasSelected = selectedRowKeys.length > 0;

    return (
      <Row type="flex" justify="space-around" align="middle">
        <Modal
          title={
            <Row type="flex" justify="space-around" align="middle">
              <Col sm={12} lg={12} align="left">
                Zebra Label
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
          visible={modalVisible}
          onOk={this.handleZebraPrint}
          okText="Print"
          onCancel={this.handleModalCancel}
          closable={false}
        >
          {selectedPrinter && printerList && (
            <Row type="flex" justify="space-around" align="middle">
              <Col sm={24} lg={24} align="middle" style={{ padding: "10px" }}>
                <RadioGroup
                  defaultValue={zebraPrintQuantity}
                  size="medium"
                  buttonStyle="solid"
                  onChange={this.handleZebraPrintQuantityChange}
                >
                  {["1", "2", "3", "4", "5"].map(e => (
                    <RadioButton key={e} value={e}>
                      {e}
                    </RadioButton>
                  ))}
                </RadioGroup>
              </Col>
              <Col sm={24} lg={24} align="middle" style={{ padding: "10px" }}>
                <Select
                  defaultValue={selectedPrinter.name}
                  style={{ width: 200 }}
                  onChange={this.handlePrinterSelectChange}
                >
                  {printerList.map(p => (
                    <Option key={p.uid} value={p.uid}>
                      {p.name}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>
          )}
        </Modal>

        <Col sm={24} lg={8}>
          <Card title="Print Sample">
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

        {data.length !== 0 && (
          <Col sm={24} lg={24} align="middle" style={{ padding: "25px" }}>
            <Row type="flex" justify="space-around" align="middle">
              <Col sm={6} lg={6} align="middle" style={{ padding: "10px" }}>
                {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
              </Col>
              <Col sm={6} lg={6} align="middle" style={{ padding: "10px" }}>
                <Button
                  type="danger"
                  onClick={this.handleDelete}
                  disabled={!hasSelected}
                >
                  Delete Selected
                </Button>
              </Col>
              <Col sm={6} lg={6} align="middle" style={{ padding: "10px" }}>
                <Button type="primary" onClick={this.handleBradyPrint}>
                  Print Brady Label
                </Button>
              </Col>
              <Col sm={6} lg={6} align="middle" style={{ padding: "10px" }}>
                {printerList ? (
                  <Button type="primary" onClick={this.handleZebraModal}>
                    Print Zebra Label
                  </Button>
                ) : (
                  <Button
                    type="danger"
                    onClick={this.handleRetryZebraConnection}
                  >
                    Retry Zebra Connection
                  </Button>
                )}
              </Col>
            </Row>
            <Table
              rowSelection={rowSelection}
              rowKey={data => data.labno}
              dataSource={data}
              columns={this.columns}
              size="small"
            />
          </Col>
        )}
      </Row>
    );
  }
}

export default SamplePrint;
