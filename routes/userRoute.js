const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const _ = require("lodash");
const db = require("../models");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/all", [auth, admin], async (req, res) => {
  //QUERY DATABASE FOR ALL USERS, RETURN ALL DATA EXCEPT PASSWORD
  const user = await db.User.findAll({ include: [db.Role] }).map(user =>
    _.omit(user.dataValues, ["password"])
  );
  res.json(user);
});

router.put("/updatePassword/:id", [auth, admin], async (req, res) => {
  const { error } = db.User.validateAdminPasswordChange(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // MAKE SURE USER IS IN DATABASE
  const user = await db.User.findOne({ where: { id: req.params.id } });
  if (!user)
    return res.status(404).send("User not found, it may have been removed");

  // UPDATE THE password_change_date field to null to prompt user to change their password on next login
  try {
    req.body.newPassword = await bcryptjs.hash(req.body.newPassword, 10);
    await db.User.update(
      {
        password: req.body.newPassword,
        password_change_date: null
      },
      {
        returning: true,
        where: { id: user.id }
      }
    );
    res.send("Password change request submitted successfully");
  } catch (ex) {
    res.status(500).send("error", ex);
  }
});

router.put("/updatePassword", [auth], async (req, res) => {
  const { error } = db.User.validatePasswordChange(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // GET THE USER FROM THE JSON WEB TOKEN
  let user = req.user;

  // MAKE SURE USER IS IN DATABASE
  user = await db.User.findOne({ where: { id: user.id } });
  if (!user)
    return res.status(404).send("User not found, it may have been removed");

  // MAKE SURE THE PASSWORD SUPPLIED MATCHES EXISTING PASSWORD FIRST
  const validPassword = await bcryptjs.compare(
    req.body.password,
    user.password
  );
  if (!validPassword) return res.status(400).send("Invalid email or password");

  // UPDATE THE PASSWORD FOR THE USER AND SEND A NEW TOKEN
  try {
    req.body.newPassword = await bcryptjs.hash(req.body.newPassword, 10);
    user = await db.User.update(
      {
        password: req.body.newPassword,
        password_change_date: db.Sequelize.fn("NOW")
      },
      {
        returning: true,
        where: { id: user.id }
      }
    );

    user = await db.User.findOne({
      where: { id: req.user.id },
      include: [db.Role]
    });

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
  } catch (ex) {
    res.status(500).send("error", ex);
  }
});

router.put("/updateStatus/:id?", [auth, admin], async (req, res) => {
  // MAKE SURE USER IS IN DATABASE
  const user = await db.User.findOne({ where: { id: req.params.id } });
  if (!user)
    return res.status(404).send("User not found, it may have been removed");

  // Toggle the status change (enabled/disabled)
  try {
    await db.User.update(
      {
        enabled: req.query.enabled
      },
      {
        returning: true,
        where: { id: user.id }
      }
    );
    res.send("Status change request submitted successfully");
  } catch (ex) {
    res.status(500).send("error", ex);
  }
});

router.put("/updateRole/:id", [auth, admin], async (req, res) => {
  // MAKE SURE USER IS IN DATABASE
  const user = await db.User.findOne({ where: { id: req.params.id } });
  if (!user)
    return res.status(404).send("User not found, it may have been removed");

  // Toggle the status change (enabled/disabled)
  try {
    await db.User.update(
      {
        role_id: req.body.role_id
      },
      {
        returning: true,
        where: { id: user.id }
      }
    );
    res.send("Role change request submitted successfully");
  } catch (ex) {
    res.status(500).send("error", ex);
  }
});

router.post("/new", [auth, admin], async (req, res) => {
  //   VALIDATE THE INPUT FROM THE FORM IS VALID BEFORE SENDING TO DB
  const { error } = db.User.validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // CHECK TO MAKE SURE THE EMAIL DOES NOT ALREADY EXIST IN THE DB
  let user = await db.User.findOne({
    where: { email: req.body.email }
  });
  if (user) return res.status(400).send("User already registered.");

  try {
    req.body.password = await bcryptjs.hash(req.body.password, 10);
    await db.User.create(
      _.pick(req.body, ["name", "email", "password", "role_id"])
    );

    // get the new user and role name for creating jwt
    user = await db.User.findOne({
      where: { email: req.body.email },
      include: [db.Role]
    });

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
      .header("x-auth-token", token)
      .header("Acccess-Control-Expose-Headers", "x-auth-token")
      .send(token);
  } catch (ex) {
    res.status(500).send("error");
  }
});

module.exports = router;
