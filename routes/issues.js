const express = require("express");
const router = express.Router();
const IssueController = require("../controller/issue.controller");

// Form to create a new project
router.post("/new", IssueController.createIssue);

//get single project details
router.post("/:id", IssueController.modifyIssue);

//delete project
router.get("/delete/:id", IssueController.deleteIssue);

// Handle creating a new project
router.post("/toggle-completion/:id", IssueController.toggleIssueCompletion);

module.exports = router;
