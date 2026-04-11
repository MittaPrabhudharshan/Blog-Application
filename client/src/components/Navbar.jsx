import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import './Navbar.css'

const Navbar = () => {
  const { user, logout } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActiveLink = (path) => {
    return location.pathname === path
  }

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="logo">BlogApp</div>
      <ul className="nav-links">
        <li>
          <Link
            to="/"
            className={isActiveLink('/') ? 'active' : ''}
          >
            Home
          </Link>
        </li>
        {user ? (
          <>
            <li>
              <Link
                to="/user"
                className={isActiveLink('/user') ? 'active' : ''}
              >
                My Blogs
              </Link>
            </li>
            <li>
              <Link
                to="/create"
                className={isActiveLink('/create') ? 'active' : ''}
              >
                Create Blog
              </Link>
            </li>
            <li>
              <button onClick={logout}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                to="/login"
                className={isActiveLink('/login') ? 'active' : ''}
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/signup"
                className={isActiveLink('/signup') ? 'active' : ''}
              >
                Signup
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Navbar