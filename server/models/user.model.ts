import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  emai: { type: String, required: true, unique: true, trim: true },
  phone: { type: String, required: true, unique: true, trim: true },
  linkedin: { type: String, trim: true },
  higherEducation: { type: String, trim: true },
  college: { type: String, trim: true },
  jobRole: { type: String, trim: true },
  company: { type: String, trim: true },
  experience: { type: Number, min: 0 }, // Assuming experience is in years
  achievements: { type: String, trim: true },
  skills: { type: [String], default: [] }, // Array of skills
  project: { type: [String], default: [] }, // Array of project names or descriptions
  goals: { type: String, trim: true },
}, { timestamps: true }); // Adds createdAt and updatedAt fields

const userModel = mongoose.model("User", UserSchema);

export default userModel;
