const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const PROJECT = require("./models/Project");
const port = 3000;
require("dotenv").config();

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to parse JSON payloads
app.use(express.json());

// Display all projects
app.get("/", async (req, res) => {
  let projects = await PROJECT.find();
  res.render("home", { projects });
});

app.use("/projects", require("./routes/projects"));
app.use("/issues", require("./routes/issues"));

async function DBCONNECT() {
  return mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

app.listen(port, async () => {
  try {
    await DBCONNECT();
    console.log("Connected To MongoDB");
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  } catch (error) {
    console.log("Error connecting to MongoDB");
    return;
  }
});
