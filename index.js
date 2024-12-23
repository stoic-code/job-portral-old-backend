const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const handleError = require("./middleware/handleError");

const jobRoutes = require("./routes/jobRoute");
const chartRoutes = require("./routes/chartRoute");
const userRoutes = require("./routes/userRoute");
const authRoutes = require("./routes/authRoute");
const { getJob } = require("./controller/job");
const dotenv = require("dotenv");

dotenv.config();

app.use(cors());

mongoose
  .connect(process.env.MONGOODB_CONNECT_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to db"))
  .catch((err) => console.log(err));
// mongoose
//   .connect("mongodb://127.0.0.1:27017/jobholic", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("connected to db"))
//   .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.json({ msg: "hello friends im here hai" });
});

// app.get("/jobs", getJob);
app.use(express.json());

app.use(jobRoutes);
app.use(chartRoutes);
app.use(userRoutes);
app.use(authRoutes);
app.use(express.static("public")); // it will allow any device to use public folder publicly

app.use((req, res) => {
  res.status(404).send({ msg: "resource/page nottttt found" });
});
app.use(handleError);

app.listen(process.env.PORT || 8008, () => {
  console.log("listening to port 8008");
});
