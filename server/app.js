const dotenv= require("dotenv")
const express = require("express")
const cors = require("cors")
const userRoute = require("./routes/userRoutes.js")
const blogRoute = require("./routes/blogRoutes.js")
const connectDB = require("./config/db")
dotenv.config()
console.log('JWT_SECRET:', process.env.JWT_SECRET)
const path = require("path");
const app = express()

app.use(cors())
app.use(express.json())

app.use(express.static(path.join(__dirname, "../client")));

app.all(/.*/, (req, res) => {
  res.sendFile(
    path.resolve(__dirname, "../client")
  );
});
app.use("/user", userRoute)
app.use("/blog", blogRoute)

connectDB()
app.listen(process.env.PORT || 3000, () => {
  console.log("Listening to PORT", process.env.PORT || 3000)
})