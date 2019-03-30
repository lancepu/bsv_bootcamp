const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/all", async (req, res) => {
  const type = await db.Type.findAll();
  res.send(type);
});

module.exports = router;
