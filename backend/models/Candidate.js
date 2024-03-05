const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobileNo: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  workExperience: { type: String, required: true },
  resumeTitle: { type: String, required: true },
  currentLocation: { type: String, required: true },
  postalAddress: { type: String, required: true },
  currentEmployer: { type: String, required: true },
  currentDesignation: { type: String, required: true },
});

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;
