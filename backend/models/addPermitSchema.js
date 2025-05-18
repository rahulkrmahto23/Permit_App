const mongoose = require("mongoose");

const permitSchema = new mongoose.Schema({
  permitNumber: {
    type: String,
    required: true,
    unique: true,
  },
  poNumber: {
    type: String,
    required: true,
  },
  employeeName: {
    type: String,
    required: true,
  },
  permitType: {
    type: String,
    required: true,
    enum: [
      "General",
      "Height",
      "Confined",
      "Excavation",
      "Civil",
      "Hot",
    ],
  },
  permitStatus: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Approved", "Rejected", "Closed"],
  },
  location: {
    type: String,
    required: true,
  },
  remarks: {
    type: String,
  },
  issueDate: {
    type: Date,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Permit", permitSchema);
