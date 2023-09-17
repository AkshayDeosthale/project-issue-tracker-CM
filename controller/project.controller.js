const PROJECT = require("../models/Project");
const ISSUE = require("../models/Issue");

module.exports.createProject = async function (req, res) {
  res.render("createProject");
};

module.exports.getProjectDetails = async function (req, res) {
  try {
    const project = await PROJECT.findById(req.params.id).populate("issues");

    res.render("projectDetail", { project });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};

module.exports.deleteProject = async function (req, res) {
  try {
    const project = await PROJECT.findById(req.params.id);
    if (!project) {
      return res.status(404).send("Project not found");
    }

    await project.deleteOne();
    res.redirect("/");
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.addProject = async function (req, res) {
  try {
    const project = new PROJECT({
      name: req.body.name,
      description: req.body.description,
      author: req.body.author,
      issues: [demoIssue._id],
    });
    const demoIssue = new ISSUE({
      title: "You can manage your Issues here.",
      description:
        "Provide a detailed description of the issue or feature request. Include any steps to reproduce if it's a bug, expected versus actual behavior, and any other pertinent details that might help in addressing the issue.",
      labels: ["Label1", "Label2", "E.g.: bug, enhancement, documentation"],
      author: "Akshay Deosthale",
      completed: true,
      project: project._id,
    });
    await demoIssue.save();
    await project.save();
    res.redirect("/");
  } catch (error) {
    console.log(error);
    window.alert("Could not add Project check logs");
  }
};
