const express = require("express");
const verifyToken = require("../middlewares/authentication");

const {
  createJobController,
  deleteJobController,
  getAllJobsController,
  jobStatsController,
  updateJobController,
} = require("../controller/jobs");

const jobRouter = express.Router();

jobRouter.post("/create-job", verifyToken, createJobController);
jobRouter.get("/get-job", verifyToken, getAllJobsController);
jobRouter.put("/update-job/:id", verifyToken, updateJobController);
jobRouter.delete("/delete-job/:id", verifyToken, deleteJobController);
jobRouter.get("/job-stats", verifyToken, jobStatsController);

module.exports = jobRouter;
