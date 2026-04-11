const Blog = require("../model/blogModel.js")

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('user', 'name')
    res.status(200).json(blogs)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('user', 'name')
    if (!blog) return res.status(404).json({ message: 'Blog not found' })
    res.status(200).json(blog)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const createBlog = async (req, res) => {
  try {
    const { title, description, image, published } = req.body
    const blog = await Blog.create({ title, description, image, published, user: req.user._id })
    res.status(201).json(blog)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!blog) return res.status(404).json({ message: 'Blog not found' })
    res.status(200).json(blog)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id)
    if (!blog) return res.status(404).json({ message: 'Blog not found' })
    res.status(200).json({ message: 'Blog deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getBlogbyuserId = async (req, res) => {
  try {
    const blogs = await Blog.find({ user: req.params.userid }).populate('user', 'name')
    res.status(200).json(blogs)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog, getBlogbyuserId }
