const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');
//use async and await method
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true
    });
    console.log('Mongo DB connected');
  } catch (err) {
    console.err(err.message);
    //Exit the error message with failure
    process.exit(1);
  }
};

module.exports = connectDB;
