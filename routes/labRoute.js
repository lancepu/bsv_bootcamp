const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/all", async (req, res) => {
  const labs = await db.Lab.findAll();
  res.send(labs);
});

module.exports = router;
