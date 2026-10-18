const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

mongoose
// .connect("mongodb+srv://gawilil747_db_user:WhzJVpxUYeNJehUJ@ebm.yymzahb.mongodb.net/")
.connect("mongodb://127.0.0.1:27017/ebmksa")
  .then(() => {
    console.log("connected to local database");
  })
  .catch((error) => {
    console.log("not connected to database", error);
  });
const app = express();

// ✅ Parse JSON bodies
app.use(express.json());

// You can still use URL-encoded if needed
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://72.61.187.71",
      "https://72.61.187.71",
      "http://72.61.187.71:3000",
      "https://72.61.187.71:3000",
      "https://www.ebmksa.com",
      "https://ebmksa.com",
      "https://api.ebmksa.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use("/uploads", express.static("uploads"));
app.use(express.static("public"));
app.use("/projects", require("./routes/projects"));
app.use("/contact-info", require("./routes/ebmContactInfo"));
app.use("/interContact-info", require("./routes/interContactInfo"));
app.use("/contact", require("./routes/contact"));
app.use("/story-images-api", require("./routes/storyImages"));
app.use("/installation-profile", require("./routes/installationProfile"));
app.use("/contact-for-inter", require("./routes/contactForInter"));
app.use("/admin", require("./routes/adminAuth"));
app.use("/company-profile", require("./routes/companyProfile"));
app.use("/inter-company-profile", require("./routes/interCompanyProfile"));
app.listen(3001, () => {
  console.log("Server running on port 3001");
});
