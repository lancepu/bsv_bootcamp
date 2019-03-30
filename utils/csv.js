const csv = require("fast-csv");
require("dotenv").config();

// Used for writing a csv file through node backend. file will be created to the specified FilePath.
// DEPRECIATED: CURRENTLY writing file directly to google cloud storage
const writeCSVAsync = (fileName, data) => {
  return new Promise((resolve, reject) => {
    const filePath = process.env.CSV_PATH;
    csv
      .writeToPath(`${filePath}${fileName}`, data, {
        headers: true
      })
      .on("finish", () => {
        resolve("done");
      })
      .on("error", () => reject("Error"));
  });
};

module.exports = writeCSVAsync;
