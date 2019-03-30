const express = require("express");
const router = express.Router();
require("dotenv").config();
const axios = require("axios");
const https = require("https");
const db = require("../models");
const _ = require("lodash");
const auth = require("../middleware/auth");
const tech = require("../middleware/tech");
// const writeCSV = require("../utils/csv");
const csv = require("fast-csv");
// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GOOGLE_CLOUD_PROJECT environment variable. See
// https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/docs/authentication.md
// These environment variables are set automatically on Google App Engine
const { Storage } = require("@google-cloud/storage");

// Instantiate a storage client
const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

//FOR CALLING EXTERNAL API
const agent = new https.Agent({
  rejectUnauthorized: false
});

router.post("/printcsv", async (req, res) => {
  // Creates a blob(object/file) with a given name
  const blob = bucket.file(req.body.fileName);
  // Starts a writable stream for the file
  const blobStream = blob.createWriteStream({ resumable: false });
  // use fast-csv writeToStream function to write to the writable stream
  csv.writeToStream(blobStream, req.body.data, { headers: true });
  blobStream.on("error", () => {
    res.status(500).send("Error occured, please contact Administrator");
  });
  blobStream.on("finish", () => {
    blobStream.end();
    res
      .status(200)
      .send(
        "Print request successfully queued, please allow some time for the labels to print out"
      );
  });
});

router.get("/:labno", auth, async (req, res) => {
  req.params.labno = req.params.labno.toUpperCase();
  const sample = await db.Sample.findOne({
    where: { labno: req.params.labno },
    include: [
      {
        model: db.User,
        as: "submit_user",
        attributes: ["id", "name"]
      },
      {
        model: db.User,
        as: "verify_user",
        attributes: ["id", "name"]
      },
      {
        model: db.User,
        as: "ppv_user",
        attributes: ["id", "name"]
      },

      db.Sample_Color,
      db.Specimen,
      db.Transparency,
      db.Tube_Color,
      db.Type,
      db.Visual_Inspect
    ]
  });
  if (!sample) return res.status(404).send("Sample Not Found");

  res.json(sample);
});

router.get("/", auth, async (req, res) => {
  let startDate = req.query.startdate;
  let endDate = req.query.enddate;
  let lab = req.query.lab;
  const sample = await db.Sample.findAll({
    where: {
      updated_at: { $between: [startDate, endDate] },
      lab_id: lab
    },
    include: [
      {
        model: db.User,
        as: "submit_user",
        attributes: ["id", "name"]
      },
      {
        model: db.User,
        as: "verify_user",
        attributes: ["id", "name"]
      },
      {
        model: db.User,
        as: "ppv_user",
        attributes: ["id", "name"]
      },

      db.Sample_Color,
      db.Specimen,
      db.Transparency,
      db.Tube_Color,
      db.Type,
      db.Visual_Inspect
    ]
  });
  if (sample.length === 0) return res.status(404).send("No Samples Found");
  res.json(sample);
});

router.post("/", auth, async (req, res) => {
  const { error } = db.Sample.validateSampleSubmit(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // IMPORTANT TO CONVERT INPUT TO UPPERCASE, FOR DUPLICATE LAB NO PURPOSE
  req.body.labno = req.body.labno.toUpperCase();
  let sample = await db.Sample.findOne({ where: { labno: req.body.labno } });
  if (sample) return res.status(400).send("Duplicate Lab Number");

  try {
    sample = await db.Sample.create(_.mapValues(req.body));
    res.status(200).send(sample);
  } catch (ex) {
    res.status(500).send("error", ex);
  }
});

router.put("/verify", [auth, tech], async (req, res) => {
  const { error } = db.Sample.validateSampleVerify(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  req.body.labno = req.body.labno.toUpperCase();
  let sample = await db.Sample.findOne({ where: { labno: req.body.labno } });
  if (!sample)
    return res
      .status(404)
      .send("Sample not found, please submit the samples first");

  try {
    sample = await db.Sample.update(_.mapValues(req.body), {
      returning: true,
      where: { labno: req.body.labno }
    });
    // sequelize update does not return anything meaningful
    res.status(200).end();
  } catch (ex) {
    res.status(500).send("error", ex);
  }
});

router.put("/ppv", [auth, tech], async (req, res) => {
  const { error } = db.Sample.validateSamplePPV(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  req.body.labno = req.body.labno.toUpperCase();
  let sample = await db.Sample.findOne({ where: { labno: req.body.labno } });
  if (!sample)
    return res
      .status(404)
      .send("Sample not found, please submit the samples first");

  try {
    sample = await db.Sample.update(_.mapValues(req.body), {
      returning: true,
      where: { labno: req.body.labno }
    });
    // sequelize update does not return anything meaningful
    res.status(200).end();
  } catch (ex) {
    res.status(500).send("error", ex);
  }
});

router.put("/:id", [auth, tech], async (req, res) => {
  const { error } = db.Sample.validateSample(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let sample = await db.Sample.findOne({ where: { id: req.params.id } });
  if (!sample)
    return res.status(404).send("Sample not found, it might have been removed");

  try {
    sample = await db.Sample.update(_.mapValues(req.body), {
      returning: true,
      where: { id: req.params.id }
    });
    // sequelize update does not return anything meaningful
    res.status(200).end();
  } catch (ex) {
    res.status(500).send("error", ex);
  }
});

router.get("/print/:labno", [auth, tech], async (req, res) => {
  const labno = req.params.labno.toUpperCase();
  const sample = await db.Sample.findOne({ where: { labno: labno } });
  if (!sample)
    return res.status(404).send("Sample not found, it may have been removed");

  try {
    const URL = `${process.env.API_URL}/${labno}`;
    const { data } = await axios.get(URL, {
      auth: {
        username: process.env.API_USERNAME,
        password: process.env.API_PASSWORD
      },
      httpsAgent: agent
    });
    console.log(data);
    const selectData = _.pick(data, [
      "labNo",
      "receiveDate",
      "patient.firstName",
      "patient.lastName",
      "patient.dob"
    ]);
    res.status(200).send(selectData);
  } catch {
    res.status(400).end();
  }
});

module.exports = router;
