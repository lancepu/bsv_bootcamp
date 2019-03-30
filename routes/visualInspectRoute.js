const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/all", async (req, res) => {
  const visualInspect = await db.Visual_Inspect.findAll();
  res.send(visualInspect);
});

module.exports = router;
