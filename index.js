const express = require("express");
const app = express();
const db = require("./models/index");
const cors = require("cors");
const path = require("path");
const login = require("./routes/loginRoute");
const user = require("./routes/userRoute");
const sample = require("./routes/sampleRoute");
const role = require("./routes/roleRoute");
const lab = require("./routes/labRoute");
const transparency = require("./routes/transparencyRoute");
const tubeColor = require("./routes/tubeColorRoute");
const type = require("./routes/typeRoute");
const specimen = require("./routes/specimenRoute");
const visualInspect = require("./routes/visualInspectRoute");
const sampleColor = require("./routes/sampleColorRoute");
require("dotenv").config();

const PORT = process.env.PORT || 8080;

const requiredVariables = ["JWT_PRIVATEKEY"];
requiredVariables.forEach(key => {
  if (typeof process.env[key] === "undefined") {
    console.error(`FATAL ERROR: ${key} is not defined`);
    process.exit(1);
  }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
}
app.use("/api/user", user);
app.use("/api/sample", sample);
app.use("/api/role", role);
app.use("/api/lab", lab);
app.use("/api/transparency", transparency);
app.use("/api/tubecolor", tubeColor);
app.use("/api/type", type);
app.use("/api/specimen", specimen);
app.use("/api/visualinspect", visualInspect);
app.use("/api/samplecolor", sampleColor);
app.use("/login", login);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

// use { force: true } argument in sync to drop all tables
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});
