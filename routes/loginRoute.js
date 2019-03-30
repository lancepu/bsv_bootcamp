const express = require("express");
const router = express.Router();
const db = require("../models");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
require("dotenv").config();

router.post("/", async (req, res) => {
  const { error } = db.User.validateLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // IF USER DOES NOT EXISTS, TELL 400 INSTEAD OF 404 IN THIS CASE, BECAUSE YOU DON'T WANT TO LET THE END USER KNOW WHY
  const user = await db.User.findOne({
    where: { email: req.body.email },
    include: [db.Role]
  });
  if (!user) return res.status(400).send("Invalid email or password");

  const validPassword = await bcryptjs.compare(
    req.body.password,
    user.password
  );
  if (!validPassword) return res.status(400).send("Invalid email or password");
  if (!user.enabled) return res.status(401).send("Account Disabled");

  // _.pick properties in an object
  // {ID: USER.ID, NAME: USER.NAME, ROLE.NAME: USER.ROLE.NAME}
  const token = jwt.sign(
    _.pick(user, [
      "id",
      "name",
      "enabled",
      "password_change_date",
      "Role.name"
    ]),
    process.env.JWT_PRIVATEKEY
  );

  res
    // SEND THE TOKEN IN A CUSTOM HTTP RESPONSE HEADER
    .header("x-auth-token", token)
    // EXPOSE THE CUSTOM HTTP RESPONSE HEADER FOR CLIENT TO ACCESS AND STORE IN COOKIE
    .header("Acccess-Control-Expose-Headers", "x-auth-token")
    .send(token);
});

module.exports = router;
