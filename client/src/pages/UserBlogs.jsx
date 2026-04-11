import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import axios from 'axios'
import BlogCard from '../components/BlogCard'
import './UserBlogs.css'

const UserBlogs = () => {
  const { user } = useAuth()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      const fetchBlogs = async () => {
        try {
          setLoading(true)
          const response = await axios.get(`http://localhost:3000/blog/user/${user._id}`)
          setBlogs(response.data)
          setError(null)
        } catch (error) {
          console.error('Error fetching user blogs:', error)
          setError('Failed to load your blogs. Please try again.')
        } finally {
          setLoading(false)
        }
      }
      fetchBlogs()
    }
  }, [user])

  const getAuthConfig = () => ({
    headers: {
      ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
    },
  })

  const handleDelete = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog? This action cannot be undone.')) return

    try {
      await axios.delete(`http://localhost:3000/blog/${blogId}`, getAuthConfig())
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== blogId))
    } catch (error) {
      console.error('Delete failed:', error)
      alert(error.response?.data?.message || 'Failed to delete blog')
    }
  }

  const handleUpdate = async (blogId, updatedData) => {
    try {
      const response = await axios.put(`http://localhost:3000/blog/${blogId}`, updatedData, getAuthConfig())
      setBlogs((prevBlogs) => prevBlogs.map((blog) => (blog._id === blogId ? response.data : blog)))
      return true
    } catch (error) {
      console.error('Update failed:', error)
      alert(error.response?.data?.message || 'Failed to update blog')
      return false
    }
  }

  const handlePublishToggle = async (blogId, isPublishing) => {
    try {
      // Find the current blog to get all its data
      const currentBlog = blogs.find(b => b._id === blogId)
      if (!currentBlog) return

      const response = await axios.put(
        `http://localhost:3000/blog/${blogId}`,
        {
          title: currentBlog.title,
          description: currentBlog.description,
          image: currentBlog.image,
          published: isPublishing
        },
        getAuthConfig()
      )
      setBlogs((prevBlogs) => prevBlogs.map((blog) => (blog._id === blogId ? response.data : blog)))
    } catch (error) {
      console.error('Publish toggle failed:', error)
      alert(error.response?.data?.message || 'Failed to update blog status')
    }
  }

  // Get user initials for avatar
  const getUserInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2)
  }

  // Calculate stats
  const totalBlogs = blogs.length
  const publishedBlogs = blogs.filter(blog => blog.published !== false).length
  const draftBlogs = totalBlogs - publishedBlogs
  const totalViews = blogs.reduce((sum, blog) => sum + (blog.views || 0), 0)

  return (
    <div className="user-blogs">
      {/* User Profile Header */}
      <div className="user-header">
        <div className="user-header-content">
          <div className="user-avatar">
            {user?.name ? getUserInitials(user.name) : 'U'}
          </div>
          <div className="user-info">
            <h1>Welcome back, {user?.name || 'User'}!</h1>
            <p>Manage and create amazing blog posts</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="user-stats">
        <div className="stat-card">
          <span className="stat-number">{totalBlogs}</span>
          <div className="stat-label">Total Blogs</div>
          <div className="stat-description">All your published and draft posts</div>
        </div>
        <div className="stat-card">
          <span className="stat-number">{publishedBlogs}</span>
          <div className="stat-label">Published</div>
          <div className="stat-description">Blogs visible to everyone</div>
        </div>
        <div className="stat-card">
          <span className="stat-number">{draftBlogs}</span>
          <div className="stat-label">Drafts</div>
          <div className="stat-description">Work in progress posts</div>
        </div>
        <div className="stat-card">
          <span className="stat-number">{totalViews}</span>
          <div className="stat-label">Total Views</div>
          <div className="stat-description">Combined views across all blogs</div>
        </div>
      </div>

      {/* Content Section */}
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">Your Blog Posts</h2>
          <Link to="/create" className="create-blog-btn">
            <span>+</span>
            Create New Blog
          </Link>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading your blogs...</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <div className="empty-icon">⚠️</div>
            <h3 className="empty-title">Oops! Something went wrong</h3>
            <p className="empty-description">{error}</p>
            <div className="empty-actions">
              <button
                onClick={() => window.location.reload()}
                className="empty-action"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3 className="empty-title">No blogs yet</h3>
            <p className="empty-description">
              You haven't created any blog posts yet. Start sharing your thoughts and stories with the world!
            </p>
            <div className="empty-actions">
              <Link to="/create" className="empty-action">
                <span>+</span>
                Create Your First Blog
              </Link>
              <Link to="/" className="empty-action secondary">
                Browse Other Blogs
              </Link>
            </div>
          </div>
        ) : (
          <div className="blogs">
            {blogs.map((blog, index) => (
              <div key={blog._id} className="blog-card-wrapper">
                <BlogCard
                  blog={blog}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                  onPublishToggle={handlePublishToggle}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserBlogs