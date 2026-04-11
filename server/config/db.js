const mongoose =require("mongoose");

// function connectDB(){
// mongoose. connect (process.env.MONGO_URL)
// . then (()=>{
// console. log("MongoDB connect successfuly")

// })

// }
function connectDB(){
  mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1) // Exit on connection failure
  })
}

module.exports = connectDB