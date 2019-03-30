const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/all", async (req, res) => {
  const sampleColor = await db.Sample_Color.findAll();
  res.send(sampleColor);
});

module.exports = router;
