const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const chart = require("../controller/chart");

router.get("/api/chart/company", auth, chart.chartDiagram);
router.get("/api/chart/job-seeker", auth, chart.barDiagram);

module.exports = router;
