import { useState } from 'react'
import './BlogCard.css'

const BlogCard = ({ blog, onDelete, onUpdate, onPublishToggle }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(blog.title)
  const [description, setDescription] = useState(blog.description)
  const [image, setImage] = useState(blog.image || '')
  const [isPublishing, setIsPublishing] = useState(false)

  const handleSave = async () => {
    const updatedBlog = { title, description, image }
    const success = await onUpdate(blog._id, updatedBlog)
    if (success) {
      setIsEditing(false)
    }
  }

  const handlePublishToggle = async () => {
    if (onPublishToggle) {
      setIsPublishing(true)
      await onPublishToggle(blog._id, !blog.published)
      setIsPublishing(false)
    }
  }

  const isDraft = blog.published === false

  return (
    <div className="blog-card">
      {isEditing ? (
        <div className="edit-form">
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image URL" />
          <div className="card-actions">
            <button type="button" className="save-btn" onClick={handleSave}>
              Save
            </button>
            <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          {blog.image && <img src={blog.image} alt={blog.title} />}
          <div className="blog-card-content">
            <div className="card-header">
              <h2>{blog.title}</h2>
              {isDraft && <span className="draft-badge">Draft</span>}
            </div>
            <p>{blog.description}</p>
            <p className="author">By: {blog.user?.name}</p>
            {(onUpdate || onDelete || onPublishToggle) && (
              <div className="card-actions">
                {onPublishToggle && (
                  <button 
                    type="button" 
                    className={isDraft ? 'publish-btn' : 'unpublish-btn'} 
                    onClick={handlePublishToggle}
                    disabled={isPublishing}
                  >
                    {isPublishing ? (isDraft ? 'Publishing...' : 'Unpublishing...') : (isDraft ? 'Publish' : 'Unpublish')}
                  </button>
                )}
                {onUpdate && (
                  <button type="button" className="edit-btn" onClick={() => setIsEditing(true)}>
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button type="button" className="delete-btn" onClick={() => onDelete(blog._id)}>
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default BlogCard