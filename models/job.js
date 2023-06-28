const mongoose = require("mongoose");

const jobSchema = mongoose.Schema({
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    title: String,
    description: String,
    requirement: String,
    location: String,
    payment_method: {
      type: String,
      enum: ["fixed", "hourly", "commission-based", "monthly"],
    },
    payment_amount: String,
    vacancies: Number,
    cateory: {
      type: String,
      enum: [
        "computer science and software",
        "accounting and financing",
        "health care",
        "tutoring and mentorship",
        "media and communication",
        "office management",
        "event organization",
        "other",
      ],
    },
    company_name: {
      type: String,
    },
    status: {
      type: String,
      enum: ["open", "closed"],
    },
    contact_info: {
      type: String,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
});

module.exports = mongoose.model("Job", jobSchema);
