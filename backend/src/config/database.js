const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;


// const mongoose = require('mongoose');
// require('dotenv').config();

// const connectDB = async () => {
//   try {
//     // Debugging: This will tell us if the URI is actually being read
//     if (!process.env.MONGODB_URI) {
//       console.error("ERROR: MONGODB_URI is not defined in .env file!");
//       return;
//     }
    
//     console.log("Attempting to connect with URI:", process.env.MONGODB_URI.split('@')[1]); // Logs only the host for security

//     const conn = await mongoose.connect(process.env.MONGODB_URI);

//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error('Database connection error:', error.message);
//     // Do not exit(1) immediately while debugging so you can see other logs
//   }
// };

// module.exports = connectDB;
