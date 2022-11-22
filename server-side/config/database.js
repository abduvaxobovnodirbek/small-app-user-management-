const mongoose = require("mongoose");

const connectToDatabase = async () => {
  await mongoose.connect("mongodb://localhost:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log(`MongoDB Connected`.cyan.underline.bold);
};

module.exports = connectToDatabase;
