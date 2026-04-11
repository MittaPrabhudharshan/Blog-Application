import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import UserBlogs from './pages/UserBlogs'
import CreateBlog from './pages/CreateBlog'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/user" element={<UserBlogs />} />
        <Route path="/create" element={<CreateBlog />} />
      </Routes>
    </>
  )
}

export default App
