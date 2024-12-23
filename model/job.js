const mongoose = require("mongoose");

const schema = mongoose.Schema;
const ObjectId = schema.ObjectId;

const jobSchema = new schema({
  title: {
    type: String,
    required: true,
  },
  job_type: {
    type: String,
    required: true,
    set: function (value) {
      return value.toLowerCase();
    },
    enum: ["full-time", "part-time"],
  },
  type: {
    type: String,
    required: true,
    set: function (value) {
      return value.toLowerCase();
    },
    enum: ["top", "hot", "featured", "normal"],
  },
  // offered_salary: {
  //   type: Number,
  //   required: true,
  // },
  job_level: {
    type: String,
    required: true,
    set: function (value) {
      return value.toLowerCase();
    },
    enum: ["fresher", "junior", "mid", "senior"],
  },
  website_link: {
    type: String,
    required: true,
  },

  deadline_date: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  tags: {
    type: Array,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "bank-finance",
      "ngo-ingo",
      "sales-marketing",
      "government",
      "army-police",
      "cooperative",
      "school-college",
      "healthcare",
      "hotel-restaurant",
      "customer_care",
      "it-computer",
      "logistics-supply_chain",
    ],
  },
  createdBy: {
    ref: "users",
    type: ObjectId,
  },
  creatorPic: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
});

const jobModel = mongoose.model("jobs", jobSchema);
module.exports = jobModel;
