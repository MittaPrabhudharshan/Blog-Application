const Express = require("express")
const { getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog, getBlogbyuserId } = require("../controller/blogController.js")
const authenticate = require("../middleware/auth.js")

const blogRoute = Express.Router()

blogRoute.get("/", getAllBlogs)
blogRoute.get("/:id", getBlogById)
blogRoute.post("/", authenticate, createBlog)//addBlog
blogRoute.put("/:id", updateBlog)
blogRoute.delete("/:id", deleteBlog)
blogRoute.get("/user/:userid", getBlogbyuserId)
module.exports = blogRoute