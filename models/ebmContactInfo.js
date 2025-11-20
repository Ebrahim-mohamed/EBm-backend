const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema(
  {
    address: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    phone: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    email: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactInfo", contactSchema);
