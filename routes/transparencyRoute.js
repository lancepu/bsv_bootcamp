const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/all", async (req, res) => {
  const transparency = await db.Transparency.findAll();
  res.send(transparency);
});

module.exports = router;
