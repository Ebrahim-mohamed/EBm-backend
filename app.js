const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

mongoose
  .connect(
    "mongodb+srv://ebmo3112002_admin:gyLMR7TaapD7hG7C@ebmdatabase.p98k1hc.mongodb.net/?appName=ebmDataBase"
  )
  .then(() => {
    console.log("connected to database");
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
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use("/uploads", express.static("uploads"));
app.use("/projects", require("./routes/projects"));
app.use("/contact-info", require("./routes/ebmContactInfo"));
app.use("/interContact-info", require("./routes/interContactInfo"));

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
