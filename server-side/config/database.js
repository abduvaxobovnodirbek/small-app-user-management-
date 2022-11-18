const mongoose = require("mongoose");

const connectToDatabase = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log(`MongoDB Connected`.cyan.underline.bold);
};

module.exports = connectToDatabase;
