const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");
const bcrypt = require("bcryptjs");
const config = require("../config/config");

const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }
    const isUser = await User.findOne({ email });

    if (isUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: name,
      password: hashedPassword,
      email,
      role: "user",
    });

    const token = generateToken(user);

    res.cookie("token", token, { httpOnly: true });

    res.status(201).json({ message: "User created successfully"});
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const signupAdmin = async (req, res) => {
  try {
     const { name, email, password } = req.body;

     if (!name || !email || !password) {
       return res.status(400).json({ message: "Please enter all fields" });
     }
     const isUser = await User.findOne({ email });

     if (isUser) {
       return res.status(400).json({ message: "User already exists" });
     }
     const hashedPassword = await bcrypt.hash(password, 10);

     const user = await User.create({
      username: name,
      password: hashedPassword,
      email,
      role: "admin",
    });

    const token = generateToken(user);
    // Send the token in the response
    res.cookie("token", token, { httpOnly: true });
    res.status(201).json({ message: "Admin created successfully"});
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};



const signupSuperadmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }
    const isUser = await User.findOne({ email });

    if (isUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);



    const user = await User.create({
      username: name,
      password: hashedPassword,
      email,
      role: "superadmin",
    });

    const token = generateToken(user);
    res.cookie("token", token, { httpOnly: true });
    res.status(201).json({ message: "Superadmin created successfully"});
  } catch (error) {}
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    // Send the token in the response
    res.cookie("token", token, { httpOnly: true });
    
    res.status(200).json({ message: "User logged in successfully"});
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// genrate jwt token

const generateToken = (user) => {
  const payLoad = {
    id: user._id,
    name: user.name,
    email: user.email,
  };
  return jwt.sign(payLoad, config.JWT_SECRET, { expiresIn: "1h" });
};

module.exports = { signupUser, signupAdmin, signupSuperadmin, loginUser };
