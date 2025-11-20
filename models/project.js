const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema(
  {
    title: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    description: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    image: {
      type: String,
      required: true, // or false if optional
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
