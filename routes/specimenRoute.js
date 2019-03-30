const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/all", async (req, res) => {
  const specimen = await db.Specimen.findAll();
  res.send(specimen);
});

module.exports = router;
