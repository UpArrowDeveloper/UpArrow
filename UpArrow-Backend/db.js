const mongoose = require('mongoose');
const uri = process.env.DB_URL;

const connectDB = async () => {
  await mongoose.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  console.log('mongodb has successfully connected');
};

module.exports = connectDB;
