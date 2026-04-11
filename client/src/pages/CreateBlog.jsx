import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import axios from 'axios'
import './CreateBlog.css'

const CreateBlog = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [successType, setSuccessType] = useState('published') // 'published' or 'draft'
  const [errors, setErrors] = useState({})
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters'
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    } else if (formData.description.length > 5000) {
      newErrors.description = 'Description must be less than 5000 characters'
    }

    if (formData.image && !isValidUrl(formData.image)) {
      newErrors.image = 'Please enter a valid image URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const handleSubmit = async (e, isDraft = false) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      }

      await axios.post('http://localhost:3000/blog', {
        title: formData.title.trim(),
        description: formData.description.trim(),
        image: formData.image.trim(),
        user: user._id,
        published: !isDraft
      }, config)

      setSuccess(true)
      setSuccessType(isDraft ? 'draft' : 'published')

      // Redirect after showing success message
      setTimeout(() => {
        navigate('/user')
      }, 2000)

    } catch (error) {
      console.error('Create blog error:', error)
      setErrors({
        submit: error.response?.data?.message || 'Failed to create blog. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  const getCharCountClass = (current, max) => {
    const percentage = (current / max) * 100
    if (percentage > 90) return 'error'
    if (percentage > 75) return 'warning'
    return ''
  }

  if (success) {
    return (
      <div className="create-blog-page">
        <div className={`success-message ${successType === 'draft' ? 'draft-success' : ''}`}>
          <div className="success-icon">{successType === 'draft' ? '💾' : '🎉'}</div>
          <h3 className="success-title">
            {successType === 'draft' ? 'Draft Saved Successfully!' : 'Blog Published Successfully!'}
          </h3>
          <p className="success-text">
            {successType === 'draft' 
              ? 'Your blog has been saved as a draft. You can edit or publish it later.'
              : 'Your blog post has been published. Redirecting to your blogs...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="create-blog-page">
      <form className={`create-blog-form ${loading ? 'form-loading' : ''}`} onSubmit={(e) => handleSubmit(e, false)}>
        {/* Form Header */}
        <div className="form-header">
          <div className="form-header-content">
            <h1 className="form-title">Create New Blog</h1>
            <p className="form-subtitle">Share your thoughts and stories with the world</p>
          </div>
        </div>

        {/* Form Body */}
        <div className="form-body">
          {/* Title Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="title">
              Blog Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className={`form-input ${errors.title ? 'form-error' : ''}`}
              placeholder="Enter an engaging title for your blog..."
              value={formData.title}
              onChange={handleInputChange}
              maxLength={100}
            />
            <div className="char-counter">
              {errors.title && <span className="error-message">{errors.title}</span>}
              <span className={`char-count ${getCharCountClass(formData.title.length, 100)}`}>
                {formData.title.length}/100
              </span>
            </div>
          </div>

          {/* Description Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Blog Content *
            </label>
            <textarea
              id="description"
              name="description"
              className={`form-textarea ${errors.description ? 'form-error' : ''}`}
              placeholder="Write your blog content here... Share your story, insights, or experiences."
              value={formData.description}
              onChange={handleInputChange}
              maxLength={5000}
            />
            <div className="char-counter">
              {errors.description && <span className="error-message">{errors.description}</span>}
              <span className={`char-count ${getCharCountClass(formData.description.length, 5000)}`}>
                {formData.description.length}/5000
              </span>
            </div>
            <p className="form-hint">
              Tip: Write engaging content that captures your readers' attention from the first sentence.
            </p>
          </div>

          {/* Image URL Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="image">
              Featured Image URL
            </label>
            <input
              type="url"
              id="image"
              name="image"
              className={`form-input ${errors.image ? 'form-error' : ''}`}
              placeholder="https://example.com/image.jpg"
              value={formData.image}
              onChange={handleInputChange}
            />
            {errors.image && <span className="error-message">{errors.image}</span>}
            <p className="form-hint">
              Optional: Add a beautiful image to make your blog more visually appealing.
            </p>
          </div>

          {/* Image Preview */}
          {(formData.image || errors.image) && (
            <div className="image-preview-section">
              <div className={`image-preview-container ${formData.image ? 'has-image' : ''}`}>
                {formData.image && isValidUrl(formData.image) ? (
                  <img
                    src={formData.image}
                    alt="Blog preview"
                    className="image-preview"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      setErrors(prev => ({ ...prev, image: 'Failed to load image. Please check the URL.' }))
                    }}
                  />
                ) : (
                  <div className="image-placeholder">
                    <div className="image-placeholder-icon">🖼️</div>
                    <div className="image-placeholder-text">
                      {errors.image ? 'Invalid image URL' : 'Image preview will appear here'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submit Error */}
          {errors.submit && (
            <div className="form-group">
              <span className="error-message">{errors.submit}</span>
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <Link to="/user" className="form-button btn-secondary">
              Cancel
            </Link>
            <button 
              type="button" 
              className="form-button btn-draft" 
              onClick={(e) => handleSubmit(e, true)}
              disabled={loading}
            >
              {loading ? 'Saving...' : '💾 Save as Draft'}
            </button>
            <button type="submit" className="form-button btn-primary" disabled={loading}>
              {loading ? 'Publishing...' : '🚀 Publish'}
            </button>
          </div>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="loading-spinner"></div>
        )}
      </form>
    </div>
  )
}

export default CreateBlog