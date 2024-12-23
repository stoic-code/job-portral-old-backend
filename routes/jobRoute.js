const express = require("express");
const auth = require("../middleware/auth");
const apply = require("../controller/apply");
const { isJobSeeker } = require("../middleware/role");

const {
  getJob,
  createJob,
  deleteJob,
  editjob,
  getJobById,
  getHotJob,
} = require("../controller/job");
const router = express.Router();

router.get("/api/jobs", getJob);
router.get("/api/jobs/:id", getJobById);
router.post("/api/jobs", auth, createJob);
router.delete("/api/jobs/delete/:id", auth, deleteJob);
router.put("/api/jobs/edit/:id", auth, editjob);
//get hot jobs
router.get("/api/hotJob", getHotJob);
//apply job
router.post("/api/apply", auth, isJobSeeker, apply);

module.exports = router;
