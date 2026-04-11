const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const User = require("../model/userModel.js")

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already registered." });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword
    });

    return res.status(201).json({ message: "Registered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Registration failed", error: error.message });
  }
}

const login = async (req, res) => {
  const { email, password } = req.body;

  // 1. Find user by email
  const userData = await User.findOne({ email });

  if (!userData) {
    return res.status(400).json({ message: "Email not found" });
  }

  // 2. Compare password
  const isPasswordCorrect = bcrypt.compareSync(password, userData.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Password is wrong" });
  }

  // 3. Generate JWT token
  const token = jwt.sign({ _id: userData._id, name: userData.name, email: userData.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // 4. Successful login
  return res.status(200).json({ message: "Login successful", token, user: { _id: userData._id, name: userData.name, email: userData.email } });
}


module.exports = { register, login }





