import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import BlogCard from '../components/BlogCard'
import './Home.css'

const Home = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true)
        const response = await axios.get('http://localhost:3000/blog')
        // Filter to show only published blogs on the public home page
        const publishedBlogs = response.data.filter(blog => blog.published !== false)
        setBlogs(publishedBlogs)
        setError(null)
      } catch (error) {
        console.error('Error fetching blogs:', error)
        setError('Failed to load blogs. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to BlogApp</h1>
          <p className="hero-subtitle">
            Discover amazing stories, insights, and perspectives from writers around the world.
            Join our community and share your voice.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">{blogs.length}</span>
              <span className="stat-label">Blogs</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">∞</span>
              <span className="stat-label">Stories</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Available</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="content-section">
        <div className="section-header">
          <h2 className="section-title">Latest Blogs</h2>
          <p className="section-subtitle">
            Explore the most recent and trending blog posts from our community
          </p>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading amazing blogs...</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <div className="empty-icon">⚠️</div>
            <h3 className="empty-title">Oops! Something went wrong</h3>
            <p className="empty-description">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="empty-action"
              style={{ border: 'none', cursor: 'pointer' }}
            >
              Try Again
            </button>
          </div>
        ) : blogs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3 className="empty-title">No blogs yet</h3>
            <p className="empty-description">
              Be the first to share your story! Create your first blog post and inspire others.
            </p>
            <Link to="/create" className="empty-action">
              Create Your First Blog
            </Link>
          </div>
        ) : (
          <div className="blogs">
            {blogs.map((blog, index) => (
              <div key={blog._id} className="blog-card-wrapper">
                <BlogCard blog={blog} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Home