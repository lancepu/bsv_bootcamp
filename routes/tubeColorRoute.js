const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/all", async (req, res) => {
  const tubeColor = await db.Tube_Color.findAll();
  res.send(tubeColor);
});

module.exports = router;
