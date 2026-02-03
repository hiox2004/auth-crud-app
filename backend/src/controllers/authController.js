const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(`User trying to register: ${email}`);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`That email already has an account: ${email}`);
      return res.status(400).json({ message: "User already exists" });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'user'
    });
    await user.save();
    console.log(`New user account created: ${email}`);
    
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    res.status(201).json({
      message: "User created",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error("Something went wrong with register:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, adminSecret } = req.body;
    console.log(`Admin registration attempt: ${email}`);
    
    if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
      console.log(`Admin registration failed - wrong secret: ${email}`);
      return res.status(403).json({ message: "Invalid admin secret" });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`Email already exists: ${email}`);
      return res.status(400).json({ message: "User already exists" });
    }
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'admin'
    });
    await user.save();
    console.log(`New admin account created: ${email}`);
    
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    res.status(201).json({
      message: "Admin created",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error("Oops, admin register failed:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt: ${email}`);
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`Login failed - no user found: ${email}`);
      return res.status(400).json({ message: "no existing user with that email" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Login failed - wrong password: ${email}`);
      return res.status(400).json({ message: "incorrect password" });
    }
    console.log(`User logged in: ${email} (${user.role})`);
    //  createinh JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error("Login went wrong:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    console.log(`Admin fetching all users`);
    const users = await User.find({}, 'id name email role');
    console.log(`Returned ${users.length} users to admin`);
    res.json(users);
  } catch (error) {
    console.error("Failed to get users:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
