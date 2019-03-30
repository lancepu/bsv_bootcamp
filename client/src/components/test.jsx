import React, { Component } from "react";
import { generateZebraTemplate } from "./../utils/generateZebraTemplate";
import { message } from "antd";

const browserPrintNotFound =
  "An error occured while attempting to connect to your Zebra Printer. You may not have Zebra Browser Print installed, or it may not be running. Install Zebra Browser Print, or start the Zebra Browser Print Service, and try again.";

class Test extends Component {
  state = {
    selectedPrinter: null,
    printerList: null
  };

  componentDidMount() {
    this.initializePrinter();
  }

  initializePrinter = () => {
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
            } else {
              message.error("No Zebra printers found");
            }
          },
          undefined,
          "printer"
        );
      },
      () => message.error(browserPrintNotFound, 5)
    );
  };

  handlePrint = () => {
    const { printerList, selectedPrinter } = this.state;
    console.log(printerList);
    const mystuff = [
      {
        labno: "test",
        firstName: "testFN",
        lastName: "testLN",
        received: "12312",
        dob: "121121",
        quantity: 1
      }
    ];
    // GENERATE THE ZEBRA CODES FOR EACH OBJECT IN THE ARRAY AND STORE THEM INTO A NEW ARRAY
    const data = mystuff.map(d => generateZebraTemplate(d));
    console.log(data);
    // LOOP THROUGH THE DATA ARRAY TO PRINT OUT EACH LABELS

    data.forEach(d =>
      selectedPrinter.send(d, this.printComplete, this.printError)
    );
  };

  printComplete = () => {
    console.log("success");
  };

  printError = text => {
    console.log(text);
  };

  render() {
    return (
      <div>
        <button onClick={this.handleClick}>test</button>;
        <button onClick={this.handlePrint}>Print</button>;
      </div>
    );
  }
}

export default Test;
