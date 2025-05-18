const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const mongoURL = process.env.MONGO_URL_ATLAS;

if (!mongoURL) {
  console.error("MongoDB URL connection is missing.");
  process.exit(1);
}

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  serverApi: { version: '1' } // optional but helpful with MongoDB Atlas
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1);
});

const db = mongoose.connection;

db.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

module.exports = db;
