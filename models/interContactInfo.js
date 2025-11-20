const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const interContactSchema = new Schema(
  {
    address: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    phone: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    email: {
      type: String,
      required: true, // or false if optional
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("interContactSchema", interContactSchema);
