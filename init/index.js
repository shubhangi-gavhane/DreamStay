const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js"); // ✅ Corrected casing

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Some error occurred during connect to MongoDB", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  
  const user = await User.findOne(); // ✅ this now works properly

  if (!user) {
    throw new Error("No user found to assign as owner.");
  }

  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: user._id, // ✅ assign owner dynamically
  }));

  await Listing.insertMany(initData.data);
  console.log("Data initialized");
};

initDB();
