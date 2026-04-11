const dotenv= require("dotenv")
const Express = require("express")
const cors = require("cors")
const userRoute = require("./routes/userRoutes.js")
const blogRoute = require("./routes/blogRoutes.js")
const connectDB = require("./config/db")
dotenv.config()
console.log('JWT_SECRET:', process.env.JWT_SECRET)
const path = require("path");

app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(
    path.resolve(__dirname, "../client/build/index.html")
  );
});
const app = Express()

app.use(cors())
app.use(Express.json())
app.use("/user", userRoute)
app.use("/blog", blogRoute)

connectDB()
app.listen(process.env.PORT || 3000, () => {
  console.log("Listening to PORT", process.env.PORT || 3000)
})