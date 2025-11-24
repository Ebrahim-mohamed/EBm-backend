const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Hash password before saving
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

AdminSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const Admin = mongoose.model("Admin", AdminSchema);

// ----------- AUTO CREATE DEFAULT ADMIN ----------
(async () => {
  try {
    const exists = await Admin.findOne({ username: "ebmadmin" });
    if (!exists) {
      const admin = new Admin({
        username: "ebmadmin",
        password: "x@r}Np7a,ajoo>s%1vJ)", // plain password, will be hashed
      });
      await admin.save();
      console.log("✅ Default admin created");
    } else {
      console.log("ℹ️ Admin already exists");
    }
  } catch (err) {
    console.error("Admin creation error:", err.message);
  }
})();
///////////////////////////////////////////////////

module.exports = Admin;
