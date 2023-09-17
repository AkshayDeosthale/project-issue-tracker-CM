const express = require("express");
const router = express.Router();
const ProjectController = require("../controller/project.controller");

// Form to create a new project
router.get("/new", ProjectController.createProject);

//get single project details
router.get("/:id", ProjectController.getProjectDetails);

//delete project
router.get("/delete/:id", ProjectController.deleteProject);

// Handle creating a new project
router.post("/new", ProjectController.addProject);

module.exports = router;
