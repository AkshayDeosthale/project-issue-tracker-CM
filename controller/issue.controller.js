const PROJECT = require("../models/Project");
const ISSUE = require("../models/Issue");

module.exports.getAllIssues = async function (req, res) {
  let searchCriteria = {};
  // Always filter by project ID (assuming it's provided in every request)
  searchCriteria.project = req.body.project;
  if (req.body.author) {
    searchCriteria.author = req.body.author;
  }

  if (req.body.titleDescription) {
    searchCriteria.$or = [
      { title: new RegExp(req.body.titleDescription, "i") },
      { description: new RegExp(req.body.titleDescription, "i") },
    ];
  }

  const issues = await ISSUE.find(searchCriteria);

  const project = await PROJECT.findById(req.body.project).populate("issues");
  if (issues) {
    project.issues = issues;
  }

  res.render("projectDetail", { project });
};

module.exports.createIssue = async function (req, res) {
  try {
    req.body.completed = false;
    req.body.labels = req.body.labels.split(",");

    const issue = new ISSUE(req.body);
    await issue.save();

    // Directly push the new issue's ID to the project's issues array
    await PROJECT.findOneAndUpdate(
      { _id: req.body.project },
      { $push: { issues: issue._id } }
    );
  } catch (error) {
    console.log(error);
  }

  res.redirect(`/projects/${req.body.project}`);
};

module.exports.modifyIssue = async function (req, res) {
  try {
    const issue = await ISSUE.findByIdAndUpdate(req.params.id, req.body);
  } catch (error) {
    console.log(error);
  }
  res.redirect(`/projects/${req.body.project}`);
};

module.exports.deleteIssue = async function (req, res) {
  try {
    // First, find the issue you want to delete
    const issue = await ISSUE.findById(req.params.id);
    if (!issue) {
      return res.status(404).send("Issue not found");
    }

    // Next, update the associated project to remove the issue reference
    await PROJECT.updateOne(
      { _id: issue.project },
      { $pull: { issues: issue._id } }
    );

    // Then, delete the issue itself
    await issue.deleteOne();

    res.redirect(`/projects/${issue.project}`);
  } catch (error) {
    console.error("Error deleting issue:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.toggleIssueCompletion = async function (req, res) {
  try {
    const issue = await ISSUE.findByIdAndUpdate(req.params.id, {
      $set: { completed: req.body.completed },
    });

    if (!issue) {
      return res.status(404).send("Issue not found");
    }
  } catch (error) {
    console.error("Error deleting project:", error);
  }
  res.redirect(`/projects/${req.body.project}`);
};
