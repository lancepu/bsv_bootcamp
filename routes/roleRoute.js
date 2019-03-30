const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/all", async (req, res) => {
  const roles = await db.Role.findAll();
  res.send(roles);
});

module.exports = router;
